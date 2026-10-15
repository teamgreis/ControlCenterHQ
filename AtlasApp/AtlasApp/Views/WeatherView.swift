// © Felix Greis 2026 – All rights reserved.
import SwiftUI

// MARK: - Weather Models

struct WeatherResponse: Codable {
    let current: CurrentWeather?
    let current_units: WeatherUnits?
    let hourly: HourlyWeather?
    let daily: DailyWeather?
}

struct CurrentWeather: Codable {
    let temperature_2m: Double?
    let relative_humidity_2m: Double?
    let wind_speed_10m: Double?
    let weathercode: Int?
    let apparent_temperature: Double?
}

struct WeatherUnits: Codable {
    let temperature_2m: String?
    let wind_speed_10m: String?
}

struct HourlyWeather: Codable {
    let time: [String]?
    let temperature_2m: [Double]?
    let precipitation_probability: [Int]?
    let weathercode: [Int]?
}

struct DailyWeather: Codable {
    let time: [String]?
    let temperature_2m_max: [Double]?
    let temperature_2m_min: [Double]?
    let weathercode: [Int]?
    let precipitation_sum: [Double]?
}

// MARK: - WeatherView

struct WeatherView: View {
    @EnvironmentObject var auth: AuthService

    @State private var weather: WeatherResponse? = nil
    @State private var isLoading = true
    @State private var errorMsg = ""

    private let accent = Color(red: 0, green: 0.9, blue: 1)
    private let bg     = Color(red: 0.04, green: 0.055, blue: 0.10)
    private let cardBg = Color(red: 0.08, green: 0.10, blue: 0.15)

    var body: some View {
        NavigationView {
            ScrollView {
                if isLoading {
                    ProgressView("Lade Wetter…").foregroundColor(.white).padding(.top, 60)
                } else if !errorMsg.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "cloud.slash").font(.system(size: 40)).foregroundColor(.orange)
                        Text(errorMsg).foregroundColor(Color(white: 0.6)).multilineTextAlignment(.center)
                        Button("Wiederholen") { Task { await load() } }.foregroundColor(accent)
                    }.padding(.top, 60)
                } else if let w = weather {
                    VStack(spacing: 16) {
                        currentCard(w)
                        if let daily = w.daily { dailyCard(daily) }
                        if let hourly = w.hourly { hourlyCard(hourly) }
                    }
                    .padding(16)
                }
            }
            .background(bg.ignoresSafeArea())
            .navigationTitle("Wetter")
            .navigationBarTitleDisplayMode(.large)
            .refreshable { await load() }
        }
        .task { await load() }
    }

    // MARK: - Current

    @ViewBuilder
    private func currentCard(_ w: WeatherResponse) -> some View {
        let cur = w.current
        let code = cur?.weathercode ?? 0
        VStack(spacing: 20) {
            HStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(weatherEmoji(code))
                        .font(.system(size: 64))
                    Text(weatherDesc(code))
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(white: 0.7))
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    if let temp = cur?.temperature_2m {
                        Text(String(format: "%.0f°", temp))
                            .font(.system(size: 56, weight: .black))
                            .foregroundColor(.white)
                    }
                    if let feel = cur?.apparent_temperature {
                        Text("Gefühlt \(String(format: "%.0f°", feel))")
                            .font(.system(size: 13))
                            .foregroundColor(Color(white: 0.5))
                    }
                }
            }

            HStack(spacing: 0) {
                if let hum = cur?.relative_humidity_2m {
                    statPill("humidity", value: "\(Int(hum))%", label: "Luftf.")
                }
                if let wind = cur?.wind_speed_10m {
                    statPill("wind", value: "\(Int(wind)) km/h", label: "Wind")
                }
                statPill("thermometer", value: weatherDesc(code), label: "Lage")
            }
        }
        .padding(20)
        .background(weatherGradient(code))
        .cornerRadius(18)
    }

    @ViewBuilder
    private func statPill(_ icon: String, value: String, label: String) -> some View {
        VStack(spacing: 4) {
            Image(systemName: sfIcon(icon)).font(.system(size: 16)).foregroundColor(Color(white: 0.7))
            Text(value).font(.system(size: 14, weight: .bold)).foregroundColor(.white)
            Text(label).font(.system(size: 10)).foregroundColor(Color(white: 0.5))
        }
        .frame(maxWidth: .infinity)
    }

    private func sfIcon(_ name: String) -> String {
        switch name {
        case "humidity": return "humidity"
        case "wind":     return "wind"
        default:         return "thermometer.medium"
        }
    }

    // MARK: - Daily

    @ViewBuilder
    private func dailyCard(_ d: DailyWeather) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("7-Tage-Vorschau", systemImage: "calendar")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(white: 0.45))

            ForEach(0..<min(7, d.time?.count ?? 0), id: \.self) { i in
                let day = d.time?[i] ?? ""
                let tMax = d.temperature_2m_max?[i] ?? 0
                let tMin = d.temperature_2m_min?[i] ?? 0
                let code = d.weathercode?[i] ?? 0
                let prec = d.precipitation_sum?[i] ?? 0

                HStack {
                    Text(dayLabel(day))
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.white)
                        .frame(width: 44, alignment: .leading)

                    Text(weatherEmoji(code))
                        .font(.system(size: 18))

                    if prec > 0 {
                        Text(String(format: "%.1f mm", prec))
                            .font(.system(size: 11))
                            .foregroundColor(.blue)
                    }

                    Spacer()

                    Text(String(format: "%.0f°", tMin))
                        .font(.system(size: 14))
                        .foregroundColor(Color(white: 0.45))

                    // Temp bar
                    let range = 40.0
                    let lo = (tMin + 20) / range
                    let hi = (tMax + 20) / range
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Capsule().fill(Color(white: 0.12)).frame(height: 5)
                            Capsule()
                                .fill(tempGradient(min: tMin, max: tMax))
                                .frame(
                                    width: max(8, geo.size.width * CGFloat(hi - lo)),
                                    height: 5
                                )
                                .offset(x: geo.size.width * CGFloat(lo))
                        }
                    }
                    .frame(width: 60, height: 5)

                    Text(String(format: "%.0f°", tMax))
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                }
                if i < min(6, (d.time?.count ?? 0) - 1) {
                    Divider().background(Color(white: 0.1))
                }
            }
        }
        .padding(16)
        .background(cardBg)
        .cornerRadius(16)
    }

    // MARK: - Hourly

    @ViewBuilder
    private func hourlyCard(_ h: HourlyWeather) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Stundenweise (nächste 24h)", systemImage: "clock")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(white: 0.45))

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    let now = Calendar.current.component(.hour, from: Date())
                    ForEach(now..<min(now + 24, h.time?.count ?? 0), id: \.self) { i in
                        let temp = h.temperature_2m?[i] ?? 0
                        let code = h.weathercode?[i] ?? 0
                        let prec = h.precipitation_probability?[i] ?? 0
                        let hour = h.time?[i].suffix(5) ?? "00:00"

                        VStack(spacing: 6) {
                            Text(i == now ? "Jetzt" : String(hour.prefix(5)))
                                .font(.system(size: 11))
                                .foregroundColor(i == now ? accent : Color(white: 0.4))

                            Text(weatherEmoji(code))
                                .font(.system(size: 20))

                            Text(String(format: "%.0f°", temp))
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.white)

                            if prec > 0 {
                                Text("\(prec)%")
                                    .font(.system(size: 10))
                                    .foregroundColor(.blue)
                            } else {
                                Text("  ").font(.system(size: 10))
                            }
                        }
                        .frame(width: 44)
                    }
                }
                .padding(.horizontal, 4)
            }
        }
        .padding(16)
        .background(cardBg)
        .cornerRadius(16)
    }

    // MARK: - Helpers

    private func weatherEmoji(_ code: Int) -> String {
        switch code {
        case 0:           return "☀️"
        case 1:           return "🌤️"
        case 2:           return "⛅️"
        case 3:           return "☁️"
        case 45, 48:      return "🌫️"
        case 51...55:     return "🌦️"
        case 61...65:     return "🌧️"
        case 71...75:     return "🌨️"
        case 80...82:     return "🌦️"
        case 95:          return "⛈️"
        case 96, 99:      return "⛈️"
        default:          return "🌡️"
        }
    }

    private func weatherDesc(_ code: Int) -> String {
        switch code {
        case 0:           return "Klar"
        case 1:           return "Überwiegend klar"
        case 2:           return "Teilweise bewölkt"
        case 3:           return "Bedeckt"
        case 45, 48:      return "Neblig"
        case 51...55:     return "Nieselregen"
        case 61...65:     return "Regen"
        case 71...75:     return "Schnee"
        case 80...82:     return "Regenschauer"
        case 95:          return "Gewitter"
        default:          return "Wechselhaft"
        }
    }

    private func weatherGradient(_ code: Int) -> LinearGradient {
        let colors: [Color]
        switch code {
        case 0, 1:    colors = [Color(red:0.1,green:0.35,blue:0.8), Color(red:0.2,green:0.55,blue:0.9)]
        case 2, 3:    colors = [Color(red:0.2,green:0.25,blue:0.35), Color(red:0.15,green:0.18,blue:0.28)]
        case 61...82: colors = [Color(red:0.05,green:0.15,blue:0.4), Color(red:0.05,green:0.18,blue:0.35)]
        case 95, 96, 99: colors = [Color(red:0.1,green:0.05,blue:0.2), Color(red:0.15,green:0.08,blue:0.25)]
        default:      colors = [Color(red:0.08,green:0.12,blue:0.22), Color(red:0.06,green:0.09,blue:0.18)]
        }
        return LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }

    private func tempGradient(min: Double, max: Double) -> LinearGradient {
        let avgTemp = (min + max) / 2
        let c: Color = avgTemp < 0 ? .blue : avgTemp < 10 ? .cyan : avgTemp < 20 ? .green : avgTemp < 28 ? .orange : .red
        return LinearGradient(colors: [c.opacity(0.7), c], startPoint: .leading, endPoint: .trailing)
    }

    private func dayLabel(_ iso: String) -> String {
        let fmt = DateFormatter(); fmt.dateFormat = "yyyy-MM-dd"
        guard let d = fmt.date(from: iso) else { return iso }
        if Calendar.current.isDateInToday(d) { return "Heute" }
        if Calendar.current.isDateInTomorrow(d) { return "Morgen" }
        let out = DateFormatter(); out.dateFormat = "EEE"; out.locale = Locale(identifier: "de_DE")
        return out.string(from: d)
    }

    // MARK: - Load

    private func load() async {
        isLoading = weather == nil
        errorMsg = ""
        do {
            weather = try await NetworkService.shared.get(
                "/api/weather", serverURL: auth.serverURL, token: auth.token
            )
        } catch NetworkError.unauthorized { auth.logout() }
        catch { errorMsg = error.localizedDescription }
        isLoading = false
    }
}
