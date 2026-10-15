// © Felix Greis 2026 – All rights reserved.
import SwiftUI
import AVFoundation

// MARK: - VoiceChannelView (Full-Screen Walkie-Talkie)

struct VoiceChannelView: View {
    @EnvironmentObject var auth: AuthService
    @StateObject private var voice = VoiceChannelService.shared

    private let accent  = Color(red: 0,    green: 0.9, blue: 1)
    private let bg      = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let card    = Color(red: 0.08, green: 0.10,  blue: 0.15)

    var body: some View {
        ZStack {
            bg.ignoresSafeArea()

            VStack(spacing: 0) {
                // ── Header ───────────────────────────────────────────
                headerBar

                // ── Participants ──────────────────────────────────────
                participantsList

                Spacer()

                // ── PTT Button ────────────────────────────────────────
                pttSection

                Spacer(minLength: 32)
            }

            // ── Error Banner ──────────────────────────────────────────
            if let err = voice.error {
                VStack {
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.yellow)
                        Text(err)
                            .font(.system(size: 13))
                            .foregroundColor(.white)
                        Spacer()
                        Button { voice.error = nil } label: {
                            Image(systemName: "xmark")
                                .foregroundColor(Color(white: 0.6))
                        }
                    }
                    .padding(12)
                    .background(Color(red: 0.3, green: 0.2, blue: 0.05))
                    .cornerRadius(10)
                    .padding(.horizontal, 16)
                    Spacer()
                }
                .padding(.top, 8)
            }
        }
        .navigationTitle("Sprachkanal")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                if voice.joined {
                    Button("Verlassen") {
                        voice.leaveChannel()
                    }
                    .foregroundColor(.red)
                    .fontWeight(.semibold)
                }
            }
        }
    }

    // MARK: - Header Bar

    private var headerBar: some View {
        HStack(spacing: 12) {
            // Status indicator
            Circle()
                .fill(voice.channelActive ? Color.green : Color(white: 0.3))
                .frame(width: 10, height: 10)
                .overlay(
                    Circle()
                        .stroke(voice.channelActive ? Color.green.opacity(0.4) : Color.clear, lineWidth: 4)
                        .scaleEffect(voice.channelActive ? 1.6 : 1)
                        .animation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true),
                                   value: voice.channelActive)
                )

            VStack(alignment: .leading, spacing: 2) {
                Text(voice.joined ? "Verbunden" : "Nicht verbunden")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(voice.joined ? .white : Color(white: 0.5))

                if let speaker = voice.currentSpeakerName {
                    Text("🎙 \(speaker) spricht…")
                        .font(.system(size: 12))
                        .foregroundColor(accent)
                } else if voice.joined {
                    Text("Kanal frei")
                        .font(.system(size: 12))
                        .foregroundColor(Color(white: 0.45))
                } else {
                    Text("Tippe auf Beitreten")
                        .font(.system(size: 12))
                        .foregroundColor(Color(white: 0.35))
                }
            }

            Spacer()

            // Participant count badge
            if !voice.participants.isEmpty {
                HStack(spacing: 4) {
                    Image(systemName: "person.2.fill")
                        .font(.system(size: 12))
                    Text("\(voice.participants.count)")
                        .font(.system(size: 13, weight: .bold))
                }
                .foregroundColor(accent)
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(accent.opacity(0.12))
                .cornerRadius(20)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
        .background(card)
    }

    // MARK: - Participants List

    private var participantsList: some View {
        VStack(alignment: .leading, spacing: 0) {
            if voice.participants.isEmpty {
                emptyParticipantsPlaceholder
            } else {
                Text("TEILNEHMER")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(white: 0.38))
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    .padding(.bottom, 8)

                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(voice.participants) { p in
                            ParticipantRow(participant: p, accent: accent)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
        }
        .frame(maxHeight: 280)
    }

    private var emptyParticipantsPlaceholder: some View {
        VStack(spacing: 12) {
            Image(systemName: "person.slash.fill")
                .font(.system(size: 36))
                .foregroundColor(Color(white: 0.25))
            Text(voice.joined ? "Du bist alleine im Kanal" : "Niemand im Kanal")
                .font(.system(size: 14))
                .foregroundColor(Color(white: 0.35))
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 48)
    }

    // MARK: - Channel Selector

    private var channelSelector: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("KANÄLE")
                .font(.system(size: 10, weight: .semibold))
                .foregroundColor(Color(white: 0.35))
                .padding(.horizontal, 20)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(voice.availableChannels) { ch in
                        Button {
                            voice.switchChannel(ch.id)
                        } label: {
                            HStack(spacing: 5) {
                                Image(systemName: ch.isPrivate ? "lock.fill" : "megaphone.fill")
                                    .font(.system(size: 11))
                                Text(ch.name)
                                    .font(.system(size: 12, weight: .semibold))
                                if ch.participantCount > 0 {
                                    Text("\(ch.participantCount)")
                                        .font(.system(size: 10))
                                        .padding(.horizontal, 5)
                                        .padding(.vertical, 1)
                                        .background(Color.white.opacity(0.15))
                                        .cornerRadius(6)
                                }
                            }
                            .foregroundColor(voice.currentChannelId == ch.id ? .black : .white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(voice.currentChannelId == ch.id ? accent : Color(white: 0.15))
                            .cornerRadius(20)
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }

    // MARK: - PTT Section

    private var pttSection: some View {
        VStack(spacing: 20) {
            if !voice.joined {
                // Join Button
                Button {
                    Task { await voice.joinChannel() }
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "antenna.radiowaves.left.and.right")
                            .font(.system(size: 18))
                        Text("Kanal beitreten")
                            .font(.system(size: 17, weight: .bold))
                    }
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
                    .background(accent)
                    .cornerRadius(16)
                    .shadow(color: accent.opacity(0.35), radius: 16, x: 0, y: 6)
                }
                .padding(.horizontal, 32)

            } else {
                // PTT Info Text
                Text(voice.muted ? "🔇 STUMMGESCHALTET" : voice.speaking ? "SENDE…" : "KANAL FREI – HALTE ZUM SPRECHEN")
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .foregroundColor(voice.muted ? .orange : voice.speaking ? .red : Color(white: 0.4))
                    .animation(.easeInOut, value: voice.speaking)

                // Audio level bar (only when speaking)
                if voice.speaking {
                    AudioLevelBar(level: voice.myAudioLevel)
                        .frame(width: 160, height: 8)
                }

                // PTT Button (big, hold-to-talk)
                PTTButton(voice: voice, accent: accent)

                // Control buttons row: Mute + Replay
                HStack(spacing: 16) {
                    // Push-to-Mute button
                    Button {
                        voice.toggleMute()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: voice.muted ? "mic.slash.fill" : "mic.fill")
                                .font(.system(size: 14))
                            Text(voice.muted ? "Ton ein" : "Stummschalten")
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .foregroundColor(voice.muted ? .orange : Color(white: 0.7))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(voice.muted ? Color.orange.opacity(0.15) : Color(white: 0.1))
                        .cornerRadius(20)
                    }

                    // Replay last 5s button
                    Button {
                        voice.replayLastFiveSeconds()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "backward.fill")
                                .font(.system(size: 13))
                            Text("5s wiederholen")
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .foregroundColor(accent.opacity(0.8))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(accent.opacity(0.08))
                        .cornerRadius(20)
                    }
                }

                // Hint
                Text("Gedrückt halten zum Sprechen")
                    .font(.system(size: 12))
                    .foregroundColor(Color(white: 0.3))

                // Channel selector (if multiple channels available)
                if !voice.availableChannels.isEmpty {
                    channelSelector
                }
            }
        }
    }
}

// MARK: - PTT Button

struct PTTButton: View {
    @ObservedObject var voice: VoiceChannelService
    let accent: Color

    @State private var isPressed = false

    var body: some View {
        let activeColor = Color(red: 0.9, green: 0.1, blue: 0.1)
        let idleColor   = Color(red: 0.06, green: 0.35, blue: 0.55)

        ZStack {
            // Outer ring glow
            Circle()
                .stroke(
                    voice.speaking ? activeColor.opacity(0.35) : accent.opacity(0.15),
                    lineWidth: 3
                )
                .frame(width: 188, height: 188)
                .scaleEffect(voice.speaking ? 1.12 : 1.0)
                .animation(.easeInOut(duration: 0.55).repeatForever(autoreverses: true),
                           value: voice.speaking)

            // Mid ring
            Circle()
                .fill(voice.speaking
                      ? activeColor.opacity(0.18)
                      : idleColor.opacity(0.14))
                .frame(width: 160, height: 160)

            // Main button
            Circle()
                .fill(
                    LinearGradient(
                        colors: voice.speaking
                            ? [activeColor, Color(red: 0.6, green: 0.05, blue: 0.05)]
                            : [idleColor, Color(red: 0.03, green: 0.22, blue: 0.38)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 130, height: 130)
                .shadow(
                    color: voice.speaking ? activeColor.opacity(0.55) : accent.opacity(0.22),
                    radius: voice.speaking ? 24 : 14,
                    x: 0, y: 6
                )
                .overlay(
                    VStack(spacing: 6) {
                        Image(systemName: voice.speaking ? "waveform.circle.fill" : "mic.fill")
                            .font(.system(size: voice.speaking ? 36 : 32, weight: .semibold))
                            .foregroundColor(.white)
                        Text(voice.speaking ? "SENDE" : "PTT")
                            .font(.system(size: 13, weight: .black, design: .rounded))
                            .foregroundColor(.white.opacity(0.85))
                    }
                )
        }
        .scaleEffect(isPressed ? 0.94 : 1.0)
        .animation(.spring(response: 0.18, dampingFraction: 0.7), value: isPressed)
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in
                    if !isPressed {
                        isPressed = true
                        voice.startPTT()
                    }
                }
                .onEnded { _ in
                    isPressed = false
                    voice.stopPTT()
                }
        )
    }
}

// MARK: - Participant Row

struct ParticipantRow: View {
    let participant: VoiceParticipant
    let accent: Color

    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            ZStack {
                Circle()
                    .fill(participant.isSpeaking
                          ? Color.red.opacity(0.2)
                          : accent.opacity(0.10))
                    .frame(width: 40, height: 40)

                Text(String((participant.username.first ?? "?").uppercased()))
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(participant.isSpeaking ? .red : accent)
            }

            // Name + status
            VStack(alignment: .leading, spacing: 2) {
                Text(participant.username)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                Text(participant.isSpeaking ? "spricht…" : "bereit")
                    .font(.system(size: 11))
                    .foregroundColor(participant.isSpeaking ? .red : Color(white: 0.4))
            }

            Spacer()

            // Speaking waveform indicator
            if participant.isSpeaking {
                WaveformIndicator()
            } else {
                Image(systemName: "mic.slash.fill")
                    .font(.system(size: 13))
                    .foregroundColor(Color(white: 0.3))
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(participant.isSpeaking
                      ? Color.red.opacity(0.08)
                      : Color(red: 0.08, green: 0.10, blue: 0.15))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(participant.isSpeaking
                                ? Color.red.opacity(0.3)
                                : Color(white: 0.1),
                                lineWidth: 1)
                )
        )
        .animation(.easeInOut(duration: 0.2), value: participant.isSpeaking)
    }
}

// MARK: - Waveform Animation

struct WaveformIndicator: View {
    @State private var phase: Double = 0

    private let bars = [0.4, 0.8, 1.0, 0.7, 0.5, 0.9, 0.6]

    var body: some View {
        HStack(spacing: 2) {
            ForEach(bars.indices, id: \.self) { i in
                RoundedRectangle(cornerRadius: 2)
                    .fill(Color.red)
                    .frame(width: 3, height: CGFloat(bars[i]) * 18)
                    .animation(
                        .easeInOut(duration: 0.3 + Double(i) * 0.07)
                            .repeatForever(autoreverses: true)
                            .delay(Double(i) * 0.05),
                        value: phase
                    )
            }
        }
        .frame(height: 20)
        .onAppear { phase = 1 }
    }
}

// MARK: - Audio Level Bar

struct AudioLevelBar: View {
    var level: Float  // 0.0 – 1.0

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 4)
                    .fill(Color(white: 0.15))
                    .frame(height: 8)
                RoundedRectangle(cornerRadius: 4)
                    .fill(
                        LinearGradient(
                            colors: [Color.green, Color.yellow, Color.red],
                            startPoint: .leading, endPoint: .trailing
                        )
                    )
                    .frame(width: geo.size.width * CGFloat(level), height: 8)
                    .animation(.linear(duration: 0.05), value: level)
            }
        }
        .frame(height: 8)
    }
}

// MARK: - VoiceChannelFloatingBar
// A compact persistent bar at the bottom of the screen (shown when in channel)

struct VoiceChannelFloatingBar: View {
    @ObservedObject var voice: VoiceChannelService
    @Binding var showFullView: Bool

    private let accent = Color(red: 0, green: 0.9, blue: 1)

    var body: some View {
        if voice.joined || voice.channelActive {
            HStack(spacing: 12) {
                // Channel icon + status
                Button {
                    showFullView = true
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "antenna.radiowaves.left.and.right")
                            .font(.system(size: 14))
                            .foregroundColor(voice.channelActive ? accent : Color(white: 0.5))

                        if let speaker = voice.currentSpeakerName {
                            Text("🎙 \(speaker)")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                        } else {
                            Text(voice.joined ? "Kanal frei" : "Sprachkanal")
                                .font(.system(size: 12))
                                .foregroundColor(Color(white: 0.5))
                        }
                    }
                }

                Spacer()

                // Compact PTT
                if voice.joined {
                    Button {
                        if voice.speaking { voice.stopPTT() } else { voice.startPTT() }
                    } label: {
                        HStack(spacing: 5) {
                            Image(systemName: voice.speaking ? "waveform.circle.fill" : "mic.fill")
                                .font(.system(size: 13))
                            Text(voice.speaking ? "SENDE" : "PTT")
                                .font(.system(size: 11, weight: .bold))
                        }
                        .foregroundColor(voice.speaking ? .white : .black)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(voice.speaking ? Color.red : accent)
                        .cornerRadius(20)
                    }
                    // Also support long-press for PTT
                    .simultaneousGesture(
                        LongPressGesture(minimumDuration: 0.0)
                            .onChanged { _ in if !voice.speaking { voice.startPTT() } }
                    )

                    // Leave button
                    Button {
                        voice.leaveChannel()
                    } label: {
                        Image(systemName: "phone.down.fill")
                            .font(.system(size: 13))
                            .foregroundColor(.red)
                            .padding(8)
                            .background(Color.red.opacity(0.15))
                            .cornerRadius(20)
                    }
                } else {
                    // Join shortcut
                    Button {
                        Task { await voice.joinChannel() }
                    } label: {
                        Text("Beitreten")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.black)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(accent)
                            .cornerRadius(20)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(
                Color(red: 0.08, green: 0.10, blue: 0.16)
                    .overlay(
                        Rectangle()
                            .fill(voice.speaking ? Color.red.opacity(0.12) : Color.clear)
                    )
            )
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(voice.speaking ? Color.red.opacity(0.5) : Color(white: 0.12)),
                alignment: .top
            )
            .transition(.move(edge: .bottom).combined(with: .opacity))
            .animation(.spring(response: 0.3, dampingFraction: 0.8), value: voice.joined)
        }
    }
}
