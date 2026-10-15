import SwiftUI

struct AlarmGroupsView: View {
    @EnvironmentObject var auth: AuthService
    @State private var groups: [AlarmGroup] = []
    @State private var loading = false

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                if loading {
                    ProgressView().tint(.white)
                } else if groups.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "bell.badge.fill").font(.system(size: 44)).foregroundColor(.gray)
                        Text("Keine Alarmgruppen").foregroundColor(.gray)
                        Text("Alarmgruppen werden im Web-Backend konfiguriert")
                            .font(.system(size: 13))
                            .foregroundColor(.gray.opacity(0.6))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                } else {
                    List(groups) { group in
                        AlarmGroupRow(group: group)
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .navigationTitle("Alarmgruppen")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { load() } label: {
                        Image(systemName: "arrow.clockwise").foregroundColor(.blue)
                    }
                }
            }
        }
        .onAppear { load() }
    }

    func load() {
        loading = true
        Task {
            let result = try? await NetworkService.shared.get(
                path: "/api/alarm-groups", token: auth.token, as: [AlarmGroup].self)
            await MainActor.run { groups = result ?? []; loading = false }
        }
    }
}

struct AlarmGroupRow: View {
    let group: AlarmGroup
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(hexColor(group.color ?? "#FF6B35").opacity(0.2))
                    .frame(width: 40, height: 40)
                Image(systemName: "bell.badge.fill")
                    .foregroundColor(hexColor(group.color ?? "#FF6B35"))
                    .font(.system(size: 18))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(group.name)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                if let desc = group.description, !desc.isEmpty {
                    Text(desc).font(.system(size: 12)).foregroundColor(.gray)
                }
            }
            Spacer()
            if let count = group.member_count {
                VStack(spacing: 2) {
                    Text("\(count)")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    Text("Mitglieder")
                        .font(.system(size: 10))
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(.vertical, 8)
        .listRowBackground(Color(white: 0.06))
    }

    func hexColor(_ hex: String) -> Color {
        let h = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        guard h.count == 6,
              let r = UInt8(h.prefix(2), radix: 16),
              let g = UInt8(h.dropFirst(2).prefix(2), radix: 16),
              let b = UInt8(h.dropFirst(4).prefix(2), radix: 16)
        else { return .orange }
        return Color(red: Double(r)/255, green: Double(g)/255, blue: Double(b)/255)
    }
}
