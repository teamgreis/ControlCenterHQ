import SwiftUI

struct TravelRequest: Codable, Identifiable {
    let id: Int
    let requester_id: Int?
    let title: String
    let destination: String
    let start_date: String?
    let end_date: String?
    let vehicle_id: Int?
    let travel_type: String?
    let status: String?
    let notes: String?
    let requester_name: String?
    let vehicle_name: String?
}

struct TravelView: View {
    @EnvironmentObject var auth: AuthService
    @State private var requests: [TravelRequest] = []
    @State private var loading = false
    @State private var showCreate = false
    @State private var filter = "all"

    var filtered: [TravelRequest] {
        if filter == "all" { return requests }
        return requests.filter { ($0.status ?? "") == filter }
    }

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    Picker("Filter", selection: $filter) {
                        Text("Alle").tag("all")
                        Text("Ausstehend").tag("pending")
                        Text("Genehmigt").tag("approved")
                        Text("Abgelehnt").tag("rejected")
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    if loading {
                        Spacer()
                        ProgressView().tint(.white)
                        Spacer()
                    } else if filtered.isEmpty {
                        Spacer()
                        VStack(spacing: 12) {
                            Image(systemName: "car.2").font(.system(size: 44)).foregroundColor(.gray)
                            Text("Keine Reiseanträge").foregroundColor(.gray)
                        }
                        Spacer()
                    } else {
                        List(filtered) { req in
                            TravelRequestRow(request: req)
                        }
                        .listStyle(.plain)
                        .scrollContentBackground(.hidden)
                    }
                }
            }
            .navigationTitle("Reisen")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showCreate = true } label: {
                        Image(systemName: "plus").foregroundColor(.blue)
                    }
                }
            }
            .sheet(isPresented: $showCreate) {
                CreateTravelSheet(onCreated: { load() }).environmentObject(auth)
            }
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/travel", token: auth.token, as: [TravelRequest].self)
            await MainActor.run { requests = result ?? []; loading = false }
        }
    }
}

struct TravelRequestRow: View {
    let request: TravelRequest
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: travelIcon(request.travel_type ?? "car"))
                    .foregroundColor(.blue)
                Text(request.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                Spacer()
                statusBadge(request.status ?? "pending")
            }
            Text(request.destination)
                .font(.system(size: 13))
                .foregroundColor(.gray)
            HStack(spacing: 12) {
                if let start = request.start_date {
                    Label(formatDate(start), systemImage: "calendar")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
                if let vehicle = request.vehicle_name {
                    Label(vehicle, systemImage: "car")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
                if let name = request.requester_name {
                    Label(name, systemImage: "person")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(.vertical, 6)
        .listRowBackground(Color(white: 0.06))
    }

    func travelIcon(_ t: String) -> String {
        switch t {
        case "car": return "car.fill"
        case "train": return "tram.fill"
        case "plane": return "airplane"
        default: return "car.fill"
        }
    }

    @ViewBuilder func statusBadge(_ s: String) -> some View {
        let (label, color): (String, Color) = {
            switch s {
            case "approved": return ("Genehmigt", .green)
            case "rejected": return ("Abgelehnt", .red)
            default: return ("Ausstehend", .orange)
            }
        }()
        Text(label)
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(color)
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(color.opacity(0.15))
            .clipShape(Capsule())
    }

    func formatDate(_ s: String) -> String {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"
        let o = DateFormatter(); o.dateFormat = "dd.MM.yy"
        if let d = f.date(from: String(s.prefix(10))) { return o.string(from: d) }
        return s
    }
}

struct CreateTravelSheet: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss
    var onCreated: () -> Void
    @State private var title = ""
    @State private var destination = ""
    @State private var travelType = "car"
    @State private var startDate = Date()
    @State private var endDate = Date()
    @State private var notes = ""
    @State private var saving = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                Form {
                    Section {
                        TextField("Titel", text: $title)
                        TextField("Ziel", text: $destination)
                        Picker("Verkehrsmittel", selection: $travelType) {
                            Text("Auto").tag("car")
                            Text("Bahn").tag("train")
                            Text("Flugzeug").tag("plane")
                        }
                        DatePicker("Abreise", selection: $startDate, displayedComponents: .date)
                        DatePicker("Rückkehr", selection: $endDate, displayedComponents: .date)
                        TextField("Notizen", text: $notes)
                    }
                    .listRowBackground(Color(white: 0.1))
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Neuer Reiseantrag")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Abbrechen") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Senden") { save() }.disabled(title.isEmpty || destination.isEmpty || saving)
                }
            }
        }
    }

    func save() {
        saving = true
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        let body: [String: Any] = [
            "title": title, "destination": destination,
            "travel_type": travelType,
            "start_date": df.string(from: startDate),
            "end_date": df.string(from: endDate),
            "notes": notes
        ]
        Task {
            _ = try? await NetworkService.shared.post(path: "/api/travel", token: auth.token, body: body)
            await MainActor.run { saving = false; onCreated(); dismiss() }
        }
    }
}
