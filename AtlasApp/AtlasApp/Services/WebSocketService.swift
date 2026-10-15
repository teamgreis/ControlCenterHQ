// © Felix Greis 2026 – All rights reserved.
import Foundation
import UserNotifications
import AVFoundation

extension Notification.Name {
    static let atlasEmergency      = Notification.Name("atlasEmergency")
    static let atlasDispatch       = Notification.Name("atlasDispatch")
    static let atlasAlertNew       = Notification.Name("atlasAlertNew")
    static let atlasAlertsAcked    = Notification.Name("atlasAlertsAcked")
    static let atlasDashRefresh    = Notification.Name("atlasDashRefresh")
    static let atlasChatMessage    = Notification.Name("atlasChatMessage")
    // Quick Action shortcuts from Home Screen
    static let atlasQuickActionSOS    = Notification.Name("atlasQuickActionSOS")
    static let atlasQuickActionPTT    = Notification.Name("atlasQuickActionPTT")
    static let atlasQuickActionAlerts = Notification.Name("atlasQuickActionAlerts")
}

// MARK: - Helpers

private func _json(_ dict: [String: Any]) -> Data? {
    try? JSONSerialization.data(withJSONObject: dict)
}

@MainActor
class WebSocketService: ObservableObject {
    static let shared = WebSocketService()

    @Published var isConnected = false

    private var task: URLSessionWebSocketTask?
    private var pingTimer: Timer?
    private var reconnectTask: Task<Void, Never>?
    private var reconnectDelay: Double = 1.0
    private var shouldReconnect = false
    private var serverURL = ""
    private var token = ""
    private var player: AVAudioPlayer?

    private init() {}

    // MARK: - Connect / Disconnect

    func connect(serverURL: String, token: String) {
        self.serverURL = serverURL
        self.token = token
        shouldReconnect = true
        reconnectDelay = 1.0
        _open()
    }

    func disconnect() {
        shouldReconnect = false
        reconnectTask?.cancel()
        pingTimer?.invalidate()
        pingTimer = nil
        task?.cancel(with: .goingAway, reason: nil)
        task = nil
        isConnected = false
    }

    // MARK: - Internal

    private func _open() {
        guard !serverURL.isEmpty, !token.isEmpty else { return }
        let wsBase = serverURL
            .replacingOccurrences(of: "https://", with: "wss://")
            .replacingOccurrences(of: "http://",  with: "ws://")
        guard let url = URL(string: "\(wsBase)/ws?token=\(token)") else { return }

        task?.cancel(with: .goingAway, reason: nil)
        let session = URLSession(configuration: .default)
        task = session.webSocketTask(with: url)
        task?.resume()
        _listen()
        _schedulePing()
    }

    private func _listen() {
        task?.receive { [weak self] result in
            Task { @MainActor [weak self] in
                guard let self else { return }
                switch result {
                case .success(let msg):
                    if !self.isConnected {
                        self.isConnected = true
                        self.reconnectDelay = 1.0
                    }
                    switch msg {
                    case .string:
                        self._handle(msg)
                    case .data(let data):
                        self._handleBinary(data)
                    @unknown default:
                        break
                    }
                    self._listen()
                case .failure:
                    self.isConnected = false
                    self._scheduleReconnect()
                }
            }
        }
    }

    private func _handle(_ msg: URLSessionWebSocketTask.Message) {
        guard case .string(let text) = msg,
              let data = text.data(using: .utf8),
              let ws = try? JSONDecoder().decode(WSMessage.self, from: data) else { return }

        switch ws.type {

        case "emergency_broadcast":
            _playSound("emergency_siren", critical: true)
            _notify(title: "🚨 NOTFALLALARM",
                    body: ws.message ?? ws.title ?? "Notfallalarm",
                    sound: _criticalSound("emergency_siren"),
                    id: "emg_\(UUID().uuidString)")
            NotificationCenter.default.post(name: .atlasEmergency, object: ws)

        case "alert_new":
            let sev = ws.severity ?? "info"
            if sev == "critical" || sev == "warning" {
                _playSound(sev == "critical" ? "emergency_siren" : "alert_tone", critical: sev == "critical")
                _notify(title: ws.title ?? "🔔 Alarm",
                        body: ws.message ?? "",
                        sound: sev == "critical" ? _criticalSound("emergency_siren") : _regularSound("alert_tone"),
                        id: "alert_\(ws.id ?? 0)_\(UUID().uuidString)")
            }
            NotificationCenter.default.post(name: .atlasAlertNew, object: ws)

        case "dispatch_request":
            _playSound("dispatch_tone", critical: true)
            let event = DispatchEvent(
                vehicleId: ws.vehicle_id ?? 0,
                vehicleName: ws.vehicle_name ?? "Fahrzeug",
                incidentTitle: ws.incident_title ?? ws.message ?? "",
                dispatchedBy: ws.dispatched_by ?? ""
            )
            _notify(title: "🚨 Einsatzauftrag",
                    body: "\(event.vehicleName): \(event.incidentTitle)",
                    sound: _criticalSound("dispatch_tone"),
                    id: "dispatch_\(ws.vehicle_id ?? 0)")
            NotificationCenter.default.post(name: .atlasDispatch, object: event)

        case "alert_ack", "alerts_ack_all":
            NotificationCenter.default.post(name: .atlasAlertsAcked, object: ws)

        case "incident_new", "incident_update", "asset_new":
            NotificationCenter.default.post(name: .atlasDashRefresh, object: ws)

        case "chat_message":
            NotificationCenter.default.post(name: .atlasChatMessage, object: ws)

        // ── Voice Channel ─────────────────────────────────────────────
        case "voice_status":
            if let raw = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let d = raw["data"] as? [String: Any] {
                VoiceChannelService.shared.handleVoiceStatus(d)
            }

        case "voice_ptt_start":
            if let raw = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let d = raw["data"] as? [String: Any] {
                VoiceChannelService.shared.handleVoicePTTStart(d)
            }

        case "voice_ptt_stop":
            if let raw = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let d = raw["data"] as? [String: Any] {
                VoiceChannelService.shared.handleVoicePTTStop(d)
            }

        default:
            NotificationCenter.default.post(name: .atlasDashRefresh, object: ws)
        }
    }

    /// Handle binary audio frames (PCM chunks from other participants).
    private func _handleBinary(_ data: Data) {
        VoiceChannelService.shared.handleAudioChunk(data)
    }

    // MARK: - Ping

    private func _schedulePing() {
        pingTimer?.invalidate()
        pingTimer = Timer.scheduledTimer(withTimeInterval: 25, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.task?.sendPing { _ in }
            }
        }
    }

    // MARK: - Reconnect

    private func _scheduleReconnect() {
        guard shouldReconnect else { return }
        reconnectTask?.cancel()
        let delay = reconnectDelay
        reconnectTask = Task { @MainActor [weak self] in
            try? await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
            guard let self, self.shouldReconnect else { return }
            self._open()
        }
        reconnectDelay = min(reconnectDelay * 2, 30)
    }

    // MARK: - Sound

    private func _playSound(_ name: String, critical: Bool) {
        guard let url = Bundle.main.url(forResource: name, withExtension: "caf") else { return }
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, options: [.duckOthers])
            try session.setActive(true)
            player = try AVAudioPlayer(contentsOf: url)
            player?.numberOfLoops = critical ? 2 : 0
            player?.prepareToPlay()
            player?.play()
        } catch {}
    }

    private func _criticalSound(_ name: String) -> UNNotificationSound {
        .criticalSoundNamed(UNNotificationSoundName("\(name).caf"))
    }

    private func _regularSound(_ name: String) -> UNNotificationSound {
        UNNotificationSound(named: UNNotificationSoundName("\(name).caf"))
    }

    // MARK: - Voice Channel Send Helpers

    func sendVoiceJoin(channelId: Int = 0) {
        _sendJSON(["type": "voice_join", "channel_id": channelId])
    }

    func sendVoiceLeave() {
        _sendJSON(["type": "voice_leave"])
    }

    func sendVoicePTTStart() {
        _sendJSON(["type": "voice_ptt_start"])
    }

    func sendVoicePTTStop() {
        _sendJSON(["type": "voice_ptt_stop"])
    }

    /// Send a raw binary frame (PCM audio chunk).
    func sendBinary(_ data: Data) {
        task?.send(.data(data)) { _ in }
    }

    private func _sendJSON(_ dict: [String: Any]) {
        guard let data = try? JSONSerialization.data(withJSONObject: dict),
              let text = String(data: data, encoding: .utf8) else { return }
        task?.send(.string(text)) { _ in }
    }

    // MARK: - Local Notification

    private func _notify(title: String, body: String, sound: UNNotificationSound, id: String) {
        let c = UNMutableNotificationContent()
        c.title = title
        c.body = body
        c.sound = sound
        if #available(iOS 15.0, *) {
            c.interruptionLevel = .critical  // bypass DND and silent mode
        }
        UNUserNotificationCenter.current().add(
            UNNotificationRequest(identifier: id, content: c, trigger: nil)
        )
    }
}
