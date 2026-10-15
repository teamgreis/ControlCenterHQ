import SwiftUI

struct Asset: Codable, Identifiable {
    let id: Int
    let name: String
    let type: String?
    let category: String?
    let status: String?
    let location: String?
    let serial_number: String?
    let notes: String?
    let created_at: String?
    let last_checked: String?
}

struct AssetsView: View {
    @EnvironmentObject var auth: AuthService
    @State private var assets: [Asset] = []
    @State private var loading = false
    @State private var search = ""
    @State private var showCreate = false

    var filtered: [Asset] {
        if search.isEmpty { return assets }
        return assets.filter {
            $0.name.localizedCaseInsensitiveContains(search) ||
            ($0.category ?? "").localizedCaseInsensitiveContains(search) ||
            ($0.location ?? "").localizedCaseInsensitiveContains(search)
        }
    }

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    // Search
                    HStack {
                        Image(systemName: "magnifyingglass").foregroundColor(.gray)
                        TextField("Suchen...", text: $search).foregroundColor(.white)
                        if !search.isEmpty {
                            Button { search = "" } label: {
                                Image(systemName: "xmark.circle.fill").foregroundColor(.gray)
                            }
                        }
                    }
                    .padding(10)
                    .background(Color(white: 0.1))
                    .cornerRadius(10)
                    .padding(.horizontal)
                    .padding(.top, 8)

                    if loading {
                        Spacer()
                        ProgressView().tint(.white)
                        Spacer()
                    } else if filtered.isEmpty {
                        Spacer()
                        VStack(spacing: 12) {
                            Image(systemName: "shippingbox").font(.system(size: 44)).foregroundColor(.gray)
                            Text("Keine Assets").foregroundColor(.gray)
                        }
                        Spacer()
                    } else {
                        List(filtered) { asset in
                            AssetRow(asset: asset)
                        }
                        .listStyle(.plain)
                        .scrollContentBackground(.hidden)
                    }
                }
            }
            .navigationTitle("Assets")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showCreate = true } label: {
                        Image(systemName: "plus").foregroundColor(.blue)
                    }
                }
            }
            .sheet(isPresented: $showCreate) {
                CreateAssetSheet(onCreated: { load() }).environmentObject(auth)
            }
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/assets", token: auth.token, as: [Asset].self)
            await MainActor.run { assets = result ?? []; loading = false }
        }
    }
}

struct AssetRow: View {
    let asset: Asset
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(categoryColor(asset.category ?? "").opacity(0.15))
                    .frame(width: 40, height: 40)
                Image(systemName: categoryIcon(asset.category ?? ""))
                    .foregroundColor(categoryColor(asset.category ?? ""))
                    .font(.system(size: 18))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(asset.name)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                HStack(spacing: 6) {
                    if let cat = asset.category {
                        Text(cat).font(.system(size: 12)).foregroundColor(.gray)
                    }
                    if let loc = asset.location {
                        Text("·").foregroundColor(.gray).font(.system(size: 12))
                        Text(loc).font(.system(size: 12)).foregroundColor(.gray)
                    }
                }
            }
            Spacer()
            statusDot(asset.status ?? "unknown")
        }
        .padding(.vertical, 4)
        .listRowBackground(Color(white: 0.06))
    }

    func categoryIcon(_ c: String) -> String {
        switch c.lowercased() {
        case "vehicle", "fahrzeug": return "car.fill"
        case "tool", "werkzeug": return "wrench.fill"
        case "equipment", "ausrüstung": return "gearshape.fill"
        case "medical", "medizin": return "cross.case.fill"
        case "communication", "kommunikation": return "antenna.radiowaves.left.and.right"
        default: return "shippingbox.fill"
        }
    }

    func categoryColor(_ c: String) -> Color {
        switch c.lowercased() {
        case "vehicle", "fahrzeug": return .blue
        case "medical", "medizin": return .red
        case "communication", "kommunikation": return .green
        default: return .orange
        }
    }

    @ViewBuilder func statusDot(_ s: String) -> some View {
        let color: Color = s == "available" ? .green : s == "in_use" ? .orange : s == "maintenance" ? .yellow : .red
        Circle().fill(color).frame(width: 8, height: 8)
    }
}

struct CreateAssetSheet: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss
    var onCreated: () -> Void
    @State private var name = ""
    @State private var type = ""
    @State private var category = "equipment"
    @State private var location = ""
    @State private var serial = ""
    @State private var notes = ""
    @State private var saving = false

    let categories = ["equipment", "vehicle", "tool", "medical", "communication"]

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                Form {
                    Section {
                        TextField("Name", text: $name)
                        TextField("Typ", text: $type)
                        Picker("Kategorie", selection: $category) {
                            ForEach(categories, id: \.self) { Text($0).tag($0) }
                        }
                        TextField("Standort", text: $location)
                        TextField("Seriennummer", text: $serial)
                        TextField("Notizen", text: $notes)
                    }
                    .listRowBackground(Color(white: 0.1))
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Neues Asset")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Abbrechen") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Speichern") { save() }.disabled(name.isEmpty || saving)
                }
            }
        }
    }

    func save() {
        saving = true
        let body: [String: Any] = [
            "name": name, "type": type, "category": category,
            "location": location, "serial_number": serial, "notes": notes, "status": "available"
        ]
        Task {
            _ = try? await NetworkService.shared.post(path: "/api/assets", token: auth.token, body: body)
            await MainActor.run { saving = false; onCreated(); dismiss() }
        }
    }
}
