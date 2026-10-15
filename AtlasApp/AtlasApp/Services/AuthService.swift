// © Felix Greis 2026 – All rights reserved.
import Foundation
import Security
import LocalAuthentication

/// Central auth + session state. All views observe this via @EnvironmentObject.
@MainActor
class AuthService: ObservableObject {
    static let shared = AuthService()

    @Published var serverURL: String = ""
    @Published var orgName: String = ""
    @Published var token: String = ""
    @Published var user: AtlasUser?
    @Published var isLoggedIn: Bool = false

    private let keychainService = "de.atlasadmin.app"
    private let kToken = "atlas_token"
    private let kUser  = "atlas_user"
    private let kURL   = "atlas_server_url"
    private let kOrg   = "atlas_org_name"

    private init() {
        serverURL = UserDefaults.standard.string(forKey: kURL) ?? ""
        orgName   = UserDefaults.standard.string(forKey: kOrg) ?? ""
        restoreSession()
    }

    // MARK: - Server URL

    func setServerURL(_ raw: String) {
        var url = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        if !url.hasPrefix("http") { url = "https://" + url }
        while url.hasSuffix("/") { url = String(url.dropLast()) }
        serverURL = url
        UserDefaults.standard.set(url, forKey: kURL)
    }

    func clearServerURL() {
        serverURL = ""
        orgName = ""
        UserDefaults.standard.removeObject(forKey: kURL)
        UserDefaults.standard.removeObject(forKey: kOrg)
    }

    // MARK: - Login

    func login(username: String, password: String) async throws {
        guard !serverURL.isEmpty else { throw AuthError.noServer }
        let resp: LoginResponse = try await NetworkService.shared.post(
            "/api/auth/login",
            body: LoginRequest(username: username, password: password),
            serverURL: serverURL,
            token: ""
        )
        // Server returns { "token": "...", "user": { ... } }
        token = resp.token
        user  = resp.user
        isLoggedIn = true
        saveKeychain(kToken, value: resp.token)
        if let data = try? JSONEncoder().encode(resp.user) { saveKeychainData(kUser, data: data) }

        // Fetch and cache org name
        if let info: InfoResponse = try? await NetworkService.shared.getPublic("/api/info", serverURL: serverURL) {
            let org = info.org_name ?? ""
            orgName = org
            UserDefaults.standard.set(org, forKey: kOrg)
        }
    }

    func logout() {
        token = ""
        user  = nil
        isLoggedIn = false
        deleteKeychain(kToken)
        deleteKeychain(kUser)
        WebSocketService.shared.disconnect()
    }

    func logoutAndClearServer() {
        logout()
        clearServerURL()
    }

    // MARK: - Auto restore

    private func restoreSession() {
        guard
            let t = loadKeychain(kToken),
            let data = loadKeychainData(kUser),
            let u = try? JSONDecoder().decode(AtlasUser.self, from: data)
        else { return }
        token = t
        user  = u
        isLoggedIn = true
    }

    func validateSession() async {
        guard isLoggedIn, !token.isEmpty, !serverURL.isEmpty else { return }
        do {
            let _: AtlasUser = try await NetworkService.shared.get(
                "/api/auth/me", serverURL: serverURL, token: token
            )
        } catch NetworkError.unauthorized {
            logout()
        } catch {}
    }

    // MARK: - Biometrics

    var biometricsAvailable: Bool {
        LAContext().canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil)
    }

    func authenticateWithBiometrics() async throws {
        let ctx = LAContext()
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil) else {
            throw AuthError.biometryUnavailable
        }
        try await ctx.evaluatePolicy(
            .deviceOwnerAuthenticationWithBiometrics,
            localizedReason: "Atlas Control Center – Anmeldung bestätigen"
        )
    }

    // MARK: - Keychain

    private func saveKeychain(_ key: String, value: String) {
        saveKeychainData(key, data: Data(value.utf8))
    }

    private func saveKeychainData(_ key: String, data: Data) {
        let q: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                 kSecAttrService as String: keychainService,
                                 kSecAttrAccount as String: key]
        SecItemDelete(q as CFDictionary)
        var item = q
        item[kSecValueData as String] = data
        item[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        SecItemAdd(item as CFDictionary, nil)
    }

    private func loadKeychain(_ key: String) -> String? {
        guard let data = loadKeychainData(key) else { return nil }
        return String(data: data, encoding: .utf8)
    }

    private func loadKeychainData(_ key: String) -> Data? {
        let q: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                 kSecAttrService as String: keychainService,
                                 kSecAttrAccount as String: key,
                                 kSecReturnData as String: true,
                                 kSecMatchLimit as String: kSecMatchLimitOne]
        var item: CFTypeRef?
        guard SecItemCopyMatching(q as CFDictionary, &item) == errSecSuccess,
              let data = item as? Data else { return nil }
        return data
    }

    private func deleteKeychain(_ key: String) {
        let q: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                 kSecAttrService as String: keychainService,
                                 kSecAttrAccount as String: key]
        SecItemDelete(q as CFDictionary)
    }
}

// MARK: - Errors

enum AuthError: LocalizedError {
    case noServer
    case invalidCredentials
    case biometryUnavailable

    var errorDescription: String? {
        switch self {
        case .noServer:              return "Keine Server-URL konfiguriert."
        case .invalidCredentials:    return "Benutzername oder Passwort falsch."
        case .biometryUnavailable:   return "Biometrie nicht verfügbar."
        }
    }
}
