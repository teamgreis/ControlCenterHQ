// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct ChatView: View {
    @EnvironmentObject var auth: AuthService
    @State private var rooms: [ChatRoom] = []
    @State private var isLoading = true
    @State private var errorMsg = ""
    @State private var chatTab = 0  // 0 = Räume, 1 = Direktnachrichten

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                Picker("Tab", selection: $chatTab) {
                    Text("Räume").tag(0)
                    Text("Direktnachrichten").tag(1)
                }
                .pickerStyle(.segmented)
                .padding()

                if chatTab == 0 {
                    Group {
                        if isLoading {
                            Spacer()
                            ProgressView("Lade Räume…").foregroundColor(.white)
                            Spacer()
                        } else if !errorMsg.isEmpty {
                            errorView
                        } else if rooms.isEmpty {
                            emptyView
                        } else {
                            roomList
                        }
                    }
                } else {
                    DMListView().environmentObject(auth)
                }
            }
            .background(bg.ignoresSafeArea())
            .navigationTitle("Chat")
            .navigationBarTitleDisplayMode(.large)
            .refreshable { await loadRooms() }
        }
        .task { await loadRooms() }
        .onReceive(NotificationCenter.default.publisher(for: .atlasChatMessage)) { _ in
            Task { await loadRooms() }
        }
    }

    // MARK: - Room List

    private var roomList: some View {
        List(rooms) { room in
            NavigationLink(destination: ChatRoomView(room: room)) {
                HStack(spacing: 12) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 10)
                            .fill(roomColor(room.type).opacity(0.18))
                            .frame(width: 42, height: 42)
                        Image(systemName: roomIcon(room.type))
                            .font(.system(size: 18))
                            .foregroundColor(roomColor(room.type))
                    }
                    VStack(alignment: .leading, spacing: 3) {
                        Text("#\(room.name)")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                        if let desc = room.description, !desc.isEmpty {
                            Text(desc)
                                .font(.system(size: 12))
                                .foregroundColor(Color(white: 0.45))
                        }
                    }
                    Spacer()
                    Text(room.type.capitalized)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(roomColor(room.type))
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(roomColor(room.type).opacity(0.12))
                        .cornerRadius(5)
                }
                .padding(.vertical, 4)
            }
            .listRowBackground(cardBg)
            .listRowInsets(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
    }

    private var emptyView: some View {
        VStack(spacing: 12) {
            Image(systemName: "bubble.left.and.bubble.right")
                .font(.system(size: 40)).foregroundColor(Color(white: 0.3))
            Text("Keine Chat-Räume vorhanden")
                .foregroundColor(Color(white: 0.5))
        }
    }

    private var errorView: some View {
        VStack(spacing: 12) {
            Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
            Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
            Button("Wiederholen") { Task { await loadRooms() } }.foregroundColor(accent)
        }.padding(32)
    }

    // MARK: - Helpers

    private func roomColor(_ type: String) -> Color {
        switch type {
        case "alerts":  return .red
        case "ops":     return .orange
        default:        return accent
        }
    }

    private func roomIcon(_ type: String) -> String {
        switch type {
        case "alerts":  return "exclamationmark.bubble"
        case "ops":     return "wrench.and.screwdriver"
        default:        return "bubble.left.and.bubble.right"
        }
    }

    // MARK: - Data

    private func loadRooms() async {
        isLoading = rooms.isEmpty
        errorMsg = ""
        do {
            let r: [ChatRoom] = try await NetworkService.shared.get(
                "/api/mobile/chat/rooms", serverURL: auth.serverURL, token: auth.token
            )
            rooms = r
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}

// MARK: - Chat Room View

struct ChatRoomView: View {
    @EnvironmentObject var auth: AuthService
    let room: ChatRoom

    @State private var messages: [ChatMessage] = []
    @State private var newMessage = ""
    @State private var isSending = false
    @State private var isLoading = true
    @FocusState private var inputFocused: Bool

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let myBg   = Color(red: 0, green: 0.3, blue: 0.35)
    private let otherBg = Color(red: 0.10, green: 0.12, blue: 0.18)

    var body: some View {
        VStack(spacing: 0) {
            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(messages) { msg in
                            messageRow(msg)
                                .id(msg.id)
                        }
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 10)
                }
                .onChange(of: messages.count) { _ in
                    if let last = messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
                .onAppear {
                    if let last = messages.last {
                        proxy.scrollTo(last.id, anchor: .bottom)
                    }
                }
            }

            Divider().background(Color(white: 0.15))

            // Input bar
            HStack(spacing: 10) {
                TextField("Nachricht…", text: $newMessage, axis: .vertical)
                    .lineLimit(1...4)
                    .padding(10)
                    .background(Color(white: 0.09))
                    .cornerRadius(20)
                    .foregroundColor(.white)
                    .focused($inputFocused)
                    .onSubmit {
                        if !newMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            Task { await send() }
                        }
                    }

                Button {
                    Task { await send() }
                } label: {
                    ZStack {
                        if isSending {
                            ProgressView().tint(.black).scaleEffect(0.8)
                        } else {
                            Image(systemName: "arrow.up")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(newMessage.isEmpty ? Color(white: 0.4) : .black)
                        }
                    }
                    .frame(width: 36, height: 36)
                    .background(newMessage.isEmpty || isSending ? Color(white: 0.2) : accent)
                    .clipShape(Circle())
                }
                .disabled(newMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isSending)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(red: 0.06, green: 0.07, blue: 0.12))
        }
        .background(bg.ignoresSafeArea())
        .navigationTitle("#\(room.name)")
        .navigationBarTitleDisplayMode(.inline)
        .task { await loadMessages() }
        .onReceive(NotificationCenter.default.publisher(for: .atlasChatMessage)) { _ in
            Task { await loadMessages() }
        }
    }

    // MARK: - Message Row

    @ViewBuilder
    private func messageRow(_ msg: ChatMessage) -> some View {
        let isMe = msg.username == auth.user?.username
        HStack(alignment: .bottom, spacing: 8) {
            if isMe { Spacer(minLength: 40) }
            if !isMe {
                // Avatar
                ZStack {
                    Circle().fill(accent.opacity(0.2)).frame(width: 30, height: 30)
                    Text(String(msg.displayName.prefix(1)).uppercased())
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(accent)
                }
            }
            VStack(alignment: isMe ? .trailing : .leading, spacing: 3) {
                if !isMe {
                    Text(msg.displayName)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(accent)
                }
                Text(msg.content)
                    .font(.system(size: 14))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12).padding(.vertical, 8)
                    .background(isMe ? myBg : otherBg)
                    .cornerRadius(isMe ? 18 : 18, antialiased: true)
                Text(formatTime(msg.timestamp))
                    .font(.system(size: 10))
                    .foregroundColor(Color(white: 0.35))
            }
            if isMe {
                // Avatar rechts
                ZStack {
                    Circle().fill(Color(white: 0.15)).frame(width: 30, height: 30)
                    Text(String((auth.user?.displayName ?? "I").prefix(1)).uppercased())
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(white: 0.6))
                }
            }
            if !isMe { Spacer(minLength: 40) }
        }
    }

    private func formatTime(_ iso: String) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"
        fmt.timeZone = TimeZone(identifier: "UTC")
        guard let d = fmt.date(from: iso) else { return iso }
        let out = DateFormatter()
        out.timeStyle = .short
        out.dateStyle = .none
        return out.string(from: d)
    }

    // MARK: - Data

    private func loadMessages() async {
        isLoading = messages.isEmpty
        do {
            let r: [ChatMessage] = try await NetworkService.shared.get(
                "/api/mobile/chat/rooms/\(room.id)/messages?limit=60",
                serverURL: auth.serverURL, token: auth.token
            )
            messages = r
        } catch NetworkError.unauthorized { auth.logout() }
        catch {}
        isLoading = false
    }

    private func send() async {
        let text = newMessage.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        isSending = true
        newMessage = ""
        do {
            struct MsgBody: Encodable { let content: String }
            let _: SimpleOK = try await NetworkService.shared.post(
                "/api/mobile/chat/rooms/\(room.id)/messages",
                body: MsgBody(content: text),
                serverURL: auth.serverURL, token: auth.token
            )
            await loadMessages()
        } catch {}
        isSending = false
    }
}

// MARK: - DM List

struct DMListView: View {
    @EnvironmentObject var auth: AuthService
    @State private var users: [AtlasUser] = []
    @State private var loading = false
    @State private var search = ""

    private let accent = Color(red: 0, green: 0.9, blue: 1)

    var filtered: [AtlasUser] {
        let others = users.filter { $0.id != auth.user?.id }
        if search.isEmpty { return others }
        return others.filter {
            $0.username.localizedCaseInsensitiveContains(search) ||
            $0.full_name.localizedCaseInsensitiveContains(search)
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
            } else if filtered.isEmpty {
                Spacer()
                VStack(spacing: 12) {
                    Image(systemName: "person.2").font(.system(size: 40)).foregroundColor(Color(white: 0.3))
                    Text("Keine Benutzer").foregroundColor(Color(white: 0.5))
                }
                Spacer()
            } else {
                List(filtered) { user in
                    NavigationLink(destination: DMChatView(otherUser: user).environmentObject(auth)) {
                        HStack(spacing: 12) {
                            ZStack {
                                Circle().fill(accent.opacity(0.2)).frame(width: 38, height: 38)
                                Text(dmInitials(user.full_name.isEmpty ? user.username : user.full_name))
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(accent)
                            }
                            VStack(alignment: .leading, spacing: 2) {
                                Text(user.full_name.isEmpty ? user.username : user.full_name)
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.white)
                                Text("@\(user.username)")
                                    .font(.system(size: 12))
                                    .foregroundColor(.gray)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    .listRowBackground(Color(red: 0.08, green: 0.10, blue: 0.15))
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
                path: "/api/users", token: auth.token, as: [AtlasUser].self)
            await MainActor.run { users = result ?? []; loading = false }
        }
    }

    func dmInitials(_ n: String) -> String {
        let parts = n.split(separator: " ")
        if parts.count >= 2 { return "\(parts[0].prefix(1))\(parts[1].prefix(1))".uppercased() }
        return String(n.prefix(2)).uppercased()
    }
}

// MARK: - DM Chat View

struct DMChatView: View {
    @EnvironmentObject var auth: AuthService
    let otherUser: AtlasUser
    @State private var messages: [ChatMessage] = []
    @State private var newMessage = ""
    @State private var isSending = false
    @FocusState private var inputFocused: Bool

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let myBg   = Color(red: 0, green: 0.3, blue: 0.35)
    private let otherBg = Color(red: 0.10, green: 0.12, blue: 0.18)

    var body: some View {
        VStack(spacing: 0) {
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 8) {
                        ForEach(messages) { msg in
                            dmMessageRow(msg).id(msg.id)
                        }
                    }
                    .padding(.horizontal, 12).padding(.vertical, 10)
                }
                .onChange(of: messages.count) { _ in
                    if let last = messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
            }
            Divider().background(Color(white: 0.15))
            HStack(spacing: 10) {
                TextField("Nachricht…", text: $newMessage, axis: .vertical)
                    .lineLimit(1...4).padding(10)
                    .background(Color(white: 0.09)).cornerRadius(20)
                    .foregroundColor(.white).focused($inputFocused)
                Button { Task { await send() } } label: {
                    Image(systemName: "arrow.up")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(newMessage.isEmpty ? Color(white: 0.4) : .black)
                        .frame(width: 36, height: 36)
                        .background(newMessage.isEmpty || isSending ? Color(white: 0.2) : accent)
                        .clipShape(Circle())
                }
                .disabled(newMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isSending)
            }
            .padding(.horizontal, 12).padding(.vertical, 8)
            .background(Color(red: 0.06, green: 0.07, blue: 0.12))
        }
        .background(bg.ignoresSafeArea())
        .navigationTitle(otherUser.full_name.isEmpty ? otherUser.username : otherUser.full_name)
        .navigationBarTitleDisplayMode(.inline)
        .task { await loadMessages() }
    }

    @ViewBuilder func dmMessageRow(_ msg: ChatMessage) -> some View {
        let isMe = msg.username == auth.user?.username
        HStack(alignment: .bottom, spacing: 8) {
            if isMe { Spacer(minLength: 40) }
            VStack(alignment: isMe ? .trailing : .leading, spacing: 3) {
                Text(msg.content)
                    .font(.system(size: 14)).foregroundColor(.white)
                    .padding(.horizontal, 12).padding(.vertical, 8)
                    .background(isMe ? myBg : otherBg)
                    .cornerRadius(18)
                Text(formatDMTime(msg.timestamp))
                    .font(.system(size: 10)).foregroundColor(Color(white: 0.35))
            }
            if !isMe { Spacer(minLength: 40) }
        }
    }

    func formatDMTime(_ iso: String) -> String {
        let fmt = DateFormatter(); fmt.dateFormat = "yyyy-MM-dd HH:mm:ss"; fmt.timeZone = TimeZone(identifier: "UTC")
        guard let d = fmt.date(from: iso) else { return iso }
        let out = DateFormatter(); out.timeStyle = .short; out.dateStyle = .none
        return out.string(from: d)
    }

    func loadMessages() async {
        do {
            let r: [ChatMessage] = try await NetworkService.shared.get(
                "/api/chat/dm/\(otherUser.id)?limit=60", serverURL: auth.serverURL, token: auth.token)
            messages = r
        } catch {}
    }

    func send() async {
        let text = newMessage.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        isSending = true; newMessage = ""
        do {
            struct MsgBody: Encodable { let content: String }
            let _: SimpleOK = try await NetworkService.shared.post(
                "/api/chat/dm/\(otherUser.id)",
                body: MsgBody(content: text),
                serverURL: auth.serverURL, token: auth.token)
            await loadMessages()
        } catch {}
        isSending = false
    }
}
