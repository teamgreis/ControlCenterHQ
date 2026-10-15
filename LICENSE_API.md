# ControlCenterHQ — Lizenz-Validierung für Kundenprogramme

Programme können ihre Lizenz gegen den zentralen Lizenzserver prüfen.
Kein Login nötig — nur der Lizenzkey und eine Geräte-ID.

## Endpunkt

```
POST https://cchq.queerbase.eu/api/license/validate
Content-Type: application/json
```

## Request

```json
{
  "key": "CCHQ-PRO-2026-AB-CDEFGH",
  "device_id": "stabile-eindeutige-geräte-id",
  "device_name": "Notebook Müller (optional)",
  "app_version": "1.2.3 (optional)"
}
```

| Feld | Pflicht | Beschreibung |
|------|---------|--------------|
| `key` | ja | Der Lizenzkey im Format `CCHQ-<TIER>-<JAHR>-<XX>-<XXXXX>` |
| `device_id` | nein | Eindeutige, stabile ID des Geräts (z. B. Hash der Hardware-Seriennummer). Ohne device_id wird die Aktivierung nicht gezählt. |
| `device_name` | nein | Anzeigename des Geräts |
| `app_version` | nein | Version des Kundenprogramms |

## Response (gültig)

```json
{
  "valid": true,
  "tier": "PRO",
  "features": {"all": true, "max_users": 9999},
  "expires_at": null,
  "activations_used": 1,
  "max_activations": 3
}
```

- `tier`: `PRO` (alle Module) oder `STANDARD` (10 Nutzer, Modul-Liste in `features.modules`)
- `expires_at`: Ablaufdatum (`YYYY-MM-DDTHH:MM:SS`) oder `null` = kein Ablauf
- `activations_used` / `max_activations`: belegte/max. Geräte-Aktivierungen

## Response (ungültig)

```json
{"valid": false, "reason": "unknown"}
```

`reason`:
- `unknown` — Key existiert nicht (Tippfehler?)
- `revoked` — Key wurde widerrufen
- `expired` — Ablaufdatum überschritten
- `activation_limit_reached` — alle Geräte-Slots belegt (im Admin-Panel ein altes Gerät freigeben)

## Rate-Limit

Max. **30 Validierungen pro Minute und IP**. Danach HTTP 429.

## Beispiel (Python)

```python
import requests

def check_license(key: str, device_id: str) -> bool:
    r = requests.post(
        "https://cchq.queerbase.eu/api/license/validate",
        json={"key": key, "device_id": device_id,
              "device_name": "Mein Programm"},
        timeout=10,
    )
    data = r.json()
    return data.get("valid", False)
```

## Beispiel (JavaScript / Node)

```javascript
async function checkLicense(key, deviceId) {
  const r = await fetch("https://cchq.queerbase.eu/api/license/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, device_id: deviceId, device_name: "Mein Programm" }),
  });
  const data = await r.json();
  return data.valid === true;
}
```

## Hinweise für Kundenprogramme

1. **Offline-Gnadenfrist empfohlen:** Bei Netzwerkfehler nicht sofort sperren —
   das letzte erfolgreiche Ergebnis lokal cachen (z. B. 7 Tage).
2. **Validierung nicht bei jedem Start:** Einmal pro Tag reicht.
3. **device_id stabil wählen** — kein Zufallswert bei jedem Start.
