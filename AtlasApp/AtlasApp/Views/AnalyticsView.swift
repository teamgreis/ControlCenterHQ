// © Felix Greis 2026 – All rights reserved.
import SwiftUI

// MARK: - Analytics Models

struct AnalyticsKPIs: Codable {
    let active_assets: Int?
    let open_incidents: Int?
    let active_alerts: Int?
    let critical_alerts: Int?
    let online_users: Int?
    let total_users: Int?
    let fleet_available: Int?
    let fleet_on_trip: Int?
    let fleet_maintenance: Int?
}

struct AuditEntry: Codable, Identifiable {
    let id: Int
    let action: String
    let user_id: Int?
    let details: String?
    let ip_addr: String?
    let timestamp: String
    let username: String?
}

struct AuditResponse: Codable {
    // Server returns array directly
}

// MARK: - AnalyticsView

struct AnalyticsView: View {
    @EnvironmentObject var auth: AuthService

    @State private var kpis: AnalyticsKPIs? = nil
    @State private var audit: [AuditEntry] = []
    @State private var isLoading = true
    @State private var errorMsg = ""
    @State private var selectedTab = 0

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Segment control
                Picker("", selection: $selectedTab) {
                    Text("Übersicht").tag(0)
                    Text("Audit-Log").tag(1)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 16).padding(.vertical, 10)
                .background(bg)

                if isLoading {
                    Spacer()
                    ProgressView("Lade…").foregroundColor(.white)
                    Spacer()
                } else if !errorMsg.isEmpty {
                    Spacer()
                    VStack(spacing: 12) {
                        Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
                        Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
                        Button("Wiederholen") { Task { await load() } }.foregroundColor(accent)
                    }.padding(32)
                    Spacer()
                } else {
                    ScrollView {
                        if selectedTab == 0 {
                            kpiSection
                        } else {
                            auditSection
                        }
                    }
                    .background(bg)
                }
            }
            .background(bg.ignoresSafeArea())
            .navigationTitle("Analytik")
            .navigationBarTitleDisplayMode(.large)
            .refreshable { await load() }
        }
        .task { await load() }
    }

    // MARK: - KPI Section

    private var kpiSection: some View {
        VStack(spacing: 16) {
            // System Status
            sectionHeader("📊 System-Status")

            if let k = kpis {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    bigKpiCard("Aktive Alarme", value: k.active_alerts ?? 0,
                               icon: "bell.badge.fill",
                               color: (k.active_alerts ?? 0) > 0 ? .red : .green,
                               sub: "\(k.critical_alerts ?? 0) kritisch")
                    bigKpiCard("Offene Einsätze", value: k.open_incidents ?? 0,
                               icon: "exclamationmark.triangle.fill",
                               color: (k.open_incidents ?? 0) > 0 ? .orange : .green,
                               sub: "Aktuelle Lage")
                    bigKpiCard("Flotte verfügbar", value: k.fleet_available ?? 0,
                               icon: "car.fill",
                               color: accent,
                               sub: "\(k.fleet_on_trip ?? 0) im Einsatz")
                    bigKpiCard("Online-Nutzer", value: k.online_users ?? 0,
                               icon: "person.2.fill",
                               color: .green,
                               sub: "von \(k.total_users ?? 0) gesamt")
                }

                // Fleet detail
                sectionHeader("🚗 Flotte")
                HStack(spacing: 12) {
                    fleetStatusCard("Verfügbar", value: k.fleet_available ?? 0, color: .green)
                    fleetStatusCard("Im Einsatz", value: k.fleet_on_trip ?? 0, color: accent)
                    fleetStatusCard("Wartung", value: k.fleet_maintenance ?? 0, color: .red)
                }

                // Alert severity breakdown
                sectionHeader("🔔 Alarme")
                HStack(spacing: 12) {
                    let total = (k.active_alerts ?? 0)
                    let critical = (k.critical_alerts ?? 0)
                    let other = max(0, total - critical)
                    fleetStatusCard("Kritisch", value: critical, color: .red)
                    fleetStatusCard("Sonstige", value: other, color: .orange)
                    fleetStatusCard("Gesamt", value: total, color: Color(white: 0.5))
                }
            }

            Spacer(minLength: 20)
        }
        .padding(16)
    }

    @ViewBuilder
    private func bigKpiCard(_ label: String, value: Int, icon: String, color: Color, sub: String) -> some View {
        VStack(spacing: 10) {
            HStack {
                Image(systemName: icon).font(.system(size: 22)).foregroundColor(color)
                Spacer()
            }
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(value)")
                        .font(.system(size: 32, weight: .black))
                        .foregroundColor(.white)
                    Text(label)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(white: 0.55))
                    Text(sub)
                        .font(.system(size: 10))
                        .foregroundColor(Color(white: 0.35))
                }
                Spacer()
            }
        }
        .padding(14)
        .background(cardBg)
        .cornerRadius(14)
    }

    @ViewBuilder
    private func fleetStatusCard(_ label: String, value: Int, color: Color) -> some View {
        VStack(spacing: 6) {
            Text("\(value)")
                .font(.system(size: 24, weight: .black))
                .foregroundColor(color)
            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(white: 0.45))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(cardBg)
        .cornerRadius(12)
    }

    // MARK: - Audit Section

    private var auditSection: some View {
        VStack(spacing: 8) {
            sectionHeader("📋 Audit-Log")
            if audit.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "doc.text").font(.system(size: 36)).foregroundColor(Color(white:0.3))
                    Text("Keine Einträge").foregroundColor(Color(white: 0.5))
                }.padding(.top, 40)
            } else {
                ForEach(audit.prefix(50)) { entry in
                    auditRow(entry)
                }
            }
            Spacer(minLength: 20)
        }
        .padding(16)
    }

    @ViewBuilder
    private func auditRow(_ e: AuditEntry) -> some View {
        HStack(spacing: 12) {
            ZStack {
                Circle().fill(actionColor(e.action).opacity(0.15)).frame(width: 36, height: 36)
                Image(systemName: actionIcon(e.action)).font(.system(size: 14)).foregroundColor(actionColor(e.action))
            }
            VStack(alignment: .leading, spacing: 3) {
                HStack {
                    Text(e.action.replacingOccurrences(of: "_", with: " ").capitalized)
                        .font(.system(size: 13, weight: .semibold)).foregroundColor(.white)
                    Spacer()
                    Text(relTime(e.timestamp))
                        .font(.system(size: 11)).foregroundColor(Color(white: 0.35))
                }
                if let user = e.username {
                    Text("@\(user)")
                        .font(.system(size: 11)).foregroundColor(Color(white: 0.45))
                }
                if let ip = e.ip_addr, !ip.isEmpty {
                    Text(ip).font(.system(size: 10, design: .monospaced)).foregroundColor(Color(white: 0.3))
                }
            }
        }
        .padding(12)
        .background(cardBg)
        .cornerRadius(10)
    }

    private func actionColor(_ action: String) -> Color {
        if action.contains("delete") || action.contains("error") { return .red }
        if action.contains("login") { return .green }
        if action.contains("create") || action.contains("add") { return accent }
        if action.contains("update") || action.contains("edit") { return .orange }
        return Color(white: 0.5)
    }

    private func actionIcon(_ action: String) -> String {
        if action.contains("delete") { return "trash" }
        if action.contains("login") { return "person.fill.checkmark" }
        if action.contains("create") || action.contains("add") { return "plus.circle" }
        if action.contains("update") || action.contains("edit") { return "pencil" }
        if action.contains("alert") { return "bell" }
        return "doc.text"
    }

    private func relTime(_ ts: String) -> String {
        let fmt = DateFormatter(); fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        fmt.timeZone = TimeZone(identifier: "UTC")
        guard let d = fmt.date(from: ts) else { return ts }
        let diff = -d.timeIntervalSinceNow
        if diff < 60 { return "Gerade" }
        if diff < 3600 { return "\(Int(diff/60))m" }
        if diff < 86400 { return "\(Int(diff/3600))h" }
        return "\(Int(diff/86400))d"
    }

    @ViewBuilder
    private func sectionHeader(_ title: String) -> some View {
        HStack {
            Text(title).font(.system(size: 14, weight: .bold)).foregroundColor(Color(white: 0.8))
            Spacer()
        }
    }

    // MARK: - Data

    private func load() async {
        isLoading = kpis == nil && audit.isEmpty
        errorMsg = ""
        async let kpisTask: AnalyticsKPIs = NetworkService.shared.get("/api/analytics/kpis", serverURL: auth.serverURL, token: auth.token)
        async let auditTask: [AuditEntry] = NetworkService.shared.get("/api/audit", serverURL: auth.serverURL, token: auth.token)
        do {
            let (k, a) = try await (kpisTask, auditTask)
            kpis = k
            audit = a
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}
