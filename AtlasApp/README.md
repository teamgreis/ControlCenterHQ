# Atlas Control Center – Native App

Hybrid iOS/iPadOS/macOS App für Atlas Control Center.

**Architektur:** Native SwiftUI Shell (Login, Push, WebSocket) + WKWebView (alle Inhalte)
**Plattformen:** iPhone, iPad, Mac (Catalyst)
**Mindest-iOS:** 16.0

---

## Schnellstart

1. **Xcode 15+** öffnen
2. `AtlasApp.xcodeproj` öffnen
3. **Signing:** Xcode → Target → Signing & Capabilities → Team auswählen
4. Bundle ID auf `de.atlasadmin.app` (oder eigene) setzen
5. **Simulator starten** → Server-URL eingeben → Login

---

## QR-Code Onboarding (empfohlen)

1. Atlas Web-App → ⚙️ Einstellungen → **📱 Mobile App verbinden**
2. QR-Code erscheint im Browser
3. App öffnen → **QR-Code scannen**
4. Verbindung wird automatisch hergestellt

---

## APNs (Push-Benachrichtigungen)

APNs ermöglicht Push auch bei geschlossenem App. Einrichtung im Apple Developer Portal:

### 1. App ID anlegen
- [developer.apple.com](https://developer.apple.com) → Certificates, Identifiers & Profiles
- Identifier: `de.atlasadmin.app`
- **Push Notifications** aktivieren

### 2. APNs Auth Key generieren
- Keys → + → **Apple Push Notifications service (APNs)** aktivieren
- Key herunterladen (`.p8` Datei) – **nur einmal möglich!**
- **Key ID** (10 Zeichen) und **Team ID** notieren

### 3. In Atlas eintragen
- Atlas Web-App → ⚙️ Einstellungen → **APNs Konfiguration**
- Key ID, Team ID und P8-Schlüssel eintragen
- **Sandbox** = aktiviert für Entwicklung, deaktiviert für Production

### APNs-Endpunkte im Atlas-Backend

| Endpoint | Methode | Beschreibung |
|----------|---------|-------------|
| `/api/push/apns/register` | POST | Device Token registrieren |
| `/api/push/apns/unregister` | DELETE | Device Token entfernen |
| `/api/push/apns/test` | POST | Test-Push senden |

---

## Mac Catalyst

- **Xcode → Target → General → Destination:** macOS aktiviert
- Auf Mac: kein QR-Scanner (manuelle URL-Eingabe)
- Keyboard-Shortcuts: ⌘R = Reload, ⌘, = Settings

---

## WebSocket & Echtzeit-Events

Die App hält eine permanente WebSocket-Verbindung zu `wss://{server}/ws/{token}`:

| Event | Aktion |
|-------|--------|
| `emergency_broadcast` | Vollbild-Notfall-Overlay + lokale Notification |
| `alert_new` (critical/warning) | Lokale Notification + Sound |
| `dispatch_request` | Alert-Dialog mit Annehmen/Ablehnen |
| `dispatch_accepted/declined` | Toast-Rückmeldung |

---

## App-Icon

Roter geometrischer Adler in Seitenansicht auf dunklem Hintergrund.
SVG-Vorlage: `AtlasApp/Assets.xcassets/AppIcon.appiconset/eagle-icon.svg`

---

## App Store Veröffentlichung

1. Xcode → Product → Archive
2. App Store Connect Account benötigt (99€/Jahr Apple Developer Program)
3. App Store Connect → New App → Bundle ID: `de.atlasadmin.app`
4. Screenshots für iPhone 6.7", iPhone 6.1", iPad 12.9" erstellen
5. Review-Prozess: typisch 24–72h

---

## Dateistruktur

```
AtlasApp/
├── AtlasApp.swift           – @main Entry Point + AppDelegate (APNs)
├── Views/
│   ├── OnboardingView.swift – QR-Scan + Server-URL Eingabe
│   ├── LoginView.swift      – Nativer Login + Face ID
│   ├── MainView.swift       – WKWebView + Notfall-Overlay + Dispatch-Alert
│   ├── WebContainerView.swift – WKWebView mit Token-Injection
│   └── SettingsView.swift   – Server-URL, Logout, App-Info
├── Services/
│   ├── AuthService.swift    – Login, Keychain, Biometrie
│   ├── WebSocketService.swift – WS-Verbindung, Auto-Reconnect
│   ├── PushService.swift    – APNs Registrierung
│   └── QRScanService.swift  – AVFoundation QR-Scanner
├── Models/
│   └── AtlasModels.swift    – ServerConfig, UserSession, AlertPayload
└── Assets.xcassets/
    └── AppIcon.appiconset/  – Roter Adler Icon (SVG + PNG)
```

---

© Felix Greis 2026 – Alle Rechte vorbehalten
