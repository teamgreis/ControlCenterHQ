import SwiftUI

struct PagerMessage: Codable, Identifiable {
    let id: Int
    let timestamp: String?
    let ric: String?
    let function_bits: Int?
    let message: String?
    let source: String?
    let created_at: String?
}

struct PagerStatus: Codable {
    let enabled: Bool?
    let frequency: String?
    let device: String?
    let messages_today: Int?
    let last_message: String?
}

struct PagerView: View {
    @EnvironmentObject var auth: AuthService
    @State private var messages: [PagerMessage] = []
    @State private var status: PagerStatus?
    @State private var loading = false
    @State private var autoRefresh = true
    private let timer = Timer.publish(every: 10, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    // Status bar
                    if let s = status {
                        HStack(spacing: 16) {
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(s.enabled == true ? Color.green : Color.red)
                                    .frame(width: 8, height: 8)
                                Text(s.enabled == true ? "Empfänger aktiv" : "Inaktiv")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                            if let freq = s.frequency {
                                Text(freq).font(.system(size: 12)).foregroundColor(.gray)
                            }
                            Spacer()
                            if let count = s.messages_today {
                                Text("\(count) heute").font(.system(size: 12)).foregroundColor(.gray)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.vertical, 10)
                        .background(Color(white: 0.08))
                    }

                    if loading && messages.isEmpty {
                        Spacer()
                        ProgressView().tint(.white)
                        Spacer()
                    } else if messages.isEmpty {
                        Spacer()
                        VStack(spacing: 12) {
                            Image(systemName: "antenna.radiowaves.left.and.right")
                                .font(.system(size: 44)).foregroundColor(.gray)
                            Text("Keine Pager-Nachrichten").foregroundColor(.gray)
                        }
                        Spacer()
                    } else {
                        List(messages) { msg in
                            PagerMessageRow(message: msg)
                        }
                        .listStyle(.plain)
                        .scrollContentBackground(.hidden)
                    }
                }
            }
            .navigationTitle("Pager")
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
        .onReceive(timer) { _ in if autoRefresh { load() } }
    }

    func load() {
        Task {
            async let msgs = NetworkService.shared.get(
                path: "/api/pager/rx/messages?limit=100",
                token: auth.token,
                as: [PagerMessage].self
            )
            async let stat = NetworkService.shared.get(
                path: "/api/pager/rx/status",
                token: auth.token,
                as: PagerStatus.self
            )
            let (m, s) = (try? await msgs, try? await stat)
            await MainActor.run {
                messages = m ?? []
                status = s
                loading = false
            }
        }
    }
}

struct PagerMessageRow: View {
    let message: PagerMessage
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                if let ric = message.ric {
                    Text("RIC: \(ric)")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.orange)
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(Color.orange.opacity(0.15))
                        .cornerRadius(4)
                }
                Spacer()
                Text(formatTime(message.timestamp ?? message.created_at ?? ""))
                    .font(.system(size: 11))
                    .foregroundColor(.gray)
            }
            if let msg = message.message, !msg.isEmpty {
                Text(msg)
                    .font(.system(size: 14))
                    .foregroundColor(.white)
                    .lineLimit(3)
            }
        }
        .padding(.vertical, 6)
        .listRowBackground(Color(white: 0.06))
    }

    func formatTime(_ s: String) -> String {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let f2 = ISO8601DateFormatter()
        f2.formatOptions = [.withInternetDateTime]
        let df = DateFormatter(); df.dateFormat = "HH:mm dd.MM"
        if let d = f.date(from: s) ?? f2.date(from: s) { return df.string(from: d) }
        return s
    }
}
