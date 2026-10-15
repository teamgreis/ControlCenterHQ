// © Felix Greis 2026 – All rights reserved.
import Foundation

// MARK: - Auth
struct LoginRequest: Codable {
    let username: String
    let password: String
}

/// Server returns: { "token": "...", "user": { "id": 1, "username": "...", ... } }
struct LoginResponse: Codable {
    let token: String
    let user: AtlasUser
}

struct AtlasUser: Codable, Identifiable {
    let id: Int
    let username: String
    let full_name: String
    let role: String
    let email: String?
    let phone: String?
    let language: String?
    let theme: String?
    let alert_tone: String?
    var displayName: String { full_name.isEmpty ? username : full_name }
    var isAdmin: Bool { role == "admin" }
}

// MARK: - Dashboard
struct DashboardResponse: Codable {
    let user: AtlasUser
    let kpis: KPIs
    let recent_alerts: [AtlasAlert]
    let recent_incidents: [Incident]
    let fleet: [Vehicle]
    let server: ServerInfo
}

struct ServerInfo: Codable {
    let org_name: String
    let version: String
}

struct KPIs: Codable {
    let active_assets: Int
    let open_incidents: Int
    let active_alerts: Int
    let critical_alerts: Int
    let fleet_available: Int
    let fleet_on_trip: Int
    let online_users: Int
}

// MARK: - Alert
struct AtlasAlert: Codable, Identifiable {
    let id: Int
    let type: String?
    let message: String
    let severity: String
    let source: String?
    let acknowledged: Int
    let acknowledged_by: Int?
    let acknowledged_at: String?
    let created_at: String
    let alarm_group: String?

    var isAcknowledged: Bool { acknowledged == 1 }
    var severityLevel: SeverityLevel { SeverityLevel(rawValue: severity) ?? .info }
}

enum SeverityLevel: String, CaseIterable {
    case info, warning, critical

    var displayName: String {
        switch self {
        case .info:     return "Info"
        case .warning:  return "Warnung"
        case .critical: return "Kritisch"
        }
    }
    var emoji: String {
        switch self {
        case .info:     return "ℹ️"
        case .warning:  return "⚠️"
        case .critical: return "🚨"
        }
    }
}

struct AlertsResponse: Codable {
    let alerts: [AtlasAlert]
    let total: Int
    let limit: Int
    let offset: Int
}

// MARK: - Incident
struct Incident: Codable, Identifiable {
    let id: Int
    let title: String
    let description: String?
    let severity: String
    let status: String
    let lat: Double?
    let lng: Double?
    let assigned_to: Int?
    let created_by: Int?
    let created_at: String
    let updated_at: String?
    let resolved_at: String?

    var isOpen: Bool { status == "open" || status == "in_progress" }
    var severityLevel: SeverityLevel { SeverityLevel(rawValue: severity) ?? .info }
}

struct IncidentsResponse: Codable {
    let incidents: [Incident]
    let total: Int
}

struct CreateIncidentRequest: Codable {
    let title: String
    let severity: String
    let description: String
    let lat: Double?
    let lng: Double?
}

// MARK: - Fleet
struct Vehicle: Codable, Identifiable {
    let id: Int
    let name: String
    let type: String
    let subtype: String?
    let license_plate: String?
    let status: String
    let lat: Double?
    let lng: Double?
    let fuel_current_l: Double?
    let fuel_capacity_l: Double?
    let odometer_km: Double?
    let assigned_driver: Int?
    let dispatch_incident_id: Int?
    let notes: String?

    var fuelPercent: Double? {
        guard let cur = fuel_current_l, let cap = fuel_capacity_l, cap > 0 else { return nil }
        return (cur / cap) * 100
    }
}

struct Trip: Codable, Identifiable {
    let id: Int
    let vehicle_id: Int
    let title: String?
    let origin: String?
    let destination: String?
    let status: String
    let departure_time: String?
    let driver_name: String?
}

struct FleetResponse: Codable {
    let vehicles: [Vehicle]
    let active_trips: [Trip]
}

// MARK: - Chat
struct ChatRoom: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String?
    let type: String
}

struct ChatMessage: Codable, Identifiable {
    let id: Int
    let content: String
    let timestamp: String
    let username: String
    let full_name: String
    var displayName: String { full_name.isEmpty ? username : full_name }
}

// MARK: - WebSocket events
struct WSMessage: Codable {
    let type: String
    let title: String?
    let message: String?
    let severity: String?
    let sound_name: String?
    let alert_id: Int?
    let by: String?
    let vehicle_id: Int?
    let vehicle_name: String?
    let incident_id: Int?
    let incident_title: String?
    let dispatched_by: String?
    let room_id: Int?
    let content: String?
    let username: String?
    let full_name: String?
    let id: Int?
}

// MARK: - Dispatch
struct DispatchEvent: Identifiable {
    let id = UUID()
    let vehicleId: Int
    let vehicleName: String
    let incidentTitle: String
    let dispatchedBy: String
}

// MARK: - QR Onboarding
struct QRPayload {
    let serverURL: String
    let token: String?

    init?(string: String) {
        if string.hasPrefix("atlas://connect") {
            guard let comps = URLComponents(string: string.replacingOccurrences(of: "atlas://connect", with: "https://x")),
                  let urlItem = comps.queryItems?.first(where: { $0.name == "url" }),
                  let urlStr = urlItem.value, !urlStr.isEmpty else { return nil }
            serverURL = urlStr
            token = comps.queryItems?.first(where: { $0.name == "token" })?.value
        } else if string.hasPrefix("http") {
            serverURL = string
            token = nil
        } else {
            return nil
        }
    }
}

// MARK: - API utilities
struct APIError: Codable {
    let detail: String
}

struct SimpleOK: Codable {
    let ok: Bool
}

struct InfoResponse: Codable {
    let app_name: String?
    let org_name: String?
    let version: String?
}

struct SetupStatus: Codable {
    let setup_required: Bool
}

// MARK: - Sensor
struct AtlasSensor: Codable, Identifiable {
    let id: Int
    let name: String
    let type: String
    let location: String?
    let status: String
    let unit: String?
    let current_value: Double?
    let min_val: Double?
    let max_val: Double?
    let last_seen: String?
    let created_at: String
}

// MARK: - Scheduled Task
struct ScheduledTask: Codable, Identifiable {
    let id: Int
    let name: String
    let action: String
    let cron: String?
    let enabled: Int
    let last_run: String?
    let next_run: String?
    let status: String?
}

struct ScheduledResponse: Codable {
    let items: [ScheduledTask]
}

// MARK: - Alarm Group
struct AlarmGroup: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String?
    let color: String?
    let alert_count: Int?
    let member_count: Int?
}

// MARK: - Fleet Driver
struct FleetDriver: Codable, Identifiable {
    let id: Int
    let name: String
    let license_class: String?
    let phone: String?
    let status: String?
}

// MARK: - Fleet Maintenance
struct MaintenanceRecord: Codable, Identifiable {
    let id: Int
    let vehicle_id: Int
    let type: String
    let description: String?
    let scheduled_at: String?
    let completed_at: String?
    let status: String
    let cost: Double?
    let vehicle_name: String?
}

// MARK: - Contact
struct Contact: Codable, Identifiable {
    let id: Int
    let name: String
    let role: String?
    let phone: String?
    let email: String?
    let organization: String?
    let notes: String?
}

// MARK: - Push status
struct PushStatusResponse: Codable {
    let user_subscriptions: Int?
    let total_subscriptions: Int?
    let pywebpush_available: Bool?
    let apns_device_count: Int?
}
