// © Felix Greis 2026 – All rights reserved.
import Foundation
import UserNotifications
import CoreLocation
import AVFoundation
import UIKit
import BackgroundTasks

/// Requests all required system permissions in a sensible sequence.
/// Call `requestAll()` once after server setup / first launch.
class PermissionService: NSObject, CLLocationManagerDelegate {
    static let shared = PermissionService()

    private let locationManager = CLLocationManager()
    // Accessed only from main thread (via DispatchQueue.main)
    private var locationContinuation: CheckedContinuation<Void, Never>?

    override init() {
        super.init()
        locationManager.delegate = self
    }

    // MARK: - Public

    /// Requests all required permissions in sequence:
    /// push + critical alerts → microphone → location always → background refresh.
    /// Safe to call multiple times.
    func requestAll() {
        Task { @MainActor in
            await requestPushPermissions()
            await requestMicrophonePermission()
            await requestLocationAlways()
            requestBackgroundRefresh()
        }
    }

    // MARK: - Push / Critical Alerts

    @MainActor
    private func requestPushPermissions() async {
        await withCheckedContinuation { continuation in
            UNUserNotificationCenter.current().requestAuthorization(
                options: [.alert, .badge, .sound, .criticalAlert]
            ) { _, _ in
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                    continuation.resume()
                }
            }
        }
    }

    // MARK: - Microphone

    @MainActor
    private func requestMicrophonePermission() async {
        await withCheckedContinuation { continuation in
            if #available(iOS 17.0, *) {
                AVAudioApplication.requestRecordPermission { _ in
                    continuation.resume()
                }
            } else {
                AVAudioSession.sharedInstance().requestRecordPermission { _ in
                    continuation.resume()
                }
            }
        }
    }

    // MARK: - Location (Always + Background)

    @MainActor
    private func requestLocationAlways() async {
        let status = locationManager.authorizationStatus

        switch status {
        case .notDetermined:
            // iOS requires WhenInUse before Always can be requested.
            await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
                locationContinuation = continuation
                locationManager.requestWhenInUseAuthorization()
            }
        case .authorizedWhenInUse:
            // Already have WhenInUse → upgrade to Always
            await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
                locationContinuation = continuation
                locationManager.requestAlwaysAuthorization()
            }
        case .authorizedAlways:
            break
        default:
            break  // Denied / restricted – nothing we can do
        }
    }

    // MARK: - CLLocationManagerDelegate
    // Called on main thread by CLLocationManager (iOS 16+)

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus
        if status == .authorizedWhenInUse {
            // Got WhenInUse → upgrade to Always
            manager.requestAlwaysAuthorization()
        } else {
            // Always, Denied, or Restricted → unblock continuation
            locationContinuation?.resume()
            locationContinuation = nil
        }
    }

    // MARK: - Background App Refresh

    private func requestBackgroundRefresh() {
        // No runtime dialog – user controls this in Settings → Background App Refresh.
        // Schedule the first background refresh task now so iOS starts the cycle.
        AppDelegate.scheduleBackgroundRefresh()
    }
}
