import SwiftUI
import CoreLocation

struct InfraNode: Codable, Identifiable {
    let id: Int
    let type: String?
    let lat: Double?
    let lon: Double?
    let tags: [String: String]?

    // Computed
    var displayName: String {
        if let t = tags?["name"] { return t }
        if let e = tags?["emergency"] { return e.replacingOccurrences(of: "_", with: " ").capitalized }
        if let m = tags?["man_made"] { return m.replacingOccurrences(of: "_", with: " ").capitalized }
        if let a = tags?["amenity"] { return a.capitalized }
        return type?.replacingOccurrences(of: "_", with: " ").capitalized ?? "Infrastruktur"
    }
    var icon: String {
        let e = tags?["emergency"] ?? ""
        let a = tags?["amenity"] ?? ""
        if e == "fire_hydrant" { return "drop.fill" }
        if a == "fire_station" { return "flame.fill" }
        if e.contains("water") || e == "suction_point" { return "water.waves" }
        if tags?["fire_access"] != nil { return "door.left.hand.open" }
        return "location.fill"
    }
    var iconColor: Color {
        let e = tags?["emergency"] ?? ""
        let a = tags?["amenity"] ?? ""
        if e == "fire_hydrant" { return .blue }
        if a == "fire_station" { return .red }
        if e.contains("water") || e == "suction_point" { return .cyan }
        return .orange
    }
}

struct InfraResponse: Codable {
    let elements: [InfraNode]?
}

struct InfrastructureView: View {
    @EnvironmentObject var auth: AuthService
    @StateObject private var loc = SimpleLocation()
    @State private var nodes: [InfraNode] = []
    @State private var loading = false
    @State private var error: String?
    @State private var radius = 300

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                VStack(spacing: 0) {
                    // Radius picker
                    HStack {
                        Text("Radius:").foregroundColor(.gray).font(.system(size: 14))
                        Picker("Radius", selection: $radius) {
                            Text("100m").tag(100)
                            Text("300m").tag(300)
                            Text("500m").tag(500)
                            Text("1km").tag(1000)
                        }
                        .pickerStyle(.segmented)
                    }
                    .padding()

                    if loading {
                        Spacer()
                        ProgressView().tint(.white)
                        Spacer()
                    } else if let err = error {
                        Spacer()
                        VStack(spacing: 12) {
                            Image(systemName: "exclamationmark.triangle").font(.system(size: 44)).foregroundColor(.orange)
                            Text(err).foregroundColor(.gray).multilineTextAlignment(.center)
                        }.padding()
                        Spacer()
                    } else if nodes.isEmpty {
                        Spacer()
                        VStack(spacing: 12) {
                            Image(systemName: "map").font(.system(size: 44)).foregroundColor(.gray)
                            Text("Keine Infrastruktur gefunden").foregroundColor(.gray)
                            Text("Standort wird benötigt").font(.system(size: 13)).foregroundColor(.gray.opacity(0.6))
                        }
                        Spacer()
                    } else {
                        List(nodes) { node in
                            InfraNodeRow(node: node)
                        }
                        .listStyle(.plain)
                        .scrollContentBackground(.hidden)
                    }
                }
            }
            .navigationTitle("Infrastruktur")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { fetch() } label: {
                        Image(systemName: "arrow.clockwise").foregroundColor(.blue)
                    }
                }
            }
        }
        .onChange(of: radius) { _ in fetch() }
        .onAppear {
            loc.start { fetch() }
        }
    }

    func fetch() {
        guard let coord = loc.coordinate else {
            error = "Standort nicht verfügbar"
            return
        }
        loading = true; error = nil
        Task {
            let path = "/api/infrastructure?lat=\(coord.latitude)&lng=\(coord.longitude)&radius=\(radius)"
            let result = try? await NetworkService.shared.get(path: path, token: auth.token, as: InfraResponse.self)
            await MainActor.run {
                nodes = result?.elements ?? []
                loading = false
            }
        }
    }
}

struct InfraNodeRow: View {
    let node: InfraNode
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle().fill(node.iconColor.opacity(0.15)).frame(width: 36, height: 36)
                Image(systemName: node.icon).foregroundColor(node.iconColor).font(.system(size: 16))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(node.displayName)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                if let lat = node.lat, let lon = node.lon {
                    Text(String(format: "%.5f, %.5f", lat, lon))
                        .font(.system(size: 11))
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(.vertical, 4)
        .listRowBackground(Color(white: 0.06))
    }
}

// Minimal location helper
class SimpleLocation: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let mgr = CLLocationManager()
    var coordinate: CLLocationCoordinate2D?
    private var onFirst: (() -> Void)?

    override init() {
        super.init()
        mgr.delegate = self
        mgr.desiredAccuracy = kCLLocationAccuracyHundredMeters
    }

    func start(onFirst: @escaping () -> Void) {
        self.onFirst = onFirst
        mgr.requestWhenInUseAuthorization()
        mgr.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        coordinate = loc.coordinate
        mgr.stopUpdatingLocation()
        onFirst?(); onFirst = nil
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {}
}
