// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct AlertsView: View {
    @EnvironmentObject var auth: AuthService

    @State private var alerts: [AtlasAlert] = []
    @State private var isLoading = true
    @State private var errorMsg = ""
    @State private var showUnreadOnly = false
    @State private var ackingAll = false

    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)
    private let accent  = Color(red: 0, green: 0.9, blue: 1)

    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Lade Alarme…").foregroundColor(.white)
                } else if !errorMsg.isEmpty {
                    errorView
                } else if alerts.isEmpty {
                    emptyView
                } else {
                    list
                }
            }
            .background(Color(red: 0.04, green: 0.055, blue: 0.10).ignoresSafeArea())
            .navigationTitle("Alarme")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Toggle("Ungelesen", isOn: $showUnreadOnly)
                        .toggleStyle(.button)
                        .font(.system(size: 13))
                        .tint(accent)
                        .onChange(of: showUnreadOnly) { _ in Task { await load() } }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Task { await ackAll() }
                    } label: {
                        if ackingAll { ProgressView().tint(accent) }
                        else { Image(systemName: "checkmark.circle").foregroundColor(accent) }
                    }
                    .disabled(ackingAll || alerts.allSatisfy { $0.isAcknowledged })
                }
            }
            .refreshable { await load() }
        }
        .task { await load() }
        .onReceive(NotificationCenter.default.publisher(for: .atlasAlertNew))    { _ in Task { await load() } }
        .onReceive(NotificationCenter.default.publisher(for: .atlasAlertsAcked)) { _ in Task { await load() } }
    }

    // MARK: - Sub-views

    private var list: some View {
        List {
            ForEach(alerts) { alert in
                AlertRowView(alert: alert, compact: false)
                    .listRowBackground(cardBg)
                    .listRowInsets(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
                    .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                        if !alert.isAcknowledged {
                            Button {
                                Task { await ack(alert) }
                            } label: {
                                Label("Bestätigen", systemImage: "checkmark")
                            }
                            .tint(.green)
                        }
                    }
            }
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
    }

    private var emptyView: some View {
        VStack(spacing: 12) {
            Image(systemName: "bell.slash").font(.system(size: 40)).foregroundColor(Color(white:0.3))
            Text(showUnreadOnly ? "Keine unbestätigten Alarme" : "Keine Alarme vorhanden")
                .foregroundColor(Color(white: 0.5))
        }
    }

    private var errorView: some View {
        VStack(spacing: 12) {
            Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
            Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
            Button("Erneut versuchen") { Task { await load() } }.foregroundColor(accent)
        }.padding(32)
    }

    // MARK: - Actions

    private func load() async {
        isLoading = alerts.isEmpty
        errorMsg = ""
        do {
            let resp: AlertsResponse = try await NetworkService.shared.get(
                "/api/mobile/alerts?limit=80&unread_only=\(showUnreadOnly ? "true" : "false")",
                serverURL: auth.serverURL, token: auth.token
            )
            alerts = resp.alerts
        } catch NetworkError.unauthorized {
            auth.logout()
        } catch {
            errorMsg = error.localizedDescription
        }
        isLoading = false
    }

    private func ack(_ alert: AtlasAlert) async {
        do {
            let _: SimpleOK = try await NetworkService.shared.post(
                "/api/mobile/alerts/\(alert.id)/ack",
                body: EmptyBody(),
                serverURL: auth.serverURL, token: auth.token
            )
            await load()
        } catch {}
    }

    private func ackAll() async {
        ackingAll = true
        do {
            let _: SimpleOK = try await NetworkService.shared.post(
                "/api/mobile/alerts/ack-all",
                body: EmptyBody(),
                serverURL: auth.serverURL, token: auth.token
            )
            await load()
        } catch {}
        ackingAll = false
    }
}

// MARK: - Alert Row (shared between Dashboard + Alerts tab)

struct AlertRowView: View {
    let alert: AtlasAlert
    let compact: Bool

    private var severityColor: Color {
        switch alert.severity {
        case "critical": return .red
        case "warning":  return .orange
        default:         return .blue
        }
    }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            RoundedRectangle(cornerRadius: 2)
                .fill(severityColor)
                .frame(width: 3)
                .frame(height: compact ? 36 : nil)

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(alert.severityLevel.emoji + " " + (alert.type ?? "Alarm"))
                        .font(.system(size: compact ? 12 : 13, weight: .semibold))
                        .foregroundColor(severityColor)
                    Spacer()
                    if alert.isAcknowledged {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 12)).foregroundColor(Color(white: 0.3))
                    }
                }
                Text(alert.message)
                    .font(.system(size: compact ? 13 : 14))
                    .foregroundColor(.white)
                    .lineLimit(compact ? 2 : nil)
                if !compact {
                    HStack(spacing: 8) {
                        if let src = alert.source {
                            Text(src).font(.system(size: 11)).foregroundColor(Color(white: 0.4))
                        }
                        Spacer()
                        Text(relativeTime(alert.created_at))
                            .font(.system(size: 11)).foregroundColor(Color(white: 0.35))
                    }
                }
            }
        }
        .padding(compact ? 10 : 12)
        .background(compact ? Color(red:0.08,green:0.10,blue:0.15) : Color.clear)
        .cornerRadius(compact ? 10 : 0)
        .opacity(alert.isAcknowledged ? 0.55 : 1.0)
    }

    private func relativeTime(_ iso: String) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        fmt.timeZone = TimeZone(identifier: "UTC")
        guard let date = fmt.date(from: iso) else { return iso }
        let diff = -date.timeIntervalSinceNow
        if diff < 60 { return "Gerade eben" }
        if diff < 3600 { return "\(Int(diff/60)) Min." }
        if diff < 86400 { return "\(Int(diff/3600)) Std." }
        return "\(Int(diff/86400)) Tage"
    }
}

// Helper for empty POST body
struct EmptyBody: Encodable {}
