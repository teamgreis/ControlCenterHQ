// © Felix Greis 2026 – All rights reserved.
import Foundation
import UIKit
import UserNotifications
import FirebaseMessaging

class FCMService: NSObject, MessagingDelegate {
    static let shared = FCMService()

    private override init() { super.init() }

    func setup() {
        Messaging.messaging().delegate = self
    }

    // Called by Firebase SDK when a new FCM token is generated
    nonisolated func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let token = fcmToken else { return }
        print("[FCM] Token: \(token)")
        Task { @MainActor in
            let auth = AuthService.shared
            guard !auth.token.isEmpty, !auth.serverURL.isEmpty else { return }
            await FCMService.shared.sendRegister(token: token, serverURL: auth.serverURL, authToken: auth.token)
        }
    }

    func registerToken(_ token: String, serverURL: String, authToken: String) {
        Task {
            await sendRegister(token: token, serverURL: serverURL, authToken: authToken)
        }
    }

    private func sendRegister(token: String, serverURL: String, authToken: String) async {
        guard !token.isEmpty, !serverURL.isEmpty, !authToken.isEmpty else { return }
        do {
            guard let url = URL(string: "\(serverURL)/api/push/fcm/register") else { return }
            var req = URLRequest(url: url)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
            req.httpBody = try JSONEncoder().encode(["fcm_token": token])
            let (_, response) = try await URLSession.shared.data(for: req)
            if let http = response as? HTTPURLResponse {
                print("[FCM] Register response: \(http.statusCode)")
            }
        } catch {
            print("[FCM] Register error: \(error)")
        }
    }

    func unregisterToken(serverURL: String, authToken: String) {
        Messaging.messaging().token { token, _ in
            guard let token = token else { return }
            Task {
                guard let url = URL(string: "\(serverURL)/api/push/fcm/unregister") else { return }
                var req = URLRequest(url: url)
                req.httpMethod = "DELETE"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
                req.httpBody = try? JSONEncoder().encode(["fcm_token": token])
                _ = try? await URLSession.shared.data(for: req)
            }
        }
    }
}
