import SwiftUI

struct FederationPeer: Codable, Identifiable {
    let id: Int
    let name: String
    let url: String
    let status: String?
    let last_seen: String?
    let auto_discovered: Int?
    let created_at: String?
}

struct FederationView: View {
    @EnvironmentObject var auth: AuthService
    @State private var peers: [FederationPeer] = []
    @State private var loading = false
    @State private var pinging: Int? = nil
    @State private var showAdd = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                if loading && peers.isEmpty {
                    ProgressView().tint(.white)
                } else if peers.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "network").font(.system(size: 44)).foregroundColor(.gray)
                        Text("Keine Verbünde").foregroundColor(.gray)
                        Text("Verbinde dich mit anderen Atlas-Instanzen")
                            .font(.system(size: 13))
                            .foregroundColor(.gray.opacity(0.6))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                } else {
                    List(peers) { peer in
                        FederationPeerRow(peer: peer, pinging: pinging == peer.id) {
                            pingPeer(peer)
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .navigationTitle("Federation")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button { load() } label: {
                        Image(systemName: "arrow.clockwise").foregroundColor(.blue)
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showAdd = true } label: {
                        Image(systemName: "plus").foregroundColor(.blue)
                    }
                }
            }
            .sheet(isPresented: $showAdd) {
                AddPeerSheet(onAdded: { load() }).environmentObject(auth)
            }
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/federation/peers", token: auth.token, as: [FederationPeer].self)
            await MainActor.run { peers = result ?? []; loading = false }
        }
    }

    func pingPeer(_ peer: FederationPeer) {
        pinging = peer.id
        Task {
            _ = try? await NetworkService.shared.get(
                path: "/api/federation/peers/\(peer.id)/ping", token: auth.token, as: [String: String].self)
            await MainActor.run { pinging = nil; load() }
        }
    }
}

struct FederationPeerRow: View {
    let peer: FederationPeer
    let pinging: Bool
    let onPing: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(statusColor(peer.status ?? "unknown").opacity(0.15))
                    .frame(width: 40, height: 40)
                Image(systemName: "server.rack")
                    .foregroundColor(statusColor(peer.status ?? "unknown"))
                    .font(.system(size: 18))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(peer.name)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                Text(peer.url)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                if let seen = peer.last_seen {
                    Text("Zuletzt: \(formatRelative(seen))")
                        .font(.system(size: 11))
                        .foregroundColor(.gray.opacity(0.7))
                }
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                statusBadge(peer.status ?? "unknown")
                Button {
                    onPing()
                } label: {
                    if pinging {
                        ProgressView().scaleEffect(0.7).tint(.blue)
                    } else {
                        Text("Ping")
                            .font(.system(size: 11))
                            .foregroundColor(.blue)
                    }
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.vertical, 6)
        .listRowBackground(Color(white: 0.06))
    }

    func statusColor(_ s: String) -> Color {
        switch s {
        case "online": return .green
        case "offline": return .red
        case "error": return .orange
        default: return .gray
        }
    }

    @ViewBuilder func statusBadge(_ s: String) -> some View {
        Text(s.capitalized)
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(statusColor(s))
            .padding(.horizontal, 6).padding(.vertical, 2)
            .background(statusColor(s).opacity(0.15))
            .cornerRadius(4)
    }

    func formatRelative(_ s: String) -> String {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let d = f.date(from: s) else { return s }
        let diff = Int(-d.timeIntervalSinceNow)
        if diff < 60 { return "gerade eben" }
        if diff < 3600 { return "vor \(diff/60) Min" }
        if diff < 86400 { return "vor \(diff/3600) Std" }
        return "vor \(diff/86400) Tagen"
    }
}

struct AddPeerSheet: View {
    @EnvironmentObject var auth: AuthService
    @Environment(\.dismiss) var dismiss
    var onAdded: () -> Void
    @State private var name = ""
    @State private var url = ""
    @State private var apiKey = ""
    @State private var saving = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                Form {
                    Section("Verbundpartner") {
                        TextField("Name", text: $name)
                        TextField("URL (z.B. https://partner.example.com)", text: $url)
                            .keyboardType(.URL)
                            .autocapitalization(.none)
                        SecureField("API-Schlüssel (optional)", text: $apiKey)
                    }
                    .listRowBackground(Color(white: 0.1))
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Peer hinzufügen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Abbrechen") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Hinzufügen") { save() }.disabled(name.isEmpty || url.isEmpty || saving)
                }
            }
        }
    }

    func save() {
        saving = true
        let body: [String: Any] = ["name": name, "url": url, "api_key": apiKey]
        Task {
            _ = try? await NetworkService.shared.post(path: "/api/federation/peers", token: auth.token, body: body)
            await MainActor.run { saving = false; onAdded(); dismiss() }
        }
    }
}
