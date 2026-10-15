import SwiftUI

struct CalendarEvent: Codable, Identifiable {
    let id: Int
    let user_id: Int?
    let title: String
    let type: String?
    let start_date: String
    let end_date: String?
    let all_day: Int?
    let description: String?
    let status: String?
    let user_name: String?
}

struct CalendarView: View {
    @EnvironmentObject var auth: AuthService
    @State private var events: [CalendarEvent] = []
    @State private var loading = false
    @State private var showCreate = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                if loading {
                    ProgressView().tint(.white)
                } else if events.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "calendar").font(.system(size: 44)).foregroundColor(.gray)
                        Text("Keine Termine").foregroundColor(.gray)
                    }
                } else {
                    List {
                        ForEach(groupedEvents(), id: \.key) { section in
                            Section(header: Text(section.key)
                                .foregroundColor(.gray)
                                .font(.system(size: 12, weight: .semibold))
                                .textCase(.none)) {
                                ForEach(section.events) { ev in
                                    CalendarEventRow(event: ev)
                                }
                            }
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .navigationTitle("Kalender")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showCreate = true } label: {
                        Image(systemName: "plus").foregroundColor(.blue)
                    }
                }
            }
            .sheet(isPresented: $showCreate) {
                CreateCalendarEventSheet(onCreated: { load() })
                    .environmentObject(auth)
            }
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/calendar",
                token: auth.token,
                as: [CalendarEvent].self
            )
            await MainActor.run {
                events = result ?? []
                loading = false
            }
        }
    }

    struct EventSection { let key: String; let events: [CalendarEvent] }

    func groupedEvents() -> [EventSection] {
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        let mf = DateFormatter(); mf.dateFormat = "MMMM yyyy"; mf.locale = Locale(identifier: "de_DE")
        var dict: [String: [CalendarEvent]] = [:]
        for e in events {
            let key: String
            if let d = df.date(from: String(e.start_date.prefix(10))) {
                key = mf.string(from: d)
            } else { key = e.start_date.prefix(7).description }
            dict[key, default: []].append(e)
        }
        return dict.keys.sorted().map { EventSection(key: $0, events: dict[$0]!) }
    }
}

struct CalendarEventRow: View {
    let event: CalendarEvent
    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 3)
                .fill(typeColor(event.type ?? "event"))
                .frame(width: 4)
            VStack(alignment: .leading, spacing: 3) {
                Text(event.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                HStack(spacing: 6) {
                    Text(formatDate(event.start_date))
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                    if let name = event.user_name {
                        Text("·").foregroundColor(.gray).font(.system(size: 12))
                        Text(name).font(.system(size: 12)).foregroundColor(.gray)
                    }
                }
            }
            Spacer()
            if let status = event.status {
                statusBadge(status)
            }
        }
        .padding(.vertical, 6)
        .listRowBackground(Color(white: 0.06))
    }

    func typeColor(_ t: String) -> Color {
        switch t {
        case "vacation": return .green
        case "shift": return .blue
        case "training": return .orange
        case "meeting": return .purple
        default: return .gray
        }
    }

    func formatDate(_ s: String) -> String {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"
        let o = DateFormatter(); o.dateFormat = "dd.MM.yyyy"; o.locale = Locale(identifier: "de_DE")
        if let d = f.date(from: String(s.prefix(10))) { return o.string(from: d) }
        return s
    }

    @ViewBuilder func statusBadge(_ s: String) -> some View {
        Text(s == "approved" ? "✓" : s == "pending" ? "⏳" : s)
            .font(.system(size: 11))
            .foregroundColor(s == "approved" ? .green : .orange)
    }
}

struct CreateCalendarEventSheet: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss
    var onCreated: () -> Void
    @State private var title = ""
    @State private var type = "event"
    @State private var startDate = Date()
    @State private var endDate = Date()
    @State private var description = ""
    @State private var saving = false

    let types = ["event", "shift", "vacation", "training", "meeting"]

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                Form {
                    Section {
                        TextField("Titel", text: $title)
                        Picker("Typ", selection: $type) {
                            ForEach(types, id: \.self) { Text($0).tag($0) }
                        }
                        DatePicker("Start", selection: $startDate, displayedComponents: .date)
                        DatePicker("Ende", selection: $endDate, displayedComponents: .date)
                        TextField("Beschreibung", text: $description)
                    }
                    .listRowBackground(Color(white: 0.1))
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Neuer Termin")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Abbrechen") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Speichern") { save() }
                        .disabled(title.isEmpty || saving)
                }
            }
        }
    }

    func save() {
        saving = true
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        let body: [String: Any] = [
            "title": title, "type": type,
            "start_date": df.string(from: startDate),
            "end_date": df.string(from: endDate),
            "all_day": true,
            "description": description
        ]
        Task {
            _ = try? await NetworkService.shared.post(path: "/api/calendar", token: auth.token, body: body)
            await MainActor.run { saving = false; onCreated(); dismiss() }
        }
    }
}
