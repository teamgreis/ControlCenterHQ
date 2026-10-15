// © Felix Greis 2026 – All rights reserved.
import Foundation
import AVFoundation
import Combine
import UIKit

// MARK: - Voice Channel Model

struct VoiceParticipant: Identifiable, Equatable {
    let id: Int
    let username: String
    var isSpeaking: Bool = false
    var audioLevel: Float = 0.0  // 0.0 – 1.0 normalised volume
}

struct VoiceChannel: Identifiable, Equatable {
    let id: Int
    let name: String
    var isPrivate: Bool = false
    var participantCount: Int = 0
}

// MARK: - VoiceChannelService

/// Manages the virtual walkie-talkie / PTT voice channel.
///
/// Architecture:
///   • The server coordinates who is in the channel and who is speaking
///     via WebSocket messages (voice_join / voice_leave / voice_ptt_start / voice_ptt_stop).
///   • Audio is captured from AVAudioEngine and streamed as PCM chunks to the server
///     via WebSocket binary frames while PTT is active.
///   • Incoming audio chunks from the server are decoded and played back in real-time
///     through AVAudioPlayerNode.
///   • WebRTC is NOT used – the server acts as an audio relay. This keeps the
///     implementation simple and works through NAT without STUN/TURN servers.
@MainActor
final class VoiceChannelService: ObservableObject {
    static let shared = VoiceChannelService()

    // MARK: - Published State

    @Published var joined: Bool = false
    @Published var speaking: Bool = false         // I am speaking
    @Published var muted: Bool = false            // Push-to-Mute active
    @Published var channelActive: Bool = false    // anyone is in the channel
    @Published var participants: [VoiceParticipant] = []
    @Published var currentSpeakerName: String? = nil
    @Published var micPermissionGranted: Bool = false
    @Published var error: String? = nil
    @Published var myAudioLevel: Float = 0.0     // real-time mic level 0–1
    @Published var availableChannels: [VoiceChannel] = []  // group/private channels
    @Published var currentChannelId: Int = 0     // 0 = default channel

    // MARK: - Private Audio Engine

    private var audioEngine    = AVAudioEngine()
    private var playerNode     = AVAudioPlayerNode()
    private var mixerNode: AVAudioMixerNode { audioEngine.mainMixerNode }

    // PCM format used for streaming: 16 kHz mono 16-bit (low bandwidth, good quality)
    private let streamFormat = AVAudioFormat(
        commonFormat: .pcmFormatInt16,
        sampleRate: 16_000,
        channels: 1,
        interleaved: true
    )!

    // Buffer incoming audio frames while engine is not running
    private var pendingBuffers: [Data] = []
    private var isEngineRunning = false

    // Replay buffer – last 5 seconds of received audio
    private var replayBuffer: [Data] = []
    private let replayBufferMaxChunks = 80  // ~5s at 16kHz with 1024-sample chunks

    // Audio level metering
    private var levelTimer: Timer?

    // MARK: - WebSocket ref (set by WebSocketService when voice events arrive)

    private var sendFrame: ((Data) -> Void)?

    private init() {}

    // MARK: - Setup

    /// Called once by WebSocketService to inject a closure for sending binary WS frames.
    func configure(sendFrame: @escaping (Data) -> Void) {
        self.sendFrame = sendFrame
    }

    // MARK: - Join / Leave

    func joinChannel() async {
        guard !joined else { return }

        // Check / request mic permission
        let granted = await requestMicPermission()
        micPermissionGranted = granted
        guard granted else {
            error = "Mikrofon-Zugriff verweigert. Bitte in Einstellungen erlauben."
            return
        }

        // Wire audio chunks → WebSocket binary frames
        configure { data in
            WebSocketService.shared.sendBinary(data)
        }

        do {
            try startAudioEngine()
        } catch {
            self.error = "Audio-Engine Fehler: \(error.localizedDescription)"
            return
        }

        joined = true
        error  = nil
        WebSocketService.shared.sendVoiceJoin()
    }

    func leaveChannel() {
        guard joined else { return }
        if speaking { stopPTT() }
        joined = false
        channelActive = false
        participants = []
        currentSpeakerName = nil
        stopAudioEngine()
        WebSocketService.shared.sendVoiceLeave()
    }

    // MARK: - Push-to-Talk

    func startPTT() {
        guard joined, !speaking, !muted else { return }
        speaking = true
        WebSocketService.shared.sendVoicePTTStart()
        haptic(.medium)
    }

    func stopPTT() {
        guard speaking else { return }
        speaking = false
        WebSocketService.shared.sendVoicePTTStop()
        haptic(.light)
    }

    // MARK: - Push-to-Mute

    func toggleMute() {
        muted.toggle()
        if muted && speaking { stopPTT() }
        haptic(muted ? .heavy : .light)
    }

    // MARK: - Replay Last 5 Seconds

    func replayLastFiveSeconds() {
        guard isEngineRunning else { return }
        let chunks = replayBuffer
        Task { @MainActor in
            for chunk in chunks {
                self.playIncoming(chunk)
            }
        }
        haptic(.light)
    }

    // MARK: - Channel Management

    func switchChannel(_ channelId: Int) {
        guard joined else { return }
        if speaking { stopPTT() }
        currentChannelId = channelId
        WebSocketService.shared.sendVoiceJoin(channelId: channelId)
    }

    func handleChannelList(_ data: [String: Any]) {
        guard let channelsData = data["channels"] as? [[String: Any]] else { return }
        availableChannels = channelsData.compactMap { d in
            guard let id = d["id"] as? Int, let name = d["name"] as? String else { return nil }
            return VoiceChannel(
                id: id, name: name,
                isPrivate: d["private"] as? Bool ?? false,
                participantCount: d["count"] as? Int ?? 0
            )
        }
    }

    // MARK: - Incoming Events (called by WebSocketService)

    func handleVoiceStatus(_ data: [String: Any]) {
        channelActive     = data["active"] as? Bool ?? false
        let speakerName   = data["speaker_name"] as? String
        currentSpeakerName = speakerName

        if let names = data["participants"] as? [String] {
            // Merge by username – keep speaking state
            var updated: [VoiceParticipant] = []
            for (i, name) in names.enumerated() {
                let existing = participants.first { $0.username == name }
                updated.append(VoiceParticipant(
                    id: existing?.id ?? i,
                    username: name,
                    isSpeaking: name == speakerName
                ))
            }
            participants = updated
        }
    }

    func handleVoicePTTStart(_ data: [String: Any]) {
        let name = data["username"] as? String ?? ""
        currentSpeakerName = name
        // Update speaking flag on participant
        for i in participants.indices {
            participants[i].isSpeaking = participants[i].username == name
        }
    }

    func handleVoicePTTStop(_ data: [String: Any]) {
        currentSpeakerName = nil
        for i in participants.indices { participants[i].isSpeaking = false }
    }

    /// Called by WebSocketService when an audio chunk binary frame arrives.
    func handleAudioChunk(_ data: Data) {
        guard isEngineRunning else {
            // Buffer up to 8 frames while engine starts
            if pendingBuffers.count < 8 { pendingBuffers.append(data) }
            return
        }
        playIncoming(data)
    }

    // MARK: - Audio Engine

    private func startAudioEngine() throws {
        let session = AVAudioSession.sharedInstance()
        // mixWithOthers lets audio continue when app goes background
        try session.setCategory(.playAndRecord,
                                mode: .voiceChat,
                                options: [.allowBluetooth, .defaultToSpeaker, .mixWithOthers])
        try session.setActive(true)

        audioEngine = AVAudioEngine()
        playerNode  = AVAudioPlayerNode()
        audioEngine.attach(playerNode)

        // Connect player to output
        let outputFormat = audioEngine.outputNode.inputFormat(forBus: 0)
        audioEngine.connect(playerNode, to: audioEngine.outputNode, format: outputFormat)

        // Install mic tap – only sends while PTT active and not muted
        let inputNode = audioEngine.inputNode
        let inputFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: inputFormat) { [weak self] buffer, _ in
            guard let self else { return }
            // Compute audio level locally (no Sendable issue – only primitives cross threads)
            let level: Float = {
                guard let data = buffer.floatChannelData?[0] else { return 0 }
                let n = Int(buffer.frameLength)
                guard n > 0 else { return 0 }
                var s: Float = 0
                for i in 0..<n { s += abs(data[i]) }
                return min(1.0, (s / Float(n)) * 10.0)
            }()
            // Convert to sendable Data before crossing actor boundary
            let pcmData: Data? = {
                guard self.speaking && !self.muted else { return nil }
                return self.convertToSendableData(buffer, inputFormat: inputFormat)
            }()
            Task { @MainActor [weak self] in
                guard let self else { return }
                self.myAudioLevel = level
                if let data = pcmData { self.sendFrame?(data) }
            }
        }

        try audioEngine.start()
        playerNode.play()
        isEngineRunning = true

        // Flush pending buffers
        pendingBuffers.forEach { playIncoming($0) }
        pendingBuffers.removeAll()
    }

    private func stopAudioEngine() {
        levelTimer?.invalidate(); levelTimer = nil
        if isEngineRunning {
            audioEngine.inputNode.removeTap(onBus: 0)
            playerNode.stop()
            audioEngine.stop()
        }
        isEngineRunning = false
        myAudioLevel = 0.0
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    private func setMicMuted(_ muted: Bool) {
        // Controlled via tap guard (self.speaking && !self.muted)
    }

    // MARK: - Audio Streaming

    /// Converts input buffer to sendable Data (16-bit 16 kHz PCM). Called on audio thread.
    private func convertToSendableData(_ buffer: AVAudioPCMBuffer, inputFormat: AVAudioFormat) -> Data? {
        guard let converted = convert(buffer, from: inputFormat, to: streamFormat) else { return nil }
        guard let channelData = converted.int16ChannelData else { return nil }
        let frameCount = Int(converted.frameLength)
        return Data(bytes: channelData[0], count: frameCount * 2)
    }

    /// Decode an incoming 16-bit 16 kHz PCM chunk and schedule it on playerNode.
    private func playIncoming(_ data: Data) {
        guard isEngineRunning else { return }
        let sampleCount = data.count / 2
        guard sampleCount > 0 else { return }
        guard let buffer = AVAudioPCMBuffer(pcmFormat: streamFormat,
                                           frameCapacity: AVAudioFrameCount(sampleCount)) else { return }
        buffer.frameLength = AVAudioFrameCount(sampleCount)
        data.withUnsafeBytes { ptr in
            guard let base = ptr.bindMemory(to: Int16.self).baseAddress else { return }
            buffer.int16ChannelData?[0].update(from: base, count: sampleCount)
        }
        // Convert from stream format to engine output format before scheduling
        let outputFormat = audioEngine.outputNode.inputFormat(forBus: 0)
        if let outBuf = convert(buffer, from: streamFormat, to: outputFormat) {
            playerNode.scheduleBuffer(outBuf, completionHandler: nil)
        }

        // Append to replay buffer (rolling, max 5s)
        replayBuffer.append(data)
        if replayBuffer.count > replayBufferMaxChunks {
            replayBuffer.removeFirst(replayBuffer.count - replayBufferMaxChunks)
        }
    }

    // MARK: - Format Conversion

    private func convert(_ buffer: AVAudioPCMBuffer,
                         from srcFormat: AVAudioFormat,
                         to dstFormat: AVAudioFormat) -> AVAudioPCMBuffer? {
        guard let converter = AVAudioConverter(from: srcFormat, to: dstFormat) else { return nil }
        let ratio = dstFormat.sampleRate / srcFormat.sampleRate
        let outFrames = AVAudioFrameCount(Double(buffer.frameLength) * ratio)
        guard let outBuf = AVAudioPCMBuffer(pcmFormat: dstFormat, frameCapacity: max(1, outFrames)) else { return nil }

        var error: NSError?
        var consumed = false
        let status = converter.convert(to: outBuf, error: &error) { _, outStatus in
            if consumed {
                outStatus.pointee = .noDataNow
                return nil
            }
            outStatus.pointee = .haveData
            consumed = true
            return buffer
        }
        return (status != .error && error == nil) ? outBuf : nil
    }

    // MARK: - Mic Permission

    private func requestMicPermission() async -> Bool {
        await withCheckedContinuation { cont in
            if #available(iOS 17.0, *) {
                AVAudioApplication.requestRecordPermission { granted in
                    cont.resume(returning: granted)
                }
            } else {
                AVAudioSession.sharedInstance().requestRecordPermission { granted in
                    cont.resume(returning: granted)
                }
            }
        }
    }

    // MARK: - Haptic

    private func haptic(_ style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let gen = UIImpactFeedbackGenerator(style: style)
        gen.impactOccurred()
    }
}
