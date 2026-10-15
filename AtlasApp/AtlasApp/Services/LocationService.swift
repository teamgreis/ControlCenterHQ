// © Felix Greis 2026 – All rights reserved.
import Foundation
import CoreLocation

/// Continuously tracks the device's GPS position and reports it to the Atlas server.
/// Starts automatically when a valid session exists; stops on logout.
@MainActor
class LocationService: NSObject, CLLocationManagerDelegate, ObservableObject {
    static let shared = LocationService()

    @Published var lastLocation: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus = .notDetermined

    private let locationManager = CLLocationManager()
    private var uploadTask: Task<Void, Never>?
    private var serverURL: String = ""
    private var authToken: String = ""
    // Upload at most every 10 seconds to avoid flooding the server
    private let uploadInterval: TimeInterval = 10
    private var lastUpload: Date = .distantPast

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 10          // notify every 10 m movement
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.pausesLocationUpdatesAutomatically = false
    }

    // MARK: - Public API

    /// Returns the last known coordinate, or nil if no fix yet.
    var currentCoordinate: (lat: Double, lng: Double)? {
        guard let loc = lastLocation else { return nil }
        return (loc.coordinate.latitude, loc.coordinate.longitude)
    }

    /// Force-upload the current location immediately (e.g. during SOS).
    func uploadNow() {
        guard let loc = lastLocation else { return }
        let lat = loc.coordinate.latitude
        let lng = loc.coordinate.longitude
        Task {
            await uploadLocation(lat: lat, lng: lng,
                                 accuracy: loc.horizontalAccuracy,
                                 speed: loc.speed >= 0 ? loc.speed : nil,
                                 heading: loc.course >= 0 ? loc.course : nil)
        }
    }

    func start(serverURL: String, token: String) {
        self.serverURL = serverURL
        self.authToken = token
        let status = locationManager.authorizationStatus
        if status == .authorizedAlways || status == .authorizedWhenInUse {
            locationManager.startUpdatingLocation()
        }
        // If permission not yet granted, the delegate will start updates once granted
    }

    func stop() {
        locationManager.stopUpdatingLocation()
        uploadTask?.cancel()
        uploadTask = nil
    }

    // MARK: - CLLocationManagerDelegate

    nonisolated func locationManager(_ manager: CLLocationManager,
                                     didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        Task { @MainActor in
            self.lastLocation = loc
            self.maybeUpload(loc)
        }
    }

    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        Task { @MainActor in
            let status = manager.authorizationStatus
            self.authorizationStatus = status
            if (status == .authorizedAlways || status == .authorizedWhenInUse),
               !self.serverURL.isEmpty {
                manager.startUpdatingLocation()
            }
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager,
                                     didFailWithError error: Error) {
        // Ignore transient errors; location manager retries automatically
        print("[LocationService] error: \(error.localizedDescription)")
    }

    // MARK: - Server upload

    private func maybeUpload(_ location: CLLocation) {
        let now = Date()
        guard now.timeIntervalSince(lastUpload) >= uploadInterval,
              !serverURL.isEmpty, !authToken.isEmpty else { return }
        lastUpload = now

        let lat = location.coordinate.latitude
        let lng = location.coordinate.longitude
        let accuracy = location.horizontalAccuracy
        let speed = location.speed >= 0 ? location.speed : nil        // m/s, nil if invalid
        let heading = location.course >= 0 ? location.course : nil    // degrees, nil if invalid

        uploadTask?.cancel()
        uploadTask = Task {
            await uploadLocation(lat: lat, lng: lng,
                                 accuracy: accuracy,
                                 speed: speed, heading: heading)
        }
    }

    private func uploadLocation(lat: Double, lng: Double,
                                accuracy: Double,
                                speed: Double?, heading: Double?) async {
        guard let url = URL(string: "\(serverURL)/api/device/location") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        req.timeoutInterval = 8

        var payload: [String: Any] = ["lat": lat, "lng": lng, "accuracy": accuracy]
        if let s = speed   { payload["speed_ms"]  = s }
        if let h = heading { payload["heading"]   = h }

        guard let body = try? JSONSerialization.data(withJSONObject: payload) else { return }
        req.httpBody = body

        do {
            let (_, response) = try await URLSession.shared.data(for: req)
            if let http = response as? HTTPURLResponse, http.statusCode != 200 {
                print("[LocationService] upload HTTP \(http.statusCode)")
            }
        } catch {
            print("[LocationService] upload failed: \(error.localizedDescription)")
        }
    }
}
