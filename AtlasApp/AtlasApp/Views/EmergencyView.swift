// © Felix Greis 2026 – All rights reserved.
import SwiftUI

/// Full-screen emergency broadcast sheet — hold the button for 3 seconds to fire.
struct EmergencyView: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss

    @State private var title = ""
    @State private var message = ""
    @State private var severity = "critical"
    @State private var holdProgress: Double = 0
    @State private var holding = false
    @State private var holdTask: Task<Void, Never>? = nil
    @State private var isSending = false
    @State private var sentOK = false
    @State private var errorMsg = ""
    @FocusState private var titleFocused: Bool

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)

    var body: some View {
        NavigationView {
            ZStack {
                bg.ignoresSafeArea()

                if sentOK {
                    successView
                } else {
                    mainContent
                }
            }
            .navigationTitle("Notfallalarm")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                        .foregroundColor(Color(white: 0.5))
                }
            }
        }
    }

    // MARK: - Main Content

    private var mainContent: some View {
        ScrollView {
            VStack(spacing: 24) {

                // Warning header
                VStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.system(size: 44, weight: .black))
                        .foregroundColor(.red)
                    Text("Notfallalarm auslösen")
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(.white)
                    Text("Dieser Alarm wird sofort an ALLE Nutzer gesendet und löst kritische Push-Benachrichtigungen aus.")
                        .font(.system(size: 13))
                        .foregroundColor(Color(white: 0.5))
                        .multilineTextAlignment(.center)
                }
                .padding(.top, 16)
                .padding(.horizontal, 20)

                // Severity
                VStack(alignment: .leading, spacing: 8) {
                    fieldLabel("SCHWEREGRAD")
                    HStack(spacing: 10) {
                        ForEach([("critical","🚨 Kritisch",.red), ("warning","⚠️ Warnung",.orange), ("info","ℹ️ Info",.blue)], id: \.0) { sev, label, color in
                            let selected = severity == sev
                            Button {
                                withAnimation(.spring(response: 0.25)) { severity = sev }
                            } label: {
                                Text(label)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(selected ? .black : color)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 10)
                                    .background(selected ? color : color.opacity(0.12))
                                    .cornerRadius(10)
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)

                // Title
                VStack(alignment: .leading, spacing: 8) {
                    fieldLabel("BEZEICHNUNG")
                    TextField("z.B. Brand im Lagerraum B2", text: $title)
                        .padding(14)
                        .background(Color(white: 0.09))
                        .cornerRadius(12)
                        .foregroundColor(.white)
                        .focused($titleFocused)
                        .autocapitalization(.sentences)
                }
                .padding(.horizontal, 20)

                // Message
                VStack(alignment: .leading, spacing: 8) {
                    fieldLabel("NACHRICHT (OPTIONAL)")
                    ZStack(alignment: .topLeading) {
                        if message.isEmpty {
                            Text("Weitere Details zum Notfall…")
                                .foregroundColor(Color(white: 0.28))
                                .padding(14)
                        }
                        TextEditor(text: $message)
                            .frame(minHeight: 80)
                            .padding(10)
                            .background(Color.clear)
                    }
                    .background(Color(white: 0.09))
                    .cornerRadius(12)
                    .foregroundColor(.white)
                    .frame(minHeight: 80)
                }
                .padding(.horizontal, 20)

                // Error
                if !errorMsg.isEmpty {
                    Text(errorMsg)
                        .font(.system(size: 13))
                        .foregroundColor(Color(red: 1, green: 0.35, blue: 0.35))
                        .padding(.horizontal, 20)
                }

                // Hold-to-Send button
                VStack(spacing: 10) {
                    Text(holding ? "Gedrückt halten…" : "Gedrückt halten zum Auslösen")
                        .font(.system(size: 12))
                        .foregroundColor(Color(white: 0.4))

                    ZStack {
                        // Background ring
                        Circle()
                            .fill(Color(white: 0.08))
                            .frame(width: 130, height: 130)

                        // Progress ring
                        Circle()
                            .trim(from: 0, to: holdProgress)
                            .stroke(severityColor, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                            .rotationEffect(.degrees(-90))
                            .frame(width: 118, height: 118)
                            .animation(.linear(duration: 0.05), value: holdProgress)

                        // Inner button
                        ZStack {
                            Circle()
                                .fill(holding ? severityColor.opacity(0.3) : Color(white: 0.12))
                                .frame(width: 100, height: 100)
                            if isSending {
                                ProgressView().tint(.white)
                            } else {
                                VStack(spacing: 4) {
                                    Image(systemName: "exclamationmark.triangle.fill")
                                        .font(.system(size: 28, weight: .black))
                                        .foregroundColor(title.isEmpty ? Color(white: 0.3) : severityColor)
                                    Text("SOS")
                                        .font(.system(size: 11, weight: .black))
                                        .foregroundColor(title.isEmpty ? Color(white: 0.3) : Color(white: 0.7))
                                }
                            }
                        }
                        .frame(width: 100, height: 100)
                        .scaleEffect(holding ? 0.94 : 1.0)
                        .animation(.spring(response: 0.2), value: holding)
                    }
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { _ in
                                if !title.isEmpty && !isSending { startHold() }
                            }
                            .onEnded { _ in cancelHold() }
                    )
                    .disabled(title.isEmpty || isSending)

                    Text("3 Sekunden halten")
                        .font(.system(size: 11))
                        .foregroundColor(Color(white: 0.3))
                }
                .padding(.bottom, 32)
            }
        }
        .onAppear { titleFocused = true }
    }

    // MARK: - Success

    private var successView: some View {
        VStack(spacing: 24) {
            Spacer()
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 72))
                .foregroundColor(.green)
            Text("Alarm gesendet!")
                .font(.system(size: 24, weight: .black))
                .foregroundColor(.white)
            Text("Der Notfallalarm wurde an alle Nutzer übermittelt.")
                .font(.system(size: 15))
                .foregroundColor(Color(white: 0.55))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            Button("Schließen") { dismiss() }
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.black)
                .frame(maxWidth: .infinity).padding(15)
                .background(Color.green)
                .cornerRadius(14)
                .padding(.horizontal, 40)
            Spacer()
        }
    }

    // MARK: - Helpers

    private var severityColor: Color {
        switch severity {
        case "critical": return .red
        case "warning":  return .orange
        default:         return .blue
        }
    }

    @ViewBuilder
    private func fieldLabel(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 10, weight: .semibold))
            .foregroundColor(Color(white: 0.45))
            .tracking(0.5)
    }

    // MARK: - Hold Logic

    private func startHold() {
        guard !holding else { return }
        holding = true
        holdProgress = 0
        holdTask = Task {
            let steps = 60
            for i in 1...steps {
                if Task.isCancelled { break }
                try? await Task.sleep(nanoseconds: 50_000_000) // 50ms × 60 = 3s
                holdProgress = Double(i) / Double(steps)
            }
            if !Task.isCancelled && holdProgress >= 1.0 {
                await send()
            }
        }
    }

    private func cancelHold() {
        holdTask?.cancel()
        holdTask = nil
        holding = false
        withAnimation(.easeOut(duration: 0.3)) { holdProgress = 0 }
    }

    private func send() async {
        isSending = true
        errorMsg = ""

        // Emergency Location Sharing: force-upload current GPS position immediately
        LocationService.shared.uploadNow()

        // Build body with optional coordinates
        let coord = LocationService.shared.currentCoordinate
        var bodyDict: [String: Any] = [
            "title": title,
            "message": message.isEmpty ? title : message,
            "severity": severity
        ]
        if let c = coord {
            bodyDict["lat"] = c.lat
            bodyDict["lng"] = c.lng
        }

        do {
            guard let url = URL(string: "\(auth.serverURL)/api/alerts/broadcast-emergency"),
                  let bodyData = try? JSONSerialization.data(withJSONObject: bodyDict) else {
                errorMsg = "Invalid URL"; isSending = false; return
            }
            var req = URLRequest(url: url)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("Bearer \(auth.token)", forHTTPHeaderField: "Authorization")
            req.httpBody = bodyData
            let (_, _) = try await URLSession.shared.data(for: req)
            withAnimation { sentOK = true }
        } catch {
            errorMsg = error.localizedDescription
        }
        holding = false
        holdProgress = 0
        isSending = false
    }
}
