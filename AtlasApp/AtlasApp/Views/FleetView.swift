// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct FleetView: View {
    @EnvironmentObject var auth: AuthService

    @State private var vehicles: [Vehicle] = []
    @State private var activeTrips: [Trip] = []
    @State private var isLoading = true
    @State private var errorMsg = ""
    @State private var selectedVehicle: Vehicle? = nil
    @State private var filterStatus = "all"

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let cardBg  = Color(red: 0.08, green: 0.10, blue: 0.15)
    private let bg      = Color(red: 0.04, green: 0.055, blue: 0.10)

    private var filtered: [Vehicle] {
        switch filterStatus {
        case "available": return vehicles.filter { $0.status == "available" }
        case "on_trip":   return vehicles.filter { $0.status == "on_trip" }
        case "dispatch":  return vehicles.filter { $0.status == "dispatched" }
        default:          return vehicles
        }
    }

    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Lade…").foregroundColor(.white)
                } else if !errorMsg.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
                        Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
                        Button("Wiederholen") { Task { await load() } }.foregroundColor(accent)
                    }.padding()
                } else {
                    ScrollView {
                        VStack(spacing: 12) {
                            // Active trips summary
                            if !activeTrips.isEmpty {
                                activeTripsCard
                                    .padding(.horizontal, 12)
                            }

                            // Vehicle cards
                            if filtered.isEmpty {
                                VStack(spacing: 12) {
                                    Image(systemName: "car.2").font(.system(size: 40)).foregroundColor(Color(white: 0.3))
                                    Text("Keine Fahrzeuge").foregroundColor(Color(white: 0.5))
                                }.padding(.top, 40)
                            } else {
                                ForEach(filtered) { v in
                                    vehicleCard(v)
                                        .padding(.horizontal, 12)
                                        .onTapGesture { selectedVehicle = v }
                                }
                            }
                        }
                        .padding(.vertical, 12)
                    }
                }
            }
            .background(bg.ignoresSafeArea())
            .navigationTitle("Flotte")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Menu {
                        Button("Alle") { filterStatus = "all" }
                        Button("Verfügbar") { filterStatus = "available" }
                        Button("Im Einsatz") { filterStatus = "on_trip" }
                        Button("Disponiert") { filterStatus = "dispatch" }
                    } label: {
                        HStack(spacing: 4) {
                            Image(systemName: "line.3.horizontal.decrease.circle")
                            Text(filterLabel).font(.system(size: 13))
                        }
                        .foregroundColor(accent)
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Text("\(filtered.count)/\(vehicles.count)")
                        .font(.system(size: 12, design: .monospaced))
                        .foregroundColor(Color(white: 0.4))
                }
            }
            .refreshable { await load() }
        }
        .task { await load() }
        .sheet(item: $selectedVehicle) { v in
            VehicleDetailView(vehicle: v, activeTrip: activeTrips.first(where: { $0.vehicle_id == v.id }))
        }
        .onReceive(NotificationCenter.default.publisher(for: .atlasDashRefresh)) { _ in
            Task { await load() }
        }
    }

    private var filterLabel: String {
        switch filterStatus {
        case "available": return "Verfügbar"
        case "on_trip":   return "Im Einsatz"
        case "dispatch":  return "Disponiert"
        default:          return "Alle"
        }
    }

    // MARK: - Active Trips Card

    @ViewBuilder
    private var activeTripsCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Aktive Fahrten (\(activeTrips.count))", systemImage: "figure.walk.motion")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(white: 0.45))
            ForEach(activeTrips) { trip in
                HStack(spacing: 8) {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 7, height: 7)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(trip.title ?? "Fahrt #\(trip.id)")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                        if let driver = trip.driver_name {
                            Text(driver)
                                .font(.system(size: 11))
                                .foregroundColor(Color(white: 0.5))
                        }
                    }
                    Spacer()
                    if let dest = trip.destination {
                        Text(dest)
                            .font(.system(size: 11))
                            .foregroundColor(accent)
                    }
                }
            }
        }
        .padding(14)
        .background(cardBg)
        .cornerRadius(12)
    }

    // MARK: - Vehicle Card

    @ViewBuilder
    private func vehicleCard(_ v: Vehicle) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 10) {
                // Type icon
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(statusColor(v.status).opacity(0.15))
                        .frame(width: 40, height: 40)
                    Image(systemName: vehicleIcon(v.type))
                        .font(.system(size: 18))
                        .foregroundColor(statusColor(v.status))
                }

                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 6) {
                        Text(v.name)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                        statusBadge(v.status)
                    }
                    if let plate = v.license_plate {
                        Text(plate)
                            .font(.system(size: 11, design: .monospaced))
                            .foregroundColor(Color(white: 0.45))
                    }
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundColor(Color(white: 0.3))
                    .font(.system(size: 12))
            }

            // Fuel bar
            if let pct = v.fuelPercent {
                fuelBar(pct, current: v.fuel_current_l, capacity: v.fuel_capacity_l)
            }

            // Odometer
            if let odo = v.odometer_km {
                HStack {
                    Image(systemName: "gauge").font(.system(size: 11)).foregroundColor(Color(white: 0.35))
                    Text(String(format: "%.0f km", odo))
                        .font(.system(size: 11))
                        .foregroundColor(Color(white: 0.45))
                }
            }
        }
        .padding(14)
        .background(cardBg)
        .cornerRadius(12)
    }

    @ViewBuilder
    private func fuelBar(_ pct: Double, current: Double?, capacity: Double?) -> some View {
        let color: Color = pct < 20 ? .red : pct < 40 ? .orange : .green
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Image(systemName: "fuelpump").font(.system(size: 11)).foregroundColor(Color(white: 0.35))
                Text(String(format: "%.0f%%", pct))
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(color)
                Spacer()
                if let cur = current, let cap = capacity {
                    Text(String(format: "%.0f / %.0f L", cur, cap))
                        .font(.system(size: 11))
                        .foregroundColor(Color(white: 0.45))
                }
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 3)
                        .fill(Color(white: 0.15))
                        .frame(height: 5)
                    RoundedRectangle(cornerRadius: 3)
                        .fill(color)
                        .frame(width: geo.size.width * CGFloat(min(pct / 100, 1)), height: 5)
                }
            }
            .frame(height: 5)
        }
    }

    @ViewBuilder
    private func statusBadge(_ status: String) -> some View {
        let c = statusColor(status)
        Text(statusLabel(status))
            .font(.system(size: 9, weight: .bold))
            .foregroundColor(c)
            .padding(.horizontal, 5).padding(.vertical, 2)
            .background(c.opacity(0.15))
            .cornerRadius(4)
    }

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "available":  return .green
        case "on_trip":    return accent
        case "dispatched": return .orange
        case "maintenance": return .red
        default:           return Color(white: 0.5)
        }
    }

    private func statusLabel(_ status: String) -> String {
        switch status {
        case "available":   return "Verfügbar"
        case "on_trip":     return "Im Einsatz"
        case "dispatched":  return "Disponiert"
        case "maintenance": return "Wartung"
        default:            return status.capitalized
        }
    }

    private func vehicleIcon(_ type: String) -> String {
        switch type.lowercased() {
        case "ambulance", "rettungswagen": return "cross.case"
        case "fire", "feuerwehr":          return "flame"
        case "police", "polizei":          return "shield"
        case "truck", "lkw":               return "truck.box"
        default:                           return "car"
        }
    }

    // MARK: - Load

    private func load() async {
        isLoading = vehicles.isEmpty
        errorMsg = ""
        do {
            let resp: FleetResponse = try await NetworkService.shared.get(
                "/api/mobile/fleet", serverURL: auth.serverURL, token: auth.token
            )
            vehicles = resp.vehicles
            activeTrips = resp.active_trips
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}

// MARK: - Vehicle Detail Sheet

struct VehicleDetailView: View {
    let vehicle: Vehicle
    let activeTrip: Trip?
    @Environment(\.dismiss) var dismiss

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {

                    // Header card
                    VStack(alignment: .leading, spacing: 8) {
                        HStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(statusColor(vehicle.status).opacity(0.18))
                                    .frame(width: 50, height: 50)
                                Image(systemName: vehicleIcon(vehicle.type))
                                    .font(.system(size: 22))
                                    .foregroundColor(statusColor(vehicle.status))
                            }
                            VStack(alignment: .leading, spacing: 4) {
                                Text(vehicle.name)
                                    .font(.system(size: 20, weight: .black))
                                    .foregroundColor(.white)
                                statusBadgeLarge(vehicle.status)
                            }
                        }
                        if let plate = vehicle.license_plate {
                            Text(plate)
                                .font(.system(size: 14, design: .monospaced))
                                .foregroundColor(Color(white: 0.55))
                        }
                    }
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(cardBg)
                    .cornerRadius(12)

                    // Fuel & Odometer
                    if vehicle.fuel_current_l != nil || vehicle.odometer_km != nil {
                        detailCard("Betrieb", icon: "gauge") {
                            if let pct = vehicle.fuelPercent {
                                let fc: Color = pct < 20 ? .red : pct < 40 ? .orange : .green
                                HStack {
                                    Text("Kraftstoff").font(.system(size: 13)).foregroundColor(Color(white: 0.45))
                                    Spacer()
                                    Text(String(format: "%.0f%%", pct))
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(fc)
                                    if let cur = vehicle.fuel_current_l, let cap = vehicle.fuel_capacity_l {
                                        Text(String(format: "(%.0f/%.0f L)", cur, cap))
                                            .font(.system(size: 12))
                                            .foregroundColor(Color(white: 0.4))
                                    }
                                }
                            }
                            if let odo = vehicle.odometer_km {
                                infoRow("Kilometerstand", String(format: "%.0f km", odo))
                            }
                        }
                    }

                    // Active trip
                    if let trip = activeTrip {
                        detailCard("Aktive Fahrt", icon: "map") {
                            if let title = trip.title { infoRow("Bezeichnung", title) }
                            if let driver = trip.driver_name { infoRow("Fahrer", driver) }
                            if let origin = trip.origin { infoRow("Start", origin) }
                            if let dest = trip.destination { infoRow("Ziel", dest) }
                            if let dep = trip.departure_time { infoRow("Abfahrt", dep) }
                        }
                    }

                    // Location
                    if vehicle.lat != nil || vehicle.lng != nil {
                        detailCard("Position", icon: "mappin.circle") {
                            if let lat = vehicle.lat, let lng = vehicle.lng {
                                Text(String(format: "%.5f, %.5f", lat, lng))
                                    .font(.system(size: 13, design: .monospaced))
                                    .foregroundColor(Color(white: 0.7))
                            }
                        }
                    }

                    // Notes
                    if let notes = vehicle.notes, !notes.isEmpty {
                        detailCard("Notizen", icon: "note.text") {
                            Text(notes).font(.system(size: 13)).foregroundColor(Color(white: 0.7))
                        }
                    }
                }
                .padding(16)
            }
            .background(bg.ignoresSafeArea())
            .navigationTitle("Fahrzeugdetails")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fertig") { dismiss() }
                        .fontWeight(.semibold)
                        .foregroundColor(accent)
                }
            }
        }
    }

    @ViewBuilder
    private func detailCard<C: View>(_ title: String, icon: String, @ViewBuilder content: () -> C) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(title, systemImage: icon)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(white: 0.45))
            content()
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(cardBg)
        .cornerRadius(12)
    }

    @ViewBuilder
    private func infoRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).font(.system(size: 13)).foregroundColor(Color(white: 0.45))
            Spacer()
            Text(value).font(.system(size: 13)).foregroundColor(Color(white: 0.8))
        }
    }

    @ViewBuilder
    private func statusBadgeLarge(_ status: String) -> some View {
        let c = statusColor(status)
        Text(statusLabel(status))
            .font(.system(size: 12, weight: .bold))
            .foregroundColor(c)
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(c.opacity(0.15))
            .cornerRadius(6)
    }

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "available":   return .green
        case "on_trip":     return Color(red: 0, green: 0.9, blue: 1)
        case "dispatched":  return .orange
        case "maintenance": return .red
        default:            return Color(white: 0.5)
        }
    }

    private func statusLabel(_ status: String) -> String {
        switch status {
        case "available":   return "Verfügbar"
        case "on_trip":     return "Im Einsatz"
        case "dispatched":  return "Disponiert"
        case "maintenance": return "Wartung"
        default:            return status.capitalized
        }
    }

    private func vehicleIcon(_ type: String) -> String {
        switch type.lowercased() {
        case "ambulance", "rettungswagen": return "cross.case"
        case "fire", "feuerwehr":          return "flame"
        case "police", "polizei":          return "shield"
        case "truck", "lkw":               return "truck.box"
        default:                           return "car"
        }
    }
}
