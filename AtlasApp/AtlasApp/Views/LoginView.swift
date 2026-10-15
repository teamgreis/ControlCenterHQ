// © Felix Greis 2026 – All rights reserved.
import SwiftUI
import LocalAuthentication

struct LoginView: View {
    @EnvironmentObject var auth: AuthService
    @State private var username = ""
    @State private var password = ""
    @State private var errorMsg = ""
    @State private var isLoading = false
    @State private var shakeOffset: CGFloat = 0
    @State private var appeared = false
    @FocusState private var focus: Field?
    private enum Field { case username, password }

    var body: some View {
        ZStack {
            Color(red: 0.04, green: 0.055, blue: 0.10).ignoresSafeArea()
                .onTapGesture { focus = nil }

            VStack(spacing: 0) {
                Spacer()

                // Logo
                VStack(spacing: 12) {
                    Image(systemName: "shield.lefthalf.filled")
                        .font(.system(size: 54, weight: .black))
                        .foregroundStyle(
                            LinearGradient(colors: [Color(red:0,green:0.9,blue:1), Color(red:0.49,green:0.23,blue:0.93)],
                                           startPoint: .topLeading, endPoint: .bottomTrailing)
                        )
                        .scaleEffect(appeared ? 1 : 0.75)
                        .opacity(appeared ? 1 : 0)

                    Text("Atlas Control Center")
                        .font(.system(size: 26, weight: .black))
                        .foregroundColor(.white)
                        .opacity(appeared ? 1 : 0)

                    if !auth.orgName.isEmpty {
                        Text(auth.orgName)
                            .font(.system(size: 13))
                            .foregroundColor(Color(red:0,green:0.9,blue:1))
                            .opacity(appeared ? 1 : 0)
                    }

                    let host = auth.serverURL
                        .replacingOccurrences(of: "https://", with: "")
                        .replacingOccurrences(of: "http://", with: "")
                    if !host.isEmpty {
                        Text(host)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(Color(red:0,green:0.9,blue:1))
                            .padding(.horizontal, 10).padding(.vertical, 4)
                            .background(Color(red:0,green:0.9,blue:1).opacity(0.12))
                            .cornerRadius(8)
                            .opacity(appeared ? 1 : 0)
                    }
                }
                .padding(.bottom, 36)

                // Form
                VStack(spacing: 14) {
                    formField(label: "BENUTZERNAME", field: .username) {
                        TextField("", text: $username)
                            .autocapitalization(.none).disableAutocorrection(true)
                            .submitLabel(.next).focused($focus, equals: .username)
                            .onSubmit { focus = .password }
                    }

                    formField(label: "PASSWORT", field: .password) {
                        SecureField("", text: $password)
                            .textContentType(.oneTimeCode)
                            .submitLabel(.done).focused($focus, equals: .password)
                            .onSubmit { Task { await doLogin() } }
                    }

                    if !errorMsg.isEmpty {
                        HStack(spacing: 6) {
                            Image(systemName: "exclamationmark.triangle.fill").font(.system(size: 12))
                            Text(errorMsg).font(.system(size: 13))
                        }
                        .foregroundColor(Color(red:1,green:0.35,blue:0.35))
                        .offset(x: shakeOffset)
                        .transition(.move(edge: .top).combined(with: .opacity))
                    }

                    // Login button
                    Button { focus = nil; Task { await doLogin() } } label: {
                        ZStack {
                            if isLoading { ProgressView().tint(.black) }
                            else { Text("Anmelden").fontWeight(.bold) }
                        }
                        .frame(maxWidth: .infinity).padding(15)
                        .background(
                            Group {
                                if username.isEmpty || password.isEmpty || isLoading {
                                    Color(white: 0.22)
                                } else {
                                    LinearGradient(
                                        colors: [Color(red:0,green:0.9,blue:1), Color(red:0.49,green:0.23,blue:0.93)],
                                        startPoint: .leading, endPoint: .trailing
                                    )
                                }
                            }
                        )
                        .foregroundColor(username.isEmpty || password.isEmpty || isLoading ? Color(white:0.5) : .black)
                        .cornerRadius(13)
                    }
                    .disabled(username.isEmpty || password.isEmpty || isLoading)

                    // Face ID
                    if auth.biometricsAvailable {
                        Button { Task { await doBiometricLogin() } } label: {
                            HStack(spacing: 6) {
                                Image(systemName: "faceid").font(.system(size: 15))
                                Text("Face ID / Touch ID").font(.system(size: 14))
                            }
                            .foregroundColor(Color(red:0,green:0.9,blue:1))
                        }
                        .padding(.top, 4)
                    }
                }
                .padding(.horizontal, 28)
                .opacity(appeared ? 1 : 0).offset(y: appeared ? 0 : 18)

                Spacer()

                Button { auth.logoutAndClearServer() } label: {
                    Text("Server wechseln")
                        .font(.system(size: 12)).foregroundColor(Color(white: 0.32))
                }
                .padding(.bottom, 28).opacity(appeared ? 1 : 0)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.82).delay(0.05)) { appeared = true }
            if auth.biometricsAvailable && !auth.token.isEmpty {
                Task {
                    try? await Task.sleep(nanoseconds: 600_000_000)
                    await doBiometricLogin()
                }
            }
        }
    }

    @ViewBuilder
    private func formField<F: View>(label: String, field: Field, @ViewBuilder content: () -> F) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 10, weight: .semibold))
                .foregroundColor(Color(white: 0.45)).tracking(0.5)
            content()
                .padding(14)
                .background(Color(white: 0.08))
                .cornerRadius(11)
                .overlay(
                    RoundedRectangle(cornerRadius: 11)
                        .stroke(focus == field
                                ? Color(red:0,green:0.9,blue:1).opacity(0.7)
                                : Color(white: 0.15), lineWidth: 1.5)
                )
                .foregroundColor(.white)
                .animation(.easeInOut(duration: 0.18), value: focus)
        }
    }

    // MARK: - Actions

    private func doLogin() async {
        guard !username.isEmpty, !password.isEmpty, !isLoading else { return }
        isLoading = true
        withAnimation { errorMsg = "" }
        do {
            try await auth.login(username: username, password: password)
        } catch {
            withAnimation { errorMsg = error.localizedDescription }
            shake()
        }
        isLoading = false
    }

    private func doBiometricLogin() async {
        guard !auth.token.isEmpty else { return }
        do {
            try await auth.authenticateWithBiometrics()
            // Token already in Keychain — just validate
            await auth.validateSession()
        } catch {
            let msg = error.localizedDescription
            if !msg.localizedCaseInsensitiveContains("cancel") {
                withAnimation { errorMsg = msg }
                shake()
            }
        }
    }

    private func shake() {
        let steps: [(Double, CGFloat)] = [(0,-8),(0.08,8),(0.16,-6),(0.24,6),(0.32,-3),(0.40,0)]
        for (delay, offset) in steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                withAnimation(.easeInOut(duration: 0.07)) { shakeOffset = offset }
            }
        }
    }
}
