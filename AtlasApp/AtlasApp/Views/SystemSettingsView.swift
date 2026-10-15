// © Felix Greis 2026 – All rights reserved.
import SwiftUI

// MARK: - Models

struct SystemSetting: Codable, Identifiable {
    var id: String { key }
    let key: String
    let value: String
    let description: String
    let type: String
    let min_val: Double?
    let max_val: Double?
    let updated_at: String
}

struct SystemSettingsResponse: Codable {
    let settings: [SystemSetting]
}

// MARK: - Group definitions (mirrors web UI groups)

private struct SettingGroup {
    let label: String
    let icon: String
    let keys: [String]
}

private let settingGroups: [SettingGroup] = [
    SettingGroup(label: "Brute-Force Schutz",   icon: "lock.shield",               keys: ["login_max_attempts","login_window_seconds","login_lockout_seconds","ip_blacklist_threshold","ip_blacklist_duration_h"]),
    SettingGroup(label: "API Rate Limiting",     icon: "bolt.shield",               keys: ["api_rate_max","api_rate_window"]),
    SettingGroup(label: "Sitzungen",             icon: "key.fill",                  keys: ["session_ttl_hours","max_sessions_per_user","session_idle_hours","session_cleaner_interval_s"]),
    SettingGroup(label: "Alarme & Eskalation",   icon: "bell.badge.fill",           keys: ["alert_resend_interval_s","escalate_interval_s","escalate_age_minutes"]),
    SettingGroup(label: "Fuhrpark",              icon: "car.2.fill",                keys: ["fleet_check_interval_s","fleet_insur_warn_days","fleet_insur_crit_days","fleet_tuev_warn_days","fleet_tuev_crit_days"]),
    SettingGroup(label: "Systemüberwachung",     icon: "cpu",                       keys: ["health_check_interval_s","kpi_interval_s","sysmon_history_max","sensor_update_interval_s","pi_temp_critical_c"]),
    SettingGroup(label: "Dienste",               icon: "network",                   keys: ["nina_interval_s","scheduled_check_interval_s","failover_check_interval_s","failover_fail_threshold","ai_analysis_interval_s","ai_block_duration_h"]),
    SettingGroup(label: "Datenpflege",           icon: "externaldrive.fill",        keys: ["backup_retention_days","audit_log_retention_days","qr_token_ttl_hours"]),
]

// MARK: - Main View

struct SystemSettingsView: View {
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var tm = ThemeManager.shared

    @State private var settings: [String: SystemSetting] = [:]
    @State private var edited: [String: String] = [:]
    @State private var isLoading = true
    @State private var isSaving = false
    @State private var errorMsg: String? = nil
    @State private var successMsg: String? = nil
    @State private var showResetConfirm = false
    @State private var expandedGroup: String? = nil

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [tm.current.bgPrimary, tm.current.bgSecondary],
                startPoint: .topLeading, endPoint: .bottomTrailing
            ).ignoresSafeArea()

            if isLoading {
                ProgressView("Lade Einstellungen…")
                    .foregroundColor(tm.current.textMuted)
            } else {
                ScrollView {
                    VStack(spacing: 12) {
                        // Status messages
                        if let err = errorMsg {
                            messageBar(err, color: tm.current.danger, icon: "xmark.circle.fill")
                        }
                        if let ok = successMsg {
                            messageBar(ok, color: tm.current.success, icon: "checkmark.circle.fill")
                        }

                        // Info note
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "info.circle.fill")
                                .foregroundColor(tm.current.accent)
                            Text("Änderungen werden beim nächsten Loop-Zyklus der Hintergrund-Prozesse wirksam (kein Neustart nötig).")
                                .font(.system(size: 12))
                                .foregroundColor(tm.current.textMuted)
                        }
                        .padding(12)
                        .background(tm.current.accentDim.opacity(0.3))
                        .cornerRadius(10)
                        .padding(.horizontal)

                        // Setting groups
                        ForEach(settingGroups, id: \.label) { group in
                            groupCard(group)
                        }

                        // Actions
                        VStack(spacing: 10) {
                            Button(action: saveAll) {
                                HStack {
                                    if isSaving { ProgressView().scaleEffect(0.8).tint(.white) }
                                    else { Image(systemName: "checkmark.circle.fill") }
                                    Text(isSaving ? "Speichere…" : "Alle Änderungen speichern")
                                }
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(tm.current.success)
                                .cornerRadius(12)
                            }
                            .disabled(isSaving || edited.isEmpty)

                            Button("🔄 Auf Werkseinstellungen zurücksetzen") {
                                showResetConfirm = true
                            }
                            .font(.system(size: 13))
                            .foregroundColor(tm.current.danger)
                            .padding(.bottom, 20)
                        }
                        .padding(.horizontal)
                    }
                    .padding(.top, 12)
                }
            }
        }
        .navigationTitle("System-Einstellungen")
        .navigationBarTitleDisplayMode(.inline)
        .task { await load() }
        .alert("Werkseinstellungen?", isPresented: $showResetConfirm) {
            Button("Zurücksetzen", role: .destructive) { Task { await resetAll() } }
            Button("Abbrechen", role: .cancel) {}
        } message: {
            Text("Alle System-Einstellungen werden auf die Standardwerte zurückgesetzt.")
        }
    }

    // MARK: - Group Card

    @ViewBuilder
    private func groupCard(_ group: SettingGroup) -> some View {
        let groupSettings = group.keys.compactMap { settings[$0] }
        if groupSettings.isEmpty { EmptyView() } else {
            VStack(spacing: 0) {
                // Header row
                Button {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                        expandedGroup = expandedGroup == group.label ? nil : group.label
                    }
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: group.icon)
                            .foregroundColor(tm.current.accent)
                            .frame(width: 22)
                        Text(group.label)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(tm.current.textPrimary)
                        Spacer()
                        Text("\(groupSettings.count)")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(tm.current.textMuted)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(tm.current.bgSecondary)
                            .cornerRadius(8)
                        Image(systemName: expandedGroup == group.label ? "chevron.up" : "chevron.down")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(tm.current.textMuted)
                    }
                    .padding(14)
                }
                .buttonStyle(.plain)

                if expandedGroup == group.label {
                    Divider().background(tm.current.border)

                    VStack(spacing: 0) {
                        ForEach(groupSettings) { setting in
                            settingRow(setting)
                            if setting.key != groupSettings.last?.key {
                                Divider().background(tm.current.border.opacity(0.5)).padding(.horizontal)
                            }
                        }
                    }
                }
            }
            .background(tm.current.bgCard)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(tm.current.border, lineWidth: 1)
            )
            .padding(.horizontal)
        }
    }

    // MARK: - Setting Row

    @ViewBuilder
    private func settingRow(_ setting: SystemSetting) -> some View {
        let binding = Binding<String>(
            get: { edited[setting.key] ?? setting.value },
            set: { newVal in edited[setting.key] = newVal }
        )

        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(setting.key)
                    .font(.system(size: 12, weight: .semibold, design: .monospaced))
                    .foregroundColor(tm.current.accent)
                Spacer()
                if let min = setting.min_val, let max = setting.max_val {
                    Text("\(Int(min))–\(Int(max))")
                        .font(.system(size: 10))
                        .foregroundColor(tm.current.textMuted)
                }
            }

            Text(setting.description)
                .font(.system(size: 11))
                .foregroundColor(tm.current.textMuted)
                .fixedSize(horizontal: false, vertical: true)

            TextField("Wert", text: binding)
                .keyboardType(.numbersAndPunctuation)
                .font(.system(size: 14, design: .monospaced))
                .foregroundColor(tm.current.textPrimary)
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
                .background(tm.current.bgSecondary)
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(edited[setting.key] != nil ? tm.current.accent : tm.current.border, lineWidth: 1)
                )
        }
        .padding(14)
    }

    // MARK: - Message Bar

    @ViewBuilder
    private func messageBar(_ text: String, color: Color, icon: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon).foregroundColor(color)
            Text(text)
                .font(.system(size: 13))
                .foregroundColor(color)
            Spacer()
        }
        .padding(12)
        .background(color.opacity(0.12))
        .cornerRadius(10)
        .padding(.horizontal)
    }

    // MARK: - Data

    private func load() async {
        isLoading = true
        errorMsg = nil
        do {
            let resp: SystemSettingsResponse = try await NetworkService.shared.get(
                "/api/admin/settings",
                serverURL: auth.serverURL,
                token: auth.token
            )
            await MainActor.run {
                settings = Dictionary(uniqueKeysWithValues: resp.settings.map { ($0.key, $0) })
                edited = [:]
                isLoading = false
            }
        } catch {
            await MainActor.run {
                errorMsg = "Fehler: \(error.localizedDescription)"
                isLoading = false
            }
        }
    }

    private func saveAll() {
        guard !edited.isEmpty else { return }
        isSaving = true
        errorMsg = nil
        successMsg = nil
        Task {
            do {
                // Build payload: [key: intValue]
                var payload: [String: Any] = [:]
                for (key, val) in edited {
                    if let n = Int(val) { payload[key] = n }
                    else if let d = Double(val) { payload[key] = d }
                    else { payload[key] = val }
                }
                try await NetworkService.shared.put(
                    path: "/api/admin/settings",
                    token: auth.token,
                    body: payload
                )
                await MainActor.run {
                    isSaving = false
                    successMsg = "✅ \(edited.count) Einstellung(en) gespeichert."
                    edited = [:]
                    // Update local state
                    // Reload to get fresh values
                }
                await load()
            } catch {
                await MainActor.run {
                    isSaving = false
                    errorMsg = "Fehler: \(error.localizedDescription)"
                }
            }
        }
    }

    private func resetAll() async {
        isSaving = true
        errorMsg = nil
        do {
            try await NetworkService.shared.post(
                path: "/api/admin/settings/reset",
                token: auth.token,
                body: [String: Any]()
            )
            await MainActor.run {
                successMsg = "🔄 Werkseinstellungen wiederhergestellt."
                edited = [:]
            }
            await load()
        } catch {
            await MainActor.run {
                errorMsg = "Fehler: \(error.localizedDescription)"
            }
        }
        await MainActor.run { isSaving = false }
    }
}
