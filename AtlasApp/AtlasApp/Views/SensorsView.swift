// © Felix Greis 2026 – All rights reserved.
import SwiftUI

struct SensorsView: View {
    @EnvironmentObject var auth: AuthService

    @State private var sensors: [AtlasSensor] = []
    @State private var isLoading = true
    @State private var errorMsg = ""

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)

    var body: some View {
        Group {
            if isLoading {
                ProgressView("Lade Sensoren…").foregroundColor(.white)
            } else if !errorMsg.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "wifi.slash").font(.system(size: 40)).foregroundColor(.orange)
                    Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
                    Button("Wiederholen") { Task { await load() } }.foregroundColor(accent)
                }.padding(32)
            } else if sensors.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "sensor.tag.radiowaves.forward")
                        .font(.system(size: 40)).foregroundColor(Color(white: 0.3))
                    Text("Keine Sensoren konfiguriert")
                        .foregroundColor(Color(white: 0.5))
                }
            } else {
                ScrollView {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        ForEach(sensors) { sensor in
                            sensorCard(sensor)
                        }
                    }
                    .padding(16)
                }
            }
        }
        .background(bg.ignoresSafeArea())
        .navigationTitle("Sensoren")
        .navigationBarTitleDisplayMode(.large)
        .refreshable { await load() }
        .task { await load() }
    }

    @ViewBuilder
    private func sensorCard(_ s: AtlasSensor) -> some View {
        let statusColor: Color = s.status == "online" ? .green : s.status == "warning" ? .orange : .red

        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: sensorIcon(s.type))
                    .font(.system(size: 16))
                    .foregroundColor(statusColor)
                Spacer()
                Circle().fill(statusColor).frame(width: 7, height: 7)
            }

            if let val = s.current_value {
                HStack(alignment: .lastTextBaseline, spacing: 3) {
                    Text(String(format: val.truncatingRemainder(dividingBy: 1) == 0 ? "%.0f" : "%.1f", val))
                        .font(.system(size: 26, weight: .black))
                        .foregroundColor(.white)
                    if let unit = s.unit {
                        Text(unit)
                            .font(.system(size: 13))
                            .foregroundColor(Color(white: 0.45))
                    }
                }
            } else {
                Text("—")
                    .font(.system(size: 26, weight: .black))
                    .foregroundColor(Color(white: 0.3))
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(s.name)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(white: 0.8))
                    .lineLimit(1)
                if let loc = s.location {
                    Text(loc)
                        .font(.system(size: 10))
                        .foregroundColor(Color(white: 0.38))
                        .lineLimit(1)
                }
            }

            // Min/Max bar
            if let cur = s.current_value, let mn = s.min_val, let mx = s.max_val, mx > mn {
                let pct = min(1, max(0, (cur - mn) / (mx - mn)))
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule().fill(Color(white: 0.12)).frame(height: 4)
                        Capsule()
                            .fill(statusColor)
                            .frame(width: max(6, geo.size.width * CGFloat(pct)), height: 4)
                    }
                }
                .frame(height: 4)
            }
        }
        .padding(14)
        .background(cardBg)
        .cornerRadius(14)
    }

    private func sensorIcon(_ type: String) -> String {
        switch type.lowercased() {
        case "temperature", "pi_temp": return "thermometer.medium"
        case "humidity":               return "humidity"
        case "pi_voltage", "voltage":  return "bolt.fill"
        case "co2":                    return "smoke.fill"
        case "motion":                 return "figure.walk.motion"
        case "door":                   return "door.left.hand.closed"
        default:                       return "sensor.tag.radiowaves.forward"
        }
    }

    private func load() async {
        isLoading = sensors.isEmpty
        errorMsg = ""
        do {
            sensors = try await NetworkService.shared.get(
                "/api/sensors", serverURL: auth.serverURL, token: auth.token
            )
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}
