// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct OnboardingView: View {
    @EnvironmentObject var auth: AuthService
    @State private var serverURLInput = ""
    @State private var showQRScanner = false
    @State private var errorMsg = ""
    @State private var isVerifying = false
    @FocusState private var urlFieldFocused: Bool
    // Animate logo + form in on first appearance
    @State private var appeared = false

    var body: some View {
        ZStack {
            Color(red: 0.04, green: 0.055, blue: 0.10)
                .ignoresSafeArea()
                .onTapGesture { urlFieldFocused = false }

            ScrollView {
                VStack(spacing: 32) {
                    // ── Logo ────────────────────────────────────────────
                    VStack(spacing: 12) {
                        Image("AppIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 90, height: 90)
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                            .shadow(color: Color(red: 0, green: 0.9, blue: 1).opacity(0.25), radius: 24)
                            .scaleEffect(appeared ? 1 : 0.7)
                            .opacity(appeared ? 1 : 0)

                        Text("Atlas Control Center")
                            .font(.system(size: 28, weight: .black))
                            .foregroundColor(.white)
                            .opacity(appeared ? 1 : 0)
                            .offset(y: appeared ? 0 : 10)

                        Text("Verbindung einrichten")
                            .font(.system(size: 15))
                            .foregroundColor(Color(white: 0.5))
                            .opacity(appeared ? 1 : 0)
                            .offset(y: appeared ? 0 : 8)
                    }
                    .padding(.top, 72)

                    // ── Form ─────────────────────────────────────────────
                    VStack(spacing: 16) {
                        // QR Scan Button (not on Mac Catalyst)
                        #if !targetEnvironment(macCatalyst)
                        Button {
                            urlFieldFocused = false
                            showQRScanner = true
                        } label: {
                            HStack(spacing: 10) {
                                Image(systemName: "qrcode.viewfinder")
                                    .font(.system(size: 20))
                                Text("QR-Code scannen")
                                    .fontWeight(.semibold)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(16)
                            .background(Color(red: 0, green: 0.898, blue: 1.0))
                            .foregroundColor(.black)
                            .cornerRadius(13)
                        }
                        .buttonStyle(.plain)

                        HStack {
                            Rectangle().fill(Color(white: 0.2)).frame(height: 1)
                            Text("oder")
                                .foregroundColor(Color(white: 0.4))
                                .font(.system(size: 12))
                                .padding(.horizontal, 8)
                            Rectangle().fill(Color(white: 0.2)).frame(height: 1)
                        }
                        #endif

                        // Manual URL input
                        VStack(alignment: .leading, spacing: 8) {
                            Text("SERVER-URL")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(Color(white: 0.45))
                                .tracking(0.5)

                            TextField("https://hostname.tailnet.ts.net:8080", text: $serverURLInput)
                                .padding(14)
                                .background(Color(white: 0.09))
                                .cornerRadius(11)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 11)
                                        .stroke(
                                            urlFieldFocused
                                                ? Color(red: 0, green: 0.898, blue: 1).opacity(0.8)
                                                : Color(white: 0.18),
                                            lineWidth: 1.5
                                        )
                                )
                                .foregroundColor(.white)
                                .autocapitalization(.none)
                                .keyboardType(.URL)
                                .disableAutocorrection(true)
                                .focused($urlFieldFocused)
                                .submitLabel(.go)
                                .onSubmit { Task { await connectManual() } }
                                .animation(.easeInOut(duration: 0.2), value: urlFieldFocused)

                            Text("💡 Tailscale-URL empfohlen – funktioniert von überall.")
                                .font(.system(size: 11))
                                .foregroundColor(Color(white: 0.38))
                        }

                        // Animated error message
                        if !errorMsg.isEmpty {
                            HStack(spacing: 6) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .font(.system(size: 12))
                                Text(errorMsg)
                                    .font(.system(size: 13))
                            }
                            .foregroundColor(Color(red: 1, green: 0.38, blue: 0.38))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .transition(.move(edge: .top).combined(with: .opacity))
                        }

                        // Connect button
                        Button {
                            urlFieldFocused = false
                            Task { await connectManual() }
                        } label: {
                            ZStack {
                                if isVerifying {
                                    ProgressView().tint(.black)
                                } else {
                                    Text("Verbinden")
                                        .fontWeight(.bold)
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding(16)
                            .background(
                                serverURLInput.isEmpty || isVerifying
                                    ? Color(white: 0.25)
                                    : Color(white: 0.9)
                            )
                            .foregroundColor(.black)
                            .cornerRadius(13)
                        }
                        .disabled(serverURLInput.isEmpty || isVerifying)
                        .animation(.easeInOut(duration: 0.15), value: serverURLInput.isEmpty)
                    }
                    .padding(.horizontal, 28)
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 20)

                    Spacer(minLength: 40)

                    Text("© Felix Greis 2026")
                        .font(.system(size: 11))
                        .foregroundColor(Color(white: 0.28))
                        .padding(.bottom, 24)
                        .opacity(appeared ? 1 : 0)
                }
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.55, dampingFraction: 0.82).delay(0.05)) {
                appeared = true
            }
        }
        .sheet(isPresented: $showQRScanner) {
            #if !targetEnvironment(macCatalyst) && canImport(UIKit)
            QRScannerSheet { scanned in
                showQRScanner = false
                if !scanned.isEmpty { handleQRCode(scanned) }
            }
            #endif
        }
    }

    // MARK: - Actions

    private func connectManual() async {
        let trimmed = serverURLInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        isVerifying = true
        withAnimation { errorMsg = "" }

        var raw = trimmed
        if !raw.hasPrefix("http") { raw = "https://" + raw }
        while raw.hasSuffix("/") { raw = String(raw.dropLast()) }

        guard let reqURL = URL(string: "\(raw)/api/info") else {
            withAnimation { errorMsg = "Ungültige URL" }
            isVerifying = false
            return
        }
        do {
            var req = URLRequest(url: reqURL)
            req.timeoutInterval = 10
            let (_, resp) = try await URLSession.shared.data(for: req)
            let statusCode = (resp as? HTTPURLResponse)?.statusCode ?? 0
            guard statusCode == 200 else {
                withAnimation { errorMsg = "Server nicht erreichbar (HTTP \(statusCode))" }
                isVerifying = false
                return
            }
            auth.setServerURL(raw)
        } catch {
            withAnimation {
                errorMsg = "Verbindung fehlgeschlagen: \(error.localizedDescription)"
            }
        }
        isVerifying = false
    }

    private func handleQRCode(_ value: String) {
        // Expected format: atlas://connect?url=...
        if let comps = URLComponents(string: value),
           comps.scheme == "atlas",
           let urlParam = comps.queryItems?.first(where: { $0.name == "url" })?.value,
           !urlParam.isEmpty {
            auth.setServerURL(urlParam)
        } else if value.hasPrefix("http://") || value.hasPrefix("https://") {
            auth.setServerURL(value)
        } else {
            // Show unrecognised value in the field for manual correction
            serverURLInput = value
        }
    }
}

#if !targetEnvironment(macCatalyst) && canImport(UIKit)
struct QRScannerSheet: View {
    var onScan: (String) -> Void

    var body: some View {
        ZStack(alignment: .topTrailing) {
            QRScannerView(onScan: onScan)
                .ignoresSafeArea()

            Button("Abbrechen") { onScan("") }
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.black.opacity(0.55))
                .cornerRadius(20)
                .padding(.top, 56)
                .padding(.trailing, 16)
        }
    }
}
#endif
