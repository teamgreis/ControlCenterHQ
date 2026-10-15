import SwiftUI

struct AtlasUserAdmin: Codable, Identifiable {
    let id: Int
    let username: String
    let full_name: String?
    let role: String?
    let email: String?
    let phone: String?
    let is_active: Int?
    let created_at: String?
}

struct UserGroup: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String?
    let member_count: Int?
    let color: String?
}

struct AdminView: View {
    @EnvironmentObject var auth: AuthService
    @State private var tab = 0

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    Picker("Tab", selection: $tab) {
                        Text("Benutzer").tag(0)
                        Text("Gruppen").tag(1)
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    if tab == 0 {
                        UsersSubView()
                            .environmentObject(auth)
                    } else {
                        GroupsSubView()
                            .environmentObject(auth)
                    }
                }
            }
            .navigationTitle("Administration")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

// MARK: - Users
struct UsersSubView: View {
    @EnvironmentObject var auth: AuthService
    @State private var users: [AtlasUserAdmin] = []
    @State private var loading = false
    @State private var search = ""

    var filtered: [AtlasUserAdmin] {
        if search.isEmpty { return users }
        return users.filter {
            $0.username.localizedCaseInsensitiveContains(search) ||
            ($0.full_name ?? "").localizedCaseInsensitiveContains(search)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Image(systemName: "magnifyingglass").foregroundColor(.gray)
                TextField("Suchen...", text: $search).foregroundColor(.white)
            }
            .padding(10)
            .background(Color(white: 0.1))
            .cornerRadius(10)
            .padding(.horizontal)
            .padding(.bottom, 8)

            if loading {
                Spacer()
                ProgressView().tint(.white)
                Spacer()
            } else {
                List(filtered) { user in
                    UserAdminRow(user: user)
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
            }
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/users", token: auth.token, as: [AtlasUserAdmin].self)
            await MainActor.run { users = result ?? []; loading = false }
        }
    }
}

struct UserAdminRow: View {
    let user: AtlasUserAdmin
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(roleColor(user.role ?? "viewer").opacity(0.2))
                    .frame(width: 38, height: 38)
                Text(initials(user.full_name ?? user.username))
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(roleColor(user.role ?? "viewer"))
            }
            VStack(alignment: .leading, spacing: 3) {
                HStack {
                    Text(user.full_name ?? user.username)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                    if user.is_active == 0 {
                        Text("Inaktiv")
                            .font(.system(size: 10))
                            .foregroundColor(.red)
                            .padding(.horizontal, 5).padding(.vertical, 1)
                            .background(Color.red.opacity(0.15))
                            .cornerRadius(3)
                    }
                }
                Text("@\(user.username)").font(.system(size: 12)).foregroundColor(.gray)
            }
            Spacer()
            Text(roleLabel(user.role ?? "viewer"))
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(roleColor(user.role ?? "viewer"))
                .padding(.horizontal, 7).padding(.vertical, 3)
                .background(roleColor(user.role ?? "viewer").opacity(0.15))
                .cornerRadius(5)
        }
        .padding(.vertical, 4)
        .listRowBackground(Color(white: 0.06))
    }

    func initials(_ n: String) -> String {
        let parts = n.split(separator: " ")
        if parts.count >= 2 { return "\(parts[0].prefix(1))\(parts[1].prefix(1))".uppercased() }
        return String(n.prefix(2)).uppercased()
    }

    func roleColor(_ r: String) -> Color {
        switch r {
        case "admin": return .red
        case "operator": return .orange
        case "responder": return .blue
        default: return .gray
        }
    }

    func roleLabel(_ r: String) -> String {
        switch r {
        case "admin": return "Admin"
        case "operator": return "Operator"
        case "responder": return "Einsatzkraft"
        default: return "Betrachter"
        }
    }
}

// MARK: - Groups
struct GroupsSubView: View {
    @EnvironmentObject var auth: AuthService
    @State private var groups: [UserGroup] = []
    @State private var loading = false
    @State private var showCreate = false

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Spacer()
                Button { showCreate = true } label: {
                    Label("Neue Gruppe", systemImage: "plus")
                        .font(.system(size: 14))
                        .foregroundColor(.blue)
                }
                .padding(.horizontal)
                .padding(.bottom, 6)
            }

            if loading {
                Spacer()
                ProgressView().tint(.white)
                Spacer()
            } else if groups.isEmpty {
                Spacer()
                VStack(spacing: 12) {
                    Image(systemName: "person.3").font(.system(size: 44)).foregroundColor(.gray)
                    Text("Keine Gruppen").foregroundColor(.gray)
                }
                Spacer()
            } else {
                List(groups) { group in
                    GroupRow(group: group)
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
            }
        }
        .sheet(isPresented: $showCreate) {
            CreateGroupSheet(onCreated: { load() }).environmentObject(auth)
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/groups", token: auth.token, as: [UserGroup].self)
            await MainActor.run { groups = result ?? []; loading = false }
        }
    }
}

struct GroupRow: View {
    let group: UserGroup
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle().fill(Color.purple.opacity(0.2)).frame(width: 38, height: 38)
                Image(systemName: "person.3.fill").foregroundColor(.purple).font(.system(size: 16))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(group.name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                if let desc = group.description, !desc.isEmpty {
                    Text(desc).font(.system(size: 12)).foregroundColor(.gray)
                }
            }
            Spacer()
            if let count = group.member_count {
                Text("\(count) Mitglieder")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 4)
        .listRowBackground(Color(white: 0.06))
    }
}

struct CreateGroupSheet: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss
    var onCreated: () -> Void
    @State private var name = ""
    @State private var description = ""
    @State private var saving = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                Form {
                    Section {
                        TextField("Gruppenname", text: $name)
                        TextField("Beschreibung", text: $description)
                    }
                    .listRowBackground(Color(white: 0.1))
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Neue Gruppe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Abbrechen") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Erstellen") { save() }.disabled(name.isEmpty || saving)
                }
            }
        }
    }

    func save() {
        saving = true
        let body: [String: Any] = ["name": name, "description": description]
        Task {
            _ = try? await NetworkService.shared.post(path: "/api/groups", token: auth.token, body: body)
            await MainActor.run { saving = false; onCreated(); dismiss() }
        }
    }
}
