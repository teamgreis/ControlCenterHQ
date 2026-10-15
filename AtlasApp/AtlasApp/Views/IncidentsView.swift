// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct IncidentsView: View {
    @EnvironmentObject var auth: AuthService

    @State private var incidents: [Incident] = []
    @State private var isLoading = true
    @State private var errorMsg = ""
    @State private var showNewIncident = false
    @State private var filterOpen = true

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let cardBg  = Color(red: 0.08, green: 0.10, blue: 0.15)

    private var filtered: [Incident] {
        filterOpen ? incidents.filter { $0.isOpen } : incidents
    }

    var body: some View {
        NavigationView {
            Group {
                if isLoading { ProgressView("Lade…").foregroundColor(.white) }
                else if !errorMsg.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
                        Text(errorMsg).foregroundColor(Color(white:0.6)).multilineTextAlignment(.center)
                        Button("Wiederholen") { Task { await load() } }.foregroundColor(accent)
                    }.padding()
                } else if filtered.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "checkmark.shield").font(.system(size: 40)).foregroundColor(Color(white:0.3))
                        Text(filterOpen ? "Keine offenen Einsätze" : "Keine Einsätze").foregroundColor(Color(white:0.5))
                    }
                } else {
                    List(filtered) { inc in
                        NavigationLink(destination: IncidentDetailView(incident: inc)) {
                            incidentRow(inc)
                        }
                        .listRowBackground(cardBg)
                        .listRowInsets(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
                    }
                    .listStyle(.insetGrouped).scrollContentBackground(.hidden)
                }
            }
            .background(Color(red: 0.04, green: 0.055, blue: 0.10).ignoresSafeArea())
            .navigationTitle("Einsätze")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Picker("", selection: $filterOpen) {
                        Text("Offen").tag(true)
                        Text("Alle").tag(false)
                    }
                    .pickerStyle(.segmented)
                    .frame(width: 120)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showNewIncident = true } label: {
                        Image(systemName: "plus").foregroundColor(accent)
                    }
                }
            }
            .refreshable { await load() }
        }
        .task { await load() }
        .sheet(isPresented: $showNewIncident) {
            NewIncidentView { await load() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasDashRefresh)) { _ in
            Task { await load() }
        }
    }

    @ViewBuilder
    private func incidentRow(_ inc: Incident) -> some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 2)
                .fill(inc.severity == "critical" ? Color.red : inc.severity == "warning" ? Color.orange : Color.blue)
                .frame(width: 3, height: 46)

            VStack(alignment: .leading, spacing: 4) {
                Text(inc.title)
                    .font(.system(size: 15, weight: .semibold)).foregroundColor(.white)
                HStack(spacing: 8) {
                    statusBadge(inc.status)
                    Text(inc.severity.capitalized)
                        .font(.system(size: 11)).foregroundColor(Color(white: 0.45))
                }
            }
            Spacer()
            Image(systemName: "chevron.right").foregroundColor(Color(white: 0.3)).font(.system(size: 12))
        }
        .padding(12)
    }

    @ViewBuilder
    private func statusBadge(_ status: String) -> some View {
        let color: Color = status == "open" ? .red : status == "in_progress" ? .orange : .green
        Text(status.replacingOccurrences(of: "_", with: " ").capitalized)
            .font(.system(size: 10, weight: .semibold))
            .foregroundColor(color)
            .padding(.horizontal, 6).padding(.vertical, 2)
            .background(color.opacity(0.15))
            .cornerRadius(4)
    }

    private func load() async {
        isLoading = incidents.isEmpty
        errorMsg = ""
        do {
            let resp: IncidentsResponse = try await NetworkService.shared.get(
                "/api/mobile/incidents?limit=50",
                serverURL: auth.serverURL, token: auth.token
            )
            incidents = resp.incidents
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}

// MARK: - Incident Detail

struct IncidentDetailView: View {
    let incident: Incident
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                VStack(alignment: .leading, spacing: 6) {
                    Text(incident.title)
                        .font(.system(size: 22, weight: .black)).foregroundColor(.white)
                    HStack(spacing: 8) {
                        severityBadge(incident.severity)
                        statusBadge(incident.status)
                    }
                }
                .padding(16).frame(maxWidth: .infinity, alignment: .leading)
                .background(cardBg).cornerRadius(12)

                if let desc = incident.description, !desc.isEmpty {
                    detailCard("Beschreibung", icon: "doc.text") {
                        Text(desc).font(.system(size: 14)).foregroundColor(Color(white: 0.75))
                    }
                }

                detailCard("Zeitstempel", icon: "clock") {
                    infoRow("Erstellt", incident.created_at)
                    if let upd = incident.updated_at { infoRow("Aktualisiert", upd) }
                    if let res = incident.resolved_at { infoRow("Abgeschlossen", res) }
                }

                if incident.lat != nil || incident.lng != nil {
                    detailCard("Position", icon: "mappin.circle") {
                        if let lat = incident.lat, let lng = incident.lng {
                            Text("Lat: \(String(format: "%.5f", lat)), Lng: \(String(format: "%.5f", lng))")
                                .font(.system(size: 13, design: .monospaced)).foregroundColor(Color(white:0.7))
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Color(red:0.04,green:0.055,blue:0.10).ignoresSafeArea())
        .navigationTitle("Einsatzdetails")
        .navigationBarTitleDisplayMode(.inline)
    }

    @ViewBuilder
    private func detailCard<C: View>(_ title: String, icon: String, @ViewBuilder content: () -> C) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(title, systemImage: icon)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(white: 0.45))
            content()
        }
        .padding(14).frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(red:0.08,green:0.10,blue:0.15)).cornerRadius(12)
    }

    @ViewBuilder
    private func infoRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).font(.system(size: 13)).foregroundColor(Color(white: 0.45))
            Spacer()
            Text(value).font(.system(size: 13)).foregroundColor(Color(white: 0.8))
        }
    }

    @ViewBuilder
    private func severityBadge(_ sev: String) -> some View {
        let c: Color = sev == "critical" ? .red : sev == "warning" ? .orange : .blue
        Text(sev.capitalized).font(.system(size: 11, weight: .semibold))
            .foregroundColor(c).padding(.horizontal,6).padding(.vertical,2)
            .background(c.opacity(0.15)).cornerRadius(4)
    }

    @ViewBuilder
    private func statusBadge(_ st: String) -> some View {
        let c: Color = st == "open" ? .red : st == "in_progress" ? .orange : .green
        Text(st.replacingOccurrences(of: "_", with: " ").capitalized)
            .font(.system(size: 11, weight: .semibold)).foregroundColor(c)
            .padding(.horizontal,6).padding(.vertical,2).background(c.opacity(0.15)).cornerRadius(4)
    }
}

// MARK: - New Incident Sheet

struct NewIncidentView: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss

    let onCreated: () async -> Void

    @State private var title = ""
    @State private var description = ""
    @State private var severity = "warning"
    @State private var isSaving = false
    @State private var errorMsg = ""
    @FocusState private var titleFocused: Bool

    private let accent = Color(red:0,green:0.9,blue:1)

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    formField("BEZEICHNUNG") {
                        TextField("z.B. Fahrzeugbrand A9", text: $title)
                            .autocapitalization(.sentences).focused($titleFocused)
                    }

                    VStack(alignment: .leading, spacing: 6) {
                        Text("SCHWEREGRAD").font(.system(size: 10, weight: .semibold))
                            .foregroundColor(Color(white:0.45)).tracking(0.5)
                        Picker("Schweregrad", selection: $severity) {
                            Text("Info").tag("info")
                            Text("Warnung").tag("warning")
                            Text("Kritisch").tag("critical")
                        }
                        .pickerStyle(.segmented)
                    }

                    formField("BESCHREIBUNG (OPTIONAL)") {
                        ZStack(alignment: .topLeading) {
                            if description.isEmpty {
                                Text("Weitere Details…")
                                    .foregroundColor(Color(white:0.3)).padding(.top, 2)
                            }
                            TextEditor(text: $description)
                                .frame(minHeight: 80)
                                .background(Color.clear)
                        }
                    }

                    if !errorMsg.isEmpty {
                        Text(errorMsg).font(.system(size: 13))
                            .foregroundColor(Color(red:1,green:0.35,blue:0.35))
                    }

                    Button {
                        Task { await save() }
                    } label: {
                        ZStack {
                            if isSaving { ProgressView().tint(.black) }
                            else { Text("Einsatz anlegen").fontWeight(.bold) }
                        }
                        .frame(maxWidth: .infinity).padding(15)
                        .background(title.isEmpty || isSaving ? Color(white:0.22) : accent)
                        .foregroundColor(title.isEmpty || isSaving ? Color(white:0.4) : .black)
                        .cornerRadius(13)
                    }
                    .disabled(title.isEmpty || isSaving)
                }
                .padding(20)
            }
            .background(Color(red:0.04,green:0.055,blue:0.10).ignoresSafeArea())
            .navigationTitle("Neuer Einsatz")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }.foregroundColor(Color(white:0.5))
                }
            }
            .onAppear { titleFocused = true }
        }
    }

    @ViewBuilder
    private func formField<F: View>(_ label: String, @ViewBuilder content: () -> F) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label).font(.system(size: 10, weight: .semibold))
                .foregroundColor(Color(white:0.45)).tracking(0.5)
            content()
                .padding(12).background(Color(white:0.08)).cornerRadius(11)
                .foregroundColor(.white)
        }
    }

    private func save() async {
        guard !title.isEmpty else { return }
        isSaving = true; errorMsg = ""
        do {
            let req = CreateIncidentRequest(title: title, severity: severity, description: description, lat: nil, lng: nil)
            let _: Incident = try await NetworkService.shared.post(
                "/api/mobile/incidents", body: req, serverURL: auth.serverURL, token: auth.token
            )
            await onCreated()
            dismiss()
        } catch { errorMsg = error.localizedDescription }
        isSaving = false
    }
}
