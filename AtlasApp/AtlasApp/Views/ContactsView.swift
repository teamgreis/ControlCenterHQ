// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct ContactsView: View {
    @EnvironmentObject var auth: AuthService

    @State private var contacts: [Contact] = []
    @State private var isLoading = true
    @State private var errorMsg = ""
    @State private var searchText = ""

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)

    private var filtered: [Contact] {
        guard !searchText.isEmpty else { return contacts }
        let q = searchText.lowercased()
        return contacts.filter {
            $0.name.lowercased().contains(q)
            || ($0.role?.lowercased().contains(q) ?? false)
            || ($0.organization?.lowercased().contains(q) ?? false)
        }
    }

    var body: some View {
        Group {
            if isLoading {
                ProgressView("Lade Kontakte…").foregroundColor(.white)
            } else if !errorMsg.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
                    Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
                    Button("Wiederholen") { Task { await load() } }.foregroundColor(accent)
                }.padding(32)
            } else if contacts.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "person.2")
                        .font(.system(size: 40)).foregroundColor(Color(white: 0.3))
                    Text("Keine Kontakte vorhanden")
                        .foregroundColor(Color(white: 0.5))
                }
            } else {
                List(filtered) { contact in
                    contactRow(contact)
                        .listRowBackground(cardBg)
                        .listRowInsets(EdgeInsets(top: 6, leading: 12, bottom: 6, trailing: 12))
                }
                .listStyle(.insetGrouped)
                .scrollContentBackground(.hidden)
                .searchable(text: $searchText, prompt: "Name, Rolle, Organisation…")
            }
        }
        .background(bg.ignoresSafeArea())
        .navigationTitle("Kontakte")
        .navigationBarTitleDisplayMode(.large)
        .refreshable { await load() }
        .task { await load() }
    }

    @ViewBuilder
    private func contactRow(_ c: Contact) -> some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(accent.opacity(0.15))
                    .frame(width: 42, height: 42)
                Text(String(c.name.prefix(1)).uppercased())
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(accent)
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(c.name)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                if let role = c.role, !role.isEmpty {
                    Text(role)
                        .font(.system(size: 12))
                        .foregroundColor(Color(white: 0.5))
                }
                if let org = c.organization, !org.isEmpty {
                    Text(org)
                        .font(.system(size: 11))
                        .foregroundColor(Color(white: 0.35))
                }
            }

            Spacer()

            HStack(spacing: 10) {
                if let phone = c.phone, !phone.isEmpty {
                    if let url = URL(string: "tel:\(phone.replacingOccurrences(of: " ", with: ""))") {
                        Link(destination: url) {
                            Image(systemName: "phone.fill")
                                .font(.system(size: 16))
                                .foregroundColor(.green)
                        }
                    }
                }
                if let email = c.email, !email.isEmpty {
                    if let url = URL(string: "mailto:\(email)") {
                        Link(destination: url) {
                            Image(systemName: "envelope.fill")
                                .font(.system(size: 15))
                                .foregroundColor(accent)
                        }
                    }
                }
            }
        }
        .padding(.vertical, 4)
    }

    private func load() async {
        isLoading = contacts.isEmpty
        errorMsg = ""
        do {
            contacts = try await NetworkService.shared.get(
                "/api/contacts", serverURL: auth.serverURL, token: auth.token
            )
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}
