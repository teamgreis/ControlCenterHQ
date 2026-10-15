// © Felix Greis 2026 – All rights reserved.
import Foundation
import UserNotifications
import AVFoundation
import UIKit

/// Polls the server every 10 seconds for new alerts (severity >= info) and
/// mirrors them as local notifications. Critical alerts additionally trigger
/// a looping alarm sound until acknowledged or replaced by a lower severity.
@MainActor
final class AlertPollingService: NSObject, ObservableObject {
    static let shared = AlertPollingService()

    private var timer: Timer?
    private var serverURL: String = ""
    private var token: String = ""
    private var lastSeenAlertId: Int?
    private var isPolling = false

    func start(serverURL: String, token: String) {
        guard !serverURL.isEmpty, !token.isEmpty else { return }
        self.serverURL = serverURL
        self.token = token
        if isPolling { return }
        isPolling = true
        scheduleTimer()
    }

    func stop() {
        timer?.invalidate()
        timer = nil
        isPolling = false
        AlarmPlayer.shared.stop()
    }

    /// One-off fetch used by background task to keep notifications alive when the
    /// app is not in the foreground. Reads credentials directly from AuthService
    /// so it works even if start() was never called (e.g. app woken from background).
    func performBackgroundFetch(completion: @escaping (UIBackgroundFetchResult) -> Void) {
        Task { @MainActor in
            // Ensure we have credentials – pull from AuthService if the polling
            // service was never started (app woken cold from background).
            let auth = AuthService.shared
            if serverURL.isEmpty || token.isEmpty {
                serverURL = auth.serverURL
                token = auth.token
            }
            let result = await pollOnce()
            completion(result ? .newData : .noData)
        }
    }

    // MARK: - Private

    private func scheduleTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { [weak self] _ in
            guard let self else { return }
            Task { await self.pollOnce() }
        }
        RunLoop.main.add(timer!, forMode: .common)
    }

    /// Fetch latest alerts and emit local notification if there is a new one.
    @discardableResult
    private func pollOnce() async -> Bool {
        guard !serverURL.isEmpty, !token.isEmpty else { return false }
        guard let url = URL(string: "\(serverURL)/api/mobile/alerts?limit=1") else { return false }

        var req = URLRequest(url: url)
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        req.timeoutInterval = 8

        do {
            let (data, response) = try await URLSession.shared.data(for: req)
            guard let http = response as? HTTPURLResponse, http.statusCode == 200 else { return false }
            let resp = try JSONDecoder().decode(AlertsResponse.self, from: data)
            guard let latest = resp.alerts.first else { return false }

            // Only react to severity >= info (info, warning, critical)
            guard ["info", "warning", "critical"].contains(latest.severity) else { return false }

            if lastSeenAlertId != latest.id {
                lastSeenAlertId = latest.id
                notify(for: latest)
                return true
            }
        } catch {
            print("[AlertPolling] fetch failed: \(error.localizedDescription)")
        }
        return false
    }

    private func notify(for alert: AtlasAlert) {
        let content = UNMutableNotificationContent()
        let sev = alert.severity
        switch sev {
        case "critical":
            content.title = "🚨 Kritischer Alarm"
            content.sound = UNNotificationSound.criticalSoundNamed(UNNotificationSoundName(rawValue: "emergency_siren.caf"))
            AlarmPlayer.shared.playLoop(named: "emergency_siren")
        case "warning":
            content.title = "⚠️ Warnung"
            content.sound = .default
            AlarmPlayer.shared.stop()
        default:
            content.title = "ℹ️ Info"
            content.sound = .default
            AlarmPlayer.shared.stop()
        }
        content.body = alert.message

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.1, repeats: false)
        let request = UNNotificationRequest(identifier: "atlas-poll-\(alert.id)", content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }
}

// MARK: - Alarm audio player

final class AlarmPlayer: NSObject, AVAudioPlayerDelegate {
    static let shared = AlarmPlayer()

    private var player: AVAudioPlayer?

    func playLoop(named name: String) {
        guard let url = Bundle.main.url(forResource: name, withExtension: "caf") else { return }
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, options: [.duckOthers])
            try session.setActive(true)
            let audio = try AVAudioPlayer(contentsOf: url)
            audio.numberOfLoops = -1
            audio.prepareToPlay()
            audio.play()
            player = audio
        } catch {
            print("[AlarmPlayer] play failed: \(error.localizedDescription)")
        }
    }

    func stop() {
        player?.stop()
        player = nil
    }
}
