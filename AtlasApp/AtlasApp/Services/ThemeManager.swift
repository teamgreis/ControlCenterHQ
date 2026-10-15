// © Felix Greis 2026 – All rights reserved.
import SwiftUI
import Combine
import UIKit

// MARK: - Theme Definition

struct AppTheme: Identifiable, Equatable {
    let id: String
    let name: String
    let emoji: String
    let bgPrimary: Color
    let bgSecondary: Color
    let bgCard: Color
    let textPrimary: Color
    let textSecondary: Color
    let textMuted: Color
    let accent: Color
    let accentDim: Color
    let danger: Color
    let warning: Color
    let success: Color
    let border: Color
    let cornerRadius: CGFloat
    let usesBlur: Bool
    let isDark: Bool

    // Convenience gradient background
    var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [bgPrimary, bgSecondary],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

// MARK: - Theme Catalogue

extension AppTheme {
    static let all: [AppTheme] = [
        .liquidGlass,
        .liquidGlass2,
        .cyberpunk,
        .glassmorphism,
        .appleTheme,
        .corporate,
        .military,
        .liquidGold,
        .arcticWhite,
        .sunset,
        .matrix,
        .royalPurple,
        .fireRed,
        .fruehling,
        .sommer,
        .herbst,
        .winter,
        .citrus,
    ]

    static let `default` = AppTheme.liquidGlass

    // ── Liquid Glass (default) ───────────────────────────────
    static let liquidGlass = AppTheme(
        id: "liquid-glass", name: "Liquid Glass", emoji: "💎",
        bgPrimary: Color(red: 0.102, green: 0.102, blue: 0.18),
        bgSecondary: Color(red: 0.086, green: 0.129, blue: 0.243),
        bgCard: Color(white: 1, opacity: 0.07),
        textPrimary: Color(white: 1, opacity: 0.92),
        textSecondary: Color(white: 1, opacity: 0.55),
        textMuted: Color(white: 1, opacity: 0.35),
        accent: Color(red: 0.376, green: 0.647, blue: 0.98),
        accentDim: Color(red: 0.376, green: 0.647, blue: 0.98).opacity(0.15),
        danger: Color(red: 0.973, green: 0.443, blue: 0.443),
        warning: Color(red: 0.984, green: 0.749, blue: 0.141),
        success: Color(red: 0.204, green: 0.831, blue: 0.6),
        border: Color(white: 1, opacity: 0.12),
        cornerRadius: 16, usesBlur: true, isDark: true
    )

    // ── Liquid Glass 2.0 ─────────────────────────────────────
    static let liquidGlass2 = AppTheme(
        id: "liquid-glass-2", name: "Liquid Glass 2.0", emoji: "🔮",
        bgPrimary: Color(red: 0.031, green: 0.027, blue: 0.102),
        bgSecondary: Color(red: 0.051, green: 0.067, blue: 0.157),
        bgCard: Color(white: 1, opacity: 0.06),
        textPrimary: Color(white: 1, opacity: 0.95),
        textSecondary: Color(white: 1, opacity: 0.6),
        textMuted: Color(white: 1, opacity: 0.35),
        accent: Color(red: 0.655, green: 0.545, blue: 0.98),
        accentDim: Color(red: 0.655, green: 0.545, blue: 0.98).opacity(0.15),
        danger: Color(red: 0.984, green: 0.443, blue: 0.522),
        warning: Color(red: 0.984, green: 0.749, blue: 0.141),
        success: Color(red: 0.204, green: 0.831, blue: 0.6),
        border: Color(white: 1, opacity: 0.10),
        cornerRadius: 20, usesBlur: true, isDark: true
    )

    // ── Cyberpunk ─────────────────────────────────────────────
    static let cyberpunk = AppTheme(
        id: "cyberpunk", name: "Cyberpunk", emoji: "⚡",
        bgPrimary: Color(red: 0.02, green: 0.02, blue: 0.031),
        bgSecondary: Color(red: 0.039, green: 0.039, blue: 0.102),
        bgCard: Color(red: 0.051, green: 0.051, blue: 0.125),
        textPrimary: Color(red: 0.878, green: 0.878, blue: 1),
        textSecondary: Color(red: 0.78, green: 0.78, blue: 1, opacity: 0.6),
        textMuted: Color(red: 0.59, green: 0.59, blue: 0.78, opacity: 0.4),
        accent: Color(red: 0, green: 1, blue: 0.533),
        accentDim: Color(red: 0, green: 1, blue: 0.533).opacity(0.12),
        danger: Color(red: 1, green: 0.2, blue: 0.4),
        warning: Color(red: 1, green: 0.8, blue: 0),
        success: Color(red: 0, green: 1, blue: 0.533),
        border: Color(red: 0, green: 1, blue: 0.533, opacity: 0.15),
        cornerRadius: 4, usesBlur: false, isDark: true
    )

    // ── Glassmorphism ────────────────────────────────────────
    static let glassmorphism = AppTheme(
        id: "glass", name: "Glassmorphism", emoji: "🌌",
        bgPrimary: Color(red: 0.4, green: 0.494, blue: 0.918),
        bgSecondary: Color(red: 0.463, green: 0.29, blue: 0.635),
        bgCard: Color(white: 1, opacity: 0.10),
        textPrimary: Color.white,
        textSecondary: Color(white: 1, opacity: 0.7),
        textMuted: Color(white: 1, opacity: 0.4),
        accent: Color.white,
        accentDim: Color(white: 1, opacity: 0.12),
        danger: Color(red: 1, green: 0.42, blue: 0.616),
        warning: Color(red: 1, green: 0.82, blue: 0.4),
        success: Color(red: 0.024, green: 0.839, blue: 0.627),
        border: Color(white: 1, opacity: 0.2),
        cornerRadius: 20, usesBlur: true, isDark: false
    )

    // ── Apple ────────────────────────────────────────────────
    static let appleTheme = AppTheme(
        id: "apple", name: "Apple", emoji: "🍎",
        bgPrimary: Color(red: 0.949, green: 0.949, blue: 0.969),
        bgSecondary: Color.white,
        bgCard: Color.white,
        textPrimary: Color(red: 0.11, green: 0.11, blue: 0.118),
        textSecondary: Color(red: 0.228, green: 0.228, blue: 0.235),
        textMuted: Color(red: 0.557, green: 0.557, blue: 0.576),
        accent: Color(red: 0, green: 0.478, blue: 1),
        accentDim: Color(red: 0, green: 0.478, blue: 1, opacity: 0.1),
        danger: Color(red: 1, green: 0.231, blue: 0.188),
        warning: Color(red: 1, green: 0.584, blue: 0),
        success: Color(red: 0.204, green: 0.78, blue: 0.349),
        border: Color(red: 0.235, green: 0.235, blue: 0.263, opacity: 0.12),
        cornerRadius: 14, usesBlur: true, isDark: false
    )

    // ── Corporate ────────────────────────────────────────────
    static let corporate = AppTheme(
        id: "corporate", name: "Corporate", emoji: "🏢",
        bgPrimary: Color(red: 0.961, green: 0.969, blue: 0.98),
        bgSecondary: Color.white,
        bgCard: Color.white,
        textPrimary: Color(red: 0.067, green: 0.094, blue: 0.153),
        textSecondary: Color(red: 0.42, green: 0.451, blue: 0.502),
        textMuted: Color(red: 0.612, green: 0.639, blue: 0.686),
        accent: Color(red: 0.114, green: 0.306, blue: 0.847),
        accentDim: Color(red: 0.114, green: 0.306, blue: 0.847, opacity: 0.08),
        danger: Color(red: 0.863, green: 0.149, blue: 0.149),
        warning: Color(red: 0.851, green: 0.467, blue: 0.024),
        success: Color(red: 0.024, green: 0.588, blue: 0.412),
        border: Color(red: 0.898, green: 0.91, blue: 0.922),
        cornerRadius: 8, usesBlur: false, isDark: false
    )

    // ── Military ─────────────────────────────────────────────
    static let military = AppTheme(
        id: "military", name: "Military", emoji: "🪖",
        bgPrimary: Color(red: 0.039, green: 0.059, blue: 0.031),
        bgSecondary: Color(red: 0.067, green: 0.102, blue: 0.055),
        bgCard: Color(red: 0.086, green: 0.122, blue: 0.071),
        textPrimary: Color(red: 0.553, green: 0.722, blue: 0.478),
        textSecondary: Color(red: 0.553, green: 0.722, blue: 0.478, opacity: 0.65),
        textMuted: Color(red: 0.553, green: 0.722, blue: 0.478, opacity: 0.35),
        accent: Color(red: 0.29, green: 0.486, blue: 0.247),
        accentDim: Color(red: 0.29, green: 0.486, blue: 0.247, opacity: 0.15),
        danger: Color(red: 0.753, green: 0.224, blue: 0.169),
        warning: Color(red: 0.953, green: 0.612, blue: 0.071),
        success: Color(red: 0.153, green: 0.682, blue: 0.376),
        border: Color(red: 0.29, green: 0.486, blue: 0.247, opacity: 0.25),
        cornerRadius: 2, usesBlur: false, isDark: true
    )

    // ── Liquid Gold ──────────────────────────────────────────
    static let liquidGold = AppTheme(
        id: "gold", name: "Liquid Gold", emoji: "✨",
        bgPrimary: Color(red: 0.039, green: 0.031, blue: 0),
        bgSecondary: Color(red: 0.075, green: 0.059, blue: 0),
        bgCard: Color(red: 0.102, green: 0.082, blue: 0),
        textPrimary: Color(red: 0.961, green: 0.843, blue: 0.431),
        textSecondary: Color(red: 0.961, green: 0.843, blue: 0.431, opacity: 0.65),
        textMuted: Color(red: 0.961, green: 0.843, blue: 0.431, opacity: 0.35),
        accent: Color(red: 1, green: 0.843, blue: 0),
        accentDim: Color(red: 1, green: 0.843, blue: 0, opacity: 0.12),
        danger: Color(red: 0.8, green: 0.133, blue: 0),
        warning: Color(red: 1, green: 0.533, blue: 0),
        success: Color(red: 0.267, green: 0.733, blue: 0.267),
        border: Color(red: 1, green: 0.843, blue: 0, opacity: 0.2),
        cornerRadius: 6, usesBlur: false, isDark: true
    )

    // ── Arctic White ─────────────────────────────────────────
    static let arcticWhite = AppTheme(
        id: "arctic", name: "Arctic White", emoji: "❄️",
        bgPrimary: Color(red: 0.973, green: 0.984, blue: 1),
        bgSecondary: Color.white,
        bgCard: Color.white,
        textPrimary: Color(red: 0.059, green: 0.09, blue: 0.165),
        textSecondary: Color(red: 0.282, green: 0.337, blue: 0.412),
        textMuted: Color(red: 0.58, green: 0.639, blue: 0.722),
        accent: Color(red: 0.055, green: 0.647, blue: 0.914),
        accentDim: Color(red: 0.055, green: 0.647, blue: 0.914, opacity: 0.08),
        danger: Color(red: 0.937, green: 0.267, blue: 0.267),
        warning: Color(red: 0.961, green: 0.62, blue: 0.043),
        success: Color(red: 0.063, green: 0.722, blue: 0.506),
        border: Color(red: 0.886, green: 0.91, blue: 0.941),
        cornerRadius: 12, usesBlur: false, isDark: false
    )

    // ── Sunset ───────────────────────────────────────────────
    static let sunset = AppTheme(
        id: "sunset", name: "Sunset", emoji: "🌅",
        bgPrimary: Color(red: 0.102, green: 0.039, blue: 0),
        bgSecondary: Color(red: 0.176, green: 0.071, blue: 0),
        bgCard: Color(red: 0.239, green: 0.102, blue: 0),
        textPrimary: Color(red: 1, green: 0.878, blue: 0.698),
        textSecondary: Color(red: 1, green: 0.878, blue: 0.698, opacity: 0.65),
        textMuted: Color(red: 1, green: 0.878, blue: 0.698, opacity: 0.35),
        accent: Color(red: 1, green: 0.42, blue: 0.208),
        accentDim: Color(red: 1, green: 0.42, blue: 0.208, opacity: 0.15),
        danger: Color(red: 1, green: 0.09, blue: 0.267),
        warning: Color(red: 1, green: 0.671, blue: 0),
        success: Color(red: 0.412, green: 0.941, blue: 0.682),
        border: Color(red: 1, green: 0.42, blue: 0.208, opacity: 0.2),
        cornerRadius: 10, usesBlur: false, isDark: true
    )

    // ── Matrix ───────────────────────────────────────────────
    static let matrix = AppTheme(
        id: "matrix", name: "Matrix", emoji: "🟩",
        bgPrimary: Color.black,
        bgSecondary: Color(red: 0, green: 0.067, blue: 0),
        bgCard: Color(red: 0, green: 0.102, blue: 0),
        textPrimary: Color(red: 0, green: 1, blue: 0.255),
        textSecondary: Color(red: 0, green: 1, blue: 0.255, opacity: 0.65),
        textMuted: Color(red: 0, green: 1, blue: 0.255, opacity: 0.35),
        accent: Color(red: 0, green: 1, blue: 0.255),
        accentDim: Color(red: 0, green: 1, blue: 0.255, opacity: 0.1),
        danger: Color.red,
        warning: Color.yellow,
        success: Color(red: 0, green: 1, blue: 0.255),
        border: Color(red: 0, green: 1, blue: 0.255, opacity: 0.2),
        cornerRadius: 0, usesBlur: false, isDark: true
    )

    // ── Royal Purple ─────────────────────────────────────────
    static let royalPurple = AppTheme(
        id: "royal", name: "Royal Purple", emoji: "👑",
        bgPrimary: Color(red: 0.051, green: 0, blue: 0.102),
        bgSecondary: Color(red: 0.102, green: 0, blue: 0.2),
        bgCard: Color(red: 0.133, green: 0, blue: 0.267),
        textPrimary: Color(red: 0.91, green: 0.835, blue: 1),
        textSecondary: Color(red: 0.91, green: 0.835, blue: 1, opacity: 0.65),
        textMuted: Color(red: 0.91, green: 0.835, blue: 1, opacity: 0.35),
        accent: Color(red: 0.753, green: 0.518, blue: 0.988),
        accentDim: Color(red: 0.753, green: 0.518, blue: 0.988, opacity: 0.15),
        danger: Color(red: 0.957, green: 0.247, blue: 0.369),
        warning: Color(red: 0.984, green: 0.573, blue: 0.235),
        success: Color(red: 0.639, green: 0.9, blue: 0.208),
        border: Color(red: 0.753, green: 0.518, blue: 0.988, opacity: 0.2),
        cornerRadius: 12, usesBlur: false, isDark: true
    )

    // ── Fire Red ─────────────────────────────────────────────
    static let fireRed = AppTheme(
        id: "fire", name: "Fire Red", emoji: "🔥",
        bgPrimary: Color(red: 0.051, green: 0, blue: 0),
        bgSecondary: Color(red: 0.102, green: 0, blue: 0),
        bgCard: Color(red: 0.133, green: 0, blue: 0),
        textPrimary: Color(red: 1, green: 0.8, blue: 0.8),
        textSecondary: Color(red: 1, green: 0.8, blue: 0.8, opacity: 0.65),
        textMuted: Color(red: 1, green: 0.8, blue: 0.8, opacity: 0.35),
        accent: Color(red: 0.937, green: 0.267, blue: 0.267),
        accentDim: Color(red: 0.937, green: 0.267, blue: 0.267, opacity: 0.15),
        danger: Color.red,
        warning: Color(red: 1, green: 0.4, blue: 0),
        success: Color(red: 0, green: 0.8, blue: 0.267),
        border: Color(red: 0.937, green: 0.267, blue: 0.267, opacity: 0.2),
        cornerRadius: 6, usesBlur: false, isDark: true
    )

    // ── Frühling (Spring) ────────────────────────────────────
    static let fruehling = AppTheme(
        id: "fruehling", name: "Frühling", emoji: "🌸",
        bgPrimary: Color(red: 0.91, green: 0.961, blue: 0.914),
        bgSecondary: Color(red: 0.953, green: 0.898, blue: 0.961),
        bgCard: Color.white.opacity(0.85),
        textPrimary: Color(red: 0.106, green: 0.369, blue: 0.125),
        textSecondary: Color(red: 0.22, green: 0.557, blue: 0.235),
        textMuted: Color(red: 0.506, green: 0.784, blue: 0.518),
        accent: Color(red: 0.263, green: 0.627, blue: 0.278),
        accentDim: Color(red: 0.263, green: 0.627, blue: 0.278, opacity: 0.12),
        danger: Color(red: 0.898, green: 0.224, blue: 0.208),
        warning: Color(red: 0.984, green: 0.549, blue: 0),
        success: Color(red: 0.263, green: 0.627, blue: 0.278),
        border: Color(red: 0.263, green: 0.627, blue: 0.278, opacity: 0.2),
        cornerRadius: 20, usesBlur: true, isDark: false
    )

    // ── Sommer (Summer) ──────────────────────────────────────
    static let sommer = AppTheme(
        id: "sommer", name: "Sommer", emoji: "☀️",
        bgPrimary: Color(red: 1, green: 0.973, blue: 0.882),
        bgSecondary: Color(red: 1, green: 0.953, blue: 0.804),
        bgCard: Color.white.opacity(0.85),
        textPrimary: Color(red: 0.902, green: 0.318, blue: 0),
        textSecondary: Color(red: 0.749, green: 0.212, blue: 0.047),
        textMuted: Color(red: 1, green: 0.671, blue: 0.251),
        accent: Color(red: 1, green: 0.435, blue: 0),
        accentDim: Color(red: 1, green: 0.435, blue: 0, opacity: 0.12),
        danger: Color(red: 0.827, green: 0.184, blue: 0.184),
        warning: Color(red: 1, green: 0.627, blue: 0),
        success: Color(red: 0.2, green: 0.412, blue: 0.118),
        border: Color(red: 1, green: 0.435, blue: 0, opacity: 0.2),
        cornerRadius: 16, usesBlur: true, isDark: false
    )

    // ── Herbst (Autumn) ──────────────────────────────────────
    static let herbst = AppTheme(
        id: "herbst", name: "Herbst", emoji: "🍂",
        bgPrimary: Color(red: 0.243, green: 0.153, blue: 0.137),
        bgSecondary: Color(red: 0.306, green: 0.204, blue: 0.18),
        bgCard: Color(white: 1, opacity: 0.08),
        textPrimary: Color(red: 1, green: 0.8, blue: 0.737),
        textSecondary: Color(red: 1, green: 0.8, blue: 0.737, opacity: 0.75),
        textMuted: Color(red: 1, green: 0.8, blue: 0.737, opacity: 0.4),
        accent: Color(red: 1, green: 0.439, blue: 0.263),
        accentDim: Color(red: 1, green: 0.439, blue: 0.263, opacity: 0.15),
        danger: Color(red: 1, green: 0.09, blue: 0.267),
        warning: Color(red: 1, green: 0.702, blue: 0),
        success: Color(red: 0.463, green: 1, blue: 0.012),
        border: Color(red: 1, green: 0.439, blue: 0.263, opacity: 0.25),
        cornerRadius: 12, usesBlur: true, isDark: true
    )

    // ── Winter ───────────────────────────────────────────────
    static let winter = AppTheme(
        id: "winter", name: "Winter", emoji: "🌨️",
        bgPrimary: Color(red: 0.89, green: 0.949, blue: 0.992),
        bgSecondary: Color(red: 0.91, green: 0.914, blue: 0.976),
        bgCard: Color.white.opacity(0.87),
        textPrimary: Color(red: 0.102, green: 0.137, blue: 0.494),
        textSecondary: Color(red: 0.157, green: 0.208, blue: 0.573),
        textMuted: Color(red: 0.624, green: 0.659, blue: 0.855),
        accent: Color(red: 0.247, green: 0.318, blue: 0.71),
        accentDim: Color(red: 0.247, green: 0.318, blue: 0.71, opacity: 0.1),
        danger: Color(red: 0.776, green: 0.157, blue: 0.157),
        warning: Color(red: 0.937, green: 0.424, blue: 0),
        success: Color(red: 0.18, green: 0.49, blue: 0.196),
        border: Color(red: 0.247, green: 0.318, blue: 0.71, opacity: 0.18),
        cornerRadius: 16, usesBlur: true, isDark: false
    )

    // ── Citrus ───────────────────────────────────────────────
    static let citrus = AppTheme(
        id: "citrus", name: "Citrus", emoji: "🍋",
        bgPrimary: Color(red: 0.102, green: 0.165, blue: 0),
        bgSecondary: Color(red: 0.122, green: 0.2, blue: 0),
        bgCard: Color(white: 1, opacity: 0.07),
        textPrimary: Color(red: 0.957, green: 1, blue: 0.506),
        textSecondary: Color(red: 0.957, green: 1, blue: 0.506, opacity: 0.72),
        textMuted: Color(red: 0.957, green: 1, blue: 0.506, opacity: 0.38),
        accent: Color(red: 0.776, green: 1, blue: 0),
        accentDim: Color(red: 0.776, green: 1, blue: 0, opacity: 0.13),
        danger: Color(red: 1, green: 0.267, blue: 0.267),
        warning: Color(red: 1, green: 0.667, blue: 0),
        success: Color(red: 0.463, green: 1, blue: 0.012),
        border: Color(red: 0.776, green: 1, blue: 0, opacity: 0.22),
        cornerRadius: 14, usesBlur: false, isDark: true
    )
}

// MARK: - ThemeManager

@MainActor
final class ThemeManager: ObservableObject {
    static let shared = ThemeManager()

    @Published var current: AppTheme = .liquidGlass

    private let key = "cchq_app_theme"

    private init() {
        // Load saved theme
        if let saved = UserDefaults.standard.string(forKey: key),
           let theme = AppTheme.all.first(where: { $0.id == saved }) {
            current = theme
        } else {
            // Check system color scheme preference
            current = .liquidGlass
        }
    }

    func setTheme(_ theme: AppTheme) {
        current = theme
        UserDefaults.standard.set(theme.id, forKey: key)
        // Sync to server preference
        Task {
            let token = AuthService.shared.token
            guard !token.isEmpty else { return }
            try? await NetworkService.shared.post(path: "/api/auth/me", token: token, body: ["theme": theme.id])
        }
    }

    func setThemeById(_ id: String) {
        if let theme = AppTheme.all.first(where: { $0.id == id }) {
            setTheme(theme)
        }
    }

    /// Apply theme received from server user profile
    func applyServerTheme(_ themeId: String?) {
        guard let tid = themeId, !tid.isEmpty else { return }
        // Only apply if we haven't locally overridden
        if UserDefaults.standard.string(forKey: key) == nil {
            setThemeById(tid)
        }
    }
}

// MARK: - Theme Environment Key

private struct ThemeKey: EnvironmentKey {
    static let defaultValue: AppTheme = .liquidGlass
}

extension EnvironmentValues {
    var appTheme: AppTheme {
        get { self[ThemeKey.self] }
        set { self[ThemeKey.self] = newValue }
    }
}

// MARK: - Theme Picker View

struct ThemePickerView: View {
    @ObservedObject private var tm = ThemeManager.shared
    @Environment(\.dismiss) private var dismiss

    private let columns = [GridItem(.adaptive(minimum: 90), spacing: 12)]

    private let groups: [(String, [AppTheme])] = [
        ("🌑 Dark Themes", AppTheme.all.filter { $0.isDark }),
        ("☀️ Light Themes", AppTheme.all.filter { !$0.isDark }),
    ]

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 24) {
                    ForEach(groups, id: \.0) { group in
                        VStack(alignment: .leading, spacing: 10) {
                            Text(group.0)
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(tm.current.textMuted)
                                .textCase(.uppercase)
                                .kerning(0.5)
                                .padding(.horizontal)

                            LazyVGrid(columns: columns, spacing: 10) {
                                ForEach(group.1) { theme in
                                    ThemeCell(theme: theme, isSelected: theme.id == tm.current.id)
                                        .onTapGesture {
                                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                                tm.setTheme(theme)
                                            }
                                        }
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                }
                .padding(.vertical, 20)
            }
            .background(tm.current.bgPrimary.ignoresSafeArea())
            .navigationTitle("🎨 Themes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fertig") { dismiss() }
                        .foregroundColor(tm.current.accent)
                }
            }
        }
    }
}

struct ThemeCell: View {
    let theme: AppTheme
    let isSelected: Bool

    var body: some View {
        VStack(spacing: 6) {
            ZStack {
                // Preview swatch
                RoundedRectangle(cornerRadius: 10)
                    .fill(
                        LinearGradient(
                            colors: [theme.bgPrimary, theme.bgSecondary],
                            startPoint: .topLeading, endPoint: .bottomTrailing
                        )
                    )
                    .frame(height: 52)

                // Accent strip at bottom
                VStack {
                    Spacer()
                    RoundedRectangle(cornerRadius: 0)
                        .fill(theme.accent)
                        .frame(height: 8)
                        .cornerRadius(10, corners: [.bottomLeft, .bottomRight])
                }
                .frame(height: 52)
                .clipShape(RoundedRectangle(cornerRadius: 10))

                // Check mark if selected
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(theme.accent)
                        .font(.system(size: 18, weight: .bold))
                        .shadow(color: .black.opacity(0.4), radius: 2)
                }
            }
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(isSelected ? theme.accent : Color.clear, lineWidth: 2)
            )
            .scaleEffect(isSelected ? 1.04 : 1)

            Text(theme.emoji)
                .font(.system(size: 16))
            Text(theme.name)
                .font(.system(size: 10, weight: isSelected ? .semibold : .regular))
                .foregroundColor(isSelected ? ThemeManager.shared.current.accent : ThemeManager.shared.current.textMuted)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
    }
}

// MARK: - Corner Radius Extension

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners
    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}
