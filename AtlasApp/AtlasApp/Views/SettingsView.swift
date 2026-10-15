// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var ws = WebSocketService.shared
    @ObservedObject private var tm = ThemeManager.shared
    @State private var showThemePicker = false

    var body: some View {
        NavigationView {
            ZStack {
                // Dynamic background
                LinearGradient(
                    colors: [tm.current.bgPrimary, tm.current.bgSecondary],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                List {
                    // ── Account ──────────────────────────────────────────
                    Section {
                        if let user = auth.user {
                            HStack(spacing: 14) {
                                ZStack {
                                    Circle()
                                        .fill(tm.current.accentDim)
                                        .frame(width: 46, height: 46)
                                    Text(String(user.displayName.prefix(1)).uppercased())
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundColor(tm.current.accent)
                                }

                                VStack(alignment: .leading, spacing: 3) {
                                    Text(user.displayName)
                                        .font(.system(size: 15, weight: .semibold))
                                        .foregroundColor(tm.current.textPrimary)
                                    HStack(spacing: 6) {
                                        Text("@\(user.username)")
                                            .font(.system(size: 12))
                                            .foregroundColor(tm.current.textMuted)
                                        if !user.role.isEmpty {
                                            Text(user.role.capitalized)
                                                .font(.system(size: 10, weight: .semibold))
                                                .padding(.horizontal, 6)
                                                .padding(.vertical, 2)
                                                .background(tm.current.accentDim)
                                                .foregroundColor(tm.current.accent)
                                                .cornerRadius(6)
                                        }
                                    }
                                }
                                Spacer()
                            }
                            .padding(.vertical, 6)
                        }

                        Button {
                            auth.logout()
                        } label: {
                            Label("Abmelden", systemImage: "rectangle.portrait.and.arrow.right")
                                .foregroundColor(tm.current.danger)
                        }
                    } header: {
                        sectionHeader("Account")
                    }
                    .listRowBackground(tm.current.bgCard)

                    // ── Appearance ───────────────────────────────────────
                    Section {
                        Button {
                            showThemePicker = true
                        } label: {
                            HStack(spacing: 12) {
                                ZStack {
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(
                                            LinearGradient(
                                                colors: [tm.current.bgPrimary, tm.current.accent.opacity(0.5)],
                                                startPoint: .topLeading, endPoint: .bottomTrailing
                                            )
                                        )
                                        .frame(width: 34, height: 34)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 8)
                                                .stroke(tm.current.border, lineWidth: 1)
                                        )
                                    Text(tm.current.emoji)
                                        .font(.system(size: 18))
                                }

                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Theme")
                                        .font(.system(size: 15))
                                        .foregroundColor(tm.current.textPrimary)
                                    Text(tm.current.name)
                                        .font(.system(size: 12))
                                        .foregroundColor(tm.current.accent)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(tm.current.textMuted)
                            }
                        }
                        .buttonStyle(.plain)

                        // Theme accent preview strip
                        HStack(spacing: 4) {
                            ForEach(AppTheme.all.prefix(10)) { t in
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(t.accent)
                                    .frame(height: 6)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 4)
                                            .stroke(t.id == tm.current.id ? .white : .clear, lineWidth: 1.5)
                                    )
                                    .onTapGesture { withAnimation(.spring()) { tm.setTheme(t) } }
                            }
                        }
                        .padding(.vertical, 4)

                    } header: {
                        sectionHeader("🎨 Appearance")
                    }
                    .listRowBackground(tm.current.bgCard)

                    // ── Server ───────────────────────────────────────────
                    Section {
                        infoRow(icon: "server.rack", label: "URL",
                                value: auth.serverURL
                                    .replacingOccurrences(of: "https://", with: "")
                                    .replacingOccurrences(of: "http://", with: ""),
                                mono: true)

                        HStack {
                            Label("WebSocket", systemImage: "dot.radiowaves.left.and.right")
                                .foregroundColor(tm.current.textSecondary)
                            Spacer()
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(ws.isConnected ? tm.current.success : tm.current.warning)
                                    .frame(width: 8, height: 8)
                                    .animation(.easeInOut(duration: 0.4), value: ws.isConnected)
                                Text(ws.isConnected ? "Verbunden" : "Verbinde…")
                                    .font(.system(size: 13))
                                    .foregroundColor(ws.isConnected ? tm.current.success : tm.current.warning)
                            }
                        }

                        if !auth.orgName.isEmpty {
                            infoRow(icon: "building.2", label: "Organisation", value: auth.orgName)
                        }

                        Button {
                            auth.logoutAndClearServer()
                        } label: {
                            Label("Server wechseln", systemImage: "arrow.triangle.2.circlepath")
                                .foregroundColor(tm.current.textSecondary)
                        }
                    } header: {
                        sectionHeader("🖥 Server")
                    }
                    .listRowBackground(tm.current.bgCard)

                    // ── App Info ─────────────────────────────────────────
                    Section {
                        infoRow(icon: "app.badge", label: "Version",
                                value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
                        infoRow(icon: "hammer", label: "Build",
                                value: Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1",
                                mono: true)
                        infoRow(icon: "c.circle", label: "Copyright", value: "© Felix Greis 2026")
                        infoRow(icon: "app.connected.to.app.below.fill", label: "App ID", value: "ControlCenterHQ", mono: true)
                    } header: {
                        sectionHeader("ℹ️ App")
                    }
                    .listRowBackground(tm.current.bgCard)
                }
                .scrollContentBackground(.hidden)
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Einstellungen")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showThemePicker) {
            ThemePickerView()
        }
    }

    // MARK: - Helpers

    private func sectionHeader(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(tm.current.textMuted)
            .textCase(.none)
            .kerning(0.3)
    }

    private func infoRow(icon: String, label: String, value: String, mono: Bool = false) -> some View {
        HStack {
            Label(label, systemImage: icon)
                .foregroundColor(tm.current.textSecondary)
            Spacer()
            Text(value)
                .font(mono ? .system(size: 12, design: .monospaced) : .system(size: 13))
                .foregroundColor(tm.current.textMuted)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
    }
}
