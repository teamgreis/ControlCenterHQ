// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var auth: AuthService

    @State private var dashboard: DashboardResponse? = nil
    @State private var isLoading = true
    @State private var errorMsg = ""

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let cardBg  = Color(red: 0.08, green: 0.10, blue: 0.15)

    var body: some View {
        NavigationView {
            ScrollView {
                if isLoading {
                    ProgressView("Lade…").padding(.top, 60).foregroundColor(.white)
                } else if !errorMsg.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
                        Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
                        Button("Erneut versuchen") { Task { await load() } }
                            .foregroundColor(accent)
                    }.padding(.top, 60)
                } else if let d = dashboard {
                    VStack(spacing: 20) {
                        // Org header
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(d.server.org_name)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(accent)
                                if let u = auth.user {
                                    Text("Angemeldet als \(u.displayName)")
                                        .font(.system(size: 11)).foregroundColor(Color(white: 0.45))
                                }
                            }
                            Spacer()
                            Circle().fill(Color.green).frame(width: 8, height: 8)
                            Text("Live").font(.system(size: 11)).foregroundColor(Color(white: 0.45))
                        }
                        .padding(.horizontal, 4)

                        // KPI Grid
                        kpiGrid(d.kpis)

                        // Recent alerts
                        if !d.recent_alerts.isEmpty {
                            sectionHeader("🔔 Letzte Alarme")
                            VStack(spacing: 8) {
                                ForEach(d.recent_alerts.prefix(5)) { alert in
                                    AlertRowView(alert: alert, compact: true)
                                }
                            }
                        }

                        // Recent incidents
                        if !d.recent_incidents.isEmpty {
                            sectionHeader("⚠️ Aktive Einsätze")
                            VStack(spacing: 8) {
                                ForEach(d.recent_incidents.filter { $0.isOpen }.prefix(4)) { inc in
                                    incidentRow(inc)
                                }
                            }
                        }

                        // Fleet status
                        if !d.fleet.isEmpty {
                            sectionHeader("🚗 Flotte")
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                                ForEach(d.fleet.prefix(6)) { v in
                                    vehicleCard(v)
                                }
                            }
                        }
                    }
                    .padding(16)
                }
            }
            .background(Color(red: 0.04, green: 0.055, blue: 0.10).ignoresSafeArea())
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .refreshable { await load() }
        }
        .task { await load() }
        .onReceive(NotificationCenter.default.publisher(for: .atlasDashRefresh)) { _ in
            Task { await load() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasAlertNew)) { _ in
            Task { await load() }
        }
    }

    // MARK: - Sub-views

    @ViewBuilder
    private func kpiGrid(_ k: KPIs) -> some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
            kpiCard("Alarme", value: k.active_alerts, icon: "bell.badge",
                    color: k.active_alerts > 0 ? .red : .green)
            kpiCard("Einsätze", value: k.open_incidents, icon: "exclamationmark.triangle",
                    color: k.open_incidents > 0 ? .orange : .green)
            kpiCard("Fahrzeuge", value: k.fleet_available, icon: "car.fill",
                    color: accent)
            kpiCard("Kritisch", value: k.critical_alerts, icon: "exclamationmark.circle.fill",
                    color: k.critical_alerts > 0 ? .red : Color(white: 0.3))
            kpiCard("Im Einsatz", value: k.fleet_on_trip, icon: "car.2.fill",
                    color: k.fleet_on_trip > 0 ? .blue : Color(white: 0.3))
            kpiCard("Online", value: k.online_users, icon: "person.fill.checkmark",
                    color: .green)
        }
    }

    @ViewBuilder
    private func kpiCard(_ label: String, value: Int, icon: String, color: Color) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon).font(.system(size: 20)).foregroundColor(color)
            Text("\(value)").font(.system(size: 22, weight: .black)).foregroundColor(.white)
            Text(label).font(.system(size: 10, weight: .medium)).foregroundColor(Color(white: 0.45))
        }
        .frame(maxWidth: .infinity).padding(.vertical, 14)
        .background(cardBg).cornerRadius(12)
    }

    @ViewBuilder
    private func sectionHeader(_ title: String) -> some View {
        HStack {
            Text(title).font(.system(size: 14, weight: .bold)).foregroundColor(Color(white: 0.8))
            Spacer()
        }
    }

    @ViewBuilder
    private func incidentRow(_ inc: Incident) -> some View {
        HStack(spacing: 12) {
            Circle()
                .fill(inc.severity == "critical" ? Color.red : inc.severity == "warning" ? Color.orange : Color.blue)
                .frame(width: 8, height: 8)
            VStack(alignment: .leading, spacing: 2) {
                Text(inc.title).font(.system(size: 14, weight: .semibold)).foregroundColor(.white)
                Text(inc.status).font(.system(size: 11)).foregroundColor(Color(white: 0.45))
            }
            Spacer()
        }
        .padding(12).background(cardBg).cornerRadius(10)
    }

    @ViewBuilder
    private func vehicleCard(_ v: Vehicle) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(v.name).font(.system(size: 13, weight: .semibold)).foregroundColor(.white)
                Spacer()
                Circle()
                    .fill(v.status == "available" ? Color.green : v.status == "on_trip" ? Color.blue : Color.orange)
                    .frame(width: 8, height: 8)
            }
            Text(v.status).font(.system(size: 10)).foregroundColor(Color(white: 0.4))
            if let pct = v.fuelPercent {
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 2).fill(Color(white: 0.12)).frame(height: 4)
                        RoundedRectangle(cornerRadius: 2)
                            .fill(pct < 25 ? Color.red : pct < 50 ? Color.orange : Color.green)
                            .frame(width: geo.size.width * CGFloat(pct / 100), height: 4)
                    }
                }
                .frame(height: 4)
            }
        }
        .padding(12).background(cardBg).cornerRadius(10)
    }

    // MARK: - Data

    private func load() async {
        isLoading = dashboard == nil
        errorMsg = ""
        do {
            dashboard = try await NetworkService.shared.get(
                "/api/mobile/dashboard",
                serverURL: auth.serverURL, token: auth.token
            )
        } catch NetworkError.unauthorized {
            auth.logout()
        } catch {
            errorMsg = error.localizedDescription
        }
        isLoading = false
    }
}
