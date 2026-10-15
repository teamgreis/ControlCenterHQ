// © Felix Greis 2026 – All rights reserved.
import Foundation
import UserNotifications
import UIKit

class PushService: NSObject, UNUserNotificationCenterDelegate {
    static let shared = PushService()

    override init() {
        super.init()
        UNUserNotificationCenter.current().delegate = self
    }

    func requestPermission() {
        // Request critical alert permission alongside the standard options.
        // Critical alerts play a sound and bypass Do Not Disturb / silent mode.
        UNUserNotificationCenter.current().requestAuthorization(
            options: [.alert, .badge, .sound, .criticalAlert]
        ) { granted, _ in
            if granted {
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }

    func registerDeviceToken(_ deviceToken: Data, serverURL: String, authToken: String) {
        let tokenString = deviceToken.map { String(format: "%02x", $0) }.joined()
        Task {
            do {
                guard let url = URL(string: "\(serverURL)/api/push/apns/register") else { return }
                var req = URLRequest(url: url)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
                req.httpBody = try JSONEncoder().encode([
                    "device_token": tokenString,
                    "bundle_id": "de.atlasadmin.app"
                ])
                _ = try await URLSession.shared.data(for: req)
            } catch {
                print("APNs register error: \(error)")
            }
        }
    }

    func unregisterDeviceToken(_ deviceToken: String, serverURL: String, authToken: String) {
        Task {
            do {
                guard let url = URL(string: "\(serverURL)/api/push/apns/unregister") else { return }
                var req = URLRequest(url: url)
                req.httpMethod = "DELETE"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
                req.httpBody = try JSONEncoder().encode(["device_token": deviceToken])
                _ = try await URLSession.shared.data(for: req)
            } catch {
                print("APNs unregister error: \(error)")
            }
        }
    }

    // MARK: - Local notification for foreground critical alerts

    /// Show a local critical notification when a push arrives in the foreground.
    /// Respects the server-defined sound name; falls back to the system default critical sound.
    func showCriticalLocalNotification(title: String, body: String, soundName: String?) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = criticalSound(for: soundName)
        if #available(iOS 15.0, *) {
            content.interruptionLevel = .critical  // overrides Focus/DND
        }

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.1, repeats: false)
        let id = "atlas-critical-\(UUID().uuidString)"
        let request = UNNotificationRequest(identifier: id, content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }

    // MARK: - UNUserNotificationCenterDelegate

    /// Called when a notification arrives while the app is in the foreground.
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                  willPresent notification: UNNotification,
                                  withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        let userInfo = notification.request.content.userInfo
        let severity = userInfo["severity"] as? String ?? ""
        let notifType = userInfo["type"] as? String ?? ""
        let isCritical = (severity == "critical") || (notifType == "emergency_broadcast")
        let isDispatch = (notifType == "dispatch_request")

        if isCritical || isDispatch {
            // Re-fire as a local critical notification so the custom sound plays
            // even if the system would otherwise suppress the APNs sound.
            let soundName: String = isDispatch ? "dispatch_tone"
                                  : (userInfo["sound_name"] as? String ?? "emergency_siren")
            let title = notification.request.content.title
            let body  = notification.request.content.body
            showCriticalLocalNotification(title: title, body: body, soundName: soundName)
            completionHandler([.banner, .badge])  // suppress original to avoid double-play
        } else {
            completionHandler([.banner, .sound, .badge])
        }
    }

    // MARK: - Helpers

    private func criticalSound(for serverSoundName: String?) -> UNNotificationSound {
        let name = (serverSoundName?.isEmpty == false) ? serverSoundName! : "emergency_siren"
        return UNNotificationSound.criticalSoundNamed(
            UNNotificationSoundName(rawValue: "\(name).caf")
        )
    }
}
