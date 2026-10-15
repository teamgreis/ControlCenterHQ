// © Felix Greis 2026 – All rights reserved.
import Foundation

/// Central HTTP client for all Atlas API calls.
/// All methods throw NetworkError on failure.
@MainActor
class NetworkService {
    static let shared = NetworkService()
    private init() {}

    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .useDefaultKeys
        return d
    }()

    // MARK: - Generic request

    func get<T: Decodable>(_ path: String, serverURL: String, token: String) async throws -> T {
        try await request(method: "GET", path: path, body: nil as String?, serverURL: serverURL, token: token)
    }

    func post<B: Encodable, T: Decodable>(_ path: String, body: B, serverURL: String, token: String) async throws -> T {
        try await request(method: "POST", path: path, body: body, serverURL: serverURL, token: token)
    }

    func postVoid<B: Encodable>(_ path: String, body: B, serverURL: String, token: String) async throws {
        let _: SimpleOK = try await request(method: "POST", path: path, body: body, serverURL: serverURL, token: token)
    }

    func delete(_ path: String, serverURL: String, token: String) async throws {
        let _: SimpleOK = try await request(method: "DELETE", path: path, body: nil as String?, serverURL: serverURL, token: token)
    }

    // MARK: - No-auth request (setup, info)

    func getPublic<T: Decodable>(_ path: String, serverURL: String) async throws -> T {
        try await request(method: "GET", path: path, body: nil as String?, serverURL: serverURL, token: "")
    }

    // MARK: - Convenience wrappers (use AuthService.serverURL + token)

    func get<T: Decodable>(path: String, token: String, as type: T.Type) async throws -> T {
        let serverURL = AuthService.shared.serverURL
        return try await request(method: "GET", path: path, body: nil as String?, serverURL: serverURL, token: token)
    }

    func post(path: String, token: String, body: [String: Any]) async throws {
        try await sendRawJSON(method: "POST", path: path, token: token, body: body)
    }

    func put(path: String, token: String, body: [String: Any]) async throws {
        try await sendRawJSON(method: "PUT", path: path, token: token, body: body)
    }

    private func sendRawJSON(method: String, path: String, token: String, body: [String: Any]) async throws {
        let serverURL = AuthService.shared.serverURL
        let encoded = try JSONSerialization.data(withJSONObject: body)
        guard let url = URL(string: serverURL + path) else { throw NetworkError.invalidURL }
        var req = URLRequest(url: url, timeoutInterval: 15)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if !token.isEmpty { req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }
        req.httpBody = encoded
        let (data, response) = try await URLSession.shared.data(for: req)
        if let http = response as? HTTPURLResponse, http.statusCode >= 300 {
            let msg = (try? decoder.decode(APIError.self, from: data))?.detail ?? "HTTP \(http.statusCode)"
            throw NetworkError.serverError(http.statusCode, msg)
        }
    }

    func getRaw(path: String, token: String) async throws -> Data {
        let serverURL = AuthService.shared.serverURL
        guard let url = URL(string: serverURL + path) else { throw NetworkError.invalidURL }
        var req = URLRequest(url: url, timeoutInterval: 30)
        req.httpMethod = "GET"
        if !token.isEmpty { req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") }
        let (data, response) = try await URLSession.shared.data(for: req)
        guard let http = response as? HTTPURLResponse, http.statusCode < 300 else {
            throw NetworkError.serverError(0, "Fehler beim Download")
        }
        return data
    }

    // MARK: - Core

    private func request<B: Encodable, T: Decodable>(
        method: String,
        path: String,
        body: B?,
        serverURL: String,
        token: String
    ) async throws -> T {
        guard let url = URL(string: serverURL + path) else {
            throw NetworkError.invalidURL
        }
        var req = URLRequest(url: url, timeoutInterval: 15)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if !token.isEmpty {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body {
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await URLSession.shared.data(for: req)
        } catch {
            throw NetworkError.connection(error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse else {
            throw NetworkError.connection("Keine HTTP-Antwort")
        }

        switch http.statusCode {
        case 200...299:
            do {
                return try decoder.decode(T.self, from: data)
            } catch {
                throw NetworkError.decoding(error.localizedDescription)
            }
        case 401:
            throw NetworkError.unauthorized
        case 400:
            let msg = (try? decoder.decode(APIError.self, from: data))?.detail ?? "Ungültige Anfrage"
            throw NetworkError.serverError(400, msg)
        default:
            let msg = (try? decoder.decode(APIError.self, from: data))?.detail ?? "HTTP \(http.statusCode)"
            throw NetworkError.serverError(http.statusCode, msg)
        }
    }
}

// MARK: - Error

enum NetworkError: LocalizedError {
    case invalidURL
    case connection(String)
    case unauthorized
    case serverError(Int, String)
    case decoding(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL:             return "Ungültige Server-URL."
        case .connection(let msg):    return "Verbindungsfehler: \(msg)"
        case .unauthorized:           return "Sitzung abgelaufen. Bitte neu anmelden."
        case .serverError(_, let m):  return m
        case .decoding(let msg):      return "Datenfehler: \(msg)"
        }
    }
}
