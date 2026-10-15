// © Felix Greis 2026 – All rights reserved.
import SwiftUI
import UIKit

// MARK: - Update-Check Model

private struct UpdateCheckResponse: Codable {
    let current_version: String
    let remote_version: String?
    let update_available: Bool
    let git_available: Bool
    let method: String
    let last_update: String?
    let error: String?
    let update_command: String
}

// MARK: - SystemView

struct SystemView: View {
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var tm = ThemeManager.shared

    @State private var appVersion = ""
    @State private var orgName = ""
    @State private var backingUp = false
    @State private var backupError: String? = nil
    @State private var backupSuccess = false
    @State private var showRestartConfirm = false
    @State private var restarting = false

    // Update check
    @State private var updateInfo: UpdateCheckResponse? = nil
    @State private var checkingUpdate = false
    @State private var updateError: String? = nil
    @State private var showUpdateDetail = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [tm.current.bgPrimary, tm.current.bgSecondary],
                startPoint: .topLeading, endPoint: .bottomTrailing
            ).ignoresSafeArea()

            ScrollView {
                VStack(spacing: 16) {

                    // ── Update-Banner (wenn verfügbar) ────────────────
                    if let u = updateInfo, u.update_available {
                        updateBannerCard(u)
                    }

                    // ── System-Info ───────────────────────────────────
                    infoCard

                    // ── Update-Check ──────────────────────────────────
                    updateCheckCard

                    // ── Backup ────────────────────────────────────────
                    backupCard

                    // ── Neustart ──────────────────────────────────────
                    restartCard

                    Spacer(minLength: 30)
                }
                .padding(.top, 16)
            }
        }
        .navigationTitle("System")
        .navigationBarTitleDisplayMode(.large)
        .onAppear {
            loadInfo()
            checkForUpdate()
        }
        .sheet(isPresented: $showUpdateDetail) {
            if let u = updateInfo {
                UpdateDetailSheet(info: u, onDismiss: { showUpdateDetail = false })
                    .environmentObject(auth)
            }
        }
    }

    // MARK: - Update Banner

    @ViewBuilder
    private func updateBannerCard(_ u: UpdateCheckResponse) -> some View {
        Button { showUpdateDetail = true } label: {
            HStack(spacing: 12) {
                Text("🆕").font(.title2)
                VStack(alignment: .leading, spacing: 2) {
                    Text("Update verfügbar!")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.black)
                    Text("v\(u.current_version) → v\(u.remote_version ?? "?")")
                        .font(.system(size: 12))
                        .foregroundColor(.black.opacity(0.75))
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(.black.opacity(0.6))
                    .font(.system(size: 13, weight: .semibold))
            }
            .padding(14)
            .background(
                LinearGradient(colors: [Color(red:0.2,green:0.85,blue:0.4), Color(red:0.1,green:0.7,blue:0.3)],
                               startPoint: .leading, endPoint: .trailing)
            )
            .cornerRadius(12)
            .padding(.horizontal)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Info Card

    private var infoCard: some View {
        cardSection(title: "Systeminfo", icon: "server.rack") {
            InfoRow(label: "Server-Version", value: appVersion.isEmpty ? "–" : "v\(appVersion)")
            InfoRow(label: "Organisation", value: orgName.isEmpty ? "–" : orgName)
            InfoRow(label: "Plattform", value: "ControlCenterHQ")
        }
    }

    // MARK: - Update Check Card

    private var updateCheckCard: some View {
        cardSection(title: "Software-Update", icon: "arrow.down.circle") {
            if checkingUpdate {
                HStack(spacing: 10) {
                    ProgressView().scaleEffect(0.8)
                    Text("Suche nach Updates…")
                        .font(.system(size: 13))
                        .foregroundColor(tm.current.textMuted)
                }
                .padding(.vertical, 4)
            } else if let u = updateInfo {
                if u.update_available {
                    HStack(spacing: 8) {
                        Image(systemName: "exclamationmark.circle.fill")
                            .foregroundColor(tm.current.success)
                        Text("v\(u.remote_version ?? "?") verfügbar (aktuell: v\(u.current_version))")
                            .font(.system(size: 13))
                            .foregroundColor(tm.current.success)
                    }
                } else {
                    HStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(tm.current.success)
                        Text("Aktuell – v\(u.current_version)")
                            .font(.system(size: 13))
                            .foregroundColor(tm.current.textSecondary)
                    }
                }
                if let err = u.error {
                    Text("⚠ \(err)")
                        .font(.system(size: 11))
                        .foregroundColor(tm.current.warning)
                }
            } else if let err = updateError {
                HStack(spacing: 8) {
                    Image(systemName: "wifi.slash")
                        .foregroundColor(tm.current.warning)
                    Text(err)
                        .font(.system(size: 12))
                        .foregroundColor(tm.current.textMuted)
                }
            }

            Button(action: { checkForUpdate() }) {
                Label(checkingUpdate ? "Prüfe…" : "Auf Updates prüfen",
                      systemImage: "arrow.clockwise")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 11)
                    .background(checkingUpdate ? Color.gray : tm.current.accent)
                    .cornerRadius(10)
            }
            .disabled(checkingUpdate)

            if let u = updateInfo, u.update_available {
                Button { showUpdateDetail = true } label: {
                    Label("Update-Details", systemImage: "info.circle")
                        .font(.system(size: 13))
                        .foregroundColor(tm.current.accent)
                }
            }
        }
    }

    // MARK: - Backup Card

    private var backupCard: some View {
        cardSection(title: "Datenbank-Backup", icon: "externaldrive.fill") {
            Text("Vollständige Sicherung der Datenbank als SQLite-Datei.")
                .font(.system(size: 13))
                .foregroundColor(tm.current.textMuted)

            if backupSuccess {
                Label("Backup erfolgreich erstellt", systemImage: "checkmark.circle.fill")
                    .foregroundColor(tm.current.success)
                    .font(.system(size: 13))
            }
            if let err = backupError {
                Label(err, systemImage: "xmark.circle.fill")
                    .foregroundColor(tm.current.danger)
                    .font(.system(size: 13))
            }

            Button(action: doBackup) {
                HStack {
                    if backingUp { ProgressView().scaleEffect(0.8).tint(.white) }
                    else { Image(systemName: "arrow.down.circle.fill") }
                    Text(backingUp ? "Backup läuft..." : "Backup erstellen")
                }
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 11)
                .background(backingUp ? Color.gray : Color.blue)
                .cornerRadius(10)
            }
            .disabled(backingUp)
        }
    }

    // MARK: - Restart Card

    private var restartCard: some View {
        cardSection(title: "Server", icon: "power") {
            Text("Startet den Atlas-Server neu. Die App ist für ~10 Sekunden nicht erreichbar.")
                .font(.system(size: 13))
                .foregroundColor(tm.current.textMuted)

            Button(action: { showRestartConfirm = true }) {
                HStack {
                    if restarting { ProgressView().scaleEffect(0.8).tint(.white) }
                    else { Image(systemName: "arrow.counterclockwise") }
                    Text(restarting ? "Neustart..." : "Server neu starten")
                }
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 11)
                .background(restarting ? Color.gray : Color.orange)
                .cornerRadius(10)
            }
            .disabled(restarting)
            .alert("Server neu starten?", isPresented: $showRestartConfirm) {
                Button("Neu starten", role: .destructive) { doRestart() }
                Button("Abbrechen", role: .cancel) {}
            } message: {
                Text("Der Server ist für einige Sekunden nicht erreichbar.")
            }
        }
    }

    // MARK: - Card helper

    @ViewBuilder
    private func cardSection<Content: View>(title: String, icon: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Label(title, systemImage: icon)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(tm.current.textMuted)

            Divider().background(tm.current.border)

            content()
        }
        .padding(16)
        .background(tm.current.bgCard)
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(tm.current.border, lineWidth: 1))
        .padding(.horizontal)
    }

    // MARK: - Data

    func loadInfo() {
        Task {
            struct InfoResp: Codable { let version: String?; let org_name: String? }
            let info = try? await NetworkService.shared.get(path: "/api/info", token: auth.token, as: InfoResp.self)
            await MainActor.run {
                appVersion = info?.version ?? ""
                orgName = info?.org_name ?? ""
            }
        }
    }

    func checkForUpdate() {
        checkingUpdate = true
        updateError = nil
        Task {
            do {
                let res: UpdateCheckResponse = try await NetworkService.shared.get(
                    "/api/system/update-check",
                    serverURL: auth.serverURL,
                    token: auth.token
                )
                await MainActor.run {
                    updateInfo = res
                    checkingUpdate = false
                }
            } catch {
                await MainActor.run {
                    updateError = "Kein Update-Server erreichbar"
                    checkingUpdate = false
                }
            }
        }
    }

    func doBackup() {
        backingUp = true; backupSuccess = false; backupError = nil
        Task {
            do {
                let data = try await NetworkService.shared.getRaw(path: "/api/system/backup", token: auth.token)
                let url = FileManager.default.temporaryDirectory.appendingPathComponent("atlas_backup.db")
                try data.write(to: url)
                await MainActor.run {
                    backingUp = false
                    backupSuccess = true
                    let av = UIActivityViewController(activityItems: [url], applicationActivities: nil)
                    if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                       let root = scene.windows.first?.rootViewController {
                        root.present(av, animated: true)
                    }
                }
            } catch {
                await MainActor.run {
                    backingUp = false
                    backupError = error.localizedDescription
                }
            }
        }
    }

    func doRestart() {
        restarting = true
        Task {
            _ = try? await NetworkService.shared.post(path: "/api/system/restart", token: auth.token, body: [:])
            await MainActor.run { restarting = false }
        }
    }
}

// MARK: - Update Detail Sheet

private struct UpdateDetailSheet: View {
    let info: UpdateCheckResponse
    let onDismiss: () -> Void
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var tm = ThemeManager.shared
    @State private var triggering = false
    @State private var triggerMsg: String? = nil

    var body: some View {
        NavigationView {
            ZStack {
                tm.current.bgPrimary.ignoresSafeArea()
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {

                        // Version-Karte
                        VStack(spacing: 12) {
                            HStack {
                                Text("Installiert")
                                    .foregroundColor(tm.current.textMuted)
                                Spacer()
                                Text("v\(info.current_version)")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(tm.current.textPrimary)
                            }
                            Divider().background(tm.current.border)
                            HStack {
                                Text("Verfügbar")
                                    .foregroundColor(tm.current.textMuted)
                                Spacer()
                                Text("v\(info.remote_version ?? "–")")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(info.update_available ? tm.current.success : tm.current.textPrimary)
                            }
                            Divider().background(tm.current.border)
                            HStack {
                                Text("Methode")
                                    .foregroundColor(tm.current.textMuted)
                                Spacer()
                                Text(info.method == "git" ? "🔀 Git" : info.method == "version.txt" ? "🌐 Version-URL" : "–")
                                    .font(.system(size: 13))
                                    .foregroundColor(tm.current.textSecondary)
                            }
                            if let last = info.last_update {
                                Divider().background(tm.current.border)
                                HStack {
                                    Text("Letztes Update")
                                        .foregroundColor(tm.current.textMuted)
                                    Spacer()
                                    Text(last)
                                        .font(.system(size: 12, design: .monospaced))
                                        .foregroundColor(tm.current.textMuted)
                                }
                            }
                        }
                        .padding(16)
                        .background(tm.current.bgCard)
                        .cornerRadius(12)

                        if let err = info.error {
                            Text("⚠ \(err)")
                                .font(.system(size: 12))
                                .foregroundColor(tm.current.warning)
                                .padding(.horizontal, 4)
                        }

                        // Anleitung
                        VStack(alignment: .leading, spacing: 8) {
                            Text("So aktualisieren:")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(tm.current.textPrimary)
                            Text("Per SSH auf den Server verbinden und diesen Befehl ausführen:")
                                .font(.system(size: 13))
                                .foregroundColor(tm.current.textMuted)
                            Text(info.update_command)
                                .font(.system(size: 14, design: .monospaced))
                                .foregroundColor(tm.current.accent)
                                .padding(10)
                                .background(tm.current.bgSecondary)
                                .cornerRadius(8)
                            Text("Der Server aktualisiert Dateien und startet automatisch neu (~30 Sekunden).")
                                .font(.system(size: 12))
                                .foregroundColor(tm.current.textMuted)
                        }

                        // Remote-Update-Button (nur wenn Server lokal erreichbar)
                        if info.update_available {
                            Divider().background(tm.current.border)

                            if let msg = triggerMsg {
                                Text(msg)
                                    .font(.system(size: 13))
                                    .foregroundColor(tm.current.success)
                                    .padding(.vertical, 4)
                            }

                            Button(action: triggerRemoteUpdate) {
                                HStack {
                                    if triggering { ProgressView().scaleEffect(0.8).tint(.white) }
                                    else { Image(systemName: "arrow.down.circle.fill") }
                                    Text(triggering ? "Update läuft…" : "🚀 Jetzt updaten (remote)")
                                }
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(triggering ? Color.gray : tm.current.success)
                                .cornerRadius(12)
                            }
                            .disabled(triggering)

                            Text("Der Server startet nach dem Update automatisch neu. Die Verbindung wird kurz unterbrochen.")
                                .font(.system(size: 11))
                                .foregroundColor(tm.current.textMuted)
                        }
                    }
                    .padding(16)
                }
            }
            .navigationTitle("Update-Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { onDismiss() }
                }
            }
        }
    }

    private func triggerRemoteUpdate() {
        triggering = true
        Task {
            do {
                try await NetworkService.shared.post(
                    path: "/api/system/run-update",
                    token: auth.token,
                    body: [String: Any]()
                )
                await MainActor.run {
                    triggering = false
                    triggerMsg = "✅ Update gestartet. Server startet in ~30s neu."
                }
            } catch {
                await MainActor.run {
                    triggering = false
                    triggerMsg = "❌ \(error.localizedDescription)"
                }
            }
        }
    }
}

// MARK: - InfoRow (shared)

struct InfoRow: View {
    let label: String
    let value: String
    @ObservedObject private var tm = ThemeManager.shared

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 13))
                .foregroundColor(tm.current.textMuted)
            Spacer()
            Text(value)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(tm.current.textSecondary)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
    }
}
