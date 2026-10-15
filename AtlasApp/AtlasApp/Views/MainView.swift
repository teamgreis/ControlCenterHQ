// © Felix Greis 2026 – All rights reserved.
import SwiftUI

/// Root tab view shown after login. Handles emergency overlay + dispatch modal + SOS button.
struct MainView: View {
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var ws    = WebSocketService.shared
    @ObservedObject private var voice = VoiceChannelService.shared
    @ObservedObject private var tm    = ThemeManager.shared

    @State private var emergencyMsg: String?    = nil
    @State private var dispatchEvent: DispatchEvent? = nil
    @State private var selectedTab              = 0
    @State private var showEmergencySheet       = false
    @State private var showVoiceFullScreen      = false

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            // ── Tab View ──────────────────────────────────────────────
            VStack(spacing: 0) {
                TabView(selection: $selectedTab) {
                    DashboardView()
                        .tabItem { Label("Dashboard", systemImage: "gauge") }
                        .tag(0)

                    AlertsView()
                        .tabItem { Label("Alarme", systemImage: "bell.badge") }
                        .tag(1)

                    IncidentsView()
                        .tabItem { Label("Einsätze", systemImage: "exclamationmark.triangle") }
                        .tag(2)

                    FleetView()
                        .tabItem { Label("Flotte", systemImage: "car.2") }
                        .tag(3)

                    ChatView()
                        .tabItem { Label("Chat", systemImage: "bubble.left.and.bubble.right") }
                        .tag(4)

                    MoreView()
                        .tabItem { Label("Mehr", systemImage: "ellipsis.circle") }
                        .tag(5)
                }
                .accentColor(tm.current.accent)
                .tint(tm.current.accent)

                // ── Voice Channel Floating Bar ─────────────────────────
                VoiceChannelFloatingBar(voice: voice, showFullView: $showVoiceFullScreen)
            }

            // ── SOS Floating Button ───────────────────────────────────
            Button {
                showEmergencySheet = true
            } label: {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.9, green: 0.1, blue: 0.1),
                                         Color(red: 0.7, green: 0.05, blue: 0.05)],
                                startPoint: .topLeading, endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 56, height: 56)
                        .shadow(color: Color.red.opacity(0.55), radius: 10, x: 0, y: 4)
                    Text("SOS")
                        .font(.system(size: 13, weight: .black))
                        .foregroundColor(.white)
                }
            }
            .padding(.trailing, 18)
            .padding(.bottom, voice.joined ? 136 : 88)
            .zIndex(50)
            .animation(.spring(response: 0.3, dampingFraction: 0.8), value: voice.joined)

            // ── Emergency Overlay ─────────────────────────────────────
            if let msg = emergencyMsg {
                EmergencyOverlayView(message: msg) {
                    withAnimation { emergencyMsg = nil }
                }
                .transition(.opacity)
                .zIndex(100)
            }

            // ── Dispatch Modal ────────────────────────────────────────
            if let ev = dispatchEvent {
                DispatchModalView(event: ev) { accepted in
                    handleDispatch(ev, accepted: accepted)
                    withAnimation { dispatchEvent = nil }
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
                .zIndex(99)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: emergencyMsg != nil)
        .animation(.spring(response: 0.4, dampingFraction: 0.85), value: dispatchEvent != nil)
        .onAppear {
            ws.connect(serverURL: auth.serverURL, token: auth.token)
            Task { await auth.validateSession() }
            AppDelegate.setupQuickActions()
            // Sync server theme
            if let themeId = auth.user?.theme {
                ThemeManager.shared.applyServerTheme(themeId)
            }
        }
        .onDisappear {
            ws.disconnect()
            if voice.joined { voice.leaveChannel() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasEmergency)) { n in
            guard let msg = n.object as? WSMessage else { return }
            withAnimation { emergencyMsg = msg.message ?? msg.title ?? "NOTFALLALARM" }
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasDispatch)) { n in
            guard let ev = n.object as? DispatchEvent else { return }
            withAnimation { dispatchEvent = ev }
        }
        // Home Screen Quick Actions
        .onReceive(NotificationCenter.default.publisher(for: .atlasQuickActionSOS)) { _ in
            showEmergencySheet = true
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasQuickActionPTT)) { _ in
            showVoiceFullScreen = true
            if !voice.joined { Task { await voice.joinChannel() } }
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasQuickActionAlerts)) { _ in
            selectedTab = 1
        }
        .sheet(isPresented: $showEmergencySheet) {
            EmergencyView().environmentObject(auth)
        }
        .sheet(isPresented: $showVoiceFullScreen) {
            NavigationView {
                VoiceChannelView().environmentObject(auth)
            }
        }
    }

    private func handleDispatch(_ ev: DispatchEvent, accepted: Bool) {
        let path = accepted
            ? "/api/fleet/vehicles/\(ev.vehicleId)/dispatch/accept"
            : "/api/fleet/vehicles/\(ev.vehicleId)/dispatch/decline"
        Task {
            try? await NetworkService.shared.postVoid(
                path, body: ["reason": ""],
                serverURL: auth.serverURL, token: auth.token
            )
        }
    }
}

// MARK: - More Tab

struct MoreView: View {
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var tm = ThemeManager.shared
    @State private var showEmergency = false

    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [tm.current.bgPrimary, tm.current.bgSecondary],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                ).ignoresSafeArea()

                List {
                    // ── Notfall ───────────────────────────────────────
                    Section {
                        Button {
                            showEmergency = true
                        } label: {
                            Label("Notfallalarm auslösen", systemImage: "exclamationmark.triangle.fill")
                                .foregroundColor(tm.current.danger)
                                .fontWeight(.semibold)
                        }
                    } header: { sectionHeader("Notfall") }
                    .listRowBackground(tm.current.bgCard)

                    // ── Kommunikation ─────────────────────────────────
                    Section {
                        navRow(destination: VoiceChannelView().environmentObject(auth),
                               icon: "waveform.circle.fill", label: "Sprachkanal") {
                            if VoiceChannelService.shared.channelActive {
                                Circle().fill(tm.current.success).frame(width: 8, height: 8)
                            }
                        }
                        navRow(destination: PagerView().environmentObject(auth),
                               icon: "antenna.radiowaves.left.and.right", label: "Pager")
                    } header: { sectionHeader("Kommunikation") }
                    .listRowBackground(tm.current.bgCard)

                    // ── Lage ──────────────────────────────────────────
                    Section {
                        navRow(destination: SensorsView().environmentObject(auth),
                               icon: "sensor.tag.radiowaves.forward", label: "Sensoren")
                        navRow(destination: InfrastructureView().environmentObject(auth),
                               icon: "map.fill", label: "Infrastruktur")
                        navRow(destination: AlarmGroupsView().environmentObject(auth),
                               icon: "bell.badge.fill", label: "Alarmgruppen")
                    } header: { sectionHeader("Lage") }
                    .listRowBackground(tm.current.bgCard)

                    // ── Organisation ──────────────────────────────────
                    Section {
                        navRow(destination: ContactsView().environmentObject(auth),
                               icon: "person.2.fill", label: "Kontakte")
                        navRow(destination: CalendarView().environmentObject(auth),
                               icon: "calendar", label: "Kalender")
                        navRow(destination: TravelView().environmentObject(auth),
                               icon: "airplane", label: "Reisen")
                        navRow(destination: AssetsView().environmentObject(auth),
                               icon: "shippingbox.fill", label: "Assets")
                    } header: { sectionHeader("Organisation") }
                    .listRowBackground(tm.current.bgCard)

                    // ── Analytik ──────────────────────────────────────
                    Section {
                        navRow(destination: WeatherView().environmentObject(auth),
                               icon: "cloud.sun.fill", label: "Wetter")
                        navRow(destination: AnalyticsView().environmentObject(auth),
                               icon: "chart.bar.fill", label: "Analytik & Logs")
                        navRow(destination: FederationView().environmentObject(auth),
                               icon: "network", label: "Federation")
                    } header: { sectionHeader("Analytik") }
                    .listRowBackground(tm.current.bgCard)

                    // ── Administration ────────────────────────────────
                    Section {
                        navRow(destination: AdminView().environmentObject(auth),
                               icon: "person.badge.key.fill", label: "Benutzer & Gruppen")
                        navRow(destination: ExportView().environmentObject(auth),
                               icon: "square.and.arrow.up.fill", label: "Daten-Export")
                        navRow(destination: SystemView().environmentObject(auth),
                               icon: "server.rack", label: "System")
                        if auth.user?.isAdmin == true {
                            navRow(destination: SystemSettingsView().environmentObject(auth),
                                   icon: "gearshape.2.fill", label: "System-Einstellungen")
                        }
                    } header: { sectionHeader("Administration") }
                    .listRowBackground(tm.current.bgCard)

                    // ── App ───────────────────────────────────────────
                    Section {
                        navRow(destination: SettingsView().environmentObject(auth),
                               icon: "gearshape.fill", label: "Einstellungen")
                    } header: { sectionHeader("App") }
                    .listRowBackground(tm.current.bgCard)
                }
                .scrollContentBackground(.hidden)
                .listStyle(.insetGrouped)
            }
            .navigationTitle("Mehr")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showEmergency) {
            EmergencyView().environmentObject(auth)
        }
    }

    // MARK: – Helpers

    private func sectionHeader(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(tm.current.textMuted)
            .textCase(.none)
    }

    @ViewBuilder
    private func navRow<D: View, T: View>(destination: D, icon: String, label: String, @ViewBuilder trailing: () -> T = { EmptyView() }) -> some View {
        NavigationLink(destination: destination) {
            HStack {
                Label(label, systemImage: icon)
                    .foregroundColor(tm.current.textSecondary)
                Spacer()
                trailing()
            }
        }
    }

    @ViewBuilder
    private func navRow<D: View>(destination: D, icon: String, label: String) -> some View {
        NavigationLink(destination: destination) {
            Label(label, systemImage: icon)
                .foregroundColor(tm.current.textSecondary)
        }
    }
}

// MARK: - Emergency Overlay

struct EmergencyOverlayView: View {
    let message: String
    let onDismiss: () -> Void
    @State private var pulse = false

    var body: some View {
        ZStack {
            Color.red.opacity(0.93).ignoresSafeArea()
            VStack(spacing: 24) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 72, weight: .black))
                    .foregroundColor(.white)
                    .scaleEffect(pulse ? 1.1 : 0.95)
                    .animation(.easeInOut(duration: 0.65).repeatForever(autoreverses: true), value: pulse)

                Text("🚨 NOTFALLALARM")
                    .font(.system(size: 28, weight: .black)).foregroundColor(.white)

                Text(message)
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.white.opacity(0.9))
                    .multilineTextAlignment(.center).padding(.horizontal, 32)

                Button("Bestätigen") { onDismiss() }
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(.red)
                    .padding(.horizontal, 36).padding(.vertical, 14)
                    .background(Color.white).cornerRadius(14)
                    .padding(.top, 8)
            }
        }
        .onTapGesture { onDismiss() }
        .onAppear { pulse = true }
    }
}

// MARK: - Dispatch Modal

struct DispatchModalView: View {
    let event: DispatchEvent
    let onRespond: (Bool) -> Void
    @ObservedObject private var tm = ThemeManager.shared

    var body: some View {
        ZStack {
            Color.black.opacity(0.72).ignoresSafeArea()
            VStack(spacing: 0) {
                Spacer()
                VStack(spacing: 20) {
                    Text("🚨 Einsatzauftrag")
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(tm.current.textPrimary)

                    VStack(spacing: 6) {
                        Text(event.vehicleName)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(tm.current.accent)
                        if !event.incidentTitle.isEmpty {
                            Text(event.incidentTitle)
                                .font(.system(size: 14))
                                .foregroundColor(tm.current.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        if !event.dispatchedBy.isEmpty {
                            Text("Disponiert von: \(event.dispatchedBy)")
                                .font(.system(size: 12))
                                .foregroundColor(tm.current.textMuted)
                        }
                    }

                    HStack(spacing: 12) {
                        Button("Ablehnen") { onRespond(false) }
                            .font(.system(size: 16, weight: .semibold))
                            .frame(maxWidth: .infinity).padding(14)
                            .background(tm.current.bgCard)
                            .foregroundColor(tm.current.danger)
                            .cornerRadius(12)
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(tm.current.danger.opacity(0.4), lineWidth: 1))

                        Button("Annehmen") { onRespond(true) }
                            .font(.system(size: 16, weight: .bold))
                            .frame(maxWidth: .infinity).padding(14)
                            .background(tm.current.success)
                            .foregroundColor(.black)
                            .cornerRadius(12)
                    }
                }
                .padding(24)
                .background(tm.current.bgCard)
                .cornerRadius(20)
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(tm.current.border, lineWidth: 1))
                .padding(.horizontal, 16).padding(.bottom, 40)
            }
        }
    }
}
