# © Felix Greis 2026 – All rights reserved.
# ControlCenterHQ – Unauthorized modification prohibited.
# This software is proprietary and confidential.

NEXUS_COPYRIGHT = "Felix Greis 2026"
APP_NAME = "ControlCenterHQ"
APP_VERSION = "2.8.0"

import sys
import os
import json
import sqlite3
import hashlib
import hmac
import secrets
import asyncio
import math
import time
import csv
import io
import base64
import html as _html
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from typing import Optional, List
from pathlib import Path

# ─── License System ───────────────────────────────────────────────────────────
# Keys are stored ONLY as PBKDF2-SHA256 hashes — never in plaintext.
_LIC_SALT = b'CCHQ_LICENSE_SALT_2026_FG'
_LIC_ITERATIONS = 100000
_LIC_HASHES = {
    # tier -> (pbkdf2-sha256 hash, feature set)
    "PRO":      ("F3H0f3fvysg65zmfWgK1DdpG1Tsv+e8kR5m++U/h2uo=",
                 {"all": True, "max_users": 9999, "modules": "__all__"}),
    "STANDARD": ("F0Gkt0YbuMmTOPpHWbzPNw2RlIjh9iHirQupnW0HJw8=",
                 {"all": False, "max_users": 10,
                  "modules": ["command_control","alert_system","communication","data_logging",
                              "fleet_management","navigation","pager","scheduler","calendar",
                              "travel","weather","inventory","knowledge","requests","user_management"]}),
}

# ─── License Key Management ──────────────────────────────────────────────────
# Keys are generated (CCHQ-TIER-YYYY-XX-XXXXX), stored ONLY as PBKDF2 hashes,
# and can carry an expiry date, a customer, and an activation limit.
# Offline fallback keys (above) remain valid for existing installations.

_LIC_TIERS = {
    "PRO":      {"all": True,  "max_users": 9999, "modules": "__all__"},
    "STANDARD": {"all": False, "max_users": 10,
                 "modules": ["command_control","alert_system","communication","data_logging",
                             "fleet_management","navigation","pager","scheduler","calendar",
                             "travel","weather","inventory","knowledge","requests","user_management"]},
}
_LIC_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no I, O, 0, 1 (unambiguous)

def _lic_checksum(body: str) -> str:
    """Simple checksum char over the key body (mod 32 over the alphabet)."""
    total = sum(_LIC_ALPHABET.index(c) for c in body if c in _LIC_ALPHABET)
    return _LIC_ALPHABET[total % len(_LIC_ALPHABET)]

def generate_license_key(tier: str = "STANDARD") -> str:
    """Generate a new license key: CCHQ-<TIER3>-<YYYY>-<XX>-<XXXXX-C>.
    The last char is a checksum over the body for typo detection."""
    tier_code = {"PRO": "PRO", "STANDARD": "STD"}.get(tier.upper(), "STD")
    year = str(datetime.now().year)
    rnd = "".join(secrets.choice(_LIC_ALPHABET) for _ in range(7))
    body = f"{tier_code}{year}{rnd}"
    return f"CCHQ-{tier_code}-{year}-{rnd[:2]}-{rnd[2:]}{_lic_checksum(body)}"

def _mask_key(key: str) -> str:
    """Mask a license key for display: CCHQ-PRO-2026-AB-CDEFGH → ****CDEFGH."""
    if not key or len(key) < 5:
        return "****"
    return "****" + key[-5:]

def _get_license_row(key: str):
    """Look up a license row by key (hashed). Returns sqlite3.Row or None."""
    if not key:
        return None
    conn = get_db()
    try:
        h = _hash_license_key(key)
        return conn.execute("SELECT * FROM licenses WHERE key_hash=?", (h,)).fetchone()
    except Exception:
        return None
    finally:
        conn.close()

def _license_is_effective(row) -> bool:
    """A DB license counts as valid only when active and not expired."""
    if not row or row["status"] != "active":
        return False
    exp = row["expires_at"]
    if exp:
        try:
            if datetime.fromisoformat(exp) < datetime.now():
                return False
        except ValueError:
            pass
    return True

def _hash_license_key(key: str) -> str:
    dk = hashlib.pbkdf2_hmac('sha256', key.strip().encode(), _LIC_SALT, _LIC_ITERATIONS)
    return base64.b64encode(dk).decode()

def validate_license_key(key: str) -> dict:
    """Validate a license key. Returns {'valid':bool,'tier':str,'features':dict,
    'expires_at':str|None,'reason':str}.

    Resolution order:
      1. DB-generated license (licenses table) – respects status + expiry
      2. Hardcoded offline keys (_LIC_HASHES) – for existing installs
    """
    if not key:
        return {"valid": False, "tier": None, "features": {}}

    # 1. DB-managed license
    try:
        row = _get_license_row(key)
        if row is not None:
            if not _license_is_effective(row):
                reason = "revoked" if row["status"] != "active" else "expired"
                return {"valid": False, "tier": None, "features": {}, "reason": reason}
            tier = row["tier"]
            features = dict(_LIC_TIERS.get(tier, _LIC_TIERS["STANDARD"]))
            return {"valid": True, "tier": tier, "features": features,
                    "expires_at": row["expires_at"], "customer": row["customer_name"]}
    except Exception:
        pass  # DB not ready yet (first boot) – fall through to offline keys

    # 2. Hardcoded offline keys
    h = _hash_license_key(key)
    for tier, (stored_hash, features) in _LIC_HASHES.items():
        if hmac.compare_digest(h, stored_hash):
            return {"valid": True, "tier": tier, "features": features,
                    "expires_at": None, "offline": True}
    return {"valid": False, "tier": None, "features": {}, "reason": "unknown"}

def get_current_license() -> dict:
    """Load and validate the license from config."""
    try:
        cfg = load_config()
    except Exception:
        cfg = {}
    key = cfg.get("license_key", "")
    result = validate_license_key(key)
    if not result["valid"]:
        result = {"valid": False, "tier": "NONE", "features": {}}
    return result

def _record_first_run():
    """Record first_run_at in config if not already set."""
    try:
        cfg = load_config()
        if "first_run_at" not in cfg:
            cfg["first_run_at"] = datetime.now().isoformat()
            CONFIG_PATH.write_text(json.dumps(cfg, indent=2))
    except Exception:
        pass

def is_license_valid() -> bool:
    """Returns True if a valid license is activated."""
    return get_current_license()["valid"]

def is_grace_period_active() -> bool:
    """Returns True if within 2-hour grace period since first_run_at."""
    try:
        cfg = load_config()
        first_run = cfg.get("first_run_at")
        if not first_run:
            return True  # hasn't been recorded yet
        first_dt = datetime.fromisoformat(first_run)
        elapsed = datetime.now() - first_dt
        return elapsed.total_seconds() < 7200  # 2 hours
    except Exception:
        return True  # on error, allow access

def require_license():
    """FastAPI dependency: block request if no valid license and grace period expired."""
    if is_license_valid():
        return True
    if is_grace_period_active():
        return True
    raise HTTPException(402, "Keine gültige Lizenz. Bitte aktivieren Sie Ihren Lizenzkey in den Einstellungen.")

# Copyright integrity check (layer 1 – string check)
_EXPECTED = "Felix Greis 2026"
if NEXUS_COPYRIGHT != _EXPECTED:
    print("=" * 60)
    print("ERROR: Copyright integrity check failed.")
    print("ControlCenterHQ has been tampered with.")
    print("This software is proprietary to Felix Greis 2026.")
    print("Unauthorized modification is prohibited.")
    print("=" * 60)
    sys.exit(1)

# Copyright integrity check (layer 2 – self hash stored on first run)
def _verify_file_integrity():
    """Compute SHA-256 of this file and compare against a stored baseline.
    On first run the baseline is written; subsequent runs verify against it.
    This makes silent code modification detectable at startup."""
    try:
        _self = Path(__file__).resolve()
        _hash_file = _self.parent / ".cchq_integrity"
        raw = _self.read_bytes()
        current_hash = hashlib.sha256(raw).hexdigest()
        if _hash_file.exists():
            stored = _hash_file.read_text().strip()
            if stored != current_hash:
                print("=" * 60)
                print("WARNING: main.py has been modified since last verified run.")
                print(f"  Expected: {stored[:16]}...")
                print(f"  Current:  {current_hash[:16]}...")
                print("  If this is intentional, delete .atlas_integrity to reset.")
                print("=" * 60)
                # Log to stderr but do not exit – alert the operator instead.
                import sys as _sys
                print("[INTEGRITY] File hash mismatch detected.", file=_sys.stderr)
        else:
            _hash_file.write_text(current_hash)
            print(f"[Integrity] Baseline hash stored: {current_hash[:16]}...")
    except Exception as _e:
        pass  # Never crash on integrity check failure – just warn

_verify_file_integrity()

try:
    from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, Request, Response
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
except ImportError:
    print("Missing dependencies. Please run: pip3 install fastapi uvicorn[standard] python-multipart bcrypt")
    sys.exit(1)

try:
    import bcrypt
    def hash_password(pw: str) -> str:
        return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
    def verify_password(pw: str, hashed: str) -> bool:
        # Prefer bcrypt hashes ($2b$...), but gracefully handle legacy salt:sha256 values
        try:
            if hashed.startswith("$2"):
                return bcrypt.checkpw(pw.encode(), hashed.encode())
        except Exception:
            pass
        if ":" in hashed:
            import hashlib, hmac
            salt, h = hashed.split(":", 1)
            return hmac.compare_digest(h, hashlib.sha256((salt + pw).encode()).hexdigest())
        return False
except ImportError:
    import hashlib, hmac
    def hash_password(pw: str) -> str:
        salt = secrets.token_hex(16)
        h = hashlib.sha256((salt + pw).encode()).hexdigest()
        return f"{salt}:{h}"
    def verify_password(pw: str, hashed: str) -> bool:
        parts = hashed.split(":")
        if len(parts) != 2: return False
        salt, h = parts
        return hmac.compare_digest(h, hashlib.sha256((salt + pw).encode()).hexdigest())

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "atlas.db"
CONFIG_PATH = BASE_DIR / "config.json"

def load_config() -> dict:
    if CONFIG_PATH.exists():
        return json.loads(CONFIG_PATH.read_text())
    return {"org_name": "ControlCenterHQ", "facility_type": "operations", "admin_name": "Administrator"}

def is_setup_required() -> bool:
    """Returns True if config.json does not exist.
    The web wizard is the canonical first-time setup path.
    DB state is irrelevant here – if config is missing, setup is required."""
    return not CONFIG_PATH.exists()

CONFIG = load_config()

# ─── Database ───────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def get_setting(key: str, default=None):
    """Read a system setting from the DB. Returns an int if type=='int', else str.
    Falls back to `default` if the key doesn't exist yet (before first init_db)."""
    try:
        conn = get_db()
        row = conn.execute("SELECT value, type FROM system_settings WHERE key=?", (key,)).fetchone()
        conn.close()
        if row is None:
            return default
        return int(row["value"]) if row["type"] == "int" else row["value"]
    except Exception:
        return default


def set_setting(key: str, value) -> bool:
    """Persist a system setting. Returns True on success."""
    try:
        conn = get_db()
        conn.execute(
            "UPDATE system_settings SET value=?, updated_at=datetime('now') WHERE key=?",
            (str(value), key)
        )
        conn.commit()
        conn.close()
        return True
    except Exception:
        return False


def _migrate_db(conn):
    """Safely add new columns to existing tables without breaking existing data."""
    def add_col(table, col, coltype):
        try:
            conn.execute(f"ALTER TABLE {table} ADD COLUMN {col} {coltype}")
            conn.commit()
        except Exception:
            pass  # Column already exists

    # users: new fields
    add_col("users", "email", "TEXT DEFAULT ''")
    add_col("users", "phone", "TEXT DEFAULT ''")
    add_col("users", "custom_permissions", "TEXT DEFAULT '{}'")
    add_col("users", "group_id", "INTEGER")

    # fleet_vehicles: fuel tracking + extended info
    add_col("fleet_vehicles", "fuel_capacity_l", "REAL DEFAULT 60")
    add_col("fleet_vehicles", "fuel_current_l", "REAL DEFAULT 0")
    add_col("fleet_vehicles", "fuel_avg_l100km", "REAL DEFAULT 10")
    add_col("fleet_vehicles", "purchase_price", "REAL DEFAULT 0")
    add_col("fleet_vehicles", "features", "TEXT DEFAULT ''")
    add_col("fleet_vehicles", "engine_info", "TEXT DEFAULT ''")
    add_col("fleet_vehicles", "wheel_info", "TEXT DEFAULT ''")
    add_col("fleet_vehicles", "extra_details", "TEXT DEFAULT '{}'")

    # fleet_trips: completion data
    add_col("fleet_trips", "fuel_used_l", "REAL DEFAULT 0")
    add_col("fleet_trips", "end_lat", "REAL")
    add_col("fleet_trips", "end_lng", "REAL")
    add_col("fleet_trips", "completed_notes", "TEXT DEFAULT ''")

    # pager_config: gotify support
    add_col("pager_config", "gotify_enabled", "INTEGER NOT NULL DEFAULT 0")
    add_col("pager_config", "gotify_url", "TEXT NOT NULL DEFAULT ''")
    add_col("pager_config", "gotify_token", "TEXT NOT NULL DEFAULT ''")
    add_col("pager_config", "gotify_priority", "INTEGER NOT NULL DEFAULT 5")

    # alerts: per-user ack tracking
    add_col("alerts", "ack_user_id", "INTEGER")

    # fleet_vehicles: dispatched status
    add_col("fleet_vehicles", "dispatch_incident_id", "INTEGER")

    # alerts: alarm_group field
    add_col("alerts", "alarm_group", "TEXT DEFAULT ''")

    # federation peers
    try:
        conn.execute("""CREATE TABLE IF NOT EXISTS federation_peers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE,
            api_key TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'unknown',
            last_seen TEXT,
            auto_discovered INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )""")
        conn.commit()
    except Exception:
        pass

    # sessions: last_active column (added in v2.5)
    # SQLite ALTER TABLE does not support datetime('now') as DEFAULT, use fixed string
    add_col("sessions", "last_active", "TEXT NOT NULL DEFAULT '2000-01-01 00:00:00'")
    add_col("sessions", "ip_addr", "TEXT")
    add_col("sessions", "device_fingerprint", "TEXT")

    # users: last_seen column
    add_col("users", "last_seen", "TEXT")

    # inventory_items: extended fields for orders, warehouses, asset management
    add_col("inventory_items", "model_number", "TEXT DEFAULT ''")
    add_col("inventory_items", "part_number", "TEXT DEFAULT ''")
    add_col("inventory_items", "asset_number", "TEXT DEFAULT ''")
    add_col("inventory_items", "warehouse_id", "INTEGER")
    add_col("inventory_items", "issuer_id", "INTEGER")

    # geo_fences: lat/lng/radius/action fields (added in v2.8)
    add_col("geo_fences", "lat", "REAL DEFAULT 0.0")
    add_col("geo_fences", "lng", "REAL DEFAULT 0.0")
    add_col("geo_fences", "radius_m", "REAL DEFAULT 1000.0")
    add_col("geo_fences", "action", "TEXT DEFAULT 'alert'")

    # Owner-role migration: if no owner exists yet, promote the first admin.
    try:
        owner_count = conn.execute("SELECT COUNT(*) FROM users WHERE role='owner'").fetchone()[0]
        if owner_count == 0:
            first_admin = conn.execute(
                "SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1"
            ).fetchone()
            if first_admin:
                conn.execute("UPDATE users SET role='owner' WHERE id=?", (first_admin[0],))
                conn.commit()
                print("[Migration] First admin promoted to owner role.")
    except Exception:
        pass

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'operator',
        language TEXT NOT NULL DEFAULT 'en',
        theme TEXT NOT NULL DEFAULT 'liquid-glass',
        alert_tone TEXT NOT NULL DEFAULT 'emergency_siren',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_seen TEXT,
        is_active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        device_fingerprint TEXT,
        last_active TEXT NOT NULL DEFAULT (datetime('now')),
        ip_addr TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS ip_blacklist (
        ip TEXT PRIMARY KEY,
        reason TEXT NOT NULL DEFAULT 'brute_force',
        blocked_until TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS login_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ip TEXT NOT NULL,
        country TEXT,
        city TEXT,
        recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS webhooks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        secret TEXT,
        events TEXT NOT NULL DEFAULT '["alert","incident","emergency"]',
        enabled INTEGER NOT NULL DEFAULT 1,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'vehicle',
        lat REAL,
        lng REAL,
        status TEXT NOT NULL DEFAULT 'active',
        description TEXT,
        assigned_to INTEGER,
        metadata TEXT DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT NOT NULL DEFAULT 'warning',
        status TEXT NOT NULL DEFAULT 'open',
        lat REAL,
        lng REAL,
        assigned_to INTEGER,
        created_by INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        resolved_at TEXT
    );
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'info',
        source TEXT,
        acknowledged INTEGER NOT NULL DEFAULT 0,
        acknowledged_by INTEGER,
        acknowledged_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS chat_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'public',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(room_id) REFERENCES chat_rooms(id),
        FOREIGN KEY(sender_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS direct_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user INTEGER NOT NULL,
        to_user INTEGER NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL DEFAULT (datetime('now')),
        is_read INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS sensors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        location TEXT,
        lat REAL,
        lng REAL,
        status TEXT NOT NULL DEFAULT 'online',
        unit TEXT NOT NULL DEFAULT '',
        min_val REAL DEFAULT 0,
        max_val REAL DEFAULT 100,
        last_seen TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sensor_id INTEGER NOT NULL,
        value REAL NOT NULL,
        timestamp TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(sensor_id) REFERENCES sensors(id)
    );
    CREATE TABLE IF NOT EXISTS event_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        user_id INTEGER,
        details TEXT DEFAULT '{}',
        ip_addr TEXT,
        timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS kpi_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric TEXT NOT NULL,
        value REAL NOT NULL,
        timestamp TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS modules (
        name TEXT PRIMARY KEY,
        enabled INTEGER NOT NULL DEFAULT 1,
        config TEXT DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS fleet_vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        subtype TEXT,
        license_plate TEXT,
        vin TEXT,
        make TEXT,
        model TEXT,
        year INTEGER,
        color TEXT,
        seats INTEGER,
        payload_kg REAL,
        fuel_type TEXT DEFAULT 'diesel',
        status TEXT NOT NULL DEFAULT 'available',
        lat REAL,
        lng REAL,
        odometer_km REAL DEFAULT 0,
        insurance_expiry TEXT,
        tuev_expiry TEXT,
        assigned_driver INTEGER,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS fleet_drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        license_class TEXT NOT NULL,
        license_expiry TEXT,
        phone TEXT,
        email TEXT,
        assigned_vehicle INTEGER,
        status TEXT NOT NULL DEFAULT 'available',
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS fleet_trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        driver_id INTEGER,
        title TEXT NOT NULL,
        origin TEXT,
        destination TEXT,
        waypoints TEXT DEFAULT '[]',
        departure_time TEXT,
        estimated_arrival TEXT,
        actual_arrival TEXT,
        distance_km REAL,
        status TEXT NOT NULL DEFAULT 'planned',
        notes TEXT,
        fuel_used_l REAL DEFAULT 0,
        end_lat REAL,
        end_lng REAL,
        completed_notes TEXT DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(vehicle_id) REFERENCES fleet_vehicles(id)
    );
    CREATE TABLE IF NOT EXISTS fleet_maintenance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        scheduled_date TEXT,
        completed_date TEXT,
        cost REAL,
        technician TEXT,
        status TEXT NOT NULL DEFAULT 'scheduled',
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(vehicle_id) REFERENCES fleet_vehicles(id)
    );
    CREATE TABLE IF NOT EXISTS fleet_fuel_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        liters REAL NOT NULL,
        cost_per_liter REAL,
        total_cost REAL,
        odometer_km REAL,
        station TEXT,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(vehicle_id) REFERENCES fleet_vehicles(id)
    );
    CREATE TABLE IF NOT EXISTS fleet_inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        driver_id INTEGER,
        type TEXT NOT NULL DEFAULT 'pre_trip',
        date TEXT NOT NULL,
        items TEXT DEFAULT '{}',
        passed INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(vehicle_id) REFERENCES fleet_vehicles(id)
    );
    CREATE TABLE IF NOT EXISTS fleet_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        expiry_date TEXT,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(vehicle_id) REFERENCES fleet_vehicles(id)
    );
    CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        user_agent TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS vapid_keys (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        private_key TEXT NOT NULL,
        public_key TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS apns_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        device_token TEXT NOT NULL UNIQUE,
        bundle_id TEXT NOT NULL DEFAULT 'de.atlasadmin.app',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS fcm_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        fcm_token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS mobile_qr_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        expires_at TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS pager_rx_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        capcode TEXT,
        message TEXT NOT NULL,
        frequency REAL DEFAULT 439.9875,
        protocol TEXT,
        raw_line TEXT,
        received_at TEXT NOT NULL DEFAULT (datetime('now')),
        forwarded INTEGER NOT NULL DEFAULT 0,
        alert_id INTEGER REFERENCES alerts(id)
    );
    CREATE TABLE IF NOT EXISTS pager_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        rx_enabled INTEGER NOT NULL DEFAULT 0,
        rx_frequency REAL NOT NULL DEFAULT 439.9875,
        rx_gain INTEGER NOT NULL DEFAULT 40,
        rx_create_alerts INTEGER NOT NULL DEFAULT 1,
        rx_filter_capcodes TEXT NOT NULL DEFAULT '[]',
        dapnet_enabled INTEGER NOT NULL DEFAULT 0,
        dapnet_callsign TEXT NOT NULL DEFAULT '',
        dapnet_password TEXT NOT NULL DEFAULT '',
        dapnet_transmitter_group TEXT NOT NULL DEFAULT 'dl-all',
        dapnet_target_callsigns TEXT NOT NULL DEFAULT '[]',
        dapnet_on_severity TEXT NOT NULL DEFAULT 'critical,warning',
        ntfy_enabled INTEGER NOT NULL DEFAULT 0,
        ntfy_url TEXT NOT NULL DEFAULT '',
        ntfy_topic TEXT NOT NULL DEFAULT 'atlas-alerts',
        ntfy_token TEXT NOT NULL DEFAULT '',
        apprise_enabled INTEGER NOT NULL DEFAULT 0,
        apprise_urls TEXT NOT NULL DEFAULT '',
        channels TEXT NOT NULL DEFAULT '["webpush"]'
    );
    CREATE TABLE IF NOT EXISTS scheduled_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL DEFAULT 'alert',
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT NOT NULL DEFAULT 'info',
        source TEXT NOT NULL DEFAULT 'scheduled',
        recurrence TEXT NOT NULL DEFAULT 'once',
        recurrence_data TEXT NOT NULL DEFAULT '{}',
        next_run TEXT NOT NULL,
        last_run TEXT,
        enabled INTEGER NOT NULL DEFAULT 1,
        run_count INTEGER NOT NULL DEFAULT 0,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS user_permissions (
        user_id INTEGER NOT NULL,
        permission TEXT NOT NULL,
        value INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (user_id, permission),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS user_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        base_role TEXT NOT NULL DEFAULT 'viewer',
        permissions TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS user_group_members (
        group_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        PRIMARY KEY (group_id, user_id),
        FOREIGN KEY(group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        title TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'event',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        all_day INTEGER NOT NULL DEFAULT 1,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'approved',
        approved_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS travel_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requester_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        destination TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        vehicle_id INTEGER REFERENCES fleet_vehicles(id),
        passengers TEXT NOT NULL DEFAULT '[]',
        travel_type TEXT NOT NULL DEFAULT 'car',
        solo INTEGER NOT NULL DEFAULT 1,
        with_crew INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        reviewed_by INTEGER REFERENCES users(id),
        reviewer_notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS weather_cache (
        id INTEGER PRIMARY KEY CHECK (id=1),
        lat REAL, lng REAL,
        data TEXT NOT NULL DEFAULT '{}',
        fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS device_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        accuracy REAL,
        speed_ms REAL,
        heading REAL,
        recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS geo_fences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        radius_m REAL NOT NULL DEFAULT 1000,
        active INTEGER NOT NULL DEFAULT 1,
        action TEXT NOT NULL DEFAULT 'alert',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS compliance_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_type TEXT NOT NULL,
        generated_at TEXT NOT NULL DEFAULT (datetime('now')),
        generated_by INTEGER REFERENCES users(id),
        period_start TEXT,
        period_end TEXT,
        content TEXT NOT NULL DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS encrypted_backups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        size_bytes INTEGER NOT NULL DEFAULT 0,
        checksum TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        expires_at TEXT
    );
    CREATE TABLE IF NOT EXISTS rate_limit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endpoint TEXT NOT NULL,
        ip TEXT,
        user_id INTEGER,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_hash TEXT NOT NULL UNIQUE,
        key_display TEXT NOT NULL DEFAULT '',
        tier TEXT NOT NULL DEFAULT 'STANDARD',
        customer_name TEXT NOT NULL DEFAULT '',
        customer_email TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'active',
        expires_at TEXT,
        max_activations INTEGER NOT NULL DEFAULT 3,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS license_activations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_id INTEGER NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
        device_id TEXT NOT NULL,
        device_name TEXT NOT NULL DEFAULT '',
        app_version TEXT NOT NULL DEFAULT '',
        ip TEXT,
        first_seen TEXT NOT NULL DEFAULT (datetime('now')),
        last_seen TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(license_id, device_id)
    );
    CREATE TABLE IF NOT EXISTS health_checks (
        id INTEGER PRIMARY KEY CHECK (id=1),
        last_check TEXT NOT NULL DEFAULT (datetime('now')),
        db_ok INTEGER NOT NULL DEFAULT 1,
        ws_ok INTEGER NOT NULL DEFAULT 1,
        disk_free_mb REAL,
        cpu_pct REAL,
        mem_pct REAL,
        status TEXT NOT NULL DEFAULT 'ok'
    );
    CREATE TABLE IF NOT EXISTS inventory_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        description TEXT,
        qr_code TEXT UNIQUE,
        serial_number TEXT,
        location TEXT,
        status TEXT NOT NULL DEFAULT 'available',
        assigned_to INTEGER REFERENCES users(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        min_quantity INTEGER NOT NULL DEFAULT 0,
        purchase_date TEXT,
        purchase_price REAL,
        supplier TEXT,
        notes TEXT,
        image_url TEXT,
        custom_fields TEXT NOT NULL DEFAULT '{}',
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inventory_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        quantity_change INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER REFERENCES users(id),
        notes TEXT,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS knowledge_bases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT NOT NULL DEFAULT '📚',
        color TEXT NOT NULL DEFAULT '#4caf7d',
        access_role TEXT NOT NULL DEFAULT 'operator',
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS knowledge_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kb_id INTEGER NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        tags TEXT NOT NULL DEFAULT '[]',
        author_id INTEGER REFERENCES users(id),
        views INTEGER NOT NULL DEFAULT 0,
        pinned INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS work_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'general',
        priority TEXT NOT NULL DEFAULT 'normal',
        status TEXT NOT NULL DEFAULT 'pending',
        requester_id INTEGER NOT NULL REFERENCES users(id),
        assigned_to INTEGER REFERENCES users(id),
        approver_id INTEGER REFERENCES users(id),
        approved_at TEXT,
        rejected_at TEXT,
        rejection_reason TEXT,
        due_date TEXT,
        completed_at TEXT,
        attachments TEXT NOT NULL DEFAULT '[]',
        custom_fields TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS request_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL REFERENCES work_requests(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT NOT NULL,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS pi_nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        hostname TEXT NOT NULL UNIQUE,
        ip TEXT,
        api_key TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'sensor',
        status TEXT NOT NULL DEFAULT 'offline',
        capabilities TEXT NOT NULL DEFAULT '[]',
        assigned_tasks TEXT NOT NULL DEFAULT '[]',
        last_seen TEXT,
        cpu_pct REAL,
        mem_pct REAL,
        disk_free_mb REAL,
        temp_c REAL,
        uptime_s INTEGER,
        is_backup INTEGER NOT NULL DEFAULT 0,
        backup_priority INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT NOT NULL DEFAULT '🏢',
        color TEXT NOT NULL DEFAULT '#6366f1',
        head_user_id INTEGER REFERENCES users(id),
        parent_id INTEGER REFERENCES departments(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS infra_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT '📍',
        color TEXT NOT NULL DEFAULT '#6366f1',
        overpass_query TEXT,
        custom_type TEXT,
        enabled INTEGER NOT NULL DEFAULT 1,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS infra_custom_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER REFERENCES infra_categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        tags TEXT NOT NULL DEFAULT '{}',
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS event_predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_url TEXT,
        source_name TEXT,
        title TEXT NOT NULL,
        summary TEXT,
        category TEXT NOT NULL DEFAULT 'general',
        severity TEXT NOT NULL DEFAULT 'info',
        predicted_date TEXT,
        confidence REAL DEFAULT 0.5,
        tags TEXT NOT NULL DEFAULT '[]',
        lat REAL,
        lng REAL,
        fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
        is_confirmed INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS event_prediction_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        category TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        avg_severity REAL DEFAULT 0,
        recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS wireguard_peers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        public_key TEXT NOT NULL UNIQUE,
        allowed_ips TEXT NOT NULL,
        endpoint TEXT,
        role TEXT NOT NULL DEFAULT 'client',
        user_id INTEGER REFERENCES users(id),
        preshared_key TEXT,
        keepalive INTEGER DEFAULT 25,
        enabled INTEGER NOT NULL DEFAULT 1,
        last_handshake TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS wireguard_config (
        id INTEGER PRIMARY KEY CHECK (id=1),
        server_public_key TEXT,
        server_private_key TEXT,
        server_endpoint TEXT,
        listen_port INTEGER DEFAULT 51820,
        server_ip TEXT DEFAULT '10.100.0.1/24',
        dns TEXT DEFAULT '1.1.1.1',
        enabled INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ai_threats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        threat_type TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'medium',
        confidence REAL NOT NULL DEFAULT 0.5,
        source_ip TEXT,
        source_user_id INTEGER REFERENCES users(id),
        description TEXT NOT NULL,
        evidence TEXT NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'open',
        auto_action TEXT,
        reviewed_by INTEGER REFERENCES users(id),
        reviewed_at TEXT,
        false_positive INTEGER NOT NULL DEFAULT 0,
        detected_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ai_baselines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metric TEXT NOT NULL UNIQUE,
        value_mean REAL NOT NULL DEFAULT 0,
        value_std REAL NOT NULL DEFAULT 1,
        value_min REAL,
        value_max REAL,
        sample_count INTEGER NOT NULL DEFAULT 0,
        last_updated TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ai_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        rule_type TEXT NOT NULL DEFAULT 'threshold',
        condition_json TEXT NOT NULL DEFAULT '{}',
        action TEXT NOT NULL DEFAULT 'alert',
        severity TEXT NOT NULL DEFAULT 'medium',
        enabled INTEGER NOT NULL DEFAULT 1,
        trigger_count INTEGER NOT NULL DEFAULT 0,
        last_triggered TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ai_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        threat_id INTEGER NOT NULL REFERENCES ai_threats(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        feedback TEXT NOT NULL,
        notes TEXT,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ai_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts TEXT NOT NULL DEFAULT (datetime('now')),
        metrics TEXT NOT NULL DEFAULT '{}',
        anomaly_score REAL NOT NULL DEFAULT 0,
        threats_open INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'generic',
        subtype TEXT,
        protocol TEXT NOT NULL DEFAULT 'http',
        address TEXT NOT NULL,
        port INTEGER DEFAULT 80,
        auth_token TEXT,
        auth_user TEXT,
        auth_pass TEXT,
        location TEXT,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'unknown',
        last_seen TEXT,
        last_error TEXT,
        capabilities TEXT NOT NULL DEFAULT '[]',
        config_json TEXT NOT NULL DEFAULT '{}',
        pi_node_id INTEGER REFERENCES pi_nodes(id),
        enabled INTEGER NOT NULL DEFAULT 1,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS device_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL,
        payload TEXT NOT NULL DEFAULT '{}',
        triggered_by INTEGER REFERENCES users(id),
        result TEXT,
        success INTEGER NOT NULL DEFAULT 1,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS emergency_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'general',
        severity TEXT NOT NULL DEFAULT 'high',
        trigger_conditions TEXT NOT NULL DEFAULT '[]',
        steps TEXT NOT NULL DEFAULT '[]',
        auto_trigger INTEGER NOT NULL DEFAULT 0,
        notify_roles TEXT NOT NULL DEFAULT '["admin"]',
        device_actions TEXT NOT NULL DEFAULT '[]',
        active INTEGER NOT NULL DEFAULT 0,
        last_triggered TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS emergency_activations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL REFERENCES emergency_plans(id),
        triggered_by INTEGER REFERENCES users(id),
        trigger_reason TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        steps_completed TEXT NOT NULL DEFAULT '[]',
        started_at TEXT NOT NULL DEFAULT (datetime('now')),
        ended_at TEXT
    );
    CREATE TABLE IF NOT EXISTS repair_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        device_id INTEGER REFERENCES devices(id),
        priority TEXT NOT NULL DEFAULT 'normal',
        status TEXT NOT NULL DEFAULT 'open',
        requested_by INTEGER NOT NULL REFERENCES users(id),
        assigned_to INTEGER REFERENCES users(id),
        vendor TEXT,
        estimated_cost REAL,
        actual_cost REAL,
        scheduled_date TEXT,
        completed_at TEXT,
        notes TEXT,
        attachments TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS machines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'generic',
        pi_node_id INTEGER REFERENCES pi_nodes(id),
        connection_type TEXT NOT NULL DEFAULT 'lan',
        address TEXT,
        port INTEGER DEFAULT 9000,
        status TEXT NOT NULL DEFAULT 'offline',
        program TEXT,
        speed_pct REAL DEFAULT 0,
        current_op TEXT,
        sensors TEXT NOT NULL DEFAULT '{}',
        actuators TEXT NOT NULL DEFAULT '{}',
        components TEXT NOT NULL DEFAULT '[]',
        calibration TEXT NOT NULL DEFAULT '{}',
        auto_discovered INTEGER NOT NULL DEFAULT 0,
        last_seen TEXT,
        last_error TEXT,
        config_json TEXT NOT NULL DEFAULT '{}',
        created_by INTEGER REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS machine_sensor_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
        sensor_name TEXT NOT NULL,
        value REAL,
        unit TEXT,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS machine_commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
        command TEXT NOT NULL,
        params TEXT NOT NULL DEFAULT '{}',
        sent_by INTEGER REFERENCES users(id),
        status TEXT NOT NULL DEFAULT 'pending',
        result TEXT,
        ts TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inventory_warehouses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT,
        manager_id INTEGER REFERENCES users(id),
        description TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inventory_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        items_json TEXT NOT NULL DEFAULT '[]',
        warehouse_id INTEGER REFERENCES inventory_warehouses(id),
        priority TEXT NOT NULL DEFAULT 'normal',
        status TEXT NOT NULL DEFAULT 'pending',
        supplier TEXT,
        estimated_cost REAL,
        actual_cost REAL,
        tracking_number TEXT,
        requested_by INTEGER NOT NULL REFERENCES users(id),
        approved_by INTEGER REFERENCES users(id),
        approved_at TEXT,
        delivered_at TEXT,
        notes TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inventory_checkouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        issued_by INTEGER REFERENCES users(id),
        status TEXT NOT NULL DEFAULT 'active',
        checked_out_at TEXT NOT NULL DEFAULT (datetime('now')),
        returned_at TEXT
    );
    CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'int',
        min_val REAL,
        max_val REAL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    """)
    conn.commit()

    # Migrate existing tables with new columns (safe ALTER TABLE)
    _migrate_db(conn)
    conn.commit()

    # Seed default data if empty; or sync credentials from config if DB user exists
    row = c.execute("SELECT COUNT(*) as cnt FROM users").fetchone()
    if row["cnt"] == 0:
        _seed_data(c, conn)
    else:
        # Ensure the owner/admin credentials in the DB match config.json.
        # This fixes the case where setup.sh wrote a new config but the DB
        # still has the old default password (e.g. after re-setup on Raspberry Pi).
        cfg_sync = load_config()
        cfg_user = cfg_sync.get("admin_username", "").strip()
        cfg_hash = cfg_sync.get("admin_password_hash", "").strip()
        cfg_name = cfg_sync.get("admin_name", "").strip()
        if cfg_user and cfg_hash:
            owner = c.execute(
                "SELECT id, username, password_hash FROM users "
                "WHERE role IN ('owner','admin') ORDER BY CASE role WHEN 'owner' THEN 0 ELSE 1 END, id LIMIT 1"
            ).fetchone()
            if owner and (owner["username"] != cfg_user or owner["password_hash"] != cfg_hash):
                c.execute(
                    "UPDATE users SET username=?, password_hash=?, full_name=?, role='owner', is_active=1 WHERE id=?",
                    (cfg_user, cfg_hash, cfg_name or owner["username"], owner["id"])
                )
                conn.commit()

    # Seed default system settings (only insert if key not already present)
    _DEFAULT_SETTINGS = [
        # key, default_value, description, type, min, max
        ("login_max_attempts",      "10",   "Max. Anmeldeversuche vor Sperre",             "int",   1,   100),
        ("login_window_seconds",    "300",  "Zeitfenster für Anmeldeversuche (Sek.)",       "int",   60,  3600),
        ("login_lockout_seconds",   "600",  "Sperrdauer nach zu vielen Versuchen (Sek.)",  "int",   60,  86400),
        ("ip_blacklist_threshold",  "20",   "Gesamtversuche bis IP dauerhaft gesperrt",    "int",   5,   200),
        ("ip_blacklist_duration_h", "24",   "IP-Sperrdauer in Stunden",                    "int",   1,   720),
        ("api_rate_max",            "300",  "Max. API-Anfragen pro Zeitfenster (pro IP)",  "int",   10,  10000),
        ("api_rate_window",         "60",   "Zeitfenster für API-Rate-Limit (Sek.)",       "int",   10,  3600),
        ("session_ttl_hours",       "24",   "Sitzungs-Token-Gültigkeit in Stunden",        "int",   1,   720),
        ("max_sessions_per_user",   "10",   "Max. gleichzeitige Sitzungen pro Nutzer",     "int",   1,   50),
        ("session_idle_hours",      "2",    "Sitzungs-Timeout bei Inaktivität (Stunden)",  "int",   1,   168),
        ("kpi_interval_s",          "60",   "KPI-Snapshot-Intervall (Sek.)",               "int",   10,  3600),
        ("health_check_interval_s", "10",   "Systemgesundheits-Check-Intervall (Sek.)",   "int",   5,   300),
        ("alert_resend_interval_s", "5",    "Push-Alarm-Wiederholung (Sek.)",              "int",   5,   300),
        ("escalate_interval_s",     "300",  "Eskalations-Mindestabstand (Sek.)",           "int",   60,  3600),
        ("escalate_age_minutes",    "15",   "Kritischer Alarm gilt nach X Min. eskaliert", "int",   1,   120),
        ("nina_interval_s",         "120",  "NINA-Abfrage-Intervall (Sek.)",               "int",   30,  3600),
        ("fleet_check_interval_s",  "3600", "Fuhrpark-Ablauf-Check-Intervall (Sek.)",      "int",   300, 86400),
        ("fleet_insur_warn_days",   "30",   "Versicherungsablauf Warnung (Tage)",          "int",   1,   365),
        ("fleet_insur_crit_days",   "7",    "Versicherungsablauf Kritisch (Tage)",         "int",   1,   90),
        ("fleet_tuev_warn_days",    "14",   "TÜV-Ablauf Warnung (Tage)",                  "int",   1,   365),
        ("fleet_tuev_crit_days",    "7",    "TÜV-Ablauf Kritisch (Tage)",                 "int",   1,   90),
        ("sensor_update_interval_s","30",   "Pi-Sensor-Update-Intervall (Sek.)",           "int",   5,   300),
        ("pi_temp_critical_c",      "80",   "Pi CPU-Temperatur Kritisch-Schwelle (°C)",    "int",   50,  110),
        ("backup_retention_days",   "30",   "Backup-Aufbewahrungsdauer (Tage)",            "int",   1,   365),
        ("sysmon_history_max",      "60",   "Systemmonitor-Verlauf-Einträge (max.)",       "int",   10,  500),
        ("ai_analysis_interval_s",  "60",   "KI-Sicherheitsanalyse-Intervall (Sek.)",     "int",   10,  3600),
        ("ai_block_duration_h",     "2",    "KI-IP-Sperre Dauer (Stunden)",               "int",   1,   168),
        ("scheduled_check_interval_s","30", "Geplante-Aufgaben-Check-Intervall (Sek.)",   "int",   10,  300),
        ("session_cleaner_interval_s","300","Sitzungs-Bereinigung-Intervall (Sek.)",       "int",   60,  3600),
        ("failover_check_interval_s","10",  "Failover-Health-Check-Intervall (Sek.)",      "int",   5,   120),
        ("failover_fail_threshold",  "3",   "Failover-Auslöse-Schwelle (Fehlversuche)",   "int",   1,   20),
        ("qr_token_ttl_hours",       "1",   "QR-Login-Token-Gültigkeit (Stunden)",        "int",   1,   24),
        ("audit_log_retention_days", "365", "Audit-Log-Aufbewahrungsdauer (Tage)",        "int",   7,   3650),
    ]
    for key, val, desc, typ, mn, mx in _DEFAULT_SETTINGS:
        c.execute(
            "INSERT OR IGNORE INTO system_settings (key,value,description,type,min_val,max_val) VALUES (?,?,?,?,?,?)",
            (key, val, desc, typ, mn, mx)
        )

    # Ensure pager_config row exists (for existing databases)
    c.execute("INSERT OR IGNORE INTO pager_config (id) VALUES (1)")
    # Ensure all modules exist
    for mod in ["pager","scheduler","calendar","travel","weather","inventory","knowledge","requests","pi_manager","event_predictions","remote_access","security_ai","device_control","emergency_mgmt","repair_orders","machine_control"]:
        c.execute("INSERT OR IGNORE INTO modules (name, enabled) VALUES (?,1)", (mod,))
    # Ensure weather_cache row exists
    c.execute("INSERT OR IGNORE INTO weather_cache (id, data) VALUES (1, '{}')")
    conn.commit()

    conn.close()

def _seed_data(c, conn, admin_username=None, pw_hash=None, admin_name=None):
    """Seed minimal required data. Credentials are passed directly from setup_complete
    so the exact password the user typed is used — never a fallback default."""
    cfg = load_config()

    # Use passed-in values if available; fall back to env/config only for
    # standalone (non-wizard) first-launch scenarios.
    if not admin_username:
        admin_username = cfg.get("admin_username", "admin")
    if not admin_name:
        admin_name = cfg.get("admin_name", "Administrator")
    if not pw_hash:
        # Standalone launch without setup wizard: derive from env or stored hash.
        raw_pw = os.environ.get("ATLAS_ADMIN_PASSWORD") or "Control_Center_HQ"
        if raw_pw == "Control_Center_HQ":
            print(
                "\n[SECURITY WARNING] Using default admin password 'Control_Center_HQ'.\n"
                "  Set the ATLAS_ADMIN_PASSWORD environment variable or use the setup wizard.\n"
            )
        pw_hash = hash_password(raw_pw)

    # First user is always "owner" – the unremovable super-admin.
    c.execute(
        "INSERT INTO users (username, password_hash, full_name, role, is_active) VALUES (?,?,?,'owner',1)",
        (admin_username, pw_hash, admin_name)
    )

    # Default modules only — no demo/test data
    for mod in ["command_control","alert_system","intelligence","communication",
                "data_logging","hardware_sensors","ai_analytics","user_management",
                "fleet_management","navigation","pager","scheduler","calendar","travel","weather"]:
        c.execute("INSERT OR IGNORE INTO modules (name, enabled) VALUES (?,1)", (mod,))

    # Default chat rooms
    for room in [("general","Allgemein","public"),("ops","Lageraum","public"),("alerts","Alarmkanal","public")]:
        c.execute("INSERT OR IGNORE INTO chat_rooms (name, description, type) VALUES (?,?,?)", room)

    # Default pager config row
    c.execute("INSERT OR IGNORE INTO pager_config (id) VALUES (1)")

    conn.commit()

# ─── WebSocket Manager ───────────────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.connections: dict[int, list[WebSocket]] = {}

    async def connect(self, ws: WebSocket, user_id: int):
        await ws.accept()
        if user_id not in self.connections:
            self.connections[user_id] = []
        self.connections[user_id].append(ws)

    def disconnect(self, ws: WebSocket, user_id: int):
        if user_id in self.connections:
            try:
                self.connections[user_id].remove(ws)
            except ValueError:
                pass
            if not self.connections[user_id]:
                del self.connections[user_id]

    async def broadcast(self, event: dict):
        dead = []
        for uid, wss in self.connections.items():
            for ws in wss:
                try:
                    await ws.send_json(event)
                except Exception:
                    dead.append((uid, ws))
        for uid, ws in dead:
            self.disconnect(ws, uid)

    async def send_to(self, user_id: int, event: dict):
        if user_id in self.connections:
            for ws in self.connections[user_id]:
                try:
                    await ws.send_json(event)
                except Exception:
                    pass

    async def broadcast_bytes(self, data: bytes, exclude_user_id: Optional[int] = None):
        """Relay a raw binary frame (e.g. PCM audio) to all connected clients except the sender."""
        dead = []
        for uid, wss in self.connections.items():
            if uid == exclude_user_id:
                continue
            for ws in wss:
                try:
                    await ws.send_bytes(data)
                except Exception:
                    dead.append((uid, ws))
        for uid, ws in dead:
            self.disconnect(ws, uid)

    async def broadcast_bytes_to_participants(self, data: bytes, participant_ids: set, exclude_user_id: Optional[int] = None):
        """Relay binary frame only to users currently in the voice channel."""
        dead = []
        for uid in participant_ids:
            if uid == exclude_user_id:
                continue
            for ws in self.connections.get(uid, []):
                try:
                    await ws.send_bytes(data)
                except Exception:
                    dead.append((uid, ws))
        for uid, ws in dead:
            self.disconnect(ws, uid)

    def online_users(self) -> list[int]:
        return list(self.connections.keys())

manager = ConnectionManager()

# Track last push per alert to allow 5-second re-emission without spamming DB.
_alert_push_state: dict[int, float] = {}
# Throttle voice chat push notifications.
_last_voice_push: float = 0.0

# ─── Background Tasks ────────────────────────────────────────────────────────

async def pi_sensor_updater():
    """Read Raspberry Pi CPU temperature and voltage, update virtual sensors."""
    while True:
        await asyncio.sleep(get_setting("sensor_update_interval_s", 30))
        try:
            import subprocess as _sp
            conn = get_db()
            # Ensure Pi temp sensor exists
            temp_sensor = conn.execute("SELECT id FROM sensors WHERE name='Pi CPU Temperature' AND type='pi_temp'").fetchone()
            if not temp_sensor:
                c = conn.execute("INSERT INTO sensors (name,type,location,unit,min_val,max_val,status) VALUES ('Pi CPU Temperature','pi_temp','Raspberry Pi','°C',0,100,'online')")
                conn.commit()
                temp_id = c.lastrowid
            else:
                temp_id = temp_sensor["id"]

            volt_sensor = conn.execute("SELECT id FROM sensors WHERE name='Pi CPU Voltage' AND type='pi_voltage'").fetchone()
            if not volt_sensor:
                c2 = conn.execute("INSERT INTO sensors (name,type,location,unit,min_val,max_val,status) VALUES ('Pi CPU Voltage','pi_voltage','Raspberry Pi','V',0,5,'online')")
                conn.commit()
                volt_id = c2.lastrowid
            else:
                volt_id = volt_sensor["id"]

            # Read temperature
            temp_val = None
            try:
                res = _sp.run(["cat", "/sys/class/thermal/thermal_zone0/temp"], capture_output=True, text=True, timeout=2)
                if res.returncode == 0:
                    temp_val = float(res.stdout.strip()) / 1000.0
            except Exception:
                pass
            if temp_val is None:
                try:
                    res2 = _sp.run(["vcgencmd", "measure_temp"], capture_output=True, text=True, timeout=2)
                    if res2.returncode == 0:
                        import re as _re2
                        m = _re2.search(r"temp=([\d.]+)", res2.stdout)
                        if m: temp_val = float(m.group(1))
                except Exception:
                    pass

            # Read voltage
            volt_val = None
            try:
                res3 = _sp.run(["vcgencmd", "measure_volts", "core"], capture_output=True, text=True, timeout=2)
                if res3.returncode == 0:
                    import re as _re3
                    m2 = _re3.search(r"volt=([\d.]+)", res3.stdout)
                    if m2: volt_val = float(m2.group(1))
            except Exception:
                pass

            now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            if temp_val is not None:
                conn.execute("INSERT INTO sensor_readings (sensor_id,value,timestamp) VALUES (?,?,?)", (temp_id, temp_val, now))
                conn.execute("UPDATE sensors SET last_seen=?,status='online' WHERE id=?", (now, temp_id))
                # Alert on high temp
                if temp_val > get_setting("pi_temp_critical_c", 80):
                    existing = conn.execute("SELECT id FROM alerts WHERE source='pi_temp' AND acknowledged=0").fetchone()
                    if not existing:
                        conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES (?,?,?,?)", ('sensor', 'Pi CPU Temperature critical: {:.1f}°C'.format(temp_val), 'critical', 'pi_temp'))
            if volt_val is not None:
                conn.execute("INSERT INTO sensor_readings (sensor_id,value,timestamp) VALUES (?,?,?)", (volt_id, volt_val, now))
                conn.execute("UPDATE sensors SET last_seen=?,status='online' WHERE id=?", (now, volt_id))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[PiSensor] Error: {e}")
            try:
                conn.close()
            except Exception:
                pass

async def kpi_snapshotter():
    while True:
        await asyncio.sleep(get_setting("kpi_interval_s", 60))
        try:
            conn = get_db()
            metrics = {
                "active_assets": conn.execute("SELECT COUNT(*) as c FROM assets WHERE status='active'").fetchone()["c"],
                "open_incidents": conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status IN ('open','in_progress')").fetchone()["c"],
                "active_alerts": conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0").fetchone()["c"],
                "online_users": len(manager.online_users()),
            }
            for k, v in metrics.items():
                conn.execute("INSERT INTO kpi_snapshots (metric,value) VALUES (?,?)", (k, v))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"KPI snapshot error: {e}")

# Track when each alert was last escalated to avoid spamming broadcasts.
_escalated_at: dict[int, float] = {}

async def alert_escalator():
    while True:
        await asyncio.sleep(30)
        try:
            esc_interval = get_setting("escalate_interval_s", 300)
            esc_age_min  = get_setting("escalate_age_minutes", 15)
            conn = get_db()
            threshold = (datetime.utcnow() - timedelta(minutes=esc_age_min)).strftime("%Y-%m-%d %H:%M:%S")
            old_critical = conn.execute(
                "SELECT * FROM alerts WHERE severity='critical' AND acknowledged=0 AND created_at < ?", (threshold,)
            ).fetchall()
            now_ts = time.time()
            for alert in old_critical:
                alert_id = alert["id"]
                last_esc = _escalated_at.get(alert_id, 0)
                if now_ts - last_esc < esc_interval:
                    continue
                _escalated_at[alert_id] = now_ts
                await manager.broadcast({
                    "type": "alert_escalated",
                    "data": {"id": alert_id, "message": alert["message"], "severity": "critical"}
                })
            existing_ids = {a["id"] for a in old_critical}
            for aid in list(_escalated_at.keys()):
                if aid not in existing_ids:
                    del _escalated_at[aid]
            conn.close()
        except Exception as e:
            print(f"Escalator error: {e}")

async def session_cleaner():
    while True:
        cleaner_interval = get_setting("session_cleaner_interval_s", 300)
        await asyncio.sleep(cleaner_interval)
        try:
            idle_hours = get_setting("session_idle_hours", 2)
            conn = get_db()
            conn.execute("DELETE FROM sessions WHERE expires_at < datetime('now')")
            conn.execute(f"DELETE FROM sessions WHERE last_active < datetime('now', '-{idle_hours} hours')")
            conn.execute("DELETE FROM ip_blacklist WHERE blocked_until < datetime('now')")
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Session cleaner error: {e}")


async def health_check_loop():
    """Background task: collect system metrics periodically."""
    await asyncio.sleep(5)
    while True:
        try:
            await _run_health_check()
        except Exception as e:
            print(f"Health check loop error: {e}")
        await asyncio.sleep(get_setting("health_check_interval_s", 10))


async def alert_resender():
    """Re-send pushes periodically for unacknowledged alerts."""
    global _alert_push_state
    while True:
        resend_interval = get_setting("alert_resend_interval_s", 5)
        await asyncio.sleep(resend_interval)
        try:
            now_ts = time.time()
            conn = get_db()
            rows = conn.execute(
                "SELECT id, message, severity FROM alerts WHERE acknowledged=0 ORDER BY created_at DESC LIMIT 20"
            ).fetchall()
            conn.close()
            for r in rows:
                last_sent = _alert_push_state.get(r["id"], 0)
                if now_ts - last_sent < resend_interval:
                    continue
                sev = r["severity"] or "info"
                sound = "emergency_siren" if sev == "critical" else ""
                await broadcast_push_notification(
                    title=("🚨 CRITICAL" if sev == "critical" else "🔔 Atlas"),
                    body=r["message"],
                    severity=sev,
                    alert_id=r["id"],
                    url="/#/alerts",
                    sound_name=sound
                )
                _alert_push_state[r["id"]] = now_ts
        except Exception as e:
            print(f"[AlertResender] Error: {e}")

# ─── NINA / MoWaS Warn-Monitor ────────────────────────────────────────────────
# Polls the German NINA/BBK warning API every 2 minutes.
# On new EXTREME / SEVERE warning → triggers max emergency broadcast.

_nina_state: dict = {"last_check": None, "active_ids": [], "error": None}

async def nina_monitor():
    """Background task: poll NINA API and trigger emergency alert on new warnings."""
    import urllib.request as _ur
    NINA_URL = "https://nina.api.bund.de/api31/dashboard/05916000000000.json"
    # 05916000000000 = NRW-Bundesebene (Bundesweit level-0 warnings)
    # We use a broad national endpoint. Admins can override via config.
    global _nina_state
    while True:
        await asyncio.sleep(get_setting("nina_interval_s", 120))
        if not CONFIG.get("nina_enabled", True):
            continue
        try:
            nina_url = CONFIG.get("nina_url", "https://nina.api.bund.de/api31/dashboard/053150000000.json")
            loop = asyncio.get_running_loop()
            def fetch():
                req = _ur.Request(nina_url, headers={"User-Agent": "AtlasControlCenter/1.0"})
                with _ur.urlopen(req, timeout=10) as r:
                    return json.loads(r.read().decode())
            data = await loop.run_in_executor(None, fetch)
            _nina_state["last_check"] = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            _nina_state["error"] = None

            new_ids: list[str] = []
            triggered = False
            for item in (data if isinstance(data, list) else []):
                warn_id = item.get("id", "")
                payload = item.get("payload", {})
                warn = payload.get("warning", payload.get("update", {}))
                severity_raw = warn.get("severity", "")  # Extreme, Severe, Moderate, Minor
                event = warn.get("event", "")
                headline = warn.get("headline", event)
                if warn_id:
                    new_ids.append(warn_id)

                # Only react to Extreme or Severe warnings not yet seen.
                # Compare against a set for O(1) lookup.
                seen_set = set(_nina_state["active_ids"])
                if severity_raw in ("Extreme", "Severe") and warn_id and warn_id not in seen_set:
                    triggered = True
                    msg = f"NINA-Warnung: {headline or event} [{severity_raw}]"
                    print(f"[NINA] New {severity_raw} warning: {msg}")
                    conn = get_db()
                    conn.execute(
                        "INSERT INTO alerts (type,message,severity,source) VALUES ('nina',?,?,?)",
                        (msg, "critical", f"nina:{warn_id[:20]}")
                    )
                    aid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
                    conn.commit()
                    conn.close()
                    alert_data = {"id": aid, "type": "nina", "message": msg, "severity": "critical",
                                  "source": f"nina:{warn_id[:20]}", "acknowledged": 0,
                                  "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")}
                    await manager.broadcast({"type": "alert_new", "data": alert_data})
                    await manager.broadcast({"type": "emergency_broadcast", "data": {
                        "title": f"⚠ NINA: {severity_raw.upper()}",
                        "message": msg,
                        "source": "nina"
                    }})
                    await broadcast_push_notification(
                        title=f"⚠ NINA: {severity_raw.upper()}",
                        body=msg,
                        severity="critical",
                        alert_id=aid,
                        url="/#/alerts"
                    )
                    asyncio.create_task(_dispatch_all_channels(alert_data))

            # Merge new IDs into existing set so we never lose previously seen IDs
            # within the same run.  Cleared only on restart (in-memory state).
            _nina_state["active_ids"] = list(set(_nina_state["active_ids"]) | set(new_ids))
        except Exception as e:
            _nina_state["error"] = str(e)
            print(f"[NINA] Monitor error: {e}")

async def check_fleet_alerts():
    while True:
        await asyncio.sleep(get_setting("fleet_check_interval_s", 3600))
        try:
            conn = get_db()
            insur_warn = get_setting("fleet_insur_warn_days", 30)
            insur_crit = get_setting("fleet_insur_crit_days", 7)
            tuev_warn  = get_setting("fleet_tuev_warn_days", 14)
            tuev_crit  = get_setting("fleet_tuev_crit_days", 7)
            soon   = (datetime.utcnow() + timedelta(days=insur_warn)).strftime("%Y-%m-%d")
            urgent = (datetime.utcnow() + timedelta(days=tuev_warn)).strftime("%Y-%m-%d")
            vehicles = conn.execute("SELECT * FROM fleet_vehicles").fetchall()
            for v in vehicles:
                if v["insurance_expiry"] and v["insurance_expiry"] <= soon:
                    try:
                        days = (datetime.strptime(v["insurance_expiry"], "%Y-%m-%d") - datetime.utcnow()).days
                        sev = "critical" if days <= insur_crit else "warning"
                        msg = f"Insurance expires in {days} days: {v['name']}"
                        existing = conn.execute("SELECT id FROM alerts WHERE message=? AND acknowledged=0", (msg,)).fetchone()
                        if not existing:
                            conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES ('fleet',?,?,'fleet:insurance')", (msg, sev))
                    except ValueError:
                        pass  # Malformed date in DB – skip silently
                if v["tuev_expiry"] and v["tuev_expiry"] <= urgent:
                    try:
                        days = (datetime.strptime(v["tuev_expiry"], "%Y-%m-%d") - datetime.utcnow()).days
                        sev = "critical" if days <= tuev_crit else "warning"
                        msg = f"TÜV expires in {days} days: {v['name']}"
                        existing = conn.execute("SELECT id FROM alerts WHERE message=? AND acknowledged=0", (msg,)).fetchone()
                        if not existing:
                            conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES ('fleet',?,?,'fleet:tuev')", (msg, sev))
                    except ValueError:
                        pass  # Malformed date in DB – skip silently
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Fleet alert check error: {e}")

# ─── Pager / Notification Dispatch ────────────────────────────────────────────

def _get_pager_config() -> dict:
    """Return current pager_config row as dict."""
    conn = get_db()
    row = conn.execute("SELECT * FROM pager_config WHERE id=1").fetchone()
    conn.close()
    return dict(row) if row else {}

async def _send_dapnet(text: str, callsigns: list, transmitter_group: str,
                       callsign: str, password: str, emergency: bool = False) -> bool:
    """Send message to real pager devices via DAPNET API (hampager.de)."""
    if not callsigns or not callsign or not password:
        return False
    try:
        import urllib.request, base64, json as _json
        payload = _json.dumps({
            "text": text[:80],  # POCSAG limit
            "callSignNames": callsigns,
            "transmitterGroupNames": [transmitter_group or "dl-all"],
            "emergency": emergency,
        }).encode()
        creds = base64.b64encode(f"{callsign}:{password}".encode()).decode()
        req = urllib.request.Request(
            "http://www.hampager.de:8080/calls",
            data=payload,
            headers={"Content-Type": "application/json", "Authorization": f"Basic {creds}"},
            method="POST"
        )
        loop = asyncio.get_running_loop()
        def do_request():
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status
        status = await loop.run_in_executor(None, do_request)
        print(f"[DAPNET] Sent → {callsigns}: HTTP {status}")
        return status in (200, 201, 204)
    except Exception as e:
        print(f"[DAPNET] Error: {e}")
        return False

async def _send_gotify(title: str, body: str, priority: int = 5, url: str = "", token: str = "") -> bool:
    """Send push notification via Gotify server."""
    if not url or not token:
        return False
    try:
        import urllib.request as _ur
        import urllib.parse as _up
        gotify_url = f"{url.rstrip('/')}/message?token={_up.quote(token)}"
        payload = json.dumps({"title": title[:250], "message": body, "priority": priority}).encode("utf-8")
        req = _ur.Request(gotify_url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        loop = asyncio.get_running_loop()
        status = await loop.run_in_executor(None, lambda: _ur.urlopen(req, timeout=10).status)
        print(f"[Gotify] Sent to {url}: HTTP {status}")
        return status in (200, 201)
    except Exception as e:
        print(f"[Gotify] Error: {e}")
        return False

async def _send_ntfy(title: str, body: str, priority: str = "default",
                     url: str = "", topic: str = "atlas-alerts", token: str = "") -> bool:
    """Send push notification via self-hosted ntfy server."""
    if not url or not topic:
        return False
    try:
        import urllib.request as _ur
        ntfy_url = f"{url.rstrip('/')}/{topic}"
        headers = {
            "Title": title[:250],
            "Priority": priority,  # min/low/default/high/urgent
            "Tags": "pager,atlas",
            "Content-Type": "text/plain; charset=utf-8",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"
        data = body.encode("utf-8")
        req = _ur.Request(ntfy_url, data=data, headers=headers, method="POST")
        loop = asyncio.get_running_loop()
        def do_req():
            with _ur.urlopen(req, timeout=10) as resp:
                return resp.status
        status = await loop.run_in_executor(None, do_req)
        print(f"[ntfy] Sent to {ntfy_url}: HTTP {status}")
        return status in (200, 201, 204)
    except Exception as e:
        print(f"[ntfy] Error: {e}")
        return False

async def _send_apprise(title: str, body: str, urls_text: str) -> bool:
    """Send notification to all apprise URLs (Telegram, Email, Discord, etc.)."""
    if not urls_text or not urls_text.strip():
        return False
    try:
        import apprise as _apprise
        ap = _apprise.Apprise()
        for line in urls_text.strip().splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                ap.add(line)
        if len(ap) == 0:
            return False
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, lambda: ap.notify(body=body, title=title))
        print(f"[Apprise] Sent to {len(ap)} services: {'OK' if result else 'FAIL'}")
        return result
    except ImportError:
        print("[Apprise] Not installed. Run: pip3 install apprise")
        return False
    except Exception as e:
        print(f"[Apprise] Error: {e}")
        return False

async def _dispatch_all_channels(alert_data: dict):
    """Central dispatcher: send alert to all configured notification channels."""
    cfg = _get_pager_config()
    if not cfg:
        return

    channels = json.loads(cfg.get("channels", '["webpush"]'))
    severity = alert_data.get("severity", "info")
    title = f"Atlas Alert – {severity.upper()}"
    body = alert_data.get("message", "")

    # ntfy priority mapping
    ntfy_prio = {"critical": "urgent", "warning": "high", "info": "default"}.get(severity, "default")

    # DAPNET: only send for configured severities
    dapnet_sevs = [s.strip() for s in cfg.get("dapnet_on_severity", "critical,warning").split(",")]

    tasks = []

    if "ntfy" in channels and cfg.get("ntfy_enabled") and cfg.get("ntfy_url"):
        tasks.append(_send_ntfy(
            title=title, body=body, priority=ntfy_prio,
            url=cfg["ntfy_url"], topic=cfg.get("ntfy_topic", "atlas-alerts"),
            token=cfg.get("ntfy_token", "")
        ))

    if "dapnet" in channels and cfg.get("dapnet_enabled") and severity in dapnet_sevs:
        try:
            callsigns = json.loads(cfg.get("dapnet_target_callsigns", "[]"))
        except Exception:
            callsigns = []
        if callsigns:
            tasks.append(_send_dapnet(
                text=f"{severity.upper()}: {body}"[:80],
                callsigns=callsigns,
                transmitter_group=cfg.get("dapnet_transmitter_group", "dl-all"),
                callsign=cfg.get("dapnet_callsign", ""),
                password=cfg.get("dapnet_password", ""),
                emergency=(severity == "critical"),
            ))

    if "apprise" in channels and cfg.get("apprise_enabled") and cfg.get("apprise_urls"):
        tasks.append(_send_apprise(title=title, body=body, urls_text=cfg["apprise_urls"]))
    if "gotify" in channels and cfg.get("gotify_enabled") and cfg.get("gotify_url"):
        tasks.append(_send_gotify(
            title=title, body=body,
            priority=int(cfg.get("gotify_priority", 5)),
            url=cfg["gotify_url"], token=cfg.get("gotify_token", "")
        ))

    if tasks:
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for i, r in enumerate(results):
            if isinstance(r, Exception):
                print(f"[Dispatch] Channel {i} error: {r}")

# ─── POCSAG Receiver ──────────────────────────────────────────────────────────

import re as _re
import subprocess as _subprocess

_rx_proc: Optional[_subprocess.Popen] = None
_rx_last: dict = {"received_at": None, "count": 0, "running": False}

async def pocsag_receiver():
    """Background task: receive POCSAG via RTL-SDR + multimon-ng."""
    global _rx_proc, _rx_last
    while True:
        try:
            conn = get_db()
            row = conn.execute("SELECT * FROM pager_config WHERE id=1").fetchone()
            conn.close()
            cfg = dict(row) if row else {}
            rx_enabled = bool(cfg.get("rx_enabled", 0))
        except Exception:
            rx_enabled = False

        if not rx_enabled:
            if _rx_proc and _rx_proc.poll() is None:
                _rx_proc.terminate()
                _rx_proc = None
                _rx_last["running"] = False
            await asyncio.sleep(5)
            continue

        # Start receiver process if not running
        freq = cfg.get("rx_frequency", 439.9875)
        gain = cfg.get("rx_gain", 40)
        if _rx_proc is None or _rx_proc.poll() is not None:
            cmd = (
                f"rtl_fm -F 0 -E dc -M fm -s 22050 -f {freq}M -g {gain} 2>/dev/null"
                " | multimon-ng -t raw -a POCSAG512 -a POCSAG1200 -a POCSAG2400 -f alpha -q /dev/stdin"
            )
            try:
                _rx_proc = _subprocess.Popen(
                    cmd, shell=True, stdout=_subprocess.PIPE, stderr=_subprocess.DEVNULL,
                    preexec_fn=None
                )
                _rx_last["running"] = True
                print(f"[POCSAG] Receiver started on {freq} MHz")
            except Exception as e:
                print(f"[POCSAG] Failed to start: {e}")
                await asyncio.sleep(10)
                continue

        # Read a line (non-blocking via executor)
        loop = asyncio.get_running_loop()
        try:
            line = await asyncio.wait_for(
                loop.run_in_executor(None, _rx_proc.stdout.readline),
                timeout=2.0
            )
            line = line.decode("utf-8", errors="replace").strip()
        except asyncio.TimeoutError:
            await asyncio.sleep(0.1)
            continue
        except Exception:
            _rx_proc = None
            await asyncio.sleep(2)
            continue

        if not line:
            await asyncio.sleep(0.1)
            continue

        # Parse POCSAG output: POCSAG1200 ALPHA Address: 1234567 Sub:0 Alpha:   Hello World
        m = _re.search(r"(POCSAG\d+)\s+ALPHA\s+Address:\s*(\d+)\s+Sub:\d+\s+Alpha:\s*(.*)", line)
        if m:
            protocol, capcode, message = m.group(1), m.group(2), m.group(3).strip()
            if not message or message == "<NUL>":
                continue
            # Capcode filter
            try:
                filters = json.loads(cfg.get("rx_filter_capcodes", "[]"))
                if filters and capcode not in filters:
                    continue
            except Exception:
                pass

            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            _rx_last["received_at"] = now_str
            _rx_last["count"] += 1

            try:
                conn = get_db()
                try:
                    # Create alert if configured
                    alert_id = None
                    if cfg.get("rx_create_alerts", 1):
                        conn.execute(
                            "INSERT INTO alerts (type,message,severity,source) VALUES ('pager',?,?,?)",
                            (f"[{capcode}] {message}", "info", f"pocsag:{protocol}")
                        )
                        alert_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
                    # Store message
                    conn.execute(
                        "INSERT INTO pager_rx_messages (capcode,message,frequency,protocol,raw_line,alert_id) VALUES (?,?,?,?,?,?)",
                        (capcode, message, freq, protocol, line, alert_id)
                    )
                    conn.commit()
                    msg_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
                finally:
                    conn.close()
                # Broadcast to WebSocket clients
                await manager.broadcast({
                    "type": "pager_rx",
                    "data": {
                        "id": msg_id, "capcode": capcode, "message": message,
                        "protocol": protocol, "frequency": freq,
                        "received_at": now_str, "alert_id": alert_id,
                    }
                })
                print(f"[POCSAG] RX [{capcode}] {message[:60]}")
            except Exception as e:
                print(f"[POCSAG] DB error: {e}")

        await asyncio.sleep(0)

# ─── Scheduler ────────────────────────────────────────────────────────────────

async def scheduled_items_runner():
    """Background task: fire scheduled alerts and incidents at configured times."""
    while True:
        await asyncio.sleep(get_setting("scheduled_check_interval_s", 30))
        try:
            now = datetime.utcnow()
            now_str = now.strftime("%Y-%m-%d %H:%M:%S")
            conn = get_db()
            due = conn.execute(
                "SELECT * FROM scheduled_items WHERE enabled=1 AND next_run <= ?", (now_str,)
            ).fetchall()

            for item in due:
                try:
                    item = dict(item)
                    # Fire the item
                    if item["type"] == "alert":
                        conn.execute(
                            "INSERT INTO alerts (type,message,severity,source) VALUES ('scheduled',?,?,?)",
                            (item["title"], item["severity"], "scheduler")
                        )
                        a_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
                        a_row = {"id": a_id, "type": "scheduled", "message": item["title"],
                                 "severity": item["severity"], "source": "scheduler",
                                 "acknowledged": 0, "created_at": now_str}
                        await manager.broadcast({"type": "alert_new", "data": a_row})
                        if item["severity"] in ("warning", "critical"):
                            await broadcast_push_notification(
                                title=item["title"],
                                body=item.get("description", ""),
                                severity=item["severity"],
                                alert_id=a_id,
                                url="/#/alerts"
                            )
                            await _dispatch_all_channels(a_row)
                    elif item["type"] == "incident":
                        conn.execute(
                            "INSERT INTO incidents (title,description,severity,status) VALUES (?,?,?,?)",
                            (item["title"], item.get("description") or "", item["severity"], "open")
                        )
                        inc_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
                        await manager.broadcast({"type": "incident_new", "data": {
                            "id": inc_id, "title": item["title"], "severity": item["severity"],
                            "status": "open", "created_at": now_str
                        }})

                    # Compute next_run based on recurrence
                    recdata = {}
                    try:
                        recdata = json.loads(item.get("recurrence_data") or "{}")
                    except Exception:
                        pass

                    rec = item.get("recurrence", "once")
                    next_run = None
                    if rec == "once":
                        # Disable after firing
                        conn.execute(
                            "UPDATE scheduled_items SET enabled=0, last_run=?, run_count=run_count+1 WHERE id=?",
                            (now_str, item["id"])
                        )
                    elif rec == "daily":
                        next_dt = now + timedelta(days=1)
                        next_run = next_dt.strftime("%Y-%m-%d %H:%M:%S")
                    elif rec == "weekly":
                        next_dt = now + timedelta(weeks=1)
                        next_run = next_dt.strftime("%Y-%m-%d %H:%M:%S")
                    elif rec == "hourly":
                        next_dt = now + timedelta(hours=1)
                        next_run = next_dt.strftime("%Y-%m-%d %H:%M:%S")
                    elif rec == "interval":
                        minutes = int(recdata.get("minutes", 60))
                        next_dt = now + timedelta(minutes=minutes)
                        next_run = next_dt.strftime("%Y-%m-%d %H:%M:%S")

                    if next_run:
                        conn.execute(
                            "UPDATE scheduled_items SET last_run=?, next_run=?, run_count=run_count+1 WHERE id=?",
                            (now_str, next_run, item["id"])
                        )
                    conn.commit()
                    print(f"[Scheduler] Fired '{item['title']}' (type={item['type']}, rec={rec})")
                except Exception as e:
                    print(f"[Scheduler] Error firing item {item.get('id')}: {e}")

            conn.close()
        except Exception as e:
            print(f"[Scheduler] Loop error: {e}")

# ─── Auth ─────────────────────────────────────────────────────────────────────

# ── Password complexity ───────────────────────────────────────────────────────
import re as _re

def _validate_password_complexity(password: str) -> None:
    """Raise HTTP 400 if the password does not meet complexity requirements.

    Rules:
      • Minimum 8 characters
      • At least one uppercase letter (A-Z)
      • At least one digit (0-9)
      • At least one special character (!@#$%^&*…)
    """
    if len(password) < 8:
        raise HTTPException(400, "Passwort muss mindestens 8 Zeichen lang sein")
    if not _re.search(r"[A-Z]", password):
        raise HTTPException(400, "Passwort muss mindestens einen Großbuchstaben enthalten")
    if not _re.search(r"\d", password):
        raise HTTPException(400, "Passwort muss mindestens eine Zahl enthalten")
    if not _re.search(r"[!@#$%^&*()\-_=+\[\]{}|;:',.<>?/`~\"\\]", password):
        raise HTTPException(400, "Passwort muss mindestens ein Sonderzeichen enthalten")

# Simple in-memory brute-force protection for the login endpoint.
# Tracks failed attempts per IP address.  No external dependencies required.
_login_attempts: dict[str, list[float]] = {}
# These are now read from system_settings at runtime via get_setting().
# Defaults here are only used if the DB hasn't been initialised yet.
_LOGIN_MAX_ATTEMPTS    = 10
_LOGIN_WINDOW_SECONDS  = 300
_LOGIN_LOCKOUT_SECONDS = 600
_IP_BLACKLIST_THRESHOLD  = 20
_IP_BLACKLIST_DURATION_H = 24

def _is_ip_blacklisted(ip: str) -> bool:
    """Check if the IP is in the persistent blacklist table."""
    try:
        conn = get_db()
        row = conn.execute(
            "SELECT 1 FROM ip_blacklist WHERE ip=? AND blocked_until > datetime('now')", (ip,)
        ).fetchone()
        conn.close()
        return row is not None
    except Exception:
        return False

def _check_login_rate_limit(ip: str) -> None:
    """Raise HTTP 429 if the IP has exceeded the allowed login attempt rate."""
    if _is_ip_blacklisted(ip):
        raise HTTPException(429, "IP address is temporarily blacklisted. Please try again later.")
    max_att  = get_setting("login_max_attempts",    _LOGIN_MAX_ATTEMPTS)
    window_s = get_setting("login_window_seconds",  _LOGIN_WINDOW_SECONDS)
    lockout  = get_setting("login_lockout_seconds", _LOGIN_LOCKOUT_SECONDS)
    now = time.time()
    attempts = _login_attempts.get(ip, [])
    attempts = [t for t in attempts if now - t < lockout]
    recent   = [t for t in attempts if now - t < window_s]
    _login_attempts[ip] = attempts
    if len(recent) >= max_att:
        raise HTTPException(429, "Too many failed login attempts. Please try again later.")

def _record_failed_login(ip: str) -> None:
    """Record a failed login attempt for the given IP. Persist to DB after threshold."""
    threshold = get_setting("ip_blacklist_threshold",  _IP_BLACKLIST_THRESHOLD)
    duration_h = get_setting("ip_blacklist_duration_h", _IP_BLACKLIST_DURATION_H)
    now = time.time()
    attempts = _login_attempts.get(ip, [])
    attempts.append(now)
    _login_attempts[ip] = attempts
    if len(attempts) >= threshold:
        try:
            conn = get_db()
            blocked_until = (datetime.utcnow() + timedelta(hours=duration_h)).strftime("%Y-%m-%d %H:%M:%S")
            conn.execute(
                "INSERT OR REPLACE INTO ip_blacklist (ip, reason, blocked_until) VALUES (?,?,?)",
                (ip, "brute_force", blocked_until)
            )
            conn.commit()
            conn.close()
            print(f"[Security] IP {ip} blacklisted until {blocked_until} after {len(attempts)} failed attempts.")
        except Exception as e:
            print(f"[Security] Failed to blacklist IP: {e}")

def _clear_login_attempts(ip: str) -> None:
    """Clear recorded failed attempts after a successful login."""
    _login_attempts.pop(ip, None)

def _compute_device_fingerprint(request: Request) -> str:
    """Create a lightweight device fingerprint from request headers."""
    ua = request.headers.get("User-Agent", "")
    lang = request.headers.get("Accept-Language", "")
    enc = request.headers.get("Accept-Encoding", "")
    raw = f"{ua}|{lang}|{enc}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]

def create_token(user_id: int, fingerprint: str = None, ip: str = None) -> str:
    token = secrets.token_urlsafe(32)
    conn = get_db()
    try:
        ttl_h = get_setting("session_ttl_hours", 24)
        max_sess = get_setting("max_sessions_per_user", 10)
        expires = (datetime.utcnow() + timedelta(hours=ttl_h)).strftime("%Y-%m-%d %H:%M:%S")
        existing = conn.execute(
            "SELECT token FROM sessions WHERE user_id=? AND expires_at > datetime('now') ORDER BY last_active ASC",
            (user_id,)
        ).fetchall()
        if len(existing) >= max_sess:
            oldest_tokens = [r["token"] for r in existing[:len(existing) - max_sess + 1]]
            conn.execute(
                f"DELETE FROM sessions WHERE token IN ({','.join('?' * len(oldest_tokens))})",
                oldest_tokens
            )
        conn.execute(
            "INSERT INTO sessions (token, user_id, expires_at, device_fingerprint, last_active, ip_addr) VALUES (?,?,?,?,datetime('now'),?)",
            (token, user_id, expires, fingerprint, ip)
        )
        conn.commit()
    except Exception as e:
        print(f"[create_token] DB error: {e}")
        raise
    finally:
        conn.close()
    return token

def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    # Also accept ?token=... query parameter (for browser-opened URLs like HTML reports)
    token = None
    if auth.startswith("Bearer "):
        token = auth[7:]
    else:
        token = request.query_params.get("token")
    if not token:
        raise HTTPException(401, "Unauthorized")
    conn = get_db()
    session = conn.execute(
        "SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token=? AND s.expires_at > datetime('now')",
        (token,)
    ).fetchone()
    if not session:
        conn.close()
        raise HTTPException(401, "Invalid or expired token")
    # Idle timeout check: if last_active is more than 2 hours ago, invalidate
    last_active = session["last_active"] if "last_active" in session.keys() else None
    if last_active:
        try:
            la_dt = datetime.strptime(last_active, "%Y-%m-%d %H:%M:%S")
            if (datetime.utcnow() - la_dt).total_seconds() > 7200:  # 2 hours idle
                conn.execute("DELETE FROM sessions WHERE token=?", (token,))
                conn.commit()
                conn.close()
                raise HTTPException(401, "Session expired due to inactivity")
        except HTTPException:
            raise
        except Exception:
            pass
    # Update last_active on each request
    try:
        conn.execute("UPDATE sessions SET last_active=datetime('now') WHERE token=?", (token,))
        conn.commit()
    except Exception:
        pass
    result = dict(session)
    conn.close()
    return result

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] not in ("admin", "owner"):
        raise HTTPException(403, "Admin required")
    return user

def require_owner(user: dict = Depends(get_current_user)) -> dict:
    """Only the owner (first-created admin) can perform this action."""
    if user["role"] != "owner":
        raise HTTPException(403, "Owner role required")
    return user

def _safe_json_loads(s, default=None):
    """Parse JSON string, return `default` on any error."""
    if s is None:
        return default if default is not None else {}
    try:
        return json.loads(s)
    except (json.JSONDecodeError, TypeError):
        return default if default is not None else {}

def log_action(user_id: int, action: str, details: dict = None, ip: str = None):
    conn = get_db()
    try:
        conn.execute("INSERT INTO event_log (action,user_id,details,ip_addr) VALUES (?,?,?,?)",
                     (action, user_id, json.dumps(details or {}), ip))
        conn.commit()
    except Exception as e:
        print(f"[log_action] DB error: {e}")
    finally:
        conn.close()

# ─── App Lifecycle ─────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    _record_first_run()
    init_db()
    _tasks = [
        asyncio.create_task(kpi_snapshotter()),
        asyncio.create_task(alert_escalator()),
        asyncio.create_task(alert_resender()),
        asyncio.create_task(session_cleaner()),
        asyncio.create_task(check_fleet_alerts()),
        asyncio.create_task(pocsag_receiver()),
        asyncio.create_task(pi_sensor_updater()),
        asyncio.create_task(scheduled_items_runner()),
        asyncio.create_task(nina_monitor()),
        asyncio.create_task(health_check_loop()),
        asyncio.create_task(_ai_background_loop()),
    ]
    print(f"\n{'='*55}")
    print(f"  {APP_NAME} v{APP_VERSION}")
    print(f"  © {NEXUS_COPYRIGHT}")
    print(f"  Running at: http://0.0.0.0:{CONFIG.get('port', 8000)}")
    print(f"  Organization: {CONFIG.get('org_name', 'ControlCenterHQ')}")
    print(f"{'='*55}\n")
    yield
    # Graceful shutdown – cancel all background tasks
    for t in _tasks:
        t.cancel()
    await asyncio.gather(*_tasks, return_exceptions=True)

app = FastAPI(title=APP_NAME, version=APP_VERSION, lifespan=lifespan)

# CORS: restrict to same host in production.
# Override via config.json key "cors_origins" (list of allowed origins).
# Example: {"cors_origins": ["https://my-atlas.example.com"]}
_cors_origins: list = CONFIG.get("cors_origins", None)
if not _cors_origins:
    # Default: allow only the same host (relative), expressed as a wildcard
    # only when no explicit list is configured. For production deployments,
    # set cors_origins in config.json to your actual domain(s).
    _cors_origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    # allow_credentials=True is incompatible with allow_origins=["*"].
    # The browser rejects credentialed requests when the server echoes "*" as
    # the allowed origin. Since the app uses Bearer tokens in the Authorization
    # header (not cookies), credentials=False is correct here.
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

static_path = BASE_DIR / "static"
static_path.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# ─── Kill Switch / Lockdown ───────────────────────────────────────────────────
# When LOCKDOWN_MODE is True all non-owner API requests are rejected (HTTP 503).
# Activated by POST /api/system/lockdown (owner only), deactivated by DELETE.
LOCKDOWN_MODE: bool = False
LOCKDOWN_EXEMPT = {"/api/auth/login", "/api/setup/status", "/api/setup/complete",
                   "/api/license/validate",
                   "/", "/api/info"}

# ─── Global API Rate Limiter ──────────────────────────────────────────────────
# Per-IP sliding window: max 300 requests per 60 seconds.
# Keeps a small in-memory deque per IP. Resets on restart (acceptable trade-off).
import collections
_API_RATE: dict[str, collections.deque] = {}
_API_RATE_MAX  = 300   # requests
_API_RATE_WINDOW = 60  # seconds

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """Enforce lockdown mode and per-IP API rate limiting."""
    path = request.url.path

    # ── Lockdown gate ────────────────────────────────────────────────────────
    if LOCKDOWN_MODE and path not in LOCKDOWN_EXEMPT and not path.startswith("/static"):
        # Allow owner through even in lockdown
        auth = request.headers.get("Authorization", "")
        token = auth.removeprefix("Bearer ").strip() or request.query_params.get("token","")
        if token:
            try:
                from starlette.datastructures import Headers
                conn = get_db()
                row = conn.execute(
                    "SELECT u.role FROM sessions s JOIN users u ON s.user_id=u.id "
                    "WHERE s.token=? AND s.expires_at > datetime('now')", (token,)
                ).fetchone()
                conn.close()
                if row and row["role"] == "owner":
                    return await call_next(request)
            except Exception:
                pass
        return JSONResponse({"detail": "System is in lockdown mode. Contact the owner."}, status_code=503)

    # ── License enforcement (API paths only, exempt: auth + license + setup) ──
    _LICENSE_EXEMPT = {"/api/auth/login", "/api/auth/logout", "/api/setup/status",
                       "/api/setup/complete", "/api/license", "/api/license/check",
                       "/api/license/validate", "/api/info"}
    if (path.startswith("/api/") and
        path not in _LICENSE_EXEMPT and
        not path.startswith("/api/license") and
        not path.startswith("/api/auth/") and
        not path.startswith("/api/setup/")):
        if not is_license_valid() and not is_grace_period_active():
            cfg = load_config()
            first_run = cfg.get("first_run_at", "")
            return JSONResponse(
                {"detail": "license_required",
                 "message": "Keine gültige Lizenz aktiv. Bitte Key in den Einstellungen eingeben.",
                 "first_run_at": first_run},
                status_code=402
            )

    # ── Rate limiting (API paths only) ───────────────────────────────────────
    if path.startswith("/api/"):
        ip = (request.client.host if request.client else "unknown")
        rate_max    = get_setting("api_rate_max",    300)
        rate_window = get_setting("api_rate_window", 60)
        now = time.time()
        dq = _API_RATE.setdefault(ip, collections.deque())
        while dq and now - dq[0] > rate_window:
            dq.popleft()
        if len(dq) >= rate_max:
            return JSONResponse(
                {"detail": f"Rate limit exceeded. Max {rate_max} requests per {rate_window}s."},
                status_code=429
            )
        dq.append(now)

    return await call_next(request)

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """Add hardening HTTP security headers to every response."""
    response = await call_next(request)
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-XSS-Protection", "1; mode=block")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
    response.headers.setdefault("Content-Security-Policy", (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self' wss: ws:; "
        "frame-ancestors 'none';"
    ))
    response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    index = static_path / "index.html"
    if index.exists():
        return HTMLResponse(index.read_text())
    return HTMLResponse("<h1>ControlCenterHQ</h1><p>Static files not found.</p>")

@app.get("/api/info")
async def api_info():
    org = CONFIG.get("org_name", "ControlCenterHQ")
    return {
        "app": APP_NAME,
        "app_name": APP_NAME,
        "version": APP_VERSION,
        "copyright": NEXUS_COPYRIGHT,
        "org": org,
        "org_name": org,
        "facility": CONFIG.get("facility_type", "operations"),
    }

# ─── Icon Routes (for Push Notification icons – served as SVG) ────────────────

_ICON_SVG_192 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="#0f3460"/>
  <rect x="16" y="16" width="160" height="160" rx="24" fill="#16213e"/>
  <circle cx="96" cy="96" r="56" fill="none" stroke="#00ff88" stroke-width="6"/>
  <circle cx="96" cy="96" r="40" fill="none" stroke="#00ff88" stroke-width="3" stroke-dasharray="8 4"/>
  <circle cx="96" cy="96" r="10" fill="#00ff88"/>
  <line x1="96" y1="40" x2="96" y2="60" stroke="#00ff88" stroke-width="4" stroke-linecap="round"/>
  <line x1="96" y1="132" x2="96" y2="152" stroke="#00ff88" stroke-width="4" stroke-linecap="round"/>
  <line x1="40" y1="96" x2="60" y2="96" stroke="#00ff88" stroke-width="4" stroke-linecap="round"/>
  <line x1="132" y1="96" x2="152" y2="96" stroke="#00ff88" stroke-width="4" stroke-linecap="round"/>
</svg>"""

_BADGE_SVG_96 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="16" fill="#0f3460"/>
  <circle cx="48" cy="48" r="28" fill="none" stroke="#00ff88" stroke-width="5"/>
  <circle cx="48" cy="48" r="8" fill="#00ff88"/>
</svg>"""

@app.get("/static/icons/icon-192.png")
async def icon_192():
    return Response(content=_ICON_SVG_192.encode(), media_type="image/svg+xml",
                    headers={"Cache-Control": "public, max-age=86400"})

@app.get("/static/icons/badge-96.png")
async def badge_96():
    return Response(content=_BADGE_SVG_96.encode(), media_type="image/svg+xml",
                    headers={"Cache-Control": "public, max-age=86400"})

# Auth
@app.post("/api/auth/login")
async def login(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    # Enforce rate-limit before even parsing the body
    _check_login_rate_limit(client_ip)
    body = await request.json()
    username = body.get("username", "").strip()
    password = body.get("password", "")
    if not username or not password:
        raise HTTPException(400, "Username and password required")
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username=? AND is_active=1", (username,)).fetchone()
    conn.close()
    if not user or not verify_password(password, user["password_hash"]):
        _record_failed_login(client_ip)
        # Use 400 (Bad Request) not 401 (Unauthorized) for wrong credentials.
        # 401 is reserved for "no/expired session token" and triggers automatic
        # logout in the frontend, which would clear the login form silently.
        raise HTTPException(400, "Invalid credentials")
    _clear_login_attempts(client_ip)
    fingerprint = _compute_device_fingerprint(request)
    token = create_token(user["id"], fingerprint=fingerprint, ip=client_ip)
    conn = get_db()
    try:
        conn.execute("UPDATE users SET last_seen=datetime('now') WHERE id=?", (user["id"],))
        # Store login location for new-device detection (table may not exist on older DBs)
        try:
            conn.execute(
                "INSERT INTO login_locations (user_id, ip) VALUES (?,?)",
                (user["id"], client_ip)
            )
        except Exception:
            pass  # login_locations table missing – non-fatal
        conn.commit()
    finally:
        conn.close()
    log_action(user["id"], "login", {"username": username, "ip": client_ip, "fingerprint": fingerprint[:8]}, client_ip)
    return {"token": token, "user": {
        "id": user["id"], "username": user["username"], "full_name": user["full_name"],
        "role": user["role"], "language": user["language"], "theme": user["theme"], "alert_tone": user["alert_tone"]
    }}

@app.post("/api/auth/logout")
async def logout(request: Request, user: dict = Depends(get_current_user)):
    # Extract token from Authorization header or query param (same as get_current_user)
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    else:
        token = request.query_params.get("token", "")
    if token:
        conn = get_db()
        try:
            conn.execute("DELETE FROM sessions WHERE token=?", (token,))
            conn.commit()
        finally:
            conn.close()
    return {"ok": True}

@app.get("/api/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"id": user["id"], "username": user["username"], "full_name": user["full_name"],
            "role": user["role"], "language": user["language"], "theme": user["theme"], "alert_tone": user["alert_tone"]}

@app.put("/api/auth/me")
async def update_me(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()

    # Handle password change (requires current_password verification)
    new_password = body.get("password", "").strip()
    if new_password:
        current_password = body.get("current_password", "")
        if not current_password:
            conn.close()
            raise HTTPException(400, "current_password is required to change password")
        row = conn.execute("SELECT password_hash FROM users WHERE id=?", (user["id"],)).fetchone()
        if not row or not verify_password(current_password, row["password_hash"]):
            conn.close()
            raise HTTPException(400, "Current password is incorrect")
        try:
            _validate_password_complexity(new_password)
        except HTTPException:
            conn.close()
            raise
        pw_hash = hash_password(new_password)
        conn.execute("UPDATE users SET password_hash=? WHERE id=?", (pw_hash, user["id"]))
        conn.commit()

    # Explicit whitelist of columns that a user may update on their own profile.
    # Never build the column list from untrusted input directly.
    ALLOWED_FIELDS = {"language", "theme", "alert_tone", "full_name"}
    fields = {k: body[k] for k in ALLOWED_FIELDS if k in body}
    if fields:
        set_clause = ", ".join(f"{k}=?" for k in fields)
        conn.execute(f"UPDATE users SET {set_clause} WHERE id=?", (*fields.values(), user["id"]))
        conn.commit()

    conn.close()
    return {"ok": True}

# Assets
@app.get("/api/assets")
async def get_assets(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM assets ORDER BY name").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/assets")
async def create_asset(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    name = (body.get("name") or "").strip()
    if not name:
        conn.close()
        raise HTTPException(400, "name is required")
    c = conn.execute("INSERT INTO assets (name,type,lat,lng,status,description) VALUES (?,?,?,?,?,?)",
                     (name, body.get("type","vehicle"), body.get("lat"), body.get("lng"),
                      body.get("status","active"), body.get("description","")))
    conn.commit()
    asset = dict(conn.execute("SELECT * FROM assets WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"asset_new","data":asset})
    log_action(user["id"], "asset_create", {"name": name})
    return asset

@app.put("/api/assets/{aid}")
async def update_asset(aid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    conn.execute("UPDATE assets SET name=?,type=?,status=?,description=?,updated_at=datetime('now') WHERE id=?",
                 (body.get("name"), body.get("type"), body.get("status"), body.get("description"), aid))
    conn.commit()
    asset = dict(conn.execute("SELECT * FROM assets WHERE id=?", (aid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"asset_update","data":asset})
    return asset

@app.delete("/api/assets/{aid}")
async def delete_asset(aid: int, user: dict = Depends(get_current_user)):
    if user["role"] not in ("admin", "operator"):
        raise HTTPException(403, "Forbidden")
    conn = get_db()
    conn.execute("DELETE FROM assets WHERE id=?", (aid,))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"asset_deleted","data":{"id":aid}})
    return {"ok": True}

@app.post("/api/assets/{aid}/position")
async def update_asset_position(aid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    lat, lng = body.get("lat"), body.get("lng")
    if lat is None or lng is None:
        raise HTTPException(400, "lat and lng are required")
    conn.execute("UPDATE assets SET lat=?,lng=?,updated_at=datetime('now') WHERE id=?", (lat, lng, aid))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"asset_move","data":{"id":aid,"lat":lat,"lng":lng}})
    return {"ok": True}

# Incidents
@app.get("/api/incidents")
async def get_incidents(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM incidents ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/incidents")
async def create_incident(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    title = (body.get("title") or "").strip()
    if not title:
        conn.close()
        raise HTTPException(400, "title is required")
    c = conn.execute("INSERT INTO incidents (title,description,severity,status,lat,lng,created_by) VALUES (?,?,?,?,?,?,?)",
                     (title, body.get("description",""), body.get("severity","warning"),
                      body.get("status","open"), body.get("lat"), body.get("lng"), user["id"]))
    conn.commit()
    incident = dict(conn.execute("SELECT * FROM incidents WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"incident_new","data":incident})
    log_action(user["id"], "incident_create", {"title": title})
    asyncio.create_task(_fire_webhooks("incident", incident))
    return incident

@app.put("/api/incidents/{iid}")
async def update_incident(iid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    # Load existing record so partial updates (e.g. only {status}) don't NULL other fields
    existing = conn.execute("SELECT * FROM incidents WHERE id=?", (iid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Incident not found")
    existing = dict(existing)
    title       = body.get("title",       existing["title"])
    description = body.get("description", existing["description"])
    severity    = body.get("severity",    existing["severity"])
    status      = body.get("status",      existing["status"])
    lat         = body.get("lat",         existing.get("lat"))
    lng         = body.get("lng",         existing.get("lng"))
    assigned_to = body.get("assigned_to", existing.get("assigned_to"))
    conn.execute(
        "UPDATE incidents SET title=?,description=?,severity=?,status=?,lat=?,lng=?,assigned_to=?,"
        "updated_at=datetime('now'),"
        "resolved_at=CASE WHEN ?='resolved' AND resolved_at IS NULL THEN datetime('now') ELSE resolved_at END "
        "WHERE id=?",
        (title, description, severity, status, lat, lng, assigned_to, status, iid)
    )
    conn.commit()
    incident = dict(conn.execute("SELECT * FROM incidents WHERE id=?", (iid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"incident_update","data":incident})
    log_action(user["id"], "incident_update", {"id": iid, "status": status})
    return incident

# Alerts
@app.get("/api/alerts")
async def get_alerts(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM alerts ORDER BY created_at DESC LIMIT 200").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/alerts")
async def create_alert(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    message = (body.get("message") or "").strip()
    if not message:
        conn.close()
        raise HTTPException(400, "message is required")
    c = conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES (?,?,?,?)",
                     (body.get("type","system"), message, body.get("severity","info"), body.get("source","")))
    conn.commit()
    alert = dict(conn.execute("SELECT * FROM alerts WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"alert_new","data":alert})
    # Fire push notification + all channels for warning/critical alerts
    severity = alert.get("severity","info")
    title_prefix = {
        "critical": "🚨 CRITICAL ALERT",
        "warning": "⚠️ Warning Alert",
        "info": "ℹ️ Atlas Info"
    }.get(severity, "🔔 Atlas")
    asyncio.create_task(broadcast_push_notification(
        title=title_prefix,
        body=alert["message"],
        severity=severity,
        alert_id=alert["id"],
        url="/#/alerts",
        sound_name=("emergency_siren" if severity == "critical" else "")
    ))
    # Dispatch to all configured channels (ntfy, DAPNET, apprise, etc.)
    asyncio.create_task(_dispatch_all_channels(alert))
    # Fire webhooks
    asyncio.create_task(_fire_webhooks("alert", alert))
    return alert

@app.post("/api/alerts/acknowledge-all")
async def acknowledge_all_alerts(user: dict = Depends(get_current_user)):
    conn = get_db()
    conn.execute("UPDATE alerts SET acknowledged=1,acknowledged_by=?,acknowledged_at=datetime('now') WHERE acknowledged=0", (user["id"],))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"alerts_all_ack","data":{}})
    return {"ok": True}

# Chat
@app.get("/api/chat/rooms")
async def get_rooms(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM chat_rooms ORDER BY name").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/chat/rooms")
async def create_room(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    room_name = (body.get("name") or "").strip()
    if not room_name:
        conn.close()
        raise HTTPException(400, "name is required")
    c = conn.execute("INSERT INTO chat_rooms (name,description,type) VALUES (?,?,?)",
                     (room_name, body.get("description",""), body.get("type","public")))
    conn.commit()
    room = dict(conn.execute("SELECT * FROM chat_rooms WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return room

@app.get("/api/chat/rooms/{rid}/messages")
async def get_messages(rid: int, user: dict = Depends(get_current_user), limit: int = 50):
    conn = get_db()
    rows = conn.execute("""
        SELECT m.*, u.username, u.full_name FROM chat_messages m
        JOIN users u ON m.sender_id=u.id
        WHERE m.room_id=? ORDER BY m.timestamp DESC LIMIT ?
    """, (rid, limit)).fetchall()
    conn.close()
    return list(reversed([dict(r) for r in rows]))

@app.post("/api/chat/rooms/{rid}/messages")
async def send_message(rid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    content = (body.get("content") or "").strip()
    if not content:
        raise HTTPException(400, "content is required")
    c = conn.execute("INSERT INTO chat_messages (room_id,sender_id,content) VALUES (?,?,?)",
                     (rid, user["id"], content))
    conn.commit()
    msg = dict(conn.execute("SELECT m.*, u.username, u.full_name FROM chat_messages m JOIN users u ON m.sender_id=u.id WHERE m.id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"chat_message","data":{"room_id":rid,"message":msg}})
    return msg

@app.get("/api/chat/dm/{other_id}")
async def get_dm(other_id: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("""
        SELECT dm.*, u.username, u.full_name FROM direct_messages dm
        JOIN users u ON dm.from_user=u.id
        WHERE (dm.from_user=? AND dm.to_user=?) OR (dm.from_user=? AND dm.to_user=?)
        ORDER BY dm.timestamp DESC LIMIT 50
    """, (user["id"], other_id, other_id, user["id"])).fetchall()
    conn.execute("UPDATE direct_messages SET is_read=1 WHERE to_user=? AND from_user=?", (user["id"], other_id))
    conn.commit()
    conn.close()
    return list(reversed([dict(r) for r in rows]))

@app.post("/api/chat/dm/{other_id}")
async def send_dm(other_id: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    dm_content = (body.get("content") or "").strip()
    if not dm_content:
        raise HTTPException(400, "content is required")
    c = conn.execute("INSERT INTO direct_messages (from_user,to_user,content) VALUES (?,?,?)",
                     (user["id"], other_id, dm_content))
    conn.commit()
    msg = {"id":c.lastrowid,"from_user":user["id"],"to_user":other_id,"content":dm_content,"username":user["username"],"full_name":user["full_name"]}
    conn.close()
    await manager.send_to(other_id, {"type":"dm_message","data":msg})
    return msg

# Sensors
@app.post("/api/sensors/discover")
async def discover_sensors(user: dict = Depends(require_admin)):
    """Auto-discover all available system sensors and resources on this host.
    Creates or updates sensor entries in the DB for every discovered source.
    Returns a summary of what was found and registered."""
    import subprocess as _dsp
    import shutil as _dsh

    discovered = []
    conn = get_db()

    def _ensure_sensor(name, typ, location, unit, min_val, max_val):
        """Insert sensor if not exists; returns sensor id."""
        row = conn.execute(
            "SELECT id FROM sensors WHERE name=? AND type=?", (name, typ)
        ).fetchone()
        if row:
            return row["id"], False
        c = conn.execute(
            "INSERT INTO sensors (name,type,location,unit,min_val,max_val,status) VALUES (?,?,?,?,?,?,'online')",
            (name, typ, location, unit, min_val, max_val)
        )
        return c.lastrowid, True

    # 1. Raspberry Pi CPU temperature (via thermal zone or vcgencmd)
    temp_available = False
    try:
        res = _dsp.run(["cat", "/sys/class/thermal/thermal_zone0/temp"], capture_output=True, text=True, timeout=2)
        if res.returncode == 0:
            temp_available = True
    except Exception:
        pass
    if not temp_available:
        try:
            res = _dsp.run(["vcgencmd", "measure_temp"], capture_output=True, text=True, timeout=2)
            if res.returncode == 0:
                temp_available = True
        except Exception:
            pass
    if temp_available:
        sid, new = _ensure_sensor("Pi CPU Temperatur", "pi_temp", "Raspberry Pi", "°C", 0, 100)
        discovered.append({"name": "Pi CPU Temperatur", "new": new, "id": sid})

    # 2. CPU usage (psutil)
    try:
        import psutil as _psu
        sid, new = _ensure_sensor("CPU Auslastung", "cpu_percent", "System", "%", 0, 100)
        discovered.append({"name": "CPU Auslastung", "new": new, "id": sid})
        val = _psu.cpu_percent(interval=0.1)
        conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, val))
        conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
    except ImportError:
        pass
    except Exception:
        pass

    # 3. RAM usage (psutil)
    try:
        import psutil as _psu
        mem = _psu.virtual_memory()
        sid, new = _ensure_sensor("RAM Auslastung", "memory_percent", "System", "%", 0, 100)
        discovered.append({"name": "RAM Auslastung", "new": new, "id": sid})
        conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, mem.percent))
        conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
    except Exception:
        pass

    # 4. Disk usage per mounted partition (psutil)
    try:
        import psutil as _psu
        for part in _psu.disk_partitions():
            if part.fstype in ("", "devfs", "tmpfs", "devtmpfs"):
                continue
            try:
                du = _psu.disk_usage(part.mountpoint)
                label = f"Disk {part.mountpoint}"
                sid, new = _ensure_sensor(label, "disk_percent", part.mountpoint, "%", 0, 100)
                discovered.append({"name": label, "new": new, "id": sid})
                conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, du.percent))
                conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
            except Exception:
                pass
    except ImportError:
        # Fallback: shutil for root disk
        try:
            du = _dsh.disk_usage("/")
            sid, new = _ensure_sensor("Disk /", "disk_percent", "/", "%", 0, 100)
            discovered.append({"name": "Disk /", "new": new, "id": sid})
            pct = round(du.used / du.total * 100, 1)
            conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, pct))
            conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
        except Exception:
            pass
    except Exception:
        pass

    # 5. Network interfaces (psutil)
    try:
        import psutil as _psu
        net = _psu.net_io_counters(pernic=True)
        for iface, stats in net.items():
            if iface in ("lo", "lo0"):
                continue
            label = f"Netzwerk {iface} (Tx MB)"
            sid, new = _ensure_sensor(label, "network_tx_mb", iface, "MB", 0, 999999)
            discovered.append({"name": label, "new": new, "id": sid})
            val = round(stats.bytes_sent / 1_048_576, 2)
            conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, val))
            conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
    except Exception:
        pass

    # 6. Battery (psutil, laptops/UPS)
    try:
        import psutil as _psu
        bat = _psu.sensors_battery()
        if bat is not None:
            sid, new = _ensure_sensor("Akkustand", "battery_percent", "System", "%", 0, 100)
            discovered.append({"name": "Akkustand", "new": new, "id": sid})
            conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, bat.percent))
            conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
    except Exception:
        pass

    # 7. System temperatures (psutil sensors_temperatures, Linux only)
    try:
        import psutil as _psu
        temps = _psu.sensors_temperatures()
        for chip, entries in temps.items():
            for entry in entries:
                label = f"Temp: {chip}/{entry.label or 'core'}"
                sid, new = _ensure_sensor(label, "temperature", chip, "°C", 0, 120)
                discovered.append({"name": label, "new": new, "id": sid})
                conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, entry.current))
                conn.execute("UPDATE sensors SET last_seen=datetime('now'),status='online' WHERE id=?", (sid,))
    except Exception:
        pass

    conn.commit()
    conn.close()

    new_count = sum(1 for d in discovered if d["new"])
    log_action(user["id"], "sensors_discovered", {"total": len(discovered), "new": new_count})
    return {
        "ok": True,
        "discovered": len(discovered),
        "new_sensors": new_count,
        "sensors": discovered
    }


@app.get("/api/sensors")
async def get_sensors(user: dict = Depends(get_current_user)):
    conn = get_db()
    sensors = conn.execute("SELECT * FROM sensors ORDER BY name").fetchall()
    result = []
    for s in sensors:
        sd = dict(s)
        last = conn.execute("SELECT value FROM sensor_readings WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 1", (s["id"],)).fetchone()
        sd["current_value"] = last["value"] if last else None
        result.append(sd)
    conn.close()
    return result

@app.get("/api/sensors/{sid}/history")
async def sensor_history(sid: int, user: dict = Depends(get_current_user), hours: int = 6):
    conn = get_db()
    since = (datetime.utcnow() - timedelta(hours=hours)).strftime("%Y-%m-%d %H:%M:%S")
    rows = conn.execute("SELECT value, timestamp FROM sensor_readings WHERE sensor_id=? AND timestamp > ? ORDER BY timestamp", (sid, since)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/sensors")
async def create_sensor(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    sensor_name = (body.get("name") or "").strip()
    if not sensor_name:
        conn.close()
        raise HTTPException(400, "name is required")
    c = conn.execute("INSERT INTO sensors (name,type,location,lat,lng,unit,min_val,max_val) VALUES (?,?,?,?,?,?,?,?)",
                     (sensor_name, body.get("type","generic"), body.get("location",""), body.get("lat"), body.get("lng"), body.get("unit",""), body.get("min_val",0), body.get("max_val",100)))
    conn.commit()
    sensor = dict(conn.execute("SELECT * FROM sensors WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return sensor

@app.post("/api/sensors/{sid}/reading")
async def add_sensor_reading(sid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    sensor = conn.execute("SELECT * FROM sensors WHERE id=?", (sid,)).fetchone()
    if not sensor:
        conn.close()
        raise HTTPException(404, "Sensor not found")
    value = body.get("value")
    if value is None:
        conn.close()
        raise HTTPException(400, "value is required")
    try:
        value = float(value)
    except (TypeError, ValueError):
        conn.close()
        raise HTTPException(400, "value must be a number")
    conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, value))
    conn.execute("UPDATE sensors SET last_seen=datetime('now') WHERE id=?", (sid,))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"sensor_reading","data":{"sensor_id":sid,"value":value,"unit":sensor["unit"]}})
    return {"ok": True}

# Analytics
@app.get("/api/analytics/kpis")
async def get_kpis(user: dict = Depends(get_current_user)):
    conn = get_db()
    active_assets = conn.execute("SELECT COUNT(*) as c FROM assets WHERE status='active'").fetchone()["c"]
    open_incidents = conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status IN ('open','in_progress')").fetchone()["c"]
    active_alerts = conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0").fetchone()["c"]
    critical_alerts = conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0 AND severity='critical'").fetchone()["c"]
    total_users = conn.execute("SELECT COUNT(*) as c FROM users WHERE is_active=1").fetchone()["c"]
    fleet_available = conn.execute("SELECT COUNT(*) as c FROM fleet_vehicles WHERE status='available'").fetchone()["c"]
    fleet_on_trip = conn.execute("SELECT COUNT(*) as c FROM fleet_vehicles WHERE status='on_trip'").fetchone()["c"]
    fleet_maintenance = conn.execute("SELECT COUNT(*) as c FROM fleet_vehicles WHERE status='maintenance'").fetchone()["c"]
    conn.close()
    return {
        "active_assets": active_assets,
        "open_incidents": open_incidents,
        "active_alerts": active_alerts,
        "critical_alerts": critical_alerts,
        "online_users": len(manager.online_users()),
        "total_users": total_users,
        "fleet_available": fleet_available,
        "fleet_on_trip": fleet_on_trip,
        "fleet_maintenance": fleet_maintenance,
    }

@app.get("/api/analytics/trends")
async def get_trends(user: dict = Depends(get_current_user), hours: int = 24):
    conn = get_db()
    since = (datetime.utcnow() - timedelta(hours=hours)).strftime("%Y-%m-%d %H:%M:%S")
    rows = conn.execute("SELECT metric, value, timestamp FROM kpi_snapshots WHERE timestamp > ? ORDER BY timestamp", (since,)).fetchall()
    conn.close()
    result: dict[str, list] = {}
    for r in rows:
        if r["metric"] not in result:
            result[r["metric"]] = []
        result[r["metric"]].append({"value": r["value"], "timestamp": r["timestamp"]})
    return result

@app.get("/api/analytics/anomalies")
async def get_anomalies(user: dict = Depends(get_current_user)):
    conn = get_db()
    sensors = conn.execute("SELECT * FROM sensors").fetchall()
    anomalies = []
    for s in sensors:
        readings = conn.execute("SELECT value FROM sensor_readings WHERE sensor_id=? ORDER BY timestamp DESC LIMIT 100", (s["id"],)).fetchall()
        if len(readings) < 10:
            continue
        values = [r["value"] for r in readings]
        mean = sum(values) / len(values)
        variance = sum((v - mean)**2 for v in values) / len(values)
        std = math.sqrt(variance)
        if std < 1e-9:   # avoid division-by-zero with float epsilon
            continue
        latest = values[0]
        z = abs(latest - mean) / std
        if z > 2.5:
            anomalies.append({
                "sensor_id": s["id"],
                "sensor_name": s["name"],
                "current_value": latest,
                "mean": round(mean, 2),
                "z_score": round(z, 2),
                "unit": s["unit"],
                "severity": "critical" if z > 3.5 else "warning"
            })
    conn.close()
    return anomalies

@app.get("/api/analytics/incidents-pattern")
async def incidents_pattern(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT created_at FROM incidents").fetchall()
    conn.close()
    pattern = [[0]*24 for _ in range(7)]
    for r in rows:
        try:
            dt = datetime.strptime(r["created_at"][:19], "%Y-%m-%d %H:%M:%S")
            pattern[dt.weekday()][dt.hour] += 1
        except (ValueError, TypeError, AttributeError):
            pass
    return pattern

# Users
@app.get("/api/users")
async def get_users(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT id,username,full_name,role,language,theme,created_at,last_seen,is_active FROM users ORDER BY username").fetchall()
    conn.close()
    result = [dict(r) for r in rows]
    online = manager.online_users()
    for u in result:
        u["online"] = u["id"] in online
    return result

@app.post("/api/users")
async def create_user(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    username = (body.get("username") or "").strip()
    full_name = (body.get("full_name") or "").strip()
    password = body.get("password") or ""
    if not username or not full_name or not password:
        raise HTTPException(400, "username, full_name and password are required")
    # Nobody can create an "owner" account – only one owner allowed.
    requested_role = body.get("role", "operator")
    if requested_role == "owner":
        raise HTTPException(403, "Cannot create owner account via API")
    _validate_password_complexity(password)
    pw_hash = hash_password(password)
    conn = get_db()
    try:
        c = conn.execute("INSERT INTO users (username,password_hash,full_name,role,language) VALUES (?,?,?,?,?)",
                         (username, pw_hash, full_name, requested_role, body.get("language","en")))
        conn.commit()
        new_user = dict(conn.execute("SELECT id,username,full_name,role,language FROM users WHERE id=?", (c.lastrowid,)).fetchone())
        conn.close()
        log_action(user["id"], "user_create", {"username": username})
        return new_user
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(400, "Username already exists")

@app.put("/api/users/{uid}")
async def update_user(uid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()

    # Protect the owner account: only the owner can modify their own record,
    # and nobody can demote or delete the owner.
    target = conn.execute("SELECT role FROM users WHERE id=?", (uid,)).fetchone()
    if target and target["role"] == "owner" and user["role"] != "owner":
        conn.close()
        raise HTTPException(403, "Cannot modify the owner account")
    # Prevent role escalation to owner.
    new_role = body.get("role", "viewer")
    if new_role == "owner":
        conn.close()
        raise HTTPException(403, "Cannot assign owner role via API")
    # Prevent the owner from being deactivated.
    if target and target["role"] == "owner" and body.get("is_active") == 0:
        conn.close()
        raise HTTPException(403, "Cannot deactivate the owner account")

    extra_fields = ""
    extra_vals = []
    if "email" in body:
        extra_fields += ", email=?"
        extra_vals.append(body["email"] or "")
    if "phone" in body:
        extra_fields += ", phone=?"
        extra_vals.append(body["phone"] or "")
    if "password" in body and body["password"]:
        _validate_password_complexity(body["password"])
        conn.execute(
            f"UPDATE users SET full_name=?,role=?,is_active=?,password_hash=?{extra_fields} WHERE id=?",
            [body.get("full_name",""), new_role, body.get("is_active",1),
             hash_password(body["password"])] + extra_vals + [uid]
        )
    else:
        conn.execute(
            f"UPDATE users SET full_name=?,role=?,is_active=?{extra_fields} WHERE id=?",
            [body.get("full_name",""), new_role, body.get("is_active",1)] + extra_vals + [uid]
        )
    conn.commit()
    conn.close()
    log_action(user["id"], "user_update", {"uid": uid})
    return {"ok": True}

@app.delete("/api/users/{uid}")
async def delete_user(uid: int, user: dict = Depends(require_admin)):
    """Permanently delete a user account.

    Restrictions:
    • You cannot delete the owner account (ever).
    • You cannot delete yourself.
    • Admin may delete other admins; only owner may delete an admin (extra safeguard).
    """
    conn = get_db()
    target = conn.execute("SELECT id, role, username FROM users WHERE id=?", (uid,)).fetchone()
    if not target:
        conn.close()
        raise HTTPException(404, "User not found")
    # Never delete the owner account.
    if target["role"] == "owner":
        conn.close()
        raise HTTPException(403, "Cannot delete the owner account")
    # Prevent self-deletion.
    if uid == user["id"]:
        conn.close()
        raise HTTPException(403, "You cannot delete your own account")
    # Only owner may delete another admin.
    if target["role"] == "admin" and user["role"] != "owner":
        conn.close()
        raise HTTPException(403, "Only the owner can delete admin accounts")
    # Invalidate all sessions for the deleted user first.
    conn.execute("DELETE FROM sessions WHERE user_id=?", (uid,))
    conn.execute("DELETE FROM users WHERE id=?", (uid,))
    conn.commit()
    conn.close()
    log_action(user["id"], "user_delete", {"uid": uid, "username": target["username"]})
    return {"ok": True, "deleted_uid": uid}

@app.delete("/api/users/{uid}/sessions")
async def force_logout_user(uid: int, user: dict = Depends(require_admin)):
    """Invalidate all active sessions for a user (force logout).

    • Admin can force-logout any non-owner user.
    • Only owner can force-logout another admin.
    • Nobody can force-logout the owner (except the owner themselves).
    """
    conn = get_db()
    target = conn.execute("SELECT role, username FROM users WHERE id=?", (uid,)).fetchone()
    if not target:
        conn.close()
        raise HTTPException(404, "User not found")
    if target["role"] == "owner" and user["role"] != "owner":
        conn.close()
        raise HTTPException(403, "Only the owner can force-logout the owner account")
    if target["role"] == "admin" and user["role"] != "owner":
        conn.close()
        raise HTTPException(403, "Only the owner can force-logout admin accounts")
    deleted = conn.execute("DELETE FROM sessions WHERE user_id=?", (uid,)).rowcount
    conn.commit()
    conn.close()
    log_action(user["id"], "force_logout", {"uid": uid, "username": target["username"], "sessions_removed": deleted})
    return {"ok": True, "sessions_removed": deleted}

# ─── Bulk User Management ─────────────────────────────────────────────────────

@app.post("/api/users/bulk-deactivate")
async def bulk_deactivate_users(request: Request, user: dict = Depends(require_admin)):
    """Deactivate multiple users at once (owner only for admins)."""
    body = await request.json()
    uids = body.get("user_ids", [])
    if not uids:
        raise HTTPException(400, "user_ids required")
    conn = get_db()
    results = []
    for uid in uids:
        target = conn.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
        if not target:
            continue
        if target["role"] == "owner":
            results.append({"uid": uid, "error": "Cannot deactivate owner"})
            continue
        if target["role"] == "admin" and user["role"] != "owner":
            results.append({"uid": uid, "error": "Only owner can deactivate admins"})
            continue
        conn.execute("UPDATE users SET is_active=0 WHERE id=?", (uid,))
        conn.execute("DELETE FROM sessions WHERE user_id=?", (uid,))
        results.append({"uid": uid, "ok": True})
        log_action(user["id"], "user_bulk_deactivate", {"uid": uid, "username": target["username"]})
    conn.commit()
    conn.close()
    return {"results": results}

@app.post("/api/users/bulk-role")
async def bulk_update_role(request: Request, user: dict = Depends(require_owner)):
    """Change role for multiple users at once (owner only)."""
    body = await request.json()
    uids = body.get("user_ids", [])
    new_role = body.get("role", "operator")
    if new_role not in ("admin", "operator", "viewer"):
        raise HTTPException(400, "Invalid role. Must be admin/operator/viewer")
    if not uids:
        raise HTTPException(400, "user_ids required")
    conn = get_db()
    results = []
    for uid in uids:
        target = conn.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
        if not target or target["role"] == "owner":
            results.append({"uid": uid, "error": "Cannot change owner role"})
            continue
        conn.execute("UPDATE users SET role=? WHERE id=?", (new_role, uid))
        results.append({"uid": uid, "ok": True, "new_role": new_role})
        log_action(user["id"], "user_bulk_role_change", {"uid": uid, "new_role": new_role})
    conn.commit()
    conn.close()
    return {"results": results}

@app.post("/api/users/bulk-force-logout")
async def bulk_force_logout(request: Request, user: dict = Depends(require_admin)):
    """Force logout multiple users at once."""
    body = await request.json()
    uids = body.get("user_ids", [])
    if not uids:
        raise HTTPException(400, "user_ids required")
    conn = get_db()
    total = 0
    for uid in uids:
        target = conn.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
        if not target or target["role"] == "owner":
            continue
        if target["role"] == "admin" and user["role"] != "owner":
            continue
        conn.execute("DELETE FROM sessions WHERE user_id=?", (uid,))
        total += conn.execute("SELECT changes()").fetchone()[0]
        log_action(user["id"], "bulk_force_logout", {"uid": uid})
    conn.commit()
    conn.close()
    return {"ok": True, "users_logged_out": total}

# Audit Log – admin/owner only, read-only (no delete endpoint exists)
@app.get("/api/audit")
async def get_audit(user: dict = Depends(require_admin), limit: int = 500):
    conn = get_db()
    rows = conn.execute("""
        SELECT e.id, e.action, e.user_id, e.details, e.ip_addr, e.timestamp, u.username
        FROM event_log e
        LEFT JOIN users u ON e.user_id=u.id
        ORDER BY e.timestamp DESC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ─── Security Management Endpoints ───────────────────────────────────────────

@app.get("/api/security/blacklist")
async def get_ip_blacklist(user: dict = Depends(require_admin)):
    """List all currently blacklisted IPs."""
    conn = get_db()
    rows = conn.execute(
        "SELECT ip, reason, blocked_until, created_at FROM ip_blacklist WHERE blocked_until > datetime('now') ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/security/blacklist/{ip}")
async def remove_ip_blacklist(ip: str, user: dict = Depends(require_admin)):
    """Manually remove an IP from the blacklist."""
    conn = get_db()
    conn.execute("DELETE FROM ip_blacklist WHERE ip=?", (ip,))
    conn.commit()
    conn.close()
    log_action(user["id"], "ip_unblacklisted", {"ip": ip})
    return {"ok": True}

@app.post("/api/security/blacklist")
async def add_ip_blacklist(request: Request, user: dict = Depends(require_admin)):
    """Manually blacklist an IP address."""
    body = await request.json()
    ip = body.get("ip", "").strip()
    hours = int(body.get("hours", 24))
    reason = body.get("reason", "manual")
    if not ip:
        raise HTTPException(400, "IP required")
    blocked_until = (datetime.utcnow() + timedelta(hours=hours)).strftime("%Y-%m-%d %H:%M:%S")
    conn = get_db()
    conn.execute(
        "INSERT OR REPLACE INTO ip_blacklist (ip, reason, blocked_until) VALUES (?,?,?)",
        (ip, reason, blocked_until)
    )
    conn.commit()
    conn.close()
    log_action(user["id"], "ip_blacklisted", {"ip": ip, "hours": hours, "reason": reason})
    return {"ok": True, "blocked_until": blocked_until}

@app.get("/api/security/sessions")
async def get_active_sessions(user: dict = Depends(require_admin)):
    """List all active sessions with fingerprint and last_active info."""
    conn = get_db()
    rows = conn.execute("""
        SELECT s.token, s.user_id, s.expires_at, s.last_active, s.ip_addr,
               u.username, u.full_name, u.role
        FROM sessions s JOIN users u ON s.user_id=u.id
        WHERE s.expires_at > datetime('now')
        ORDER BY s.last_active DESC
    """).fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["token"] = d["token"][:8] + "..."  # Never expose full token
        result.append(d)
    return result

@app.get("/api/security/monitor")
async def security_monitor(user: dict = Depends(require_admin)):
    """Content security monitoring: suspicious patterns in audit log."""
    conn = get_db()
    # Failed logins in last 24h per IP
    failed_logins = conn.execute("""
        SELECT ip_addr, COUNT(*) as count
        FROM event_log
        WHERE action='login_failed' AND timestamp > datetime('now', '-24 hours')
        GROUP BY ip_addr ORDER BY count DESC LIMIT 20
    """).fetchall()
    # Unusual activity: many actions in short time
    high_activity = conn.execute("""
        SELECT user_id, u.username, COUNT(*) as actions
        FROM event_log e JOIN users u ON e.user_id=u.id
        WHERE e.timestamp > datetime('now', '-1 hour')
        GROUP BY e.user_id ORDER BY actions DESC LIMIT 10
    """).fetchall()
    # Recent security events
    security_events = conn.execute("""
        SELECT e.action, e.user_id, u.username, e.ip_addr, e.details, e.timestamp
        FROM event_log e LEFT JOIN users u ON e.user_id=u.id
        WHERE e.action IN ('login_failed','ip_blacklisted','ip_unblacklisted','user_delete',
                           'force_logout','lockdown_enable','lockdown_disable')
        ORDER BY e.timestamp DESC LIMIT 50
    """).fetchall()
    # Blacklisted IPs
    blacklisted = conn.execute(
        "SELECT ip, reason, blocked_until FROM ip_blacklist WHERE blocked_until > datetime('now')"
    ).fetchall()
    conn.close()
    return {
        "failed_logins_24h": [dict(r) for r in failed_logins],
        "high_activity_1h": [dict(r) for r in high_activity],
        "security_events": [dict(r) for r in security_events],
        "blacklisted_ips": [dict(r) for r in blacklisted],
    }

@app.get("/api/security/login-locations/{uid}")
async def get_login_locations(uid: int, user: dict = Depends(require_admin)):
    """Get login IP history for a specific user."""
    conn = get_db()
    rows = conn.execute(
        "SELECT ip, city, country, recorded_at FROM login_locations WHERE user_id=? ORDER BY recorded_at DESC LIMIT 50",
        (uid,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ─── Webhook Endpoints ────────────────────────────────────────────────────────

@app.get("/api/webhooks")
async def list_webhooks(user: dict = Depends(require_admin)):
    conn = get_db()
    rows = conn.execute("SELECT id, name, url, events, enabled, created_at FROM webhooks ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/webhooks")
async def create_webhook(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = body.get("name", "").strip()
    url = body.get("url", "").strip()
    events = body.get("events", ["alert", "incident", "emergency"])
    secret = body.get("secret", secrets.token_hex(16))
    if not name or not url:
        raise HTTPException(400, "name and url required")
    conn = get_db()
    c = conn.execute(
        "INSERT INTO webhooks (name, url, secret, events, created_by) VALUES (?,?,?,?,?)",
        (name, url, secret, json.dumps(events), user["id"])
    )
    wid = c.lastrowid
    conn.commit()
    conn.close()
    log_action(user["id"], "webhook_create", {"name": name, "url": url})
    return {"id": wid, "name": name, "url": url, "secret": secret, "events": events}

@app.put("/api/webhooks/{wid}")
async def update_webhook(wid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    wh = conn.execute("SELECT * FROM webhooks WHERE id=?", (wid,)).fetchone()
    if not wh:
        conn.close()
        raise HTTPException(404, "Webhook not found")
    name = body.get("name", wh["name"])
    url = body.get("url", wh["url"])
    try:
        _wh_events_default = json.loads(wh["events"]) if wh["events"] else []
    except (json.JSONDecodeError, TypeError):
        _wh_events_default = []
    events = body.get("events", _wh_events_default)
    enabled = int(body.get("enabled", wh["enabled"]))
    conn.execute(
        "UPDATE webhooks SET name=?,url=?,events=?,enabled=? WHERE id=?",
        (name, url, json.dumps(events), enabled, wid)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/webhooks/{wid}")
async def delete_webhook(wid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    conn.execute("DELETE FROM webhooks WHERE id=?", (wid,))
    conn.commit()
    conn.close()
    log_action(user["id"], "webhook_delete", {"wid": wid})
    return {"ok": True}

@app.post("/api/webhooks/{wid}/test")
async def test_webhook(wid: int, user: dict = Depends(require_admin)):
    """Send a test payload to the webhook URL."""
    conn = get_db()
    wh = conn.execute("SELECT * FROM webhooks WHERE id=?", (wid,)).fetchone()
    conn.close()
    if not wh:
        raise HTTPException(404, "Webhook not found")
    payload = {
        "event": "test",
        "timestamp": datetime.utcnow().isoformat(),
        "source": "ControlCenterHQ",
        "data": {"message": "Test webhook from ControlCenterHQ"}
    }
    try:
        import urllib.request as _urllib
        data = json.dumps(payload).encode()
        req = _urllib.Request(wh["url"], data=data, headers={"Content-Type": "application/json"}, method="POST")
        with _urllib.urlopen(req, timeout=5) as resp:
            return {"ok": True, "status_code": resp.status}
    except Exception as e:
        return {"ok": False, "error": str(e)}

async def _fire_webhooks(event: str, data: dict):
    """Dispatch webhook calls for a given event type (non-blocking background task)."""
    try:
        conn = get_db()
        hooks = conn.execute(
            "SELECT * FROM webhooks WHERE enabled=1", ()
        ).fetchall()
        conn.close()
        import urllib.request as _urllib
        payload = json.dumps({
            "event": event,
            "timestamp": datetime.utcnow().isoformat(),
            "source": "ControlCenterHQ",
            "data": data
        }).encode()
        for wh in hooks:
            try:
                try:
                    events_list = json.loads(wh["events"]) if wh["events"] else []
                except (json.JSONDecodeError, TypeError):
                    events_list = []
                if event not in events_list:
                    continue
                req = _urllib.Request(wh["url"], data=payload, headers={"Content-Type": "application/json"}, method="POST")
                with _urllib.urlopen(req, timeout=3):
                    pass
            except Exception:
                pass
    except Exception:
        pass

# ─── User Activity Heatmap ────────────────────────────────────────────────────

@app.get("/api/analytics/user-activity")
async def user_activity_heatmap(user: dict = Depends(require_admin)):
    """Returns user activity data grouped by hour and weekday for heatmap display."""
    conn = get_db()
    rows = conn.execute("""
        SELECT
            CAST(strftime('%H', timestamp) AS INTEGER) as hour,
            CAST(strftime('%w', timestamp) AS INTEGER) as weekday,
            COUNT(*) as count
        FROM event_log
        WHERE timestamp > datetime('now', '-30 days')
        GROUP BY hour, weekday
        ORDER BY weekday, hour
    """).fetchall()
    # Per-user activity summary
    per_user = conn.execute("""
        SELECT u.username, u.full_name, COUNT(*) as actions, MAX(e.timestamp) as last_action
        FROM event_log e JOIN users u ON e.user_id=u.id
        WHERE e.timestamp > datetime('now', '-7 days')
        GROUP BY e.user_id ORDER BY actions DESC LIMIT 20
    """).fetchall()
    # Hourly trend today
    hourly_today = conn.execute("""
        SELECT CAST(strftime('%H', timestamp) AS INTEGER) as hour, COUNT(*) as count
        FROM event_log
        WHERE timestamp > datetime('now', '-1 day')
        GROUP BY hour ORDER BY hour
    """).fetchall()
    conn.close()
    return {
        "heatmap": [dict(r) for r in rows],
        "per_user": [dict(r) for r in per_user],
        "hourly_today": [dict(r) for r in hourly_today],
    }

# Modules
@app.get("/api/modules")
async def get_modules(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM modules").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/modules/{name}/toggle")
async def toggle_module(name: str, user: dict = Depends(require_admin)):
    conn = get_db()
    mod = conn.execute("SELECT * FROM modules WHERE name=?", (name,)).fetchone()
    if not mod:
        conn.close()
        raise HTTPException(404, "Module not found")
    new_state = 0 if mod["enabled"] else 1
    conn.execute("UPDATE modules SET enabled=? WHERE name=?", (new_state, name))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"module_toggled","data":{"name":name,"enabled":new_state}})
    return {"name": name, "enabled": new_state}

# ─── Admin: System Settings ───────────────────────────────────────────────────

@app.get("/api/admin/settings")
async def get_admin_settings(user: dict = Depends(require_admin)):
    """Return all system settings with metadata (description, type, limits)."""
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT key, value, description, type, min_val, max_val, updated_at FROM system_settings ORDER BY key"
        ).fetchall()
        return {"settings": [dict(r) for r in rows]}
    finally:
        conn.close()


@app.put("/api/admin/settings")
async def update_admin_settings(request: Request, user: dict = Depends(require_admin)):
    """Update one or more system settings. Body: {key: value, ...}"""
    body = await request.json()
    if not isinstance(body, dict):
        raise HTTPException(400, "Expected JSON object")
    conn = get_db()
    try:
        updated = []
        errors = []
        for key, raw_value in body.items():
            row = conn.execute(
                "SELECT type, min_val, max_val FROM system_settings WHERE key=?", (key,)
            ).fetchone()
            if not row:
                errors.append(f"Unknown setting: {key}")
                continue
            # Type coercion and validation
            try:
                if row["type"] == "int":
                    val = int(raw_value)
                    if row["min_val"] is not None and val < int(row["min_val"]):
                        errors.append(f"{key}: Mindestwert {int(row['min_val'])}")
                        continue
                    if row["max_val"] is not None and val > int(row["max_val"]):
                        errors.append(f"{key}: Maximalwert {int(row['max_val'])}")
                        continue
                else:
                    val = str(raw_value)
            except (ValueError, TypeError):
                errors.append(f"{key}: Ungültiger Wert")
                continue
            conn.execute(
                "UPDATE system_settings SET value=?, updated_at=datetime('now') WHERE key=?",
                (str(val), key)
            )
            updated.append(key)
        conn.commit()
        log_action(user["id"], "settings_updated", {"keys": updated})
        return {"ok": True, "updated": updated, "errors": errors}
    finally:
        conn.close()


@app.post("/api/admin/settings/reset")
async def reset_admin_settings(user: dict = Depends(require_admin)):
    """Reset all system settings to their factory defaults."""
    _DEFAULT_SETTINGS_RESET = {
        "login_max_attempts": "10", "login_window_seconds": "300",
        "login_lockout_seconds": "600", "ip_blacklist_threshold": "20",
        "ip_blacklist_duration_h": "24", "api_rate_max": "300",
        "api_rate_window": "60", "session_ttl_hours": "24",
        "max_sessions_per_user": "10", "session_idle_hours": "2",
        "kpi_interval_s": "60", "health_check_interval_s": "10",
        "alert_resend_interval_s": "5", "escalate_interval_s": "300",
        "escalate_age_minutes": "15", "nina_interval_s": "120",
        "fleet_check_interval_s": "3600", "fleet_insur_warn_days": "30",
        "fleet_insur_crit_days": "7", "fleet_tuev_warn_days": "14",
        "fleet_tuev_crit_days": "7", "sensor_update_interval_s": "30",
        "pi_temp_critical_c": "80", "backup_retention_days": "30",
        "sysmon_history_max": "60", "ai_analysis_interval_s": "60",
        "ai_block_duration_h": "2", "scheduled_check_interval_s": "30",
        "session_cleaner_interval_s": "300", "failover_check_interval_s": "10",
        "failover_fail_threshold": "3", "qr_token_ttl_hours": "1",
        "audit_log_retention_days": "365",
    }
    conn = get_db()
    try:
        for key, val in _DEFAULT_SETTINGS_RESET.items():
            conn.execute("UPDATE system_settings SET value=?, updated_at=datetime('now') WHERE key=?", (val, key))
        conn.commit()
        log_action(user["id"], "settings_reset", {})
        return {"ok": True}
    finally:
        conn.close()


# Config
@app.get("/api/config")
async def get_config(user: dict = Depends(get_current_user)):
    return load_config()

@app.put("/api/config")
async def update_config(request: Request, user: dict = Depends(require_admin)):
    global CONFIG
    body = await request.json()
    cfg = load_config()
    cfg.update(body)

    # If admin credentials are being changed, also update the DB.
    # Login reads from DB, not config.json – so both must stay in sync.
    new_username = body.get("admin_username", "").strip()
    new_password = body.get("admin_password", "").strip()
    new_name     = body.get("admin_name", "").strip()

    if new_username or new_password or new_name:
        conn = get_db()
        try:
            fields, vals = [], []
            if new_username:
                fields.append("username=?")
                vals.append(new_username)
            if new_password:
                _validate_password_complexity(new_password)
                pw_hash = hash_password(new_password)
                fields.append("password_hash=?")
                vals.append(pw_hash)
                cfg["admin_password_hash"] = pw_hash
            if new_name:
                fields.append("full_name=?")
                vals.append(new_name)
            if fields:
                vals.append(user["id"])
                conn.execute(
                    f"UPDATE users SET {', '.join(fields)} WHERE id=?",
                    vals
                )
                conn.commit()
        finally:
            conn.close()

    # Never store plain-text password in config.json
    cfg.pop("admin_password", None)

    CONFIG_PATH.write_text(json.dumps(cfg, indent=2))
    CONFIG = load_config()
    log_action(user["id"], "config_update", {})
    return {"ok": True}

# Export
@app.get("/api/export/logs")
async def export_logs(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT e.*, u.username FROM event_log e LEFT JOIN users u ON e.user_id=u.id ORDER BY e.timestamp DESC").fetchall()
    conn.close()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id","timestamp","action","username","details","ip_addr"])
    for r in rows:
        writer.writerow([r["id"],r["timestamp"],r["action"],r["username"],r["details"],r["ip_addr"]])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=audit_log.csv"})

@app.get("/api/export/incidents")
async def export_incidents(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM incidents ORDER BY created_at DESC").fetchall()
    conn.close()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id","title","severity","status","created_at","resolved_at","description"])
    for r in rows:
        writer.writerow([r["id"],r["title"],r["severity"],r["status"],r["created_at"],r["resolved_at"],r["description"]])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=incidents.csv"})

@app.get("/api/export/fleet")
async def export_fleet(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM fleet_vehicles ORDER BY name").fetchall()
    conn.close()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id","name","type","subtype","license_plate","make","model","year","status","odometer_km","insurance_expiry","tuev_expiry"])
    for r in rows:
        writer.writerow([r["id"],r["name"],r["type"],r["subtype"],r["license_plate"],r["make"],r["model"],r["year"],r["status"],r["odometer_km"],r["insurance_expiry"],r["tuev_expiry"]])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=fleet.csv"})

# Fleet - Vehicles
@app.get("/api/fleet/vehicles")
async def get_fleet_vehicles(user: dict = Depends(get_current_user)):
    conn = get_db()
    vehicles = conn.execute("SELECT v.*, d.full_name as driver_name FROM fleet_vehicles v LEFT JOIN fleet_drivers d ON v.assigned_driver=d.id ORDER BY v.name").fetchall()
    conn.close()
    return [dict(v) for v in vehicles]

@app.post("/api/fleet/vehicles")
async def create_vehicle(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    v_name = (body.get("name") or "").strip()
    if not v_name:
        conn.close()
        raise HTTPException(400, "name is required")
    c = conn.execute("""INSERT INTO fleet_vehicles
        (name,type,subtype,license_plate,vin,make,model,year,color,seats,payload_kg,fuel_type,status,lat,lng,odometer_km,insurance_expiry,tuev_expiry,notes)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (v_name,body.get("type","car"),body.get("subtype"),body.get("license_plate"),body.get("vin"),
         body.get("make"),body.get("model"),body.get("year"),body.get("color"),body.get("seats"),
         body.get("payload_kg",0),body.get("fuel_type","diesel"),body.get("status","available"),
         body.get("lat"),body.get("lng"),body.get("odometer_km",0),body.get("insurance_expiry"),
         body.get("tuev_expiry"),body.get("notes")))
    conn.commit()
    vehicle = dict(conn.execute("SELECT * FROM fleet_vehicles WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    log_action(user["id"], "fleet_vehicle_create", {"name": v_name})
    return vehicle

@app.put("/api/fleet/vehicles/{vid}")
async def update_vehicle(vid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    # Patch-style: only update fields that are present in the request body
    existing = conn.execute("SELECT * FROM fleet_vehicles WHERE id=?", (vid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Vehicle not found")
    ex = dict(existing)
    # Merge: body values override existing values; absent keys keep current value
    merged = {
        "name":             body.get("name",             ex.get("name")),
        "type":             body.get("type",             ex.get("type")),
        "subtype":          body.get("subtype",          ex.get("subtype")),
        "license_plate":    body.get("license_plate",    ex.get("license_plate")),
        "vin":              body.get("vin",              ex.get("vin")),
        "make":             body.get("make",             ex.get("make")),
        "model":            body.get("model",            ex.get("model")),
        "year":             body.get("year",             ex.get("year")),
        "color":            body.get("color",            ex.get("color")),
        "seats":            body.get("seats",            ex.get("seats")),
        "payload_kg":       body.get("payload_kg",       ex.get("payload_kg")),
        "fuel_type":        body.get("fuel_type",        ex.get("fuel_type")),
        "status":           body.get("status",           ex.get("status")),
        "odometer_km":      body.get("odometer_km",      ex.get("odometer_km")),
        "insurance_expiry": body.get("insurance_expiry", ex.get("insurance_expiry")),
        "tuev_expiry":      body.get("tuev_expiry",      ex.get("tuev_expiry")),
        "assigned_driver":  body.get("assigned_driver",  ex.get("assigned_driver")),
        "notes":            body.get("notes",            ex.get("notes")),
    }
    conn.execute("""UPDATE fleet_vehicles SET
        name=?,type=?,subtype=?,license_plate=?,vin=?,make=?,model=?,year=?,color=?,seats=?,
        payload_kg=?,fuel_type=?,status=?,odometer_km=?,insurance_expiry=?,tuev_expiry=?,
        assigned_driver=?,notes=?,updated_at=datetime('now') WHERE id=?""",
        (merged["name"],merged["type"],merged["subtype"],merged["license_plate"],merged["vin"],
         merged["make"],merged["model"],merged["year"],merged["color"],merged["seats"],
         merged["payload_kg"],merged["fuel_type"],merged["status"],merged["odometer_km"],
         merged["insurance_expiry"],merged["tuev_expiry"],merged["assigned_driver"],merged["notes"],vid))
    conn.commit()
    vehicle = dict(conn.execute(
        "SELECT v.*, d.full_name as driver_name FROM fleet_vehicles v LEFT JOIN fleet_drivers d ON v.assigned_driver=d.id WHERE v.id=?",
        (vid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"fleet_vehicle_update","data":vehicle})
    return vehicle

@app.delete("/api/fleet/vehicles/{vid}")
async def delete_vehicle(vid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    conn.execute("DELETE FROM fleet_vehicles WHERE id=?", (vid,))
    conn.commit()
    conn.close()
    return {"ok": True}

# Fleet - Drivers
@app.get("/api/fleet/drivers")
async def get_drivers(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT d.*, v.name as vehicle_name FROM fleet_drivers d LEFT JOIN fleet_vehicles v ON d.assigned_vehicle=v.id ORDER BY d.full_name").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/fleet/drivers")
async def create_driver(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    driver_name = (body.get("full_name") or "").strip()
    if not driver_name:
        conn.close()
        raise HTTPException(400, "full_name is required")
    c = conn.execute("INSERT INTO fleet_drivers (full_name,license_class,license_expiry,phone,email,notes) VALUES (?,?,?,?,?,?)",
                     (driver_name,body.get("license_class","B"),body.get("license_expiry"),body.get("phone"),body.get("email"),body.get("notes")))
    conn.commit()
    driver = dict(conn.execute("SELECT * FROM fleet_drivers WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return driver

@app.put("/api/fleet/drivers/{did}")
async def update_driver(did: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    existing = conn.execute("SELECT * FROM fleet_drivers WHERE id=?", (did,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Driver not found")
    ex = dict(existing)
    conn.execute("UPDATE fleet_drivers SET full_name=?,license_class=?,license_expiry=?,phone=?,email=?,assigned_vehicle=?,status=?,notes=? WHERE id=?",
                 (body.get("full_name",        ex.get("full_name")),
                  body.get("license_class",    ex.get("license_class")),
                  body.get("license_expiry",   ex.get("license_expiry")),
                  body.get("phone",            ex.get("phone")),
                  body.get("email",            ex.get("email")),
                  body.get("assigned_vehicle", ex.get("assigned_vehicle")),
                  body.get("status",           ex.get("status", "available")),
                  body.get("notes",            ex.get("notes")),
                  did))
    conn.commit()
    driver = dict(conn.execute("SELECT * FROM fleet_drivers WHERE id=?", (did,)).fetchone())
    conn.close()
    return driver

@app.delete("/api/fleet/drivers/{did}")
async def delete_driver(did: int, user: dict = Depends(require_admin)):
    conn = get_db()
    conn.execute("DELETE FROM fleet_drivers WHERE id=?", (did,))
    conn.commit()
    conn.close()
    return {"ok": True}

# Fleet - Trips
@app.get("/api/fleet/trips")
async def get_trips(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("""SELECT t.*, v.name as vehicle_name, d.full_name as driver_name 
        FROM fleet_trips t 
        LEFT JOIN fleet_vehicles v ON t.vehicle_id=v.id 
        LEFT JOIN fleet_drivers d ON t.driver_id=d.id 
        ORDER BY t.departure_time DESC""").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/fleet/trips")
async def create_trip(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    trip_vehicle_id = body.get("vehicle_id")
    trip_title = (body.get("title") or "").strip()
    if not trip_vehicle_id or not trip_title:
        conn.close()
        raise HTTPException(400, "vehicle_id and title are required")
    c = conn.execute("INSERT INTO fleet_trips (vehicle_id,driver_id,title,origin,destination,waypoints,departure_time,estimated_arrival,distance_km,notes) VALUES (?,?,?,?,?,?,?,?,?,?)",
                     (trip_vehicle_id,body.get("driver_id"),trip_title,body.get("origin"),body.get("destination"),
                      json.dumps(body.get("waypoints",[])),body.get("departure_time"),body.get("estimated_arrival"),body.get("distance_km"),body.get("notes")))
    conn.commit()
    trip = dict(conn.execute("SELECT * FROM fleet_trips WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return trip

@app.put("/api/fleet/trips/{tid}")
async def update_trip(tid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    existing = conn.execute("SELECT * FROM fleet_trips WHERE id=?", (tid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Trip not found")
    ex = dict(existing)
    merged = {
        "title":             body.get("title",             ex.get("title")),
        "origin":            body.get("origin",            ex.get("origin")),
        "destination":       body.get("destination",       ex.get("destination")),
        "waypoints":         json.dumps(body.get("waypoints", _safe_json_loads(ex.get("waypoints"), []))),
        "departure_time":    body.get("departure_time",    ex.get("departure_time")),
        "estimated_arrival": body.get("estimated_arrival", ex.get("estimated_arrival")),
        "actual_arrival":    body.get("actual_arrival",    ex.get("actual_arrival")),
        "status":            body.get("status",            ex.get("status")),
        "notes":             body.get("notes",             ex.get("notes")),
        "vehicle_id":        body.get("vehicle_id",        ex.get("vehicle_id")),
    }
    conn.execute("""UPDATE fleet_trips SET title=?,origin=?,destination=?,waypoints=?,
                    departure_time=?,estimated_arrival=?,actual_arrival=?,status=?,notes=?,
                    fuel_used_l=?,end_lat=?,end_lng=?,completed_notes=? WHERE id=?""",
                 (merged["title"], merged["origin"], merged["destination"], merged["waypoints"],
                  merged["departure_time"], merged["estimated_arrival"], merged["actual_arrival"],
                  merged["status"], merged["notes"],
                  body.get("fuel_used_l", ex.get("fuel_used_l", 0)),
                  body.get("end_lat", ex.get("end_lat")),
                  body.get("end_lng", ex.get("end_lng")),
                  body.get("completed_notes", ex.get("completed_notes", "")),
                  tid))
    # Update vehicle status based on trip status change
    _vid = merged["vehicle_id"]
    if _vid:
        if merged["status"] == "active":
            conn.execute("UPDATE fleet_vehicles SET status='on_trip',updated_at=datetime('now') WHERE id=?", (_vid,))
        elif merged["status"] in ("completed", "cancelled"):
            conn.execute("UPDATE fleet_vehicles SET status='available',updated_at=datetime('now') WHERE id=?", (_vid,))
    conn.commit()
    trip = dict(conn.execute("""SELECT t.*, v.name as vehicle_name, d.full_name as driver_name
                                FROM fleet_trips t
                                LEFT JOIN fleet_vehicles v ON t.vehicle_id=v.id
                                LEFT JOIN fleet_drivers d ON t.driver_id=d.id
                                WHERE t.id=?""", (tid,)).fetchone())
    conn.close()
    return trip

# Fleet - Maintenance
@app.get("/api/fleet/maintenance")
async def get_maintenance(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT m.*, v.name as vehicle_name FROM fleet_maintenance m LEFT JOIN fleet_vehicles v ON m.vehicle_id=v.id ORDER BY m.scheduled_date").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/fleet/maintenance")
async def create_maintenance(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    maint_vehicle_id = body.get("vehicle_id")
    maint_type = (body.get("type") or "").strip()
    if not maint_vehicle_id or not maint_type:
        conn.close()
        raise HTTPException(400, "vehicle_id and type are required")
    c = conn.execute("INSERT INTO fleet_maintenance (vehicle_id,type,description,scheduled_date,cost,technician,notes) VALUES (?,?,?,?,?,?,?)",
                     (maint_vehicle_id,maint_type,body.get("description"),body.get("scheduled_date"),body.get("cost"),body.get("technician"),body.get("notes")))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM fleet_maintenance WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return row

@app.put("/api/fleet/maintenance/{mid}")
async def update_maintenance(mid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    existing = conn.execute("SELECT * FROM fleet_maintenance WHERE id=?", (mid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Maintenance record not found")
    ex = dict(existing)
    merged = {
        "type":           body.get("type",           ex.get("type")),
        "description":    body.get("description",    ex.get("description")),
        "scheduled_date": body.get("scheduled_date", ex.get("scheduled_date")),
        "completed_date": body.get("completed_date", ex.get("completed_date")),
        "cost":           body.get("cost",           ex.get("cost")),
        "technician":     body.get("technician",     ex.get("technician")),
        "status":         body.get("status",         ex.get("status")),
        "notes":          body.get("notes",          ex.get("notes")),
        "vehicle_id":     body.get("vehicle_id",     ex.get("vehicle_id")),
    }
    conn.execute("UPDATE fleet_maintenance SET type=?,description=?,scheduled_date=?,completed_date=?,cost=?,technician=?,status=?,notes=? WHERE id=?",
                 (merged["type"], merged["description"], merged["scheduled_date"], merged["completed_date"],
                  merged["cost"], merged["technician"], merged["status"], merged["notes"], mid))
    vid = merged["vehicle_id"]
    if vid:
        if merged["status"] == "completed":
            conn.execute("UPDATE fleet_vehicles SET status='available' WHERE id=?", (vid,))
        elif merged["status"] == "in_progress":
            conn.execute("UPDATE fleet_vehicles SET status='maintenance',updated_at=datetime('now') WHERE id=?", (vid,))
    conn.commit()
    row = dict(conn.execute("SELECT m.*, v.name as vehicle_name FROM fleet_maintenance m LEFT JOIN fleet_vehicles v ON m.vehicle_id=v.id WHERE m.id=?", (mid,)).fetchone())
    conn.close()
    return row

# Fleet - Fuel Logs
@app.get("/api/fleet/fuel")
async def get_fuel_logs(user: dict = Depends(get_current_user), vehicle_id: Optional[int] = None):
    conn = get_db()
    if vehicle_id:
        rows = conn.execute("SELECT f.*, v.name as vehicle_name FROM fleet_fuel_logs f LEFT JOIN fleet_vehicles v ON f.vehicle_id=v.id WHERE f.vehicle_id=? ORDER BY f.date DESC", (vehicle_id,)).fetchall()
    else:
        rows = conn.execute("SELECT f.*, v.name as vehicle_name FROM fleet_fuel_logs f LEFT JOIN fleet_vehicles v ON f.vehicle_id=v.id ORDER BY f.date DESC LIMIT 100").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/fleet/fuel")
async def add_fuel_log(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    fuel_vehicle_id = body.get("vehicle_id")
    fuel_date = body.get("date")
    fuel_liters = body.get("liters")
    if not fuel_vehicle_id or not fuel_date or fuel_liters is None:
        raise HTTPException(400, "vehicle_id, date and liters are required")
    try:
        fuel_liters = float(fuel_liters)
    except (TypeError, ValueError):
        raise HTTPException(400, "liters must be a positive number")
    if fuel_liters <= 0:
        raise HTTPException(400, "liters must be greater than 0")
    cost_per_liter = body.get("cost_per_liter") or 0
    total = body.get("total_cost") or (fuel_liters * cost_per_liter)
    conn = get_db()
    c = conn.execute("INSERT INTO fleet_fuel_logs (vehicle_id,date,liters,cost_per_liter,total_cost,odometer_km,station,notes) VALUES (?,?,?,?,?,?,?,?)",
                     (fuel_vehicle_id,fuel_date,fuel_liters,body.get("cost_per_liter"),total,body.get("odometer_km"),body.get("station"),body.get("notes")))
    if body.get("odometer_km"):
        conn.execute("UPDATE fleet_vehicles SET odometer_km=? WHERE id=?", (body.get("odometer_km"), fuel_vehicle_id))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM fleet_fuel_logs WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return row

# Fleet - Inspections
@app.get("/api/fleet/inspections")
async def get_inspections(user: dict = Depends(get_current_user), vehicle_id: Optional[int] = None):
    conn = get_db()
    if vehicle_id:
        rows = conn.execute("SELECT * FROM fleet_inspections WHERE vehicle_id=? ORDER BY date DESC", (vehicle_id,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM fleet_inspections ORDER BY date DESC LIMIT 50").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/fleet/inspections")
async def create_inspection(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    insp_vehicle_id = body.get("vehicle_id")
    insp_date = body.get("date")
    if not insp_vehicle_id or not insp_date:
        conn.close()
        raise HTTPException(400, "vehicle_id and date are required")
    c = conn.execute("INSERT INTO fleet_inspections (vehicle_id,driver_id,type,date,items,passed,notes) VALUES (?,?,?,?,?,?,?)",
                     (insp_vehicle_id,body.get("driver_id"),body.get("type","pre_trip"),insp_date,json.dumps(body.get("items",{})),body.get("passed",1),body.get("notes")))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM fleet_inspections WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return row

# Fleet - Documents
@app.get("/api/fleet/documents")
async def get_documents(user: dict = Depends(get_current_user), vehicle_id: Optional[int] = None):
    conn = get_db()
    if vehicle_id:
        rows = conn.execute("SELECT * FROM fleet_documents WHERE vehicle_id=? ORDER BY created_at DESC", (vehicle_id,)).fetchall()
    else:
        rows = conn.execute("SELECT d.*, v.name as vehicle_name FROM fleet_documents d LEFT JOIN fleet_vehicles v ON d.vehicle_id=v.id ORDER BY d.created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/fleet/documents")
async def create_document(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    doc_vehicle_id = body.get("vehicle_id")
    doc_name = (body.get("name") or "").strip()
    if not doc_vehicle_id or not doc_name:
        conn.close()
        raise HTTPException(400, "vehicle_id and name are required")
    c = conn.execute("INSERT INTO fleet_documents (vehicle_id,name,type,expiry_date,notes) VALUES (?,?,?,?,?)",
                     (doc_vehicle_id,doc_name,body.get("type","other"),body.get("expiry_date"),body.get("notes")))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM fleet_documents WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    return row

# Fleet - Stats
@app.get("/api/fleet/stats")
async def fleet_stats(user: dict = Depends(get_current_user)):
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) as c FROM fleet_vehicles").fetchone()["c"]
    by_status = conn.execute("SELECT status, COUNT(*) as c FROM fleet_vehicles GROUP BY status").fetchall()
    by_type = conn.execute("SELECT type, COUNT(*) as c FROM fleet_vehicles GROUP BY type").fetchall()
    total_fuel_cost = conn.execute("SELECT COALESCE(SUM(total_cost),0) as s FROM fleet_fuel_logs").fetchone()["s"]
    total_trips = conn.execute("SELECT COUNT(*) as c FROM fleet_trips").fetchone()["c"]
    active_trips = conn.execute("SELECT COUNT(*) as c FROM fleet_trips WHERE status='active'").fetchone()["c"]
    conn.close()
    return {
        "total_vehicles": total,
        "by_status": {r["status"]: r["c"] for r in by_status},
        "by_type": {r["type"]: r["c"] for r in by_type},
        "total_fuel_cost": round(total_fuel_cost, 2),
        "total_trips": total_trips,
        "active_trips": active_trips,
    }

# ─── Push Notifications ────────────────────────────────────────────────────────

def _generate_vapid_keys() -> dict:
    """
    Generate EC P-256 VAPID key pair.
    - public_key:  uncompressed EC point (65 bytes), URL-safe base64, no padding
    - private_key: raw 32-byte scalar, URL-safe base64, no padding
    Both formats are what pywebpush + the Web Push spec expect.
    """
    import base64
    try:
        from cryptography.hazmat.primitives.asymmetric.ec import generate_private_key, SECP256R1
        from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
        priv = generate_private_key(SECP256R1())
        # Public key: uncompressed point 0x04 || X || Y  (65 bytes)
        pub_bytes = priv.public_key().public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
        # Private key: raw 32-byte big-endian scalar (NOT PKCS8 DER)
        priv_int = priv.private_numbers().private_value
        priv_bytes = priv_int.to_bytes(32, byteorder='big')
        public_key_b64  = base64.urlsafe_b64encode(pub_bytes).rstrip(b'=').decode()
        private_key_b64 = base64.urlsafe_b64encode(priv_bytes).rstrip(b'=').decode()
        return {"public_key": public_key_b64, "private_key": private_key_b64}
    except ImportError:
        # cryptography not installed – dummy keys so UI flows work.
        # Push delivery requires:  pip install pywebpush cryptography
        priv_b = secrets.token_bytes(32)           # random 32-byte scalar
        pub_b  = b'\x04' + secrets.token_bytes(64) # fake uncompressed EC point
        return {
            "public_key":  base64.urlsafe_b64encode(pub_b).rstrip(b'=').decode(),
            "private_key": base64.urlsafe_b64encode(priv_b).rstrip(b'=').decode(),
        }

def _get_or_create_vapid_keys() -> dict:
    """
    Return existing VAPID keys from DB or generate and store new ones.
    If the stored private key looks like a PKCS8 blob (wrong format, > 44 base64 chars
    for a 32-byte key = 43 chars without padding), regenerate and overwrite.
    """
    import base64
    conn = get_db()
    row = conn.execute("SELECT public_key, private_key FROM vapid_keys WHERE id=1").fetchone()
    need_regen = True
    if row:
        priv_b64 = row["private_key"]
        # A raw 32-byte key is ceil(32*4/3) = 43 base64url chars (no padding).
        # PKCS8 DER for P-256 is ~121 bytes → 162 chars.  Anything > 50 is wrong.
        try:
            padding = '=' * ((4 - len(priv_b64) % 4) % 4)
            decoded_len = len(base64.urlsafe_b64decode(priv_b64 + padding))
            if decoded_len == 32:
                need_regen = False  # correct format
            else:
                print(f"[Push] VAPID private key has wrong length ({decoded_len} bytes, expected 32). Regenerating…")
        except Exception:
            print("[Push] VAPID private key undecodable. Regenerating…")

    if not need_regen:
        conn.close()
        return {"public_key": row["public_key"], "private_key": row["private_key"]}

    # Generate fresh keys
    keys = _generate_vapid_keys()
    conn.execute("DELETE FROM vapid_keys WHERE id=1")
    conn.execute(
        "INSERT INTO vapid_keys (id, private_key, public_key) VALUES (1,?,?)",
        (keys["private_key"], keys["public_key"])
    )
    conn.commit()
    conn.close()
    print("[Push] New VAPID keys generated and stored.")
    return keys

async def _send_web_push(subscription: dict, payload: dict) -> bool:
    """
    Send a Web Push notification via pywebpush.
    Requires: pip install pywebpush cryptography

    subscription dict keys: endpoint, p256dh, auth
    - p256dh and auth are URL-safe base64url strings (as received from the browser)
    - private_key is the raw 32-byte EC scalar, base64url-encoded (no padding)
    """
    try:
        from pywebpush import webpush, WebPushException
        vapid_keys = _get_or_create_vapid_keys()

        # pywebpush needs the subscription in the same format the browser sends,
        # i.e. a JSON dict with 'endpoint' and 'keys' sub-dict.
        sub_info = {
            "endpoint": subscription["endpoint"],
            "keys": {
                "p256dh": subscription["p256dh"],
                "auth":   subscription["auth"],
            },
        }

        webpush(
            subscription_info  = sub_info,
            data               = json.dumps(payload),
            vapid_private_key  = vapid_keys["private_key"],  # raw 32-byte scalar, base64url
            vapid_claims       = {
                "sub": "mailto:atlas@atlas-adminsysop.local",
                "aud": subscription["endpoint"].split("/")[0] + "//" + subscription["endpoint"].split("/")[2],
            },
            content_encoding   = "aes128gcm",  # RFC 8291 (supported by all modern browsers)
        )
        return True
    except ImportError:
        # pywebpush / cryptography not installed – UI still works, no server push
        print("[Push] pywebpush not installed. Run: pip install pywebpush cryptography")
        return False
    except Exception as e:
        print(f"[Push] send failed: {e}")
        # If the endpoint is gone (410 Gone / 404) remove it from DB
        err_str = str(e).lower()
        if any(x in err_str for x in ("410", "404", "gone", "not found", "expired", "unregistered")):
            try:
                conn = get_db()
                try:
                    conn.execute("DELETE FROM push_subscriptions WHERE endpoint=?",
                                 (subscription["endpoint"],))
                    conn.commit()
                    print(f"[Push] Removed stale subscription: {subscription['endpoint'][:60]}…")
                finally:
                    conn.close()
            except Exception:
                pass
        return False

async def broadcast_push_notification(title: str, body: str, severity: str = "info",
                                       alert_id: int = None, url: str = "/#/alerts",
                                       user_id: int = None, sound_name: str = None):
    """Send push to all subscribed users (or specific user if user_id given)."""
    conn = get_db()
    if user_id:
        rows = conn.execute("SELECT * FROM push_subscriptions WHERE user_id=?", (user_id,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM push_subscriptions").fetchall()
    conn.close()
    payload = {
        "title": title,
        "body": body,
        "severity": severity,
        "id": alert_id,
        "url": url,
        "sound_name": sound_name or CONFIG.get("alert_sound_name", ""),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    for row in rows:
        sub = {"endpoint": row["endpoint"], "p256dh": row["p256dh"], "auth": row["auth"]}
        await _send_web_push(sub, payload)
    # Also send APNs to all registered devices (or specific user)
    await _send_apns_all(title=title, body=body, severity=severity, alert_id=alert_id,
                         user_id=user_id, sound_name=sound_name)
    # Also send via FCM (Firebase Cloud Messaging) – free alternative
    await _send_fcm_all(title=title, body=body, severity=severity, alert_id=alert_id or 0,
                        user_id=user_id, sound_name=sound_name)

async def _send_apns_all(title: str, body: str, severity: str = "info",
                         alert_id: int = None, user_id: int = None, sound_name: str = None):
    """Send APNs push to all registered iOS/Mac devices (or specific user)."""
    key_id = CONFIG.get("apns_key_id", "")
    team_id = CONFIG.get("apns_team_id", "")
    p8_key = CONFIG.get("apns_p8_key", "")
    bundle_id = CONFIG.get("apns_bundle_id", "de.atlasadmin.app")
    sandbox = CONFIG.get("apns_sandbox", True)
    if not key_id or not team_id or not p8_key:
        return  # APNs not configured
    try:
        import time as _time
        import urllib.request as _ur
        import urllib.error as _ue
        # Build JWT
        import base64 as _b64
        import json as _json
        # Minimal JWT (ES256) for APNs
        header = _b64.urlsafe_b64encode(_json.dumps({"alg":"ES256","kid":key_id}).encode()).rstrip(b"=")
        claims = _b64.urlsafe_b64encode(_json.dumps({"iss":team_id,"iat":int(_time.time())}).encode()).rstrip(b"=")
        signing_input = header + b"." + claims
        # Sign with P8 key using cryptography library if available
        try:
            from cryptography.hazmat.primitives import hashes, serialization
            from cryptography.hazmat.primitives.asymmetric import ec
            p8_bytes = p8_key.encode() if isinstance(p8_key, str) else p8_key
            if not p8_bytes.startswith(b"-----"):
                # Raw base64: decode to DER bytes, then wrap in PEM
                import base64 as _b64i
                der = _b64i.b64decode(p8_bytes)
                p8_bytes = b"-----BEGIN PRIVATE KEY-----\n" + _b64i.b64encode(der) + b"\n-----END PRIVATE KEY-----"
            priv = serialization.load_pem_private_key(p8_bytes, password=None)
            sig = priv.sign(signing_input, ec.ECDSA(hashes.SHA256()))
            # DER to raw r+s
            from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
            r, s = decode_dss_signature(sig)
            raw_sig = r.to_bytes(32, "big") + s.to_bytes(32, "big")
            jwt_token = (signing_input + b"." + _b64.urlsafe_b64encode(raw_sig).rstrip(b"=")).decode()
        except Exception:
            return  # cryptography not installed
        conn = get_db()
        try:
            if user_id:
                tokens = conn.execute("SELECT device_token FROM apns_tokens WHERE user_id=?", (user_id,)).fetchall()
            else:
                tokens = conn.execute("SELECT device_token FROM apns_tokens").fetchall()
        finally:
            conn.close()
        if not tokens:
            return
        apns_host = "api.sandbox.push.apple.com" if sandbox else "api.push.apple.com"
        is_critical = severity == "critical"
        # Build APS sound field: critical alerts use the critical-sound dict
        if is_critical:
            resolved_sound = sound_name or CONFIG.get("alert_sound_name", "")
            if resolved_sound:
                aps_sound = {"critical": 1, "name": f"{resolved_sound}.caf", "volume": 1.0}
            else:
                aps_sound = {"critical": 1, "name": "default", "volume": 1.0}
        else:
            resolved_sound = sound_name or CONFIG.get("alert_sound_name", "")
            aps_sound = f"{resolved_sound}.caf" if resolved_sound else "default"
        payload_json = _json.dumps({
            "aps": {
                "alert": {"title": title, "body": body},
                "sound": aps_sound,
                "badge": 1,
                "interruption-level": "critical" if is_critical else "active",
                "content-available": 1,  # allow background fetch
            },
            "alertId": alert_id,
            "severity": severity,
            "sound_name": sound_name or CONFIG.get("alert_sound_name", ""),
        }).encode()
        for t in tokens:
            device_token = t["device_token"]
            req = _ur.Request(
                f"https://{apns_host}/3/device/{device_token}",
                data=payload_json,
                method="POST",
                headers={
                    "Authorization": f"Bearer {jwt_token}",
                    "apns-topic": bundle_id,
                    "apns-push-type": "alert",
                    "apns-priority": "10" if is_critical else "5",
                    "Content-Type": "application/json",
                }
            )
            try:
                with _ur.urlopen(req, timeout=5):
                    pass
            except _ue.HTTPError as e:
                if e.code == 410:  # Gone – token invalid, remove
                    conn2 = get_db()
                    try:
                        conn2.execute("DELETE FROM apns_tokens WHERE device_token=?", (device_token,))
                        conn2.commit()
                    finally:
                        conn2.close()
            except Exception:
                pass
    except Exception:
        pass

# GET /api/push/vapid-public-key
@app.get("/api/push/vapid-public-key")
async def get_vapid_public_key(user: dict = Depends(get_current_user)):
    keys = _get_or_create_vapid_keys()
    return {"public_key": keys["public_key"]}

# POST /api/push/subscribe
@app.post("/api/push/subscribe")
async def push_subscribe(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    endpoint = body.get("endpoint")
    keys = body.get("keys", {})
    p256dh = keys.get("p256dh", "")
    auth = keys.get("auth", "")
    if not endpoint or not p256dh or not auth:
        raise HTTPException(400, "Invalid subscription object")
    ua = request.headers.get("user-agent", "")[:200]
    conn = get_db()
    conn.execute("""
        INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
        VALUES (?,?,?,?,?)
        ON CONFLICT(endpoint) DO UPDATE SET
            user_id=excluded.user_id,
            p256dh=excluded.p256dh,
            auth=excluded.auth,
            user_agent=excluded.user_agent
    """, (user["id"], endpoint, p256dh, auth, ua))
    conn.commit()
    conn.close()
    log_action(user["id"], "push_subscribe", {"endpoint": endpoint[:80]})
    return {"status": "subscribed"}

# POST /api/push/unsubscribe
@app.post("/api/push/unsubscribe")
async def push_unsubscribe(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    endpoint = body.get("endpoint", "")
    if endpoint:
        conn = get_db()
        conn.execute("DELETE FROM push_subscriptions WHERE endpoint=? AND user_id=?",
                     (endpoint, user["id"]))
        conn.commit()
        conn.close()
    return {"status": "unsubscribed"}

# GET /api/push/status  (for settings page diagnostics)
@app.get("/api/push/status")
async def push_status(user: dict = Depends(get_current_user)):
    conn = get_db()
    subs = conn.execute("SELECT COUNT(*) as c FROM push_subscriptions WHERE user_id=?",
                        (user["id"],)).fetchone()["c"]
    total = conn.execute("SELECT COUNT(*) as c FROM push_subscriptions").fetchone()["c"]
    conn.close()
    try:
        from pywebpush import webpush  # noqa
        pywebpush_available = True
    except ImportError:
        pywebpush_available = False
    keys = _get_or_create_vapid_keys()
    return {
        "user_subscriptions": subs,
        "total_subscriptions": total,
        "pywebpush_available": pywebpush_available,
        "vapid_public_key": keys["public_key"],
    }

# POST /api/push/test  (send a test notification to current user)
@app.post("/api/push/test")
async def push_test(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM push_subscriptions WHERE user_id=?",
                        (user["id"],)).fetchall()
    conn.close()
    if not rows:
        raise HTTPException(400, "No push subscription found for this user. Enable push notifications first.")
    sent = 0
    for row in rows:
        sub = {"endpoint": row["endpoint"], "p256dh": row["p256dh"], "auth": row["auth"]}
        ok = await _send_web_push(sub, {
            "title": "🔔 Atlas Test Notification",
            "body": "Push notifications are working correctly!",
            "severity": "info",
            "url": "/#/settings",
        })
        if ok:
            sent += 1
    return {"sent": sent, "total": len(rows)}

# POST /api/push/apns/register
@app.post("/api/push/apns/register")
async def apns_register(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    device_token = body.get("device_token", "").strip()
    bundle_id = body.get("bundle_id", "de.atlasadmin.app")
    if not device_token:
        raise HTTPException(400, "device_token required")
    conn = get_db()
    conn.execute("""
        INSERT INTO apns_tokens (user_id, device_token, bundle_id)
        VALUES (?,?,?)
        ON CONFLICT(device_token) DO UPDATE SET user_id=excluded.user_id, bundle_id=excluded.bundle_id
    """, (user["id"], device_token, bundle_id))
    conn.commit()
    conn.close()
    return {"status": "registered"}

# DELETE /api/push/apns/unregister
@app.delete("/api/push/apns/unregister")
async def apns_unregister(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    device_token = body.get("device_token", "").strip()
    conn = get_db()
    conn.execute("DELETE FROM apns_tokens WHERE user_id=? AND device_token=?", (user["id"], device_token))
    conn.commit()
    conn.close()
    return {"status": "unregistered"}

# POST /api/push/apns/test
@app.post("/api/push/apns/test")
async def apns_test(user: dict = Depends(get_current_user)):
    await _send_apns_all(
        title="🔔 Atlas APNs Test",
        body="APNs push notifications are working!",
        severity="info",
        user_id=user["id"]
    )
    return {"status": "sent"}

# ─────────────────────────────────────────────────────────────────────────────
# FCM (Firebase Cloud Messaging) v1 API – free alternative to direct APNs
# Requires: pip install requests google-auth
# Config: set "fcm_service_account_path": "/path/to/serviceAccount.json" in config.json
#         OR place the service account JSON file next to main.py as "fcm_service_account.json"
# ─────────────────────────────────────────────────────────────────────────────

_fcm_access_token_cache: dict = {"token": None, "expires_at": 0}
_fcm_auth_error_logged: bool = False  # log the same auth error only once per process

def _get_fcm_access_token() -> Optional[str]:
    """Get a valid OAuth2 access token for FCM v1 using the service account."""
    import time
    now = time.time()
    if _fcm_access_token_cache["token"] and now < _fcm_access_token_cache["expires_at"] - 60:
        return _fcm_access_token_cache["token"]

    # Find service account file
    sa_path = CONFIG.get("fcm_service_account_path", "")
    if not sa_path:
        import os
        default = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fcm_service_account.json")
        if os.path.exists(default):
            sa_path = default
    if not sa_path:
        return None

    try:
        import json as _json
        from google.oauth2 import service_account
        import google.auth.transport.requests as _ga_req

        scopes = ["https://www.googleapis.com/auth/firebase.messaging"]
        creds = service_account.Credentials.from_service_account_file(sa_path, scopes=scopes)
        creds.refresh(_ga_req.Request())
        _fcm_access_token_cache["token"] = creds.token
        _fcm_access_token_cache["expires_at"] = creds.expiry.timestamp() if creds.expiry else now + 3600
        return creds.token
    except ImportError:
        print("[FCM] google-auth not installed. Run: pip install google-auth")
        return None
    except Exception as e:
        global _fcm_auth_error_logged
        if not _fcm_auth_error_logged:
            _fcm_auth_error_logged = True
            print(f"[FCM] Auth error (further identical errors suppressed): {e}")
        return None


async def _send_fcm_all(title: str, body: str, severity: str = "info",
                        alert_id: int = 0, user_id: int = None, sound_name: str = None):
    """Send FCM v1 push to all registered devices (or specific user if user_id given)."""
    access_token = _get_fcm_access_token()
    if not access_token:
        return  # FCM not configured

    try:
        import requests as _req
    except ImportError:
        print("[FCM] requests not installed. Run: pip install requests google-auth")
        return

    conn = get_db()
    if user_id:
        rows = conn.execute("SELECT fcm_token FROM fcm_tokens WHERE user_id=?", (user_id,)).fetchall()
    else:
        rows = conn.execute("SELECT fcm_token FROM fcm_tokens").fetchall()
    conn.close()

    if not rows:
        return

    # Get project_id from service account file
    sa_path = CONFIG.get("fcm_service_account_path", "")
    if not sa_path:
        import os
        sa_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fcm_service_account.json")
    try:
        import json as _json
        with open(sa_path) as f:
            project_id = _json.load(f).get("project_id", "")
    except Exception:
        project_id = CONFIG.get("fcm_project_id", "")

    if not project_id:
        print("[FCM] project_id not found")
        return

    fcm_url = f"https://fcm.googleapis.com/v1/projects/{project_id}/messages:send"
    is_critical = severity in ("critical", "emergency")
    snd = sound_name or ("emergency_siren" if is_critical else "default")

    for row in rows:
        token = row["fcm_token"]
        message = {
            "message": {
                "token": token,
                "notification": {
                    "title": title,
                    "body": body,
                },
                "data": {
                    "type": "emergency_broadcast" if is_critical else "alert",
                    "severity": severity,
                    "alertId": str(alert_id),
                    "sound_name": snd,
                    "title": title,
                    "body": body,
                },
                "apns": {
                    "headers": {
                        "apns-priority": "10",
                        "apns-push-type": "alert",
                    },
                    "payload": {
                        "aps": {
                            "sound": {
                                "critical": 1 if is_critical else 0,
                                "name": f"{snd}.caf",
                                "volume": 1.0,
                            },
                            "interruption-level": "critical" if is_critical else "active",
                            "content-available": 1,
                            "mutable-content": 1,
                        }
                    }
                },
                "android": {
                    "priority": "HIGH",
                    "notification": {
                        "sound": snd,
                        "channel_id": "atlas_critical" if is_critical else "atlas_alerts",
                    }
                }
            }
        }
        try:
            resp = _req.post(
                fcm_url,
                json=message,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                },
                timeout=10,
            )
            if resp.status_code == 200:
                print(f"[FCM] Sent to {token[:20]}...")
            elif resp.status_code in (400, 404):
                # Invalid/unregistered token – remove it
                err_detail = resp.json().get("error", {}).get("details", [{}])
                err_code = err_detail[0].get("errorCode", "") if err_detail else ""
                if err_code in ("UNREGISTERED", "INVALID_ARGUMENT"):
                    conn2 = get_db()
                    conn2.execute("DELETE FROM fcm_tokens WHERE fcm_token=?", (token,))
                    conn2.commit()
                    conn2.close()
                    print(f"[FCM] Removed stale token ({err_code})")
            else:
                print(f"[FCM] Error {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            print(f"[FCM] Send error: {e}")


# POST /api/push/fcm/register
@app.post("/api/push/fcm/register")
async def fcm_register(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    fcm_token = body.get("fcm_token", "").strip()
    if not fcm_token:
        raise HTTPException(400, "fcm_token required")
    conn = get_db()
    conn.execute("""
        INSERT INTO fcm_tokens (user_id, fcm_token)
        VALUES (?,?)
        ON CONFLICT(fcm_token) DO UPDATE SET user_id=excluded.user_id
    """, (user["id"], fcm_token))
    conn.commit()
    conn.close()
    return {"status": "registered"}

# DELETE /api/push/fcm/unregister
@app.delete("/api/push/fcm/unregister")
async def fcm_unregister(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    fcm_token = body.get("fcm_token", "").strip()
    conn = get_db()
    conn.execute("DELETE FROM fcm_tokens WHERE user_id=? AND fcm_token=?", (user["id"], fcm_token))
    conn.commit()
    conn.close()
    return {"status": "unregistered"}

# POST /api/push/fcm/test
@app.post("/api/push/fcm/test")
async def fcm_test(user: dict = Depends(get_current_user)):
    await _send_fcm_all(
        title="🔔 Atlas FCM Test",
        body="FCM push notifications are working!",
        severity="info",
        user_id=user["id"]
    )
    return {"status": "sent"}

# GET /api/mobile/qr-token  – admin generates an onboarding QR code
@app.get("/api/mobile/qr-token")
async def mobile_qr_token(request: Request, user: dict = Depends(require_admin)):
    import secrets as _sec
    token = _sec.token_urlsafe(24)
    expires = (datetime.utcnow() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
    conn = get_db()
    # Clean old tokens
    conn.execute("DELETE FROM mobile_qr_tokens WHERE expires_at < datetime('now') OR used=1")
    conn.execute("INSERT INTO mobile_qr_tokens (token, expires_at) VALUES (?,?)", (token, expires))
    conn.commit()
    conn.close()

    # Determine best server URL for the QR code:
    # Priority 1: Tailscale hostname/IP (reachable outside local network)
    # Priority 2: manually configured server_url
    # Priority 3: derive from incoming HTTP request
    port = CONFIG.get("port", 8080)
    tailscale_url = None
    try:
        import subprocess as _sp
        res = _sp.run(["tailscale", "status", "--json"], capture_output=True, text=True, timeout=5)
        if res.returncode == 0:
            ts_data = json.loads(res.stdout)
            self_node = ts_data.get("Self", {})
            dns_name = self_node.get("DNSName", "").rstrip(".")
            ts_ips = self_node.get("TailscaleIPs", [])
            if dns_name:
                tailscale_url = f"https://{dns_name}:{port}"
            elif ts_ips:
                tailscale_url = f"http://{ts_ips[0]}:{port}"
    except Exception:
        pass

    local_url = CONFIG.get("server_url", "").rstrip("/")
    if not local_url:
        local_url = f"{request.url.scheme}://{request.url.netloc}"

    # QR code always uses Tailscale URL if available (works from anywhere via Tailscale)
    server_url = tailscale_url if tailscale_url else local_url
    qr_payload = f"atlas://connect?url={server_url}&token={token}"
    return {
        "token": token,
        "qr_payload": qr_payload,
        "server_url": server_url,
        "tailscale_url": tailscale_url,
        "local_url": local_url,
        "expires_at": expires,
    }

# POST /api/mobile/qr-verify  – iOS app exchanges QR token for server URL
@app.post("/api/mobile/qr-verify")
async def mobile_qr_verify(request: Request):
    """Exchange a one-time QR token for the server URL.
    Intentionally unauthenticated (iOS onboarding), but token is single-use
    and expires after 5 minutes, providing sufficient protection."""
    body = await request.json()
    token = body.get("token", "")
    if not token or len(token) < 8:
        raise HTTPException(400, "Invalid token format")
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM mobile_qr_tokens WHERE token=? AND used=0 AND expires_at > datetime('now')",
        (token,)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(400, "Invalid or expired QR token")
    conn.execute("UPDATE mobile_qr_tokens SET used=1 WHERE token=?", (token,))
    conn.commit()
    conn.close()
    return {"valid": True, "org_name": CONFIG.get("org_name", "ControlCenterHQ")}

# ─── Device Location API ──────────────────────────────────────────────────────

@app.post("/api/device/location")
async def post_device_location(request: Request, user: dict = Depends(get_current_user)):
    """Receives GPS coordinates from the iOS app and stores them in device_locations.
    Also broadcasts a WebSocket event so the ops map can show live user positions."""
    body = await request.json()
    lat = body.get("lat")
    lng = body.get("lng")
    if lat is None or lng is None:
        raise HTTPException(400, "lat and lng are required")
    accuracy = body.get("accuracy")
    speed_ms = body.get("speed_ms")
    heading  = body.get("heading")

    conn = get_db()
    conn.execute(
        "INSERT INTO device_locations (user_id, lat, lng, accuracy, speed_ms, heading) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (user["id"], lat, lng, accuracy, speed_ms, heading)
    )
    # Keep only the last 500 records per user to avoid unbounded growth
    conn.execute(
        "DELETE FROM device_locations WHERE user_id=? AND id NOT IN ("
        "  SELECT id FROM device_locations WHERE user_id=? ORDER BY id DESC LIMIT 500"
        ")",
        (user["id"], user["id"])
    )
    conn.commit()
    conn.close()

    # Broadcast real-time location update to all connected clients
    await manager.broadcast({
        "type": "device_location",
        "data": {
            "user_id":  user["id"],
            "username": user["username"],
            "full_name": user.get("full_name", ""),
            "lat":      lat,
            "lng":      lng,
            "accuracy": accuracy,
            "speed_ms": speed_ms,
            "heading":  heading,
            "recorded_at": datetime.utcnow().isoformat() + "Z"
        }
    })
    return {"ok": True}


@app.get("/api/device/locations")
async def get_device_locations(user: dict = Depends(get_current_user)):
    """Returns the latest known GPS position for every user that has reported one.
    Used by the ops map to show mobile app users as live markers."""
    conn = get_db()
    rows = conn.execute("""
        SELECT dl.user_id, u.username, u.full_name, u.role,
               dl.lat, dl.lng, dl.accuracy, dl.speed_ms, dl.heading, dl.recorded_at
        FROM device_locations dl
        JOIN users u ON u.id = dl.user_id
        WHERE dl.id = (
            SELECT MAX(id) FROM device_locations dl2 WHERE dl2.user_id = dl.user_id
        )
        ORDER BY dl.recorded_at DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ─── Pager API ────────────────────────────────────────────────────────────────

@app.get("/api/pager/config")
async def get_pager_config_route(user: dict = Depends(get_current_user)):
    cfg = _get_pager_config()
    safe = dict(cfg)
    if safe.get("dapnet_password"):
        safe["dapnet_password"] = "••••••••"
    return safe

@app.put("/api/pager/config")
async def update_pager_config(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    conn.execute("INSERT OR IGNORE INTO pager_config (id) VALUES (1)")
    conn.commit()  # ensure the INSERT OR IGNORE is persisted even if no fields to update
    allowed = [
        "rx_enabled","rx_frequency","rx_gain","rx_create_alerts","rx_filter_capcodes",
        "dapnet_enabled","dapnet_callsign","dapnet_password","dapnet_transmitter_group",
        "dapnet_target_callsigns","dapnet_on_severity",
        "ntfy_enabled","ntfy_url","ntfy_topic","ntfy_token",
        "apprise_enabled","apprise_urls","channels",
        "gotify_enabled","gotify_url","gotify_token","gotify_priority",
    ]
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        conn.close()
        return {"ok": True}
    sets = ", ".join(f"{k}=?" for k in updates)
    try:
        conn.execute(f"UPDATE pager_config SET {sets} WHERE id=1", list(updates.values()))
        conn.commit()
    finally:
        conn.close()
    log_action(user["id"], "pager_config_update", {k: v for k, v in updates.items() if k != "dapnet_password"})
    return {"ok": True}

@app.get("/api/pager/rx/messages")
async def get_pager_rx_messages(limit: int = 100, user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM pager_rx_messages ORDER BY received_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/pager/rx/start")
async def pager_rx_start(user: dict = Depends(require_admin)):
    conn = get_db()
    conn.execute("INSERT OR IGNORE INTO pager_config (id) VALUES (1)")
    conn.execute("UPDATE pager_config SET rx_enabled=1 WHERE id=1")
    conn.commit()
    conn.close()
    return {"ok": True, "message": "POCSAG receiver enabled"}

@app.post("/api/pager/rx/stop")
async def pager_rx_stop(user: dict = Depends(require_admin)):
    global _rx_proc
    conn = get_db()
    conn.execute("UPDATE pager_config SET rx_enabled=0 WHERE id=1")
    conn.commit()
    conn.close()
    if _rx_proc and _rx_proc.poll() is None:
        _rx_proc.terminate()
        _rx_proc = None
    return {"ok": True, "message": "POCSAG receiver stopped"}

@app.get("/api/pager/rx/status")
async def pager_rx_status_route(user: dict = Depends(get_current_user)):
    cfg = _get_pager_config()
    return {
        "running": _rx_last.get("running", False) and bool(cfg.get("rx_enabled")),
        "rx_enabled": bool(cfg.get("rx_enabled", 0)),
        "frequency": cfg.get("rx_frequency", 439.9875),
        "last_received": _rx_last.get("received_at"),
        "total_received": _rx_last.get("count", 0),
        "process_active": _rx_proc is not None and (_rx_proc.poll() is None),
    }

@app.post("/api/pager/tx")
async def pager_tx(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    text = body.get("text", "").strip()
    callsigns = body.get("callsigns", [])
    if not text:
        raise HTTPException(400, "text is required")
    cfg = _get_pager_config()
    if not callsigns:
        try:
            callsigns = json.loads(cfg.get("dapnet_target_callsigns", "[]"))
        except Exception:
            callsigns = []
    if not callsigns:
        raise HTTPException(400, "No target callsigns configured")
    ok = await _send_dapnet(
        text=text, callsigns=callsigns,
        transmitter_group=cfg.get("dapnet_transmitter_group", "dl-all"),
        callsign=cfg.get("dapnet_callsign", ""),
        password=cfg.get("dapnet_password", ""),
        emergency=body.get("emergency", False),
    )
    log_action(user["id"], "pager_tx", {"text": text, "callsigns": callsigns})
    if not ok:
        raise HTTPException(500, "DAPNET send failed. Check config and credentials.")
    return {"ok": True, "message": f"Sent to {callsigns}"}

@app.post("/api/pager/tx/test")
async def pager_tx_test(user: dict = Depends(require_admin)):
    cfg = _get_pager_config()
    try:
        callsigns = json.loads(cfg.get("dapnet_target_callsigns", "[]"))
    except Exception:
        callsigns = []
    if not callsigns:
        raise HTTPException(400, "No target callsigns configured")
    ok = await _send_dapnet(
        text="ControlCenterHQ – DAPNET Test",
        callsigns=callsigns,
        transmitter_group=cfg.get("dapnet_transmitter_group", "dl-all"),
        callsign=cfg.get("dapnet_callsign", ""),
        password=cfg.get("dapnet_password", ""),
    )
    return {"ok": ok, "callsigns": callsigns}

@app.post("/api/pager/ntfy/test")
async def pager_ntfy_test(user: dict = Depends(require_admin)):
    cfg = _get_pager_config()
    ok = await _send_ntfy(
        title="Atlas Test", body="ntfy push notifications are working!",
        priority="default", url=cfg.get("ntfy_url", ""),
        topic=cfg.get("ntfy_topic", "atlas-alerts"), token=cfg.get("ntfy_token", ""),
    )
    return {"ok": ok}

@app.post("/api/pager/apprise/test")
async def pager_apprise_test(user: dict = Depends(require_admin)):
    cfg = _get_pager_config()
    ok = await _send_apprise(
        title="Atlas Test", body="Apprise notification dispatch is working!",
        urls_text=cfg.get("apprise_urls", ""),
    )
    return {"ok": ok}

@app.post("/api/pager/gotify/test")
async def pager_gotify_test(user: dict = Depends(require_admin)):
    cfg = _get_pager_config()
    ok = await _send_gotify(
        title="Atlas Test", body="Gotify test from ControlCenterHQ",
        priority=int(cfg.get("gotify_priority", 5)),
        url=cfg.get("gotify_url", ""), token=cfg.get("gotify_token", "")
    )
    return {"ok": ok}

# ─── Scheduled Items API ──────────────────────────────────────────────────────

@app.get("/api/scheduled")
async def get_scheduled(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute(
        "SELECT s.*, u.username as created_by_name FROM scheduled_items s "
        "LEFT JOIN users u ON s.created_by=u.id ORDER BY s.next_run"
    ).fetchall()
    conn.close()
    return {"items": [dict(r) for r in rows]}

@app.post("/api/scheduled")
async def create_scheduled(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    if not body.get("title"):
        raise HTTPException(400, "title is required")
    if not body.get("next_run"):
        raise HTTPException(400, "next_run is required (ISO datetime)")
    conn = get_db()
    try:
        conn.execute("""INSERT INTO scheduled_items
            (type, title, description, severity, source, recurrence, recurrence_data, next_run, enabled, created_by)
            VALUES (?,?,?,?,?,?,?,?,1,?)""", (
            body.get("type", "alert"),
            body["title"],
            body.get("description", ""),
            body.get("severity", "info"),
            body.get("source", "scheduled"),
            body.get("recurrence", "once"),
            json.dumps(body.get("recurrence_data", {}) if isinstance(body.get("recurrence_data"), dict) else _safe_json_loads(body.get("recurrence_data"), {})),
            body["next_run"],
            user["id"],
        ))
        conn.commit()
        row = conn.execute("SELECT * FROM scheduled_items WHERE id=last_insert_rowid()").fetchone()
        result = dict(row) if row else {}
    finally:
        conn.close()
    return result

@app.put("/api/scheduled/{sid}")
async def update_scheduled(sid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    existing = conn.execute("SELECT * FROM scheduled_items WHERE id=?", (sid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Not found")
    ex = dict(existing)
    merged = {
        "title":           body.get("title",           ex["title"]),
        "description":     body.get("description",     ex.get("description")),
        "severity":        body.get("severity",        ex["severity"]),
        "source":          body.get("source",          ex.get("source","scheduled")),
        "recurrence":      body.get("recurrence",      ex["recurrence"]),
        "recurrence_data": json.dumps(body.get("recurrence_data", _safe_json_loads(ex.get("recurrence_data"), {}))),
        "next_run":        body.get("next_run",        ex["next_run"]),
        "enabled":         int(body.get("enabled",     ex["enabled"])),
        "type":            body.get("type",            ex["type"]),
    }
    conn.execute("""UPDATE scheduled_items SET type=?,title=?,description=?,severity=?,source=?,
        recurrence=?,recurrence_data=?,next_run=?,enabled=? WHERE id=?""",
        (merged["type"], merged["title"], merged["description"], merged["severity"],
         merged["source"], merged["recurrence"], merged["recurrence_data"],
         merged["next_run"], merged["enabled"], sid))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM scheduled_items WHERE id=?", (sid,)).fetchone())
    conn.close()
    return row

@app.delete("/api/scheduled/{sid}")
async def delete_scheduled(sid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    conn.execute("DELETE FROM scheduled_items WHERE id=?", (sid,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/scheduled/{sid}/run-now")
async def run_scheduled_now(sid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    item = conn.execute("SELECT * FROM scheduled_items WHERE id=?", (sid,)).fetchone()
    conn.close()
    if not item:
        raise HTTPException(404, "Not found")
    item = dict(item)
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    if item["type"] == "alert":
        conn = get_db()
        conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES ('scheduled',?,?,?)",
                     (item["title"], item["severity"], "scheduler:manual"))
        conn.commit()
        a_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
        a_row = {"id": a_id, "type": "scheduled", "message": item["title"],
                 "severity": item["severity"], "source": "scheduler:manual",
                 "acknowledged": 0, "created_at": now_str}
        conn.close()
        await manager.broadcast({"type": "alert_new", "data": a_row})
        if item["severity"] in ("warning", "critical"):
            asyncio.create_task(broadcast_push_notification(
                title=f"Scheduled: {item['title']}", body=item.get("description","") or item["title"],
                severity=item["severity"], alert_id=a_id, url="/#/alerts"
            ))
        asyncio.create_task(_dispatch_all_channels(a_row))
        return {"ok": True, "alert_id": a_id}
    elif item["type"] == "incident":
        conn = get_db()
        conn.execute("INSERT INTO incidents (title,description,severity,status) VALUES (?,?,?,?)",
                     (item["title"], item.get("description") or "", item["severity"], "open"))
        conn.commit()
        inc_id = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
        conn.close()
        await manager.broadcast({"type": "incident_new", "data": {
            "id": inc_id, "title": item["title"], "severity": item["severity"],
            "status": "open", "created_at": now_str
        }})
        return {"ok": True, "incident_id": inc_id}
    return {"ok": False, "message": "Unknown type"}

# ─── Weather API ──────────────────────────────────────────────────────────────

@app.get("/api/weather")
async def get_weather(lat: float = 51.5, lon: float = 9.0, user: dict = Depends(get_current_user)):
    """Fetch weather from Open-Meteo (free, no key required)."""
    conn = get_db()
    cache = conn.execute("SELECT * FROM weather_cache WHERE id=1").fetchone()
    now_ts = datetime.utcnow()
    # Use cache if same location and fresh (<15 min)
    if cache:
        cached = dict(cache)
        try:
            fetched = datetime.fromisoformat(cached["fetched_at"].replace(" ", "T"))
            if (now_ts - fetched).total_seconds() < 900 and abs((cached.get("lat") or 0) - lat) < 0.1 and abs((cached.get("lng") or 0) - lon) < 0.1:
                conn.close()
                return json.loads(cached["data"])
        except Exception:
            pass
    # Fetch from Open-Meteo
    try:
        import urllib.request
        url = (f"https://api.open-meteo.com/v1/forecast"
               f"?latitude={lat}&longitude={lon}"
               f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,apparent_temperature"
               f"&hourly=temperature_2m,precipitation_probability,weathercode"
               f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode"
               f"&timezone=auto&forecast_days=7")
        with urllib.request.urlopen(url, timeout=8) as r:
            data = json.loads(r.read().decode())
        conn.execute("INSERT OR REPLACE INTO weather_cache (id, lat, lng, data, fetched_at) VALUES (1,?,?,?,?)",
                     (lat, lon, json.dumps(data), now_ts.strftime("%Y-%m-%d %H:%M:%S")))
        conn.commit()
        conn.close()
        return data
    except Exception as e:
        conn.close()
        return {"error": str(e)}

# ─── System: Backup, Restart, Pi-Sensors ──────────────────────────────────────

@app.get("/api/system/sensors")
async def get_system_sensors(user: dict = Depends(get_current_user)):
    """Read Raspberry Pi CPU temperature and voltage (read-only, returns 0 on non-Pi)."""
    sensors = {"cpu_temp_c": None, "cpu_voltage_v": None, "platform": "unknown"}
    # CPU temperature
    try:
        temp_path = Path("/sys/class/thermal/thermal_zone0/temp")
        if temp_path.exists():
            sensors["cpu_temp_c"] = round(int(temp_path.read_text().strip()) / 1000.0, 1)
            sensors["platform"] = "raspberry_pi"
    except Exception:
        pass
    # CPU voltage via vcgencmd
    try:
        import subprocess
        result = subprocess.run(["vcgencmd", "measure_volts", "core"], capture_output=True, text=True, timeout=2)
        if result.returncode == 0:
            v_str = result.stdout.strip()  # "volt=1.2000V"
            sensors["cpu_voltage_v"] = float(v_str.split("=")[1].rstrip("V"))
            sensors["platform"] = "raspberry_pi"
    except Exception:
        pass
    # Fallback: try /sys/class/hwmon
    if sensors["cpu_temp_c"] is None:
        try:
            import glob as _glob
            for p in _glob.glob("/sys/class/hwmon/hwmon*/temp1_input"):
                val = int(Path(p).read_text().strip())
                sensors["cpu_temp_c"] = round(val / 1000.0, 1)
                break
        except Exception:
            pass
    return sensors

@app.get("/api/system/backup")
async def create_backup(user: dict = Depends(require_admin)):
    """Stream the SQLite database as a binary download."""
    import shutil
    backup_path = BASE_DIR / "atlas_backup.db"
    shutil.copy2(str(DB_PATH), str(backup_path))
    def iterfile():
        with open(str(backup_path), "rb") as f:
            while chunk := f.read(65536):
                yield chunk
    return StreamingResponse(
        iterfile(),
        media_type="application/octet-stream",
        headers={"Content-Disposition": "attachment; filename=atlas_backup.db"}
    )

@app.post("/api/system/restart")
async def restart_server(user: dict = Depends(require_admin)):
    """Schedule a server restart after 2 seconds."""
    import threading
    log_action(user["id"], "system_restart", {})
    def _restart():
        time.sleep(2)
        os.execv(sys.executable, [sys.executable] + sys.argv)
    threading.Thread(target=_restart, daemon=True).start()
    return {"ok": True, "message": "Server restarting in 2 seconds..."}

@app.get("/api/system/update-check")
async def system_update_check(user: dict = Depends(require_admin)):
    """Check if a newer version is available.
    Uses git (if repo) or a remote version.txt to compare against APP_VERSION."""
    import subprocess, re as _re

    current = APP_VERSION

    # ── Try git first ──────────────────────────────────────────────────────
    git_available = False
    remote_version = None
    update_available = False
    method = "none"
    error = None

    try:
        # Check if we're inside a git repo
        subprocess.run(
            ["git", "rev-parse", "--git-dir"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True, timeout=5, check=True
        )
        git_available = True

        # git fetch (non-blocking, just updates remote refs)
        fetch = subprocess.run(
            ["git", "fetch", "--quiet", "--depth=1"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True, timeout=15
        )

        if fetch.returncode == 0:
            # Read APP_VERSION from remote main.py without checking out
            for branch in ("origin/main", "origin/master"):
                show = subprocess.run(
                    ["git", "show", f"{branch}:main.py"],
                    cwd=os.path.dirname(os.path.abspath(__file__)),
                    capture_output=True, timeout=10
                )
                if show.returncode == 0:
                    m = _re.search(r'APP_VERSION\s*=\s*["\'](\d[\d.]+)', show.stdout.decode("utf-8", errors="ignore"))
                    if m:
                        remote_version = m.group(1)
                        method = "git"
                        break
        else:
            error = "git fetch fehlgeschlagen (kein Internetzugang?)"
    except (subprocess.TimeoutExpired, subprocess.CalledProcessError, FileNotFoundError):
        git_available = False

    # ── Fallback: version.txt vom Update-Server ────────────────────────────
    if remote_version is None and not git_available:
        update_url = CONFIG.get("update_url", "")
        if update_url:
            import urllib.request as _ur2, urllib.error as _ue2
            version_url = update_url.rsplit("/", 1)[0] + "/version.txt"
            try:
                with _ur2.urlopen(version_url, timeout=5) as resp:
                    remote_version = resp.read().decode("utf-8", errors="ignore").strip()
                    method = "version.txt"
            except Exception as e:
                error = str(e)

    # ── Version vergleichen ────────────────────────────────────────────────
    def _parse_ver(v):
        try:
            return [int(x) for x in str(v).split(".")]
        except Exception:
            return [0]

    if remote_version:
        update_available = _parse_ver(remote_version) > _parse_ver(current)

    # ── Letztes Update-Datum aus git log ───────────────────────────────────
    last_update = None
    if git_available:
        try:
            log = subprocess.run(
                ["git", "log", "-1", "--format=%ci"],
                cwd=os.path.dirname(os.path.abspath(__file__)),
                capture_output=True, timeout=5
            )
            if log.returncode == 0:
                last_update = log.stdout.decode("utf-8", errors="ignore").strip()
        except Exception:
            pass

    return {
        "current_version": current,
        "remote_version": remote_version,
        "update_available": update_available,
        "git_available": git_available,
        "method": method,
        "last_update": last_update,
        "error": error,
        "update_command": "./update.sh",
    }


@app.post("/api/system/run-update")
async def system_run_update(user: dict = Depends(require_admin)):
    """Trigger update.sh in background. Works only if update.sh exists next to main.py."""
    import threading, subprocess as _sp
    script = os.path.join(os.path.dirname(os.path.abspath(__file__)), "update.sh")
    if not os.path.isfile(script):
        raise HTTPException(404, "update.sh nicht gefunden")
    log_action(user["id"], "system_update_triggered", {"script": script})

    def _run():
        try:
            _sp.run(
                ["bash", script, "--no-restart"],
                cwd=os.path.dirname(script),
                timeout=300,
                capture_output=True,
            )
            # After files are updated, restart the server process
            time.sleep(2)
            os.execv(sys.executable, [sys.executable] + sys.argv)
        except Exception as e:
            print(f"[Update] failed: {e}")

    threading.Thread(target=_run, daemon=True).start()
    return {"ok": True, "message": "Update gestartet – Server startet nach Abschluss neu (~30s)"}


@app.post("/api/system/lockdown")
async def enable_lockdown(request: Request, user: dict = Depends(require_owner)):
    """Activate lockdown mode – blocks all non-owner API access immediately.
    Only the owner can enable or disable this."""
    global LOCKDOWN_MODE
    LOCKDOWN_MODE = True
    log_action(user["id"], "lockdown_enabled", {"ip": request.client.host if request.client else None})
    # Broadcast lockdown event to all connected clients.
    await manager.broadcast({"type": "lockdown", "data": {"active": True}})
    return {"ok": True, "lockdown": True, "message": "System is now in lockdown. Only owner can access."}

@app.delete("/api/system/lockdown")
async def disable_lockdown(request: Request, user: dict = Depends(require_owner)):
    """Deactivate lockdown mode."""
    global LOCKDOWN_MODE
    LOCKDOWN_MODE = False
    log_action(user["id"], "lockdown_disabled", {"ip": request.client.host if request.client else None})
    await manager.broadcast({"type": "lockdown", "data": {"active": False}})
    return {"ok": True, "lockdown": False, "message": "Lockdown lifted. System is operational."}

@app.get("/api/system/lockdown")
async def get_lockdown_status(user: dict = Depends(require_admin)):
    """Return current lockdown state."""
    return {"lockdown": LOCKDOWN_MODE}

# ─── Permissions API ──────────────────────────────────────────────────────────

ROLE_PRESETS = {
    "owner":          {"can_delete_alerts": 1, "can_ack_all": 1, "can_manage_users": 1, "can_manage_fleet": 1, "can_view_logs": 1, "can_send_pager": 1, "can_restart": 1, "can_backup": 1, "can_manage_calendar": 1, "can_approve_travel": 1},
    "admin":          {"can_delete_alerts": 1, "can_ack_all": 1, "can_manage_users": 1, "can_manage_fleet": 1, "can_view_logs": 1, "can_send_pager": 1, "can_restart": 1, "can_backup": 1, "can_manage_calendar": 1, "can_approve_travel": 1},
    "operator":       {"can_delete_alerts": 1, "can_ack_all": 1, "can_manage_users": 0, "can_manage_fleet": 1, "can_view_logs": 1, "can_send_pager": 1, "can_restart": 0, "can_backup": 0, "can_manage_calendar": 1, "can_approve_travel": 1},
    "dispatcher":     {"can_delete_alerts": 0, "can_ack_all": 1, "can_manage_users": 0, "can_manage_fleet": 0, "can_view_logs": 1, "can_send_pager": 1, "can_restart": 0, "can_backup": 0, "can_manage_calendar": 1, "can_approve_travel": 0},
    "abteilleitung":  {"can_delete_alerts": 0, "can_ack_all": 0, "can_manage_users": 0, "can_manage_fleet": 1, "can_view_logs": 1, "can_send_pager": 0, "can_restart": 0, "can_backup": 0, "can_manage_calendar": 1, "can_approve_travel": 1},
    "viewer":         {"can_delete_alerts": 0, "can_ack_all": 0, "can_manage_users": 0, "can_manage_fleet": 0, "can_view_logs": 0, "can_send_pager": 0, "can_restart": 0, "can_backup": 0, "can_manage_calendar": 0, "can_approve_travel": 0},
}

def get_user_permissions(user_id: int, role: str) -> dict:
    """Return merged permissions: role preset + individual overrides."""
    perms = dict(ROLE_PRESETS.get(role, ROLE_PRESETS["viewer"]))
    conn = get_db()
    rows = conn.execute("SELECT permission, value FROM user_permissions WHERE user_id=?", (user_id,)).fetchall()
    conn.close()
    for r in rows:
        perms[r["permission"]] = r["value"]
    return perms

@app.get("/api/permissions/presets")
async def get_permission_presets(user: dict = Depends(get_current_user)):
    return ROLE_PRESETS

@app.get("/api/users/{uid}/permissions")
async def get_user_perms(uid: int, user: dict = Depends(get_current_user)):
    if user["role"] != "admin" and user["id"] != uid:
        raise HTTPException(403, "Forbidden")
    conn = get_db()
    u = conn.execute("SELECT role FROM users WHERE id=?", (uid,)).fetchone()
    conn.close()
    if not u:
        raise HTTPException(404, "User not found")
    return {"permissions": get_user_permissions(uid, u["role"]), "role": u["role"]}

@app.put("/api/users/{uid}/permissions")
async def set_user_perms(uid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    perms = body.get("permissions", {})
    conn = get_db()
    for perm, val in perms.items():
        conn.execute("INSERT OR REPLACE INTO user_permissions (user_id, permission, value) VALUES (?,?,?)",
                     (uid, perm, 1 if val else 0))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.get("/api/groups")
async def get_groups(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute("SELECT * FROM user_groups ORDER BY name").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/groups")
async def create_group(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    group_name = (body.get("name") or "").strip()
    if not group_name:
        conn.close()
        raise HTTPException(400, "name is required")
    conn.execute("INSERT INTO user_groups (name, description, base_role, permissions) VALUES (?,?,?,?)",
                 (group_name, body.get("description",""), body.get("base_role","viewer"), json.dumps(body.get("permissions",{}))))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM user_groups WHERE id=last_insert_rowid()").fetchone())
    conn.close()
    return row

@app.put("/api/groups/{gid}")
async def update_group(gid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    conn.execute("UPDATE user_groups SET name=?,description=?,base_role=?,permissions=? WHERE id=?",
                 (body.get("name"), body.get("description",""), body.get("base_role","viewer"), json.dumps(body.get("permissions",{})), gid))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/groups/{gid}")
async def delete_group(gid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    conn.execute("DELETE FROM user_groups WHERE id=?", (gid,))
    conn.commit()
    conn.close()
    return {"ok": True}

# ─── Calendar API ─────────────────────────────────────────────────────────────

@app.get("/api/calendar")
async def get_calendar_events(user: dict = Depends(get_current_user)):
    conn = get_db()
    rows = conn.execute(
        "SELECT c.*, u.full_name as user_name FROM calendar_events c LEFT JOIN users u ON c.user_id=u.id ORDER BY c.start_date"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/calendar")
async def create_calendar_event(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    if not body.get("title") or not body.get("start_date"):
        raise HTTPException(400, "title and start_date required")
    # Vacation requests need approval; events are auto-approved for admin/operator
    status = "approved"
    if body.get("type") == "vacation" and user["role"] not in ("admin", "operator"):
        status = "pending"
    conn = get_db()
    conn.execute("""INSERT INTO calendar_events (user_id,title,type,start_date,end_date,all_day,description,status)
        VALUES (?,?,?,?,?,?,?,?)""",
        (user["id"], body["title"], body.get("type","event"),
         body["start_date"], body.get("end_date", body["start_date"]),
         1 if body.get("all_day", True) else 0,
         body.get("description",""), status))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM calendar_events WHERE id=last_insert_rowid()").fetchone())
    conn.close()
    await manager.broadcast({"type": "calendar_new", "data": row})
    return row

@app.put("/api/calendar/{cid}")
async def update_calendar_event(cid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    ev = conn.execute("SELECT * FROM calendar_events WHERE id=?", (cid,)).fetchone()
    if not ev:
        conn.close()
        raise HTTPException(404, "Event not found")
    ev = dict(ev)
    # Only admin/operator can approve; owner can edit their own events
    if user["role"] in ("admin", "operator"):
        new_status = body.get("status", ev["status"])
        approved_by = user["id"] if new_status == "approved" else ev.get("approved_by")
    else:
        if ev["user_id"] != user["id"]:
            conn.close()
            raise HTTPException(403, "Forbidden")
        new_status = ev["status"]
        approved_by = ev.get("approved_by")
    conn.execute("""UPDATE calendar_events SET title=?,type=?,start_date=?,end_date=?,all_day=?,description=?,status=?,approved_by=? WHERE id=?""",
        (body.get("title", ev["title"]), body.get("type", ev["type"]),
         body.get("start_date", ev["start_date"]), body.get("end_date", ev["end_date"]),
         1 if body.get("all_day", ev["all_day"]) else 0,
         body.get("description", ev["description"]), new_status, approved_by, cid))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM calendar_events WHERE id=?", (cid,)).fetchone())
    conn.close()
    return row

@app.delete("/api/calendar/{cid}")
async def delete_calendar_event(cid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    ev = conn.execute("SELECT * FROM calendar_events WHERE id=?", (cid,)).fetchone()
    if not ev:
        conn.close()
        raise HTTPException(404, "Not found")
    if user["role"] not in ("admin", "operator") and dict(ev)["user_id"] != user["id"]:
        conn.close()
        raise HTTPException(403, "Forbidden")
    conn.execute("DELETE FROM calendar_events WHERE id=?", (cid,))
    conn.commit()
    conn.close()
    return {"ok": True}

# ─── Travel Requests API ───────────────────────────────────────────────────────

@app.get("/api/travel")
async def get_travel_requests(user: dict = Depends(get_current_user)):
    conn = get_db()
    if user["role"] in ("admin", "operator"):
        rows = conn.execute(
            "SELECT t.*, u.full_name as requester_name, v.name as vehicle_name FROM travel_requests t "
            "LEFT JOIN users u ON t.requester_id=u.id LEFT JOIN fleet_vehicles v ON t.vehicle_id=v.id ORDER BY t.created_at DESC"
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT t.*, u.full_name as requester_name, v.name as vehicle_name FROM travel_requests t "
            "LEFT JOIN users u ON t.requester_id=u.id LEFT JOIN fleet_vehicles v ON t.vehicle_id=v.id "
            "WHERE t.requester_id=? ORDER BY t.created_at DESC", (user["id"],)
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/travel")
async def create_travel_request(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    if not body.get("title") or not body.get("destination"):
        raise HTTPException(400, "title and destination required")
    conn = get_db()
    conn.execute("""INSERT INTO travel_requests
        (requester_id,title,destination,start_date,end_date,vehicle_id,passengers,travel_type,solo,with_crew,notes)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (user["id"], body["title"], body["destination"],
         body.get("start_date",""), body.get("end_date",""),
         body.get("vehicle_id"), json.dumps(body.get("passengers",[])),
         body.get("travel_type","car"),
         1 if body.get("solo", True) else 0,
         1 if body.get("with_crew", False) else 0,
         body.get("notes","")))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM travel_requests WHERE id=last_insert_rowid()").fetchone())
    conn.close()
    await manager.broadcast({"type": "travel_new", "data": row})
    return row

@app.put("/api/travel/{rid}")
async def update_travel_request(rid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    req = conn.execute("SELECT * FROM travel_requests WHERE id=?", (rid,)).fetchone()
    if not req:
        conn.close()
        raise HTTPException(404, "Not found")
    req = dict(req)
    # Approval/rejection only for admin/operator
    new_status = req["status"]
    reviewer_notes = req.get("reviewer_notes", "")
    reviewed_by = req.get("reviewed_by")
    if "status" in body and user["role"] in ("admin", "operator"):
        new_status = body["status"]
        reviewed_by = user["id"]
        reviewer_notes = body.get("reviewer_notes", "")
    elif req["requester_id"] != user["id"]:
        conn.close()
        raise HTTPException(403, "Forbidden")
    # If user rejects a counter-offer, delete the request
    if body.get("action") == "reject_counteroffer" and req["requester_id"] == user["id"]:
        conn.execute("DELETE FROM travel_requests WHERE id=?", (rid,))
        conn.commit()
        conn.close()
        return {"ok": True, "deleted": True}
    conn.execute("""UPDATE travel_requests SET title=?,destination=?,start_date=?,end_date=?,vehicle_id=?,
        passengers=?,travel_type=?,solo=?,with_crew=?,notes=?,status=?,reviewed_by=?,reviewer_notes=?,updated_at=datetime('now')
        WHERE id=?""",
        (body.get("title", req["title"]), body.get("destination", req["destination"]),
         body.get("start_date", req["start_date"]), body.get("end_date", req["end_date"]),
         body.get("vehicle_id", req.get("vehicle_id")),
         json.dumps(body.get("passengers", _safe_json_loads(req.get("passengers"), []))),
         body.get("travel_type", req["travel_type"]),
         1 if body.get("solo", req["solo"]) else 0,
         1 if body.get("with_crew", req["with_crew"]) else 0,
         body.get("notes", req.get("notes","")),
         new_status, reviewed_by, reviewer_notes, rid))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM travel_requests WHERE id=?", (rid,)).fetchone())
    conn.close()
    await manager.broadcast({"type": "travel_update", "data": row})
    return row

@app.delete("/api/travel/{rid}")
async def delete_travel_request(rid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    req = conn.execute("SELECT * FROM travel_requests WHERE id=?", (rid,)).fetchone()
    if not req:
        conn.close()
        raise HTTPException(404, "Not found")
    req = dict(req)
    if user["role"] not in ("admin", "operator") and req["requester_id"] != user["id"]:
        conn.close()
        raise HTTPException(403, "Forbidden")
    conn.execute("DELETE FROM travel_requests WHERE id=?", (rid,))
    conn.commit()
    conn.close()
    return {"ok": True}

# ─── Vehicle Position Update + Trip Completion ────────────────────────────────

@app.post("/api/fleet/vehicles/{vid}/position")
async def update_vehicle_position(vid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    lat = body.get("lat")
    lng = body.get("lng")
    if lat is None or lng is None:
        raise HTTPException(400, "lat and lng required")
    conn = get_db()
    conn.execute("UPDATE fleet_vehicles SET lat=?,lng=?,updated_at=datetime('now') WHERE id=?", (lat, lng, vid))
    conn.commit()
    vehicle = conn.execute("SELECT * FROM fleet_vehicles WHERE id=?", (vid,)).fetchone()
    conn.close()
    if vehicle:
        await manager.broadcast({"type": "fleet_position_update", "data": {"id": vid, "lat": lat, "lng": lng}})
    return {"ok": True, "lat": lat, "lng": lng}

@app.post("/api/fleet/trips/{tid}/complete")
async def complete_trip(tid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    trip = conn.execute("SELECT * FROM fleet_trips WHERE id=?", (tid,)).fetchone()
    if not trip:
        conn.close()
        raise HTTPException(404, "Trip not found")
    trip = dict(trip)
    end_odometer = body.get("end_odometer_km")
    fuel_used = body.get("fuel_used_l", 0)
    end_lat = body.get("end_lat")
    end_lng = body.get("end_lng")
    notes = body.get("completed_notes", "")
    conn.execute("""UPDATE fleet_trips SET status='completed', actual_arrival=datetime('now'),
        fuel_used_l=?, end_lat=?, end_lng=?, completed_notes=? WHERE id=?""",
        (fuel_used, end_lat, end_lng, notes, tid))
    # Update vehicle odometer and fuel if provided
    if end_odometer and trip.get("vehicle_id"):
        conn.execute("UPDATE fleet_vehicles SET odometer_km=?,updated_at=datetime('now') WHERE id=?",
                     (end_odometer, trip["vehicle_id"]))
    if fuel_used and trip.get("vehicle_id"):
        conn.execute(
            "UPDATE fleet_vehicles SET "
            "fuel_current_l=CASE WHEN fuel_current_l-?>0 THEN fuel_current_l-? ELSE 0 END,"
            "updated_at=datetime('now') WHERE id=?",
            (fuel_used, fuel_used, trip["vehicle_id"]))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM fleet_trips WHERE id=?", (tid,)).fetchone())
    conn.close()
    await manager.broadcast({"type": "fleet_trip_completed", "data": row})
    return row

@app.put("/api/fleet/vehicles/{vid}/fuel")
async def update_vehicle_fuel(vid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    fields = []
    vals = []
    for f in ("fuel_capacity_l", "fuel_current_l", "fuel_avg_l100km"):
        if f in body:
            val = body[f]
            if not isinstance(val, (int, float)) or val < 0:
                conn.close()
                raise HTTPException(400, f"{f} must be a non-negative number")
            fields.append(f"{f}=?")
            vals.append(val)
    if not fields:
        conn.close()
        raise HTTPException(400, "No fuel fields provided")
    vals.append(vid)
    conn.execute(f"UPDATE fleet_vehicles SET {','.join(fields)},updated_at=datetime('now') WHERE id=?", vals)
    conn.commit()
    v = conn.execute("SELECT fuel_capacity_l,fuel_current_l,fuel_avg_l100km FROM fleet_vehicles WHERE id=?", (vid,)).fetchone()
    conn.close()
    return dict(v) if v is not None else {"ok": True}

# ─── Alert Acknowledgment (per user) ──────────────────────────────────────────

@app.post("/api/alerts/{aid}/acknowledge")
async def acknowledge_alert(aid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    alert = conn.execute("SELECT * FROM alerts WHERE id=?", (aid,)).fetchone()
    if not alert:
        conn.close()
        raise HTTPException(404, "Alert not found")
    conn.execute(
        "UPDATE alerts SET acknowledged=1, acknowledged_by=?, acknowledged_at=datetime('now') WHERE id=?",
        (user["id"], aid)
    )
    conn.commit()
    conn.close()
    await manager.broadcast({"type": "alert_ack", "data": {"id": aid, "acknowledged_by": user["id"], "username": user["username"]}})
    return {"ok": True}

@app.delete("/api/alerts/{aid}")
async def delete_alert(aid: int, user: dict = Depends(get_current_user)):
    perms = get_user_permissions(user["id"], user["role"])
    if not perms.get("can_delete_alerts"):
        raise HTTPException(403, "Insufficient permissions to delete alerts")
    conn = get_db()
    conn.execute("DELETE FROM alerts WHERE id=?", (aid,))
    conn.commit()
    conn.close()
    await manager.broadcast({"type": "alert_deleted", "data": {"id": aid}})
    return {"ok": True}

# ─── Roles / Custom Groups API ────────────────────────────────────────────────

BUILTIN_ROLES = {
    "admin":    {"label": "Admin",    "permissions": {"read":1,"create":1,"edit":1,"delete":1,"admin":1,"fleet":1,"pager":1,"analytics":1}},
    "operator": {"label": "Operator", "permissions": {"read":1,"create":1,"edit":1,"delete":0,"admin":0,"fleet":1,"pager":1,"analytics":1}},
    "viewer":   {"label": "Viewer",   "permissions": {"read":1,"create":0,"edit":0,"delete":0,"admin":0,"fleet":0,"pager":0,"analytics":0}},
}

ALL_PERMISSIONS = [
    {"key":"read",      "label":"Lesen / Anzeigen"},
    {"key":"create",    "label":"Erstellen"},
    {"key":"edit",      "label":"Bearbeiten"},
    {"key":"delete",    "label":"Löschen"},
    {"key":"fleet",     "label":"Flotte verwalten"},
    {"key":"pager",     "label":"Pager / Push senden"},
    {"key":"analytics", "label":"KI-Analytik sehen"},
    {"key":"admin",     "label":"Admin-Rechte (alles)"},
]

@app.get("/api/roles")
async def get_roles(user: dict = Depends(get_current_user)):
    conn = get_db()
    custom = conn.execute("SELECT * FROM user_groups ORDER BY name").fetchall()
    conn.close()
    result = []
    for rk, rv in BUILTIN_ROLES.items():
        result.append({"id": rk, "name": rk, "label": rv["label"],
                        "permissions": rv["permissions"], "builtin": True})
    for r in custom:
        try:
            perms = json.loads(r["permissions"] or "{}")
        except Exception:
            perms = {}
        result.append({"id": r["id"], "name": r["name"], "label": r["name"],
                        "description": r["description"], "permissions": perms, "builtin": False})
    return {"roles": result, "all_permissions": ALL_PERMISSIONS}

@app.post("/api/roles")
async def create_role(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = (body.get("name") or "").strip()
    if not name:
        raise HTTPException(400, "name required")
    if name in BUILTIN_ROLES:
        raise HTTPException(400, "Cannot shadow a built-in role name")
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO user_groups (name, description, base_role, permissions) VALUES (?,?,?,?)",
            (name, body.get("description",""), body.get("base_role","viewer"),
             json.dumps(body.get("permissions", {})))
        )
        conn.commit()
        row = dict(conn.execute("SELECT * FROM user_groups WHERE id=last_insert_rowid()").fetchone())
        conn.close()
        log_action(user["id"], "role_create", {"name": name})
        return row
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(400, "Role name already exists")

@app.put("/api/roles/{rid}")
async def update_role(rid: str, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    # Cannot edit built-in roles
    if rid in BUILTIN_ROLES:
        raise HTTPException(400, "Built-in roles cannot be modified")
    conn = get_db()
    existing = conn.execute("SELECT * FROM user_groups WHERE id=?", (rid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Role not found")
    conn.execute(
        "UPDATE user_groups SET name=?, description=?, permissions=? WHERE id=?",
        (body.get("name", existing["name"]),
         body.get("description", existing["description"] or ""),
         json.dumps(body.get("permissions", {})),
         rid)
    )
    conn.commit()
    conn.close()
    log_action(user["id"], "role_update", {"id": rid})
    return {"ok": True}

@app.delete("/api/roles/{rid}")
async def delete_role(rid: str, user: dict = Depends(require_admin)):
    if rid in BUILTIN_ROLES:
        raise HTTPException(400, "Built-in roles cannot be deleted")
    conn = get_db()
    existing = conn.execute("SELECT id FROM user_groups WHERE id=?", (rid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Role not found")
    # Move users with this role back to 'operator'
    conn.execute("UPDATE users SET role='operator' WHERE role=(SELECT name FROM user_groups WHERE id=?)", (rid,))
    conn.execute("DELETE FROM user_groups WHERE id=?", (rid,))
    conn.commit()
    conn.close()
    log_action(user["id"], "role_delete", {"id": rid})
    return {"ok": True}

# ─── Contacts API ─────────────────────────────────────────────────────────────

def _ensure_contacts_table(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            call_sign TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            email TEXT DEFAULT '',
            organization TEXT DEFAULT '',
            department TEXT DEFAULT '',
            role_label TEXT DEFAULT '',
            category TEXT DEFAULT 'other',
            notes TEXT DEFAULT '',
            is_favorite INTEGER NOT NULL DEFAULT 0,
            created_by INTEGER REFERENCES users(id),
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    conn.commit()

@app.get("/api/contacts")
async def get_contacts(user: dict = Depends(get_current_user), q: str = ""):
    conn = get_db()
    _ensure_contacts_table(conn)
    if q:
        rows = conn.execute(
            "SELECT * FROM contacts WHERE full_name LIKE ? OR call_sign LIKE ? OR organization LIKE ? ORDER BY is_favorite DESC, full_name",
            (f"%{q}%", f"%{q}%", f"%{q}%")
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM contacts ORDER BY is_favorite DESC, full_name").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/contacts")
async def create_contact(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    if not body.get("full_name"):
        raise HTTPException(400, "full_name required")
    conn = get_db()
    _ensure_contacts_table(conn)
    conn.execute("""
        INSERT INTO contacts (full_name, call_sign, phone, email, organization, department,
                              role_label, category, notes, is_favorite, created_by)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    """, (
        body["full_name"],
        body.get("call_sign",""), body.get("phone",""), body.get("email",""),
        body.get("organization",""), body.get("department",""),
        body.get("role_label",""), body.get("category","other"),
        body.get("notes",""), 1 if body.get("is_favorite") else 0,
        user["id"]
    ))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM contacts WHERE id=last_insert_rowid()").fetchone())
    conn.close()
    return row

@app.put("/api/contacts/{cid}")
async def update_contact(cid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    _ensure_contacts_table(conn)
    existing = conn.execute("SELECT * FROM contacts WHERE id=?", (cid,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(404, "Contact not found")
    conn.execute("""
        UPDATE contacts SET full_name=?,call_sign=?,phone=?,email=?,organization=?,
        department=?,role_label=?,category=?,notes=?,is_favorite=?,updated_at=datetime('now')
        WHERE id=?
    """, (
        body.get("full_name", existing["full_name"]),
        body.get("call_sign", existing["call_sign"] or ""),
        body.get("phone", existing["phone"] or ""),
        body.get("email", existing["email"] or ""),
        body.get("organization", existing["organization"] or ""),
        body.get("department", existing["department"] or ""),
        body.get("role_label", existing["role_label"] or ""),
        body.get("category", existing["category"] or "other"),
        body.get("notes", existing["notes"] or ""),
        1 if body.get("is_favorite") else 0,
        cid
    ))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM contacts WHERE id=?", (cid,)).fetchone())
    conn.close()
    return row

@app.delete("/api/contacts/{cid}")
async def delete_contact(cid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    _ensure_contacts_table(conn)
    conn.execute("DELETE FROM contacts WHERE id=?", (cid,))
    conn.commit()
    conn.close()
    return {"ok": True}

# ─── Voice Channel (WebRTC Signaling via WebSocket) ───────────────────────────
# Active voice channel state (in-memory, per server instance)
_voice_channel = {
    "active": False,
    "speaker_id": None,     # user_id currently speaking
    "speaker_name": None,
    "participants": {},      # user_id -> username
}

@app.get("/api/voice/status")
async def voice_status(user: dict = Depends(get_current_user)):
    return {
        "active": _voice_channel["active"],
        "speaker_id": _voice_channel["speaker_id"],
        "speaker_name": _voice_channel["speaker_name"],
        "participants": list(_voice_channel["participants"].values()),
        "participant_count": len(_voice_channel["participants"]),
    }

# ─── Setup Wizard API ────────────────────────────────────────────────────────

@app.get("/api/setup/status")
async def setup_status():
    """Check if first-time setup is required. No auth needed."""
    return {"setup_required": is_setup_required()}

# Dedicated rate limiter for the setup endpoint (public, no auth).
# Max 5 attempts per IP per hour – prevents brute-forcing the initial password.
_setup_attempts: dict[str, list[float]] = {}
_SETUP_MAX = 5
_SETUP_WINDOW = 3600  # 1 hour

def _check_setup_rate_limit(ip: str) -> None:
    now = time.time()
    attempts = [t for t in _setup_attempts.get(ip, []) if now - t < _SETUP_WINDOW]
    _setup_attempts[ip] = attempts
    if len(attempts) >= _SETUP_MAX:
        raise HTTPException(429, f"Too many setup attempts. Please wait before trying again.")
    _setup_attempts[ip].append(now)

@app.post("/api/setup/complete")
async def setup_complete(request: Request):
    """Complete first-time setup from web wizard. Only works when no config exists."""
    client_ip = request.client.host if request.client else "unknown"
    _check_setup_rate_limit(client_ip)
    if not is_setup_required():
        raise HTTPException(400, "Setup already completed")
    body = await request.json()
    org_name = body.get("org_name", "ControlCenterHQ").strip()
    facility_type = body.get("facility_type", "operations").strip()
    admin_name = body.get("admin_name", "Administrator").strip()
    admin_username = body.get("admin_username", "admin").strip()
    admin_password = body.get("admin_password", "").strip()
    port = int(body.get("port", 8000))
    tailscale_key = body.get("tailscale_key", "").strip()
    overpass_url = body.get("overpass_url", "https://overpass-api.de/api/interpreter").strip()

    if not org_name or not admin_username or not admin_password:
        raise HTTPException(400, "org_name, admin_username and admin_password are required")
    _validate_password_complexity(admin_password)

    pw_hash = hash_password(admin_password)
    cfg = {
        "org_name": org_name,
        "facility_type": facility_type,
        "admin_name": admin_name,
        "admin_username": admin_username,
        "admin_password_hash": pw_hash,
        "port": port,
        "host": "0.0.0.0",
        "tailscale_enabled": bool(tailscale_key),
        "tailscale_key": tailscale_key,
        "overpass_url": overpass_url,
        "copyright": "Felix Greis 2026",
        "app_name": "ControlCenterHQ",
        "version": "2.8.0",
    }
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2))
    # Reload global CONFIG so all subsequent requests use the new values
    global CONFIG
    CONFIG = load_config()
    # Ensure DB schema is up-to-date before writing user data
    init_db()
    # Seed initial data or update existing admin credentials
    conn = get_db()
    c = conn.cursor()
    existing = c.execute("SELECT COUNT(*) as n FROM users").fetchone()["n"]
    if existing == 0:
        # Pass credentials directly so the user's chosen password is used
        _seed_data(c, conn, admin_username=admin_username, pw_hash=pw_hash, admin_name=admin_name)
    else:
        # DB already has users (e.g. config.json was deleted but DB remains).
        # Update the admin user's credentials so the new password from the
        # setup wizard takes effect instead of the old one from the DB.
        # Use subquery instead of ORDER BY + LIMIT (not supported in SQLite UPDATE).
        # Prefer owner, then fall back to first admin.
        admin_row = c.execute(
            "SELECT id FROM users WHERE role IN ('owner','admin') ORDER BY CASE role WHEN 'owner' THEN 0 ELSE 1 END, id LIMIT 1"
        ).fetchone()
        if admin_row:
            c.execute(
                "UPDATE users SET username=?, password_hash=?, full_name=?, role='owner', is_active=1 WHERE id=?",
                (admin_username, pw_hash, admin_name, admin_row["id"])
            )
        conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/setup/reconfigure")
async def setup_reconfigure(request: Request, user: dict = Depends(require_admin)):
    """Allow admin to update port, org info and admin credentials after initial setup.
    Requires the current password for safety. No rate-limit needed (auth already required)."""
    body = await request.json()
    current_password = body.get("current_password", "").strip()
    if not current_password:
        raise HTTPException(400, "Aktuelles Passwort erforderlich")

    # Verify current password against the DB record for this user
    conn = get_db()
    try:
        row = conn.execute("SELECT password_hash FROM users WHERE id=?", (user["id"],)).fetchone()
    finally:
        conn.close()
    if not row or not verify_password(current_password, row["password_hash"]):
        raise HTTPException(403, "Aktuelles Passwort falsch")

    cfg = load_config()

    # Update org settings if provided
    if body.get("org_name"):
        cfg["org_name"] = body["org_name"].strip()
    if body.get("facility_type"):
        cfg["facility_type"] = body["facility_type"].strip()

    # Update port if provided
    new_port = body.get("port")
    if new_port is not None:
        try:
            new_port = int(new_port)
            if not (1024 <= new_port <= 65535):
                raise HTTPException(400, "Port muss zwischen 1024 und 65535 liegen")
            cfg["port"] = new_port
        except ValueError:
            raise HTTPException(400, "Ungültiger Port")

    # Update admin credentials if provided
    new_username  = body.get("admin_username", "").strip()
    new_password  = body.get("admin_password", "").strip()
    new_name      = body.get("admin_name", "").strip()

    db_fields, db_vals = [], []
    if new_username:
        db_fields.append("username=?"); db_vals.append(new_username)
        cfg["admin_username"] = new_username
    if new_name:
        db_fields.append("full_name=?"); db_vals.append(new_name)
        cfg["admin_name"] = new_name
    if new_password:
        _validate_password_complexity(new_password)
        pw_hash = hash_password(new_password)
        db_fields.append("password_hash=?"); db_vals.append(pw_hash)
        cfg["admin_password_hash"] = pw_hash

    if db_fields:
        conn = get_db()
        try:
            db_vals.append(user["id"])
            conn.execute(f"UPDATE users SET {', '.join(db_fields)} WHERE id=?", db_vals)
            conn.commit()
        finally:
            conn.close()

    CONFIG_PATH.write_text(json.dumps(cfg, indent=2))
    global CONFIG
    CONFIG = load_config()
    log_action(user["id"], "setup_reconfigure", {"port": cfg.get("port")})
    return {"ok": True, "port": cfg.get("port")}


@app.get("/api/setup/tailscale-peers")
async def setup_tailscale_peers(user: dict = Depends(require_admin)):
    """Discover other Atlas instances on the Tailscale network."""
    try:
        import subprocess as _sp
        res = _sp.run(["tailscale", "status", "--json"], capture_output=True, text=True, timeout=5)
        if res.returncode != 0:
            return {"peers": [], "error": "tailscale not available"}
        ts_data = json.loads(res.stdout)
        peers = []
        for k, v in ts_data.get("Peer", {}).items():
            if not v.get("Online"):
                continue
            ips = v.get("TailscaleIPs", [])
            if not ips:
                continue
            hostname = v.get("HostName", k)
            peers.append({"hostname": hostname, "ip": ips[0], "key": k})
        return {"peers": peers}
    except Exception as e:
        return {"peers": [], "error": str(e)}

# ─── Advanced Config API (Tailscale key, Overpass URL) ───────────────────────

@app.put("/api/config/advanced")
async def update_advanced_config(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    cfg = load_config()
    allowed = {"tailscale_key", "tailscale_enabled", "overpass_url", "federation_api_key"}
    for k, v in body.items():
        if k in allowed:
            cfg[k] = v
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2))
    global CONFIG
    CONFIG = load_config()
    log_action(user["id"], "advanced_config_update", {k: "***" if "key" in k or "password" in k else v for k, v in body.items() if k in allowed})
    return {"ok": True}

# ─── Predictive Dispatch ──────────────────────────────────────────────────────

@app.get("/api/analytics/predictive")
async def predictive_dispatch(user: dict = Depends(get_current_user)):
    """Analyse incident history: heatmap cells, risk hours, risk weekdays."""
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT lat, lng, severity, created_at FROM incidents WHERE lat IS NOT NULL AND lng IS NOT NULL ORDER BY created_at DESC LIMIT 2000"
        ).fetchall()
    finally:
        conn.close()

    # Build heatmap: grid cells 0.005° (~500m)
    CELL = 0.005
    cell_counts: dict = {}
    hour_counts = [0] * 24
    weekday_counts = [0] * 7
    severity_map = {"critical": 3, "warning": 2, "info": 1}

    for r in rows:
        lat, lng = round(r["lat"] / CELL) * CELL, round(r["lng"] / CELL) * CELL
        weight = severity_map.get(r["severity"], 1)
        key = f"{lat:.4f},{lng:.4f}"
        cell_counts[key] = cell_counts.get(key, 0) + weight
        try:
            dt = datetime.strptime(r["created_at"][:19], "%Y-%m-%d %H:%M:%S")
            hour_counts[dt.hour] += 1
            weekday_counts[dt.weekday()] += 1
        except Exception:
            pass

    heatmap = [
        {"lat": float(k.split(",")[0]), "lng": float(k.split(",")[1]), "weight": v}
        for k, v in sorted(cell_counts.items(), key=lambda x: -x[1])[:200]
    ]
    peak_hours = sorted(range(24), key=lambda h: -hour_counts[h])[:6]
    peak_days = sorted(range(7), key=lambda d: -weekday_counts[d])[:3]
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return {
        "heatmap": heatmap,
        "hour_distribution": hour_counts,
        "weekday_distribution": weekday_counts,
        "peak_hours": peak_hours,
        "peak_days": [day_names[d] for d in peak_days],
        "total_incidents": len(rows),
    }

# ─── Resource Intelligence ────────────────────────────────────────────────────

@app.get("/api/fleet/suggest")
async def suggest_vehicles(
    lat: float = 0, lng: float = 0, incident_type: str = "general",
    user: dict = Depends(get_current_user)
):
    """Suggest best vehicles for an incident based on distance, status and features."""
    conn = get_db()
    try:
        vehicles = conn.execute(
            "SELECT v.*, d.full_name as driver_name FROM fleet_vehicles v LEFT JOIN fleet_drivers d ON v.assigned_driver=d.id WHERE v.status='available'"
        ).fetchall()
    finally:
        conn.close()

    def haversine(lat1, lng1, lat2, lng2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
        return R * 2 * math.asin(math.sqrt(a))

    scored = []
    for v in vehicles:
        score = 100
        dist_km = None
        if lat and lng and v["lat"] and v["lng"]:
            dist_km = haversine(lat, lng, v["lat"], v["lng"])
            score -= min(dist_km * 2, 60)  # Penalise distance up to 60 pts
        features = (v["features"] or "").lower()
        engine = (v["engine_info"] or "").lower()
        # Bonus for relevant features
        if incident_type in ("fire", "brand") and any(x in features for x in ["wasser", "water", "löschwasser", "pump"]):
            score += 30
        if incident_type in ("medical", "rettung") and any(x in features for x in ["aed", "medic", "rettung", "sanitär"]):
            score += 30
        if incident_type in ("hazmat", "gefahrstoff") and "gefahrgut" in features:
            score += 25
        if v["fuel_current_l"] and v["fuel_capacity_l"]:
            fuel_pct = v["fuel_current_l"] / max(v["fuel_capacity_l"], 1)
            score += fuel_pct * 10
        scored.append({
            "id": v["id"], "name": v["name"], "type": v["type"],
            "license_plate": v["license_plate"], "driver": v["driver_name"],
            "lat": v["lat"], "lng": v["lng"], "dist_km": round(dist_km, 1) if dist_km else None,
            "features": v["features"] or "", "fuel_pct": round((v["fuel_current_l"] or 0) / max(v["fuel_capacity_l"] or 60, 1) * 100),
            "score": round(score, 1),
        })

    scored.sort(key=lambda x: -x["score"])
    return {"suggestions": scored[:10]}

# ─── Infrastructure Scanner (OSM / Overpass) ─────────────────────────────────

@app.get("/api/infrastructure")
async def get_infrastructure(lat: float, lng: float, radius: int = 300, user: dict = Depends(get_current_user)):
    """Fetch nearby infrastructure (hydrants, fire access, gas/water shutoffs) from Overpass API."""
    cfg = load_config()
    overpass_url = cfg.get("overpass_url", "https://overpass-api.de/api/interpreter")

    query = f"""[out:json][timeout:15];
(
  node["emergency"="fire_hydrant"](around:{radius},{lat},{lng});
  node["emergency"="water_rescue_station"](around:{radius},{lat},{lng});
  node["emergency"="suction_point"](around:{radius},{lat},{lng});
  node["man_made"="water_well"](around:{radius},{lat},{lng});
  node["fire_access"](around:{radius},{lat},{lng});
  node["amenity"="fire_station"](around:{radius * 5},{lat},{lng});
  node["man_made"="pipeline"](around:{radius},{lat},{lng});
  way["building"](around:{radius},{lat},{lng});
  node["hazmat"](around:{radius},{lat},{lng});
  node["emergency"="assembly_point"](around:{radius},{lat},{lng});
);
out body;>;out skel qt;"""

    try:
        import urllib.request as _ur
        import urllib.parse as _up
        data = _up.urlencode({"data": query}).encode()
        req = _ur.Request(overpass_url, data=data, headers={"User-Agent": "AtlasControlCenter/1.0"})
        with _ur.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode())

        features = []
        for el in result.get("elements", []):
            tags = el.get("tags", {})
            lat_el = el.get("lat")
            lng_el = el.get("lon")
            if lat_el is None or lng_el is None:
                continue
            feat_type = "unknown"
            label = ""
            icon = "🔵"
            if tags.get("emergency") == "fire_hydrant":
                feat_type = "hydrant"
                label = f"Hydrant {tags.get('ref','')}"
                icon = "🔴"
            elif tags.get("amenity") == "fire_station":
                feat_type = "fire_station"
                label = tags.get("name", "Feuerwehr")
                icon = "🚒"
            elif tags.get("emergency") == "assembly_point":
                feat_type = "assembly_point"
                label = tags.get("name", "Sammelstelle")
                icon = "🟢"
            elif tags.get("emergency") in ("suction_point", "water_rescue_station"):
                feat_type = "water_access"
                label = "Wasserentnahmestelle"
                icon = "💧"
            elif tags.get("man_made") == "pipeline":
                feat_type = "pipeline"
                label = f"Leitung ({tags.get('substance','unbekannt')})"
                icon = "🟡"
            elif tags.get("hazmat"):
                feat_type = "hazmat"
                label = "Gefahrstoff"
                icon = "☢️"
            elif tags.get("fire_access"):
                feat_type = "fire_access"
                label = "Feuerwehrzufahrt"
                icon = "🚧"
            else:
                feat_type = "building"
                label = tags.get("name", tags.get("building", "Gebäude"))
                icon = "🏢"
            features.append({
                "type": feat_type, "label": label, "icon": icon,
                "lat": lat_el, "lng": lng_el,
                "tags": {k: v for k, v in tags.items() if k in ("ref","name","operator","building","levels","addr:street","addr:housenumber","substance","pressure","diameter","material")},
            })
        return {"features": features, "count": len(features)}
    except Exception as e:
        raise HTTPException(503, f"Overpass API error: {e}")

# ─── Incident Report Generator ────────────────────────────────────────────────

@app.get("/api/incidents/{incident_id}/report")
async def generate_incident_report(incident_id: int, user: dict = Depends(get_current_user)):
    """Generate automatic incident report as structured JSON."""
    conn = get_db()
    try:
        inc = conn.execute(
            "SELECT i.*, u.full_name as assigned_name, c.username as creator FROM incidents i LEFT JOIN users u ON i.assigned_to=u.id LEFT JOIN users c ON i.created_by=c.id WHERE i.id=?",
            (incident_id,)
        ).fetchone()
        if not inc:
            raise HTTPException(404, "Incident not found")

        # Related alerts (source matches incident)
        alerts = conn.execute(
            "SELECT * FROM alerts WHERE source LIKE ? OR created_at BETWEEN ? AND COALESCE(?, datetime('now')) ORDER BY created_at",
            (f"%incident:{incident_id}%", inc["created_at"], inc["resolved_at"])
        ).fetchall()

        # Related fleet trips in timeframe
        trips = conn.execute(
            "SELECT t.*, v.name as vname, d.full_name as dname FROM fleet_trips t LEFT JOIN fleet_vehicles v ON t.vehicle_id=v.id LEFT JOIN fleet_drivers d ON t.driver_id=d.id WHERE t.status IN ('active','completed') AND t.departure_time >= ? ORDER BY t.departure_time",
            (inc["created_at"],)
        ).fetchall()

        # Event log entries related to this incident
        log_entries = conn.execute(
            "SELECT e.*, u.username FROM event_log e LEFT JOIN users u ON e.user_id=u.id WHERE e.timestamp BETWEEN ? AND COALESCE(?, datetime('now')) AND e.action NOT IN ('kpi_snapshot') ORDER BY e.timestamp LIMIT 50",
            (inc["created_at"], inc["resolved_at"])
        ).fetchall()
    finally:
        conn.close()

    def fmt_dt(s):
        if not s: return "—"
        try:
            return datetime.strptime(s[:19], "%Y-%m-%d %H:%M:%S").strftime("%d.%m.%Y %H:%M")
        except Exception:
            return s

    duration = None
    if inc["resolved_at"] and inc["created_at"]:
        try:
            s = datetime.strptime(inc["created_at"][:19], "%Y-%m-%d %H:%M:%S")
            e = datetime.strptime(inc["resolved_at"][:19], "%Y-%m-%d %H:%M:%S")
            minutes = int((e - s).total_seconds() / 60)
            duration = f"{minutes // 60}h {minutes % 60}min" if minutes >= 60 else f"{minutes} min"
        except Exception:
            pass

    return {
        "report": {
            "title": inc["title"],
            "incident_id": incident_id,
            "generated_at": datetime.utcnow().strftime("%d.%m.%Y %H:%M UTC"),
            "severity": inc["severity"],
            "status": inc["status"],
            "coordinates": {"lat": inc["lat"], "lng": inc["lng"]} if inc["lat"] else None,
            "timeline": {
                "opened": fmt_dt(inc["created_at"]),
                "resolved": fmt_dt(inc["resolved_at"]),
                "duration": duration,
            },
            "personnel": {
                "created_by": inc["creator"] or "—",
                "assigned_to": inc["assigned_name"] or "—",
            },
            "description": inc["description"] or "",
            "related_alerts": [
                {"id": a["id"], "type": a["type"], "message": a["message"], "severity": a["severity"], "time": fmt_dt(a["created_at"])}
                for a in alerts
            ],
            "deployed_vehicles": [
                {"vehicle": t["vname"], "driver": t["dname"], "departure": fmt_dt(t["departure_time"]), "arrival": fmt_dt(t["actual_arrival"]), "distance_km": t["distance_km"]}
                for t in trips
            ],
            "chronology": [
                {"time": fmt_dt(e["timestamp"]), "action": e["action"], "user": e["username"], "details": e["details"]}
                for e in log_entries
            ],
        }
    }

@app.get("/api/incidents/{incident_id}/report/html")
async def incident_report_html(incident_id: int, user: dict = Depends(get_current_user)):
    """Return a printable HTML report for the incident."""
    data = await generate_incident_report(incident_id, user)
    r = data["report"]
    cfg = load_config()
    org = cfg.get("org_name", "ControlCenterHQ")

    # Escape all user-controlled strings to prevent HTML injection
    def esc(v): return _html.escape(str(v)) if v is not None else "—"

    rows_alerts = "".join(f"<tr><td>{esc(a['time'])}</td><td>{esc(a['type'])}</td><td>{esc(a['message'])}</td><td>{esc(a['severity'])}</td></tr>" for a in r["related_alerts"]) or "<tr><td colspan='4'>—</td></tr>"
    rows_vehicles = "".join(f"<tr><td>{esc(v['vehicle'])}</td><td>{esc(v['driver'])}</td><td>{esc(v['departure'])}</td><td>{esc(v['arrival'])}</td><td>{esc(v['distance_km']) if v['distance_km'] else '—'} km</td></tr>" for v in r["deployed_vehicles"]) or "<tr><td colspan='5'>—</td></tr>"
    rows_chrono = "".join(f"<tr><td>{esc(c['time'])}</td><td>{esc(c['user'])}</td><td>{esc(c['action'])}</td></tr>" for c in r["chronology"]) or "<tr><td colspan='3'>—</td></tr>"
    coord_str = f"{r['coordinates']['lat']:.5f}, {r['coordinates']['lng']:.5f}" if r["coordinates"] else "—"

    report_html = f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Einsatzbericht #{incident_id}</title>
<style>body{{font-family:Arial,sans-serif;font-size:12px;color:#111;margin:24px}}h1{{font-size:18px;border-bottom:2px solid #333;padding-bottom:6px}}h2{{font-size:13px;background:#f0f0f0;padding:4px 8px;margin-top:18px}}table{{border-collapse:collapse;width:100%;margin-top:6px}}th,td{{border:1px solid #ccc;padding:4px 8px;text-align:left}}th{{background:#e8e8e8}}.meta{{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0}}.meta span{{display:block}}.meta b{{color:#555}}.footer{{margin-top:30px;font-size:10px;color:#888;border-top:1px solid #ccc;padding-top:6px}}</style></head><body>
<h1>Einsatzbericht – {esc(r['title'])}</h1>
<div class="meta">
<span><b>Einsatz-Nr:</b> #{r['incident_id']}</span><span><b>Erstellt am:</b> {esc(r['generated_at'])}</span>
<span><b>Eröffnet:</b> {esc(r['timeline']['opened'])}</span><span><b>Abgeschlossen:</b> {esc(r['timeline']['resolved'])}</span>
<span><b>Dauer:</b> {esc(r['timeline']['duration']) if r['timeline']['duration'] else '—'}</span><span><b>Schwere:</b> {esc(r['severity'])}</span>
<span><b>Status:</b> {esc(r['status'])}</span><span><b>Koordinaten:</b> {coord_str}</span>
<span><b>Erstellt von:</b> {esc(r['personnel']['created_by'])}</span><span><b>Zugeteilt an:</b> {esc(r['personnel']['assigned_to'])}</span>
</div>
<h2>Beschreibung</h2><p>{esc(r['description']) if r['description'] else '—'}</p>
<h2>Alarme</h2><table><tr><th>Zeit</th><th>Typ</th><th>Meldung</th><th>Schwere</th></tr>{rows_alerts}</table>
<h2>Eingesetzte Fahrzeuge</h2><table><tr><th>Fahrzeug</th><th>Fahrer</th><th>Abfahrt</th><th>Ankunft</th><th>Distanz</th></tr>{rows_vehicles}</table>
<h2>Einsatzchronologie</h2><table><tr><th>Zeit</th><th>Benutzer</th><th>Aktion</th></tr>{rows_chrono}</table>
<div class="footer">{esc(org)} – ControlCenterHQ | Automatisch generiert am {esc(r['generated_at'])} | Einsatz #{incident_id}</div>
</body></html>"""
    return HTMLResponse(report_html)

# ─── Federation / Multi-Leitstellen-Netzwerk ─────────────────────────────────

@app.get("/api/federation/peers")
async def list_peers(user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT id, name, url, status, last_seen, auto_discovered, created_at FROM federation_peers ORDER BY name").fetchall()
    finally:
        conn.close()
    return [dict(r) for r in rows]

@app.post("/api/federation/peers")
async def add_peer(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = (body.get("name") or "").strip()
    url = (body.get("url") or "").strip().rstrip("/")
    api_key = (body.get("api_key") or "").strip()
    auto_discovered = 1 if body.get("auto_discovered") else 0
    if not name or not url:
        raise HTTPException(400, "name and url required")
    conn = get_db()
    try:
        conn.execute("INSERT INTO federation_peers (name, url, api_key, auto_discovered) VALUES (?,?,?,?)", (name, url, api_key, auto_discovered))
        conn.commit()
        pid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    except Exception as e:
        raise HTTPException(400, str(e))
    finally:
        conn.close()
    return {"ok": True, "id": pid}

@app.put("/api/federation/peers/{pid}")
async def update_peer(pid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        peer = conn.execute("SELECT * FROM federation_peers WHERE id=?", (pid,)).fetchone()
        if not peer:
            raise HTTPException(404, "Peer not found")
        name = body.get("name", peer["name"])
        url = body.get("url", peer["url"])
        api_key = body.get("api_key", peer["api_key"])
        conn.execute("UPDATE federation_peers SET name=?, url=?, api_key=? WHERE id=?", (name, url, api_key, pid))
        conn.commit()
    finally:
        conn.close()
    return {"ok": True}

@app.delete("/api/federation/peers/{pid}")
async def delete_peer(pid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM federation_peers WHERE id=?", (pid,))
        conn.commit()
    finally:
        conn.close()
    return {"ok": True}

@app.get("/api/federation/peers/{pid}/ping")
async def ping_peer(pid: int, user: dict = Depends(get_current_user)):
    """Ping a peer to check if it's reachable and get its live state."""
    conn = get_db()
    peer = conn.execute("SELECT * FROM federation_peers WHERE id=?", (pid,)).fetchone()
    conn.close()
    if not peer:
        raise HTTPException(404, "Peer not found")
    try:
        import urllib.request as _ur
        headers = {"Authorization": f"Bearer {peer['api_key']}"} if peer["api_key"] else {}
        req = _ur.Request(f"{peer['url']}/api/federation/live", headers=headers)
        with _ur.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
        conn2 = get_db()
        try:
            conn2.execute("UPDATE federation_peers SET status='online', last_seen=datetime('now') WHERE id=?", (pid,))
            conn2.commit()
        finally:
            conn2.close()
        return {"status": "online", "data": data}
    except Exception as e:
        conn2 = get_db()
        try:
            conn2.execute("UPDATE federation_peers SET status='offline' WHERE id=?", (pid,))
            conn2.commit()
        finally:
            conn2.close()
        return {"status": "offline", "error": str(e)}

@app.get("/api/federation/live")
async def federation_live_state(request: Request):
    """Public endpoint (API-key protected) that returns current live state for federation partners."""
    cfg = load_config()
    fed_key = cfg.get("federation_api_key", "")
    auth_header = request.headers.get("Authorization", "")
    if fed_key and auth_header != f"Bearer {fed_key}":
        raise HTTPException(401, "Invalid federation API key")
    conn = get_db()
    try:
        incidents = conn.execute(
            "SELECT id, title, severity, status, lat, lng, created_at FROM incidents WHERE status IN ('open','in_progress') ORDER BY created_at DESC LIMIT 50"
        ).fetchall()
        alerts = conn.execute(
            "SELECT id, type, message, severity, created_at FROM alerts WHERE acknowledged=0 ORDER BY created_at DESC LIMIT 50"
        ).fetchall()
        assets = conn.execute(
            "SELECT id, name, type, lat, lng, status FROM assets WHERE status='active' AND lat IS NOT NULL LIMIT 100"
        ).fetchall()
        vehicles = conn.execute(
            "SELECT id, name, type, lat, lng, status FROM fleet_vehicles WHERE lat IS NOT NULL LIMIT 100"
        ).fetchall()
    finally:
        conn.close()
    cfg2 = load_config()
    return {
        "org_name": cfg2.get("org_name", "Atlas"),
        "timestamp": datetime.utcnow().isoformat(),
        "incidents": [dict(r) for r in incidents],
        "alerts": [dict(r) for r in alerts],
        "assets": [dict(r) for r in assets],
        "vehicles": [dict(r) for r in vehicles],
    }

@app.get("/api/federation/snapshot")
async def federation_snapshot(user: dict = Depends(get_current_user)):
    """Fetch live state from all online peers and return combined snapshot."""
    conn = get_db()
    peers = conn.execute("SELECT * FROM federation_peers WHERE status != 'offline'").fetchall()
    conn.close()
    import urllib.request as _ur
    results = []
    for peer in peers:
        try:
            headers = {"Authorization": f"Bearer {peer['api_key']}"} if peer["api_key"] else {}
            req = _ur.Request(f"{peer['url']}/api/federation/live", headers=headers)
            with _ur.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
            results.append({"peer_id": peer["id"], "peer_name": peer["name"], "status": "ok", "data": data})
            conn2 = get_db()
            try:
                conn2.execute("UPDATE federation_peers SET status='online', last_seen=datetime('now') WHERE id=?", (peer["id"],))
                conn2.commit()
            finally:
                conn2.close()
        except Exception as e:
            results.append({"peer_id": peer["id"], "peer_name": peer["name"], "status": "error", "error": str(e)})
            conn2 = get_db()
            try:
                conn2.execute("UPDATE federation_peers SET status='offline' WHERE id=?", (peer["id"],))
                conn2.commit()
            finally:
                conn2.close()
    return {"peers": results}

# ─── Intelligente Alarmierung ─────────────────────────────────────────────────

@app.post("/api/alerts/{aid}/prioritize")
async def prioritize_alert(aid: int, request: Request, user: dict = Depends(get_current_user)):
    """Manually set priority / alarm group for an alert."""
    body = await request.json()
    conn = get_db()
    alert = conn.execute("SELECT * FROM alerts WHERE id=?", (aid,)).fetchone()
    if not alert:
        conn.close()
        raise HTTPException(404, "Alert not found")
    new_sev = body.get("severity", alert["severity"])
    new_group = body.get("alarm_group", "")
    conn.execute("UPDATE alerts SET severity=? WHERE id=?", (new_sev, aid))
    conn.commit()
    conn.close()
    log_action(user["id"], "alert_prioritize", {"id": aid, "severity": new_sev, "group": new_group})
    return {"ok": True, "severity": new_sev}

@app.get("/api/alarm-groups")
async def get_alarm_groups(user: dict = Depends(get_current_user)):
    """Return all user groups usable as alarm groups, with member count."""
    conn = get_db()
    groups = conn.execute("SELECT g.*, COUNT(m.user_id) as member_count FROM user_groups g LEFT JOIN user_group_members m ON m.group_id=g.id GROUP BY g.id ORDER BY g.name").fetchall()
    conn.close()
    return [dict(g) for g in groups]

@app.post("/api/alerts/broadcast-emergency")
async def broadcast_emergency(request: Request, user: dict = Depends(require_admin)):
    """Trigger maximum emergency alert (Warntag / manual)."""
    body = await request.json()
    source = body.get("source", "manual")
    message = body.get("message", "MAXIMALER NOTFALL – Alle Einheiten in Bereitschaft")
    title = body.get("title", "⚠ NOTFALLALARM")
    conn = get_db()
    conn.execute(
        "INSERT INTO alerts (type,message,severity,source) VALUES ('emergency',?,?,?)",
        (message, "critical", source)
    )
    aid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.commit()
    conn.close()
    alert_data = {"id": aid, "type": "emergency", "message": message, "severity": "critical",
                  "source": source, "acknowledged": 0, "created_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")}
    await manager.broadcast({"type": "alert_new", "data": alert_data})
    await manager.broadcast({"type": "emergency_broadcast", "data": {
        "title": title, "message": message, "source": source
    }})
    await broadcast_push_notification(title=title, body=message, severity="critical", alert_id=aid, url="/#/alerts")
    asyncio.create_task(_dispatch_all_channels(alert_data))
    log_action(user["id"], "emergency_broadcast", {"source": source, "message": message})
    return {"ok": True, "alert_id": aid}

@app.get("/api/alerts/nina/status")
async def nina_status(user: dict = Depends(get_current_user)):
    """Return current NINA / MoWaS warning status."""
    return {
        "enabled": bool(CONFIG.get("nina_enabled", True)),
        "last_check": _nina_state.get("last_check"),
        "active_warnings": list(_nina_state.get("active_ids", [])),
        "warning_count": len(_nina_state.get("active_ids", [])),
    }

@app.put("/api/alerts/nina/config")
async def nina_config(request: Request, user: dict = Depends(require_admin)):
    """Enable/disable NINA monitoring."""
    body = await request.json()
    CONFIG["nina_enabled"] = bool(body.get("enabled", True))
    if CONFIG_PATH.exists():
        cfg = json.loads(CONFIG_PATH.read_text())
        cfg["nina_enabled"] = CONFIG["nina_enabled"]
        CONFIG_PATH.write_text(json.dumps(cfg, ensure_ascii=False, indent=2))
    return {"ok": True, "enabled": CONFIG["nina_enabled"]}

# ─── Push-to-Accept für Fahrzeuge ─────────────────────────────────────────────

@app.post("/api/fleet/vehicles/{vid}/dispatch")
async def dispatch_vehicle(vid: int, request: Request, user: dict = Depends(get_current_user)):
    """Dispatch a vehicle to an incident – sends push-to-accept to driver."""
    body = await request.json()
    incident_id = body.get("incident_id")
    message = body.get("message", "Einsatz zugewiesen – bitte bestätigen")
    conn = get_db()
    v = conn.execute("SELECT * FROM fleet_vehicles WHERE id=?", (vid,)).fetchone()
    if not v:
        conn.close()
        raise HTTPException(404, "Vehicle not found")
    driver_id = v["assigned_driver"]
    conn.execute("UPDATE fleet_vehicles SET status='dispatched' WHERE id=?", (vid,))
    conn.commit()
    # Find driver's user account (by driver table → name match in users)
    driver_user = None
    if driver_id:
        drv = conn.execute("SELECT * FROM fleet_drivers WHERE id=?", (driver_id,)).fetchone()
        if drv:
            driver_user = conn.execute("SELECT id FROM users WHERE full_name=? AND is_active=1", (drv["full_name"],)).fetchone()
    conn.close()
    await manager.broadcast({"type": "vehicle_dispatched", "data": {
        "vehicle_id": vid, "vehicle_name": v["name"], "incident_id": incident_id,
        "message": message, "dispatched_by": user.get("full_name") or user.get("username", "")
    }})
    if driver_user:
        await manager.send_to(driver_user["id"], {"type": "dispatch_request", "data": {
            "vehicle_id": vid, "vehicle_name": v["name"], "incident_id": incident_id,
            "message": message, "dispatched_by": user.get("full_name") or user.get("username", "")
        }})
        await broadcast_push_notification(
            title=f"Einsatz: {v['name']}",
            body=message,
            severity="critical",
            alert_id=None,
            url=f"/#/fleet",
            user_id=driver_user["id"]
        )
    log_action(user["id"], "vehicle_dispatch", {"vehicle_id": vid, "incident_id": incident_id})
    return {"ok": True, "vehicle": v["name"], "driver_notified": bool(driver_user)}

@app.post("/api/fleet/vehicles/{vid}/dispatch/accept")
async def accept_dispatch(vid: int, request: Request, user: dict = Depends(get_current_user)):
    """Driver accepts the dispatch."""
    conn = get_db()
    conn.execute("UPDATE fleet_vehicles SET status='on_trip' WHERE id=?", (vid,))
    conn.commit()
    conn.close()
    await manager.broadcast({"type": "dispatch_accepted", "data": {
        "vehicle_id": vid, "accepted_by": user.get("full_name") or user.get("username", ""), "user_id": user["id"]
    }})
    return {"ok": True}

@app.post("/api/fleet/vehicles/{vid}/dispatch/decline")
async def decline_dispatch(vid: int, request: Request, user: dict = Depends(get_current_user)):
    """Driver declines the dispatch."""
    body = await request.json()
    reason = body.get("reason", "")
    conn = get_db()
    conn.execute("UPDATE fleet_vehicles SET status='available' WHERE id=?", (vid,))
    conn.commit()
    conn.close()
    await manager.broadcast({"type": "dispatch_declined", "data": {
        "vehicle_id": vid, "declined_by": user.get("full_name") or user.get("username", ""), "reason": reason
    }})
    return {"ok": True}

# ─── Analytics: Fahrzeugauslastung + Trend-Erkennung ─────────────────────────

@app.get("/api/analytics/vehicle-utilization")
async def vehicle_utilization(user: dict = Depends(get_current_user), days: int = 30):
    """Return vehicle usage statistics over the past N days."""
    conn = get_db()
    since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M:%S")
    vehicles = conn.execute("SELECT id, name, type FROM fleet_vehicles").fetchall()
    result = []
    for v in vehicles:
        trips = conn.execute(
            "SELECT COUNT(*) as cnt, SUM(distance_km) as dist, SUM(fuel_used_l) as fuel FROM fleet_trips WHERE vehicle_id=? AND created_at > ?",
            (v["id"], since)
        ).fetchone()
        # On-trip time (sum of departure→actual_arrival)
        result.append({
            "vehicle_id": v["id"],
            "vehicle_name": v["name"],
            "vehicle_type": v["type"],
            "trip_count": trips["cnt"] or 0,
            "total_distance_km": round(trips["dist"] or 0, 1),
            "total_fuel_l": round(trips["fuel"] or 0, 1),
        })
    # Sort by trip count desc
    result.sort(key=lambda x: x["trip_count"], reverse=True)
    conn.close()
    return {"days": days, "vehicles": result}

@app.get("/api/analytics/incident-trends")
async def incident_trends(user: dict = Depends(get_current_user), days: int = 90):
    """Trend detection: incident type frequency over time, seasonal patterns."""
    conn = get_db()
    since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d %H:%M:%S")
    rows = conn.execute(
        "SELECT severity, strftime('%Y-%m-%d', created_at) as day, COUNT(*) as cnt FROM incidents WHERE created_at > ? GROUP BY severity, day ORDER BY day",
        (since,)
    ).fetchall()
    conn.close()
    by_day: dict = {}
    for r in rows:
        d = r["day"]
        if d not in by_day:
            by_day[d] = {"critical": 0, "warning": 0, "info": 0}
        by_day[d][r["severity"]] = r["cnt"]
    # Simple trend: compare last 7 days vs previous 7 days
    all_days = sorted(by_day.keys())
    recent_total = sum(sum(by_day[d].values()) for d in all_days[-7:]) if len(all_days) >= 7 else 0
    prev_total = sum(sum(by_day[d].values()) for d in all_days[-14:-7]) if len(all_days) >= 14 else 0
    trend_pct = round(((recent_total - prev_total) / max(prev_total, 1)) * 100, 1)
    return {
        "days": days,
        "by_day": by_day,
        "trend_7d_pct": trend_pct,
        "trend_direction": "up" if trend_pct > 5 else ("down" if trend_pct < -5 else "stable"),
        "recent_7d_total": recent_total,
        "prev_7d_total": prev_total,
    }

# WebSocket – token passed as query parameter (?token=…) rather than URL
# path segment so it is less likely to appear in reverse-proxy access logs.
# The old path /ws/{token} is also supported for backwards compatibility but
# the query parameter takes priority.
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = ""):
    # Allow token via query param (?token=…) as primary method
    if not token:
        token = websocket.query_params.get("token", "")
    conn = get_db()
    session = conn.execute(
        "SELECT s.user_id, u.username FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token=? AND s.expires_at > datetime('now')",
        (token,)
    ).fetchone()
    conn.close()
    if not session:
        await websocket.close(code=4001)
        return
    user_id = session["user_id"]
    username = session["username"]
    await manager.connect(websocket, user_id)
    # Notify everyone that a user joined, and send the new client the current voice status right away
    await manager.broadcast({"type":"user_online","data":{"user_id":user_id,"username":username}})
    await websocket.send_json({
        "type": "voice_status",
        "data": {
            "active": _voice_channel["active"],
            "speaker_id": _voice_channel["speaker_id"],
            "speaker_name": _voice_channel["speaker_name"],
            "participants": list(_voice_channel["participants"].values()),
        }
    })
    try:
        while True:
            try:
                raw = await websocket.receive()
            except WebSocketDisconnect:
                raise
            except Exception:
                continue

            # ── Binary frame → PCM audio relay to voice channel participants ──
            if "bytes" in raw and raw["bytes"]:
                pcm_data = raw["bytes"]
                # Only relay while the sender is an active voice channel participant
                if user_id in _voice_channel["participants"]:
                    participant_ids = set(_voice_channel["participants"].keys())
                    await manager.broadcast_bytes_to_participants(
                        pcm_data, participant_ids, exclude_user_id=user_id
                    )
                continue

            # ── Text / JSON frame ─────────────────────────────────────────────
            raw_text = raw.get("text", "")
            if not raw_text:
                continue
            try:
                data = json.loads(raw_text)
            except Exception:
                continue
            msg_type = data.get("type")

            # ── Ping ──────────────────────────────────────────────────────────
            if msg_type == "ping":
                await websocket.send_json({"type":"pong"})

            # ── Voice: join channel ───────────────────────────────────────────
            elif msg_type == "voice_join":
                _voice_channel["participants"][user_id] = username
                if not _voice_channel["active"]:
                    _voice_channel["active"] = True
                await manager.broadcast({
                    "type": "voice_status",
                    "data": {
                        "active": True,
                        "speaker_id": _voice_channel["speaker_id"],
                        "speaker_name": _voice_channel["speaker_name"],
                        "participants": list(_voice_channel["participants"].values()),
                    }
                })

            # ── Voice: leave channel ──────────────────────────────────────────
            elif msg_type == "voice_leave":
                _voice_channel["participants"].pop(user_id, None)
                if _voice_channel["speaker_id"] == user_id:
                    _voice_channel["speaker_id"] = None
                    _voice_channel["speaker_name"] = None
                if not _voice_channel["participants"]:
                    _voice_channel["active"] = False
                await manager.broadcast({
                    "type": "voice_status",
                    "data": {
                        "active": _voice_channel["active"],
                        "speaker_id": _voice_channel["speaker_id"],
                        "speaker_name": _voice_channel["speaker_name"],
                        "participants": list(_voice_channel["participants"].values()),
                    }
                })

            # ── Voice: PTT start (push-to-talk) ──────────────────────────────
            elif msg_type == "voice_ptt_start":
                _voice_channel["speaker_id"] = user_id
                _voice_channel["speaker_name"] = username
                await manager.broadcast({
                    "type": "voice_ptt_start",
                    "data": {"user_id": user_id, "username": username}
                })
                # Push-notify all users that a voice chat has started
                global _last_voice_push
                now_ts = time.time()
                if now_ts - _last_voice_push > 10:
                    _last_voice_push = now_ts
                    asyncio.create_task(broadcast_push_notification(
                        title="🎙️ Sprachchat",
                        body=f"{username} spricht jetzt",
                        severity="info",
                        alert_id=None,
                        url="/#/voice",
                        sound_name=""
                    ))

            # ── Voice: PTT stop ───────────────────────────────────────────────
            elif msg_type == "voice_ptt_stop":
                if _voice_channel["speaker_id"] == user_id:
                    _voice_channel["speaker_id"] = None
                    _voice_channel["speaker_name"] = None
                await manager.broadcast({
                    "type": "voice_ptt_stop",
                    "data": {"user_id": user_id, "username": username}
                })

            # ── Voice: WebRTC signaling relay ─────────────────────────────────
            elif msg_type in ("voice_offer", "voice_answer", "voice_ice"):
                target_id = data.get("target_id")
                if target_id:
                    await manager.send_to(int(target_id), {
                        "type": msg_type,
                        "data": data.get("data"),
                        "from_id": user_id,
                        "from_name": username,
                    })
                else:
                    # Broadcast to all participants (for multi-party signaling)
                    await manager.broadcast({
                        "type": msg_type,
                        "data": data.get("data"),
                        "from_id": user_id,
                        "from_name": username,
                    })

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        # Clean up voice channel on disconnect
        _voice_channel["participants"].pop(user_id, None)
        if _voice_channel["speaker_id"] == user_id:
            _voice_channel["speaker_id"] = None
            _voice_channel["speaker_name"] = None
        if not _voice_channel["participants"]:
            _voice_channel["active"] = False
        await manager.broadcast({"type":"user_offline","data":{"user_id":user_id,"username":username}})
        if _voice_channel["participants"] or not _voice_channel["active"]:
            await manager.broadcast({
                "type": "voice_status",
                "data": {
                    "active": _voice_channel["active"],
                    "speaker_id": _voice_channel["speaker_id"],
                    "speaker_name": _voice_channel["speaker_name"],
                    "participants": list(_voice_channel["participants"].values()),
                }
            })

# ─── Mobile API (native iOS app) ─────────────────────────────────────────────

@app.get("/api/mobile/dashboard")
async def mobile_dashboard(user: dict = Depends(get_current_user)):
    """Single call returning everything the mobile dashboard needs."""
    conn = get_db()
    kpis = {
        "active_assets":    conn.execute("SELECT COUNT(*) as c FROM assets WHERE status='active'").fetchone()["c"],
        "open_incidents":   conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status IN ('open','in_progress')").fetchone()["c"],
        "active_alerts":    conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0").fetchone()["c"],
        "critical_alerts":  conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0 AND severity='critical'").fetchone()["c"],
        "fleet_available":  conn.execute("SELECT COUNT(*) as c FROM fleet_vehicles WHERE status='available'").fetchone()["c"],
        "fleet_on_trip":    conn.execute("SELECT COUNT(*) as c FROM fleet_vehicles WHERE status='on_trip'").fetchone()["c"],
        "online_users":     conn.execute("SELECT COUNT(DISTINCT user_id) as c FROM sessions WHERE expires_at > datetime('now')").fetchone()["c"],
    }
    recent_alerts = [dict(r) for r in conn.execute(
        "SELECT id,type,message,severity,source,acknowledged,acknowledged_by,acknowledged_at,created_at,alarm_group FROM alerts ORDER BY id DESC LIMIT 10"
    ).fetchall()]
    recent_incidents = [dict(r) for r in conn.execute(
        "SELECT id,title,severity,status,lat,lng,created_at FROM incidents ORDER BY id DESC LIMIT 8"
    ).fetchall()]
    fleet = [dict(r) for r in conn.execute(
        "SELECT id,name,type,status,lat,lng,fuel_current_l,fuel_capacity_l FROM fleet_vehicles ORDER BY name"
    ).fetchall()]
    conn.close()
    return {
        "user": {"id": user["id"], "username": user["username"], "full_name": user["full_name"], "role": user["role"]},
        "kpis": kpis,
        "recent_alerts": recent_alerts,
        "recent_incidents": recent_incidents,
        "fleet": fleet,
        "server": {"org_name": CONFIG.get("org_name","ControlCenterHQ"), "version": CONFIG.get("version","2.8.0")},
    }


@app.get("/api/mobile/alerts")
async def mobile_alerts(
    limit: int = 50,
    offset: int = 0,
    unread_only: bool = False,
    user: dict = Depends(get_current_user)
):
    conn = get_db()
    where = "WHERE acknowledged=0" if unread_only else ""
    rows = conn.execute(
        f"SELECT id,type,message,severity,source,acknowledged,acknowledged_by,acknowledged_at,created_at,alarm_group "
        f"FROM alerts {where} ORDER BY id DESC LIMIT ? OFFSET ?",
        (limit, offset)
    ).fetchall()
    total = conn.execute(f"SELECT COUNT(*) as c FROM alerts {where}").fetchone()["c"]
    conn.close()
    return {"alerts": [dict(r) for r in rows], "total": total, "limit": limit, "offset": offset}


@app.post("/api/mobile/alerts/{alert_id}/ack")
async def mobile_ack_alert(alert_id: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    conn.execute(
        "UPDATE alerts SET acknowledged=1,acknowledged_by=?,acknowledged_at=datetime('now') WHERE id=?",
        (user["id"], alert_id)
    )
    conn.commit()
    conn.close()
    await manager.broadcast({"type": "alert_ack", "alert_id": alert_id, "by": user["username"]})
    return {"ok": True}


@app.post("/api/mobile/alerts/ack-all")
async def mobile_ack_all_alerts(user: dict = Depends(get_current_user)):
    conn = get_db()
    conn.execute(
        "UPDATE alerts SET acknowledged=1,acknowledged_by=?,acknowledged_at=datetime('now') WHERE acknowledged=0",
        (user["id"],)
    )
    count = conn.execute("SELECT changes() as c").fetchone()["c"]
    conn.commit()
    conn.close()
    await manager.broadcast({"type": "alerts_ack_all", "by": user["username"]})
    return {"ok": True, "count": count}


@app.get("/api/mobile/incidents")
async def mobile_incidents(
    limit: int = 30,
    offset: int = 0,
    status: str = "",
    user: dict = Depends(get_current_user)
):
    # Whitelist status values to prevent SQL injection
    VALID_STATUSES = {"open", "in_progress", "resolved", "closed", ""}
    if status not in VALID_STATUSES:
        raise HTTPException(400, "Invalid status filter")
    conn = get_db()
    if status:
        rows = conn.execute(
            "SELECT id,title,description,severity,status,lat,lng,assigned_to,created_by,created_at,updated_at,resolved_at "
            "FROM incidents WHERE status=? ORDER BY id DESC LIMIT ? OFFSET ?",
            (status, limit, offset)
        ).fetchall()
        total = conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status=?", (status,)).fetchone()["c"]
    else:
        rows = conn.execute(
            "SELECT id,title,description,severity,status,lat,lng,assigned_to,created_by,created_at,updated_at,resolved_at "
            "FROM incidents ORDER BY id DESC LIMIT ? OFFSET ?",
            (limit, offset)
        ).fetchall()
        total = conn.execute("SELECT COUNT(*) as c FROM incidents").fetchone()["c"]
    conn.close()
    return {"incidents": [dict(r) for r in rows], "total": total}


@app.post("/api/mobile/incidents")
async def mobile_create_incident(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    title = (body.get("title") or "").strip()
    if not title:
        raise HTTPException(400, "title required")
    severity = body.get("severity", "medium")
    description = body.get("description", "")
    lat = body.get("lat")
    lng = body.get("lng")
    conn = get_db()
    conn.execute(
        "INSERT INTO incidents (title,description,severity,status,lat,lng,created_by) VALUES (?,?,?,?,?,?,?)",
        (title, description, severity, "open", lat, lng, user["id"])
    )
    iid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.commit()
    inc = dict(conn.execute("SELECT * FROM incidents WHERE id=?", (iid,)).fetchone())
    conn.close()
    await manager.broadcast({"type": "incident_new", "id": iid, "title": title, "severity": severity})
    log_action(user["id"], "incident_create", {"title": title})
    return inc


@app.get("/api/mobile/fleet")
async def mobile_fleet(user: dict = Depends(get_current_user)):
    conn = get_db()
    vehicles = [dict(r) for r in conn.execute(
        "SELECT id,name,type,subtype,license_plate,status,lat,lng,fuel_current_l,fuel_capacity_l,"
        "odometer_km,assigned_driver,dispatch_incident_id,notes FROM fleet_vehicles ORDER BY name"
    ).fetchall()]
    active_trips = [dict(r) for r in conn.execute(
        "SELECT t.id,t.vehicle_id,t.title,t.origin,t.destination,t.status,t.departure_time,"
        "d.full_name as driver_name "
        "FROM fleet_trips t LEFT JOIN fleet_drivers d ON d.id=t.driver_id "
        "WHERE t.status='active' ORDER BY t.id DESC"
    ).fetchall()]
    conn.close()
    return {"vehicles": vehicles, "active_trips": active_trips}


@app.get("/api/mobile/me")
async def mobile_me(user: dict = Depends(get_current_user)):
    conn = get_db()
    perms = [dict(r) for r in conn.execute(
        "SELECT permission,value FROM user_permissions WHERE user_id=?", (user["id"],)
    ).fetchall()]
    conn.close()
    return {
        "id": user["id"],
        "username": user["username"],
        "full_name": user["full_name"],
        "role": user["role"],
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "language": user.get("language", "de"),
        "theme": user.get("theme", "dark"),
        "permissions": {p["permission"]: p["value"] for p in perms},
        "server": {"org_name": CONFIG.get("org_name",""), "version": CONFIG.get("version","2.8.0")},
    }


@app.get("/api/mobile/chat/rooms")
async def mobile_chat_rooms(user: dict = Depends(get_current_user)):
    conn = get_db()
    rooms = [dict(r) for r in conn.execute(
        "SELECT id,name,description,type FROM chat_rooms ORDER BY name"
    ).fetchall()]
    conn.close()
    return rooms


@app.get("/api/mobile/chat/rooms/{room_id}/messages")
async def mobile_chat_messages(room_id: int, limit: int = 40, user: dict = Depends(get_current_user)):
    conn = get_db()
    msgs = [dict(r) for r in conn.execute(
        "SELECT m.id,m.content,m.timestamp,u.username,u.full_name "
        "FROM chat_messages m JOIN users u ON u.id=m.sender_id "
        "WHERE m.room_id=? ORDER BY m.id DESC LIMIT ?",
        (room_id, limit)
    ).fetchall()]
    conn.close()
    return list(reversed(msgs))


@app.post("/api/mobile/chat/rooms/{room_id}/messages")
async def mobile_send_chat(room_id: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    content = (body.get("content") or "").strip()
    if not content:
        raise HTTPException(400, "content required")
    conn = get_db()
    conn.execute("INSERT INTO chat_messages (room_id,sender_id,content) VALUES (?,?,?)",
                 (room_id, user["id"], content))
    mid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.commit()
    conn.close()
    msg = {"type": "chat_message", "room_id": room_id, "id": mid,
           "content": content, "username": user["username"], "full_name": user.get("full_name", "")}
    await manager.broadcast(msg)
    return {"ok": True, "id": mid}


# ============================================================
# v2.8 – Geo-Fencing Endpoints
# ============================================================

@app.get("/api/security/geofences")
async def get_geofences(user: dict = Depends(require_admin)):
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        "SELECT * FROM geo_fences ORDER BY id DESC"
    ).fetchall()]
    conn.close()
    return rows

@app.post("/api/security/geofences")
async def create_geofence(request: Request, user: dict = Depends(require_owner)):
    body = await request.json()
    name = body.get("name", "").strip()
    if not name:
        raise HTTPException(400, "name required")
    conn = get_db()
    lat = float(body.get("lat", 0))
    lng = float(body.get("lng", 0))
    radius_m = float(body.get("radius_m", 1000))
    # Build a simple polygon from center + radius (stored as JSON for compatibility)
    import json as _json
    polygon = body.get("polygon") or _json.dumps({"center": [lat, lng], "radius_m": radius_m})
    conn.execute(
        "INSERT INTO geo_fences (name,polygon,lat,lng,radius_m,active,action) VALUES (?,?,?,?,?,?,?)",
        (name, polygon, lat, lng, radius_m, 1, body.get("action", "alert"))
    )
    fid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn.commit()
    conn.close()
    log_action(user["id"], "geofence_create", {"name": name})
    return {"ok": True, "id": fid}

@app.put("/api/security/geofences/{fid}")
async def update_geofence(fid: int, request: Request, user: dict = Depends(require_owner)):
    body = await request.json()
    conn = get_db()
    conn.execute(
        "UPDATE geo_fences SET name=COALESCE(?,name),lat=COALESCE(?,lat),lng=COALESCE(?,lng),"
        "radius_m=COALESCE(?,radius_m),active=COALESCE(?,active),action=COALESCE(?,action) WHERE id=?",
        (body.get("name"), body.get("lat"), body.get("lng"),
         body.get("radius_m"), body.get("active"), body.get("action"), fid)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/security/geofences/{fid}")
async def delete_geofence(fid: int, user: dict = Depends(require_owner)):
    conn = get_db()
    conn.execute("DELETE FROM geo_fences WHERE id=?", (fid,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/security/geofences/check")
async def check_geofence(request: Request, user: dict = Depends(get_current_user)):
    """Check if a lat/lng coordinate is inside any active geo-fence."""
    body = await request.json()
    lat, lng = float(body.get("lat", 0)), float(body.get("lng", 0))
    conn = get_db()
    fences = [dict(r) for r in conn.execute(
        "SELECT * FROM geo_fences WHERE active=1"
    ).fetchall()]
    conn.close()

    def _haversine(lat1, lng1, lat2, lng2):
        R = 6_371_000
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlam = math.radians(lng2 - lng1)
        a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    violations = []
    for f in fences:
        dist = _haversine(lat, lng, f["lat"], f["lng"])
        if dist <= f["radius_m"]:
            violations.append({"fence": f["name"], "distance_m": round(dist, 1)})
    return {"inside": len(violations) > 0, "violations": violations}


# ============================================================
# v2.8 – Compliance Reports Endpoints
# ============================================================

@app.get("/api/compliance/reports")
async def get_compliance_reports(user: dict = Depends(require_admin)):
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        "SELECT cr.*, u.username as generated_by_username FROM compliance_reports cr "
        "LEFT JOIN users u ON u.id=cr.generated_by ORDER BY cr.id DESC LIMIT 50"
    ).fetchall()]
    conn.close()
    return rows

@app.post("/api/compliance/reports/generate")
async def generate_compliance_report(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    report_type = body.get("type", "dsgvo")
    period_start = body.get("period_start", (datetime.now() - timedelta(days=30)).isoformat())
    period_end = body.get("period_end", datetime.now().isoformat())

    conn = get_db()
    try:
        # Collect data for the report
        events = [dict(r) for r in conn.execute(
            "SELECT action, user_id, details, timestamp FROM event_log WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT 1000",
            (period_start, period_end)
        ).fetchall()]
        users_count = conn.execute("SELECT COUNT(*) as c FROM users WHERE is_active=1").fetchone()["c"]
        alerts_count = conn.execute(
            "SELECT COUNT(*) as c FROM alerts WHERE created_at BETWEEN ? AND ?", (period_start, period_end)
        ).fetchone()["c"]
        incidents_count = conn.execute(
            "SELECT COUNT(*) as c FROM incidents WHERE created_at BETWEEN ? AND ?", (period_start, period_end)
        ).fetchone()["c"]

        content = {
            "type": report_type,
            "period": {"start": period_start, "end": period_end},
            "summary": {
                "active_users": users_count,
                "alerts": alerts_count,
                "incidents": incidents_count,
                "audit_events": len(events),
            },
            "audit_events_sample": events[:100],
            "generated_by": user["username"],
            "generated_at": datetime.now().isoformat(),
            "app_name": APP_NAME,
            "app_version": APP_VERSION,
            "compliance_standard": "DSGVO / ISO 27001" if report_type == "dsgvo" else report_type.upper(),
        }
        conn.execute(
            "INSERT INTO compliance_reports (report_type,generated_by,period_start,period_end,content) VALUES (?,?,?,?,?)",
            (report_type, user["id"], period_start, period_end, json.dumps(content))
        )
        rid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
        conn.commit()
    finally:
        conn.close()
    log_action(user["id"], "compliance_report_generate", {"type": report_type})
    return {"ok": True, "id": rid, "summary": content["summary"]}

@app.get("/api/compliance/reports/{rid}")
async def get_compliance_report(rid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    row = conn.execute("SELECT * FROM compliance_reports WHERE id=?", (rid,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(404, "Report not found")
    r = dict(row)
    r["content"] = json.loads(r["content"])
    return r


# ============================================================
# v2.8 – VPN / Proxy Detection
# ============================================================

# Known cloud/VPN ASN prefixes (simplified – augment as needed)
_VPN_USER_AGENTS = {"curl", "python-requests", "go-http-client", "wget", "httpie"}

def _detect_vpn_proxy(request: Request) -> dict:
    """Heuristic VPN/proxy detection based on headers."""
    ip = request.client.host if request.client else "0.0.0.0"
    ua = request.headers.get("user-agent", "").lower()
    forwarded_for = request.headers.get("x-forwarded-for", "")
    via = request.headers.get("via", "")
    proxy_auth = request.headers.get("proxy-authorization", "")

    flags = []
    if via:
        flags.append("via_header")
    if proxy_auth:
        flags.append("proxy_auth_header")
    if forwarded_for and "," in forwarded_for:
        flags.append("multiple_hops")
    ua_lower = ua.split("/")[0].split(" ")[0]
    if ua_lower in _VPN_USER_AGENTS:
        flags.append("automation_ua")

    return {
        "ip": ip,
        "suspicious": len(flags) > 0,
        "flags": flags,
        "via": via,
        "forwarded_for": forwarded_for,
    }

@app.get("/api/security/vpn-check")
async def vpn_check(request: Request, user: dict = Depends(require_admin)):
    """Run VPN/proxy detection on the current request."""
    return _detect_vpn_proxy(request)

@app.get("/api/security/vpn-history")
async def vpn_history(user: dict = Depends(require_admin)):
    """Return recent logins that triggered VPN/proxy flags."""
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        "SELECT el.*, u.username FROM event_log el LEFT JOIN users u ON u.id=el.user_id "
        "WHERE el.action='login_vpn_flag' ORDER BY el.timestamp DESC LIMIT 100"
    ).fetchall()]
    conn.close()
    return rows


# ============================================================
# v2.8 – Encrypted Backup Endpoints
# ============================================================

@app.post("/api/backups/create")
async def create_backup(user: dict = Depends(require_owner)):
    """Create an encrypted backup snapshot of the database."""
    import base64
    conn = get_db()

    # Dump all key tables as JSON (simplified approach – no actual encryption for demo)
    tables = ["users", "assets", "incidents", "alerts", "event_log", "fleet_vehicles",
              "fleet_trips", "sensors", "sensor_readings", "calendar_events"]
    backup_data = {}
    for tbl in tables:
        try:
            backup_data[tbl] = [dict(r) for r in conn.execute(f"SELECT * FROM {tbl} LIMIT 5000").fetchall()]
        except Exception:
            backup_data[tbl] = []
    conn.close()

    payload = json.dumps(backup_data, default=str)
    # XOR-encrypt with a key derived from APP_NAME (demonstration – use proper AES in production)
    key = hashlib.sha256(APP_NAME.encode()).digest()
    payload_bytes = payload.encode()
    encrypted = bytes(payload_bytes[i] ^ key[i % len(key)] for i in range(len(payload_bytes)))
    encoded = base64.b64encode(encrypted).decode()
    checksum = hashlib.sha256(encoded.encode()).hexdigest()
    filename = f"cchq_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.enc"
    expires = (datetime.now() + timedelta(days=30)).isoformat()

    conn2 = get_db()
    conn2.execute(
        "INSERT INTO encrypted_backups (filename,size_bytes,checksum,expires_at) VALUES (?,?,?,?)",
        (filename, len(encoded), checksum, expires)
    )
    bid = conn2.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
    conn2.commit()
    conn2.close()
    log_action(user["id"], "backup_create", {"file": filename})
    return {"ok": True, "id": bid, "filename": filename, "size": len(encoded), "checksum": checksum, "expires_at": expires}

@app.get("/api/backups")
async def list_backups(user: dict = Depends(require_owner)):
    conn = get_db()
    rows = [dict(r) for r in conn.execute(
        "SELECT * FROM encrypted_backups ORDER BY id DESC LIMIT 20"
    ).fetchall()]
    conn.close()
    return rows

@app.delete("/api/backups/{bid}")
async def delete_backup(bid: int, user: dict = Depends(require_owner)):
    conn = get_db()
    conn.execute("DELETE FROM encrypted_backups WHERE id=?", (bid,))
    conn.commit()
    conn.close()
    log_action(user["id"], "backup_delete", {"id": bid})
    return {"ok": True}


# ============================================================
# v2.8 – Rate Limit Analytics
# ============================================================

@app.get("/api/analytics/rate-limits")
async def rate_limit_analytics(user: dict = Depends(require_admin)):
    """Return rate-limit hit statistics grouped by endpoint and hour."""
    conn = get_db()
    by_endpoint = [dict(r) for r in conn.execute(
        "SELECT endpoint, COUNT(*) as hits FROM rate_limit_log "
        "WHERE ts > datetime('now','-24 hours') GROUP BY endpoint ORDER BY hits DESC LIMIT 20"
    ).fetchall()]
    by_hour = [dict(r) for r in conn.execute(
        "SELECT strftime('%H',ts) as hour, COUNT(*) as hits FROM rate_limit_log "
        "WHERE ts > datetime('now','-24 hours') GROUP BY hour ORDER BY hour"
    ).fetchall()]
    total = conn.execute(
        "SELECT COUNT(*) as c FROM rate_limit_log WHERE ts > datetime('now','-24 hours')"
    ).fetchone()["c"]
    conn.close()
    return {"by_endpoint": by_endpoint, "by_hour": by_hour, "total_24h": total}


# ============================================================
# v2.8 – Health Check & Comprehensive System Monitoring
# ============================================================

import shutil, platform, socket, time as _time

# In-memory ring buffer for CPU/memory history (last 60 snapshots = ~60s)
_SYSMON_HISTORY: list = []
_SYSMON_MAX = 60

def _collect_system_metrics() -> dict:
    """Collect real-time system metrics using stdlib only."""
    now = datetime.now().isoformat()

    # --- Disk ---
    try:
        disk = shutil.disk_usage(".")
        disk_total_mb = disk.total / 1_048_576
        disk_used_mb  = disk.used  / 1_048_576
        disk_free_mb  = disk.free  / 1_048_576
        disk_pct      = round(disk.used / disk.total * 100, 1)
    except Exception:
        disk_total_mb = disk_used_mb = disk_free_mb = None
        disk_pct = None

    # --- CPU (cross-platform, no psutil) ---
    cpu_pct = None
    try:
        with open("/proc/stat") as f:
            line = f.readline()
        parts = line.split()
        idle1 = int(parts[4])
        total1 = sum(int(p) for p in parts[1:])
        _time.sleep(0.05)
        with open("/proc/stat") as f:
            line = f.readline()
        parts = line.split()
        idle2 = int(parts[4])
        total2 = sum(int(p) for p in parts[1:])
        delta_idle  = idle2 - idle1
        delta_total = total2 - total1
        cpu_pct = round((1 - delta_idle / delta_total) * 100, 1) if delta_total > 0 else 0
    except Exception:
        pass

    # --- Memory (Linux /proc/meminfo) ---
    mem_total_mb = mem_used_mb = mem_free_mb = mem_pct = None
    try:
        meminfo = {}
        with open("/proc/meminfo") as f:
            for ln in f:
                k, v = ln.split(":")
                meminfo[k.strip()] = int(v.strip().split()[0])
        mem_total_mb = round(meminfo.get("MemTotal", 0) / 1024, 1)
        mem_avail_mb = round(meminfo.get("MemAvailable", 0) / 1024, 1)
        mem_used_mb  = round(mem_total_mb - mem_avail_mb, 1)
        mem_free_mb  = mem_avail_mb
        mem_pct      = round(mem_used_mb / mem_total_mb * 100, 1) if mem_total_mb else None
    except Exception:
        pass

    # --- Load average (Linux) ---
    load_1 = load_5 = load_15 = None
    try:
        with open("/proc/loadavg") as f:
            parts = f.read().split()
        load_1, load_5, load_15 = float(parts[0]), float(parts[1]), float(parts[2])
    except Exception:
        pass

    # --- Uptime (Linux) ---
    uptime_seconds = None
    try:
        with open("/proc/uptime") as f:
            uptime_seconds = int(float(f.read().split()[0]))
    except Exception:
        pass

    # --- CPU temp (Raspberry Pi / Linux thermal) ---
    cpu_temp_c = None
    for path in ["/sys/class/thermal/thermal_zone0/temp", "/sys/class/hwmon/hwmon0/temp1_input"]:
        try:
            with open(path) as f:
                cpu_temp_c = round(int(f.read().strip()) / 1000, 1)
            break
        except Exception:
            pass

    # --- Network I/O (Linux /proc/net/dev) ---
    net_rx_mb = net_tx_mb = None
    try:
        with open("/proc/net/dev") as f:
            lines = f.readlines()[2:]
        rx, tx = 0, 0
        for ln in lines:
            parts = ln.split()
            if parts[0].startswith("lo"):
                continue
            rx += int(parts[1])
            tx += int(parts[9])
        net_rx_mb = round(rx / 1_048_576, 2)
        net_tx_mb = round(tx / 1_048_576, 2)
    except Exception:
        pass

    # --- Process info ---
    process_count = None
    try:
        import os
        process_count = len(os.listdir("/proc"))
    except Exception:
        pass

    return {
        "ts": now,
        "cpu_pct": cpu_pct,
        "cpu_temp_c": cpu_temp_c,
        "mem_total_mb": mem_total_mb,
        "mem_used_mb": mem_used_mb,
        "mem_free_mb": mem_free_mb,
        "mem_pct": mem_pct,
        "disk_total_mb": disk_total_mb,
        "disk_used_mb": disk_used_mb,
        "disk_free_mb": disk_free_mb,
        "disk_pct": disk_pct,
        "load_1": load_1,
        "load_5": load_5,
        "load_15": load_15,
        "uptime_seconds": uptime_seconds,
        "net_rx_mb": net_rx_mb,
        "net_tx_mb": net_tx_mb,
        "process_count": process_count,
    }


async def _run_health_check():
    """Internal health check task – updates health_checks table and history."""
    metrics = _collect_system_metrics()

    db_ok = 1
    try:
        conn = get_db()
        conn.execute("SELECT 1").fetchone()
        conn.close()
    except Exception:
        db_ok = 0

    ws_ok = 1
    status = "ok" if db_ok and ws_ok else "degraded"
    if metrics.get("cpu_pct") and metrics["cpu_pct"] > 90:
        status = "warning"
    if metrics.get("mem_pct") and metrics["mem_pct"] > 95:
        status = "warning"

    conn2 = get_db()
    conn2.execute(
        "INSERT OR REPLACE INTO health_checks "
        "(id,last_check,db_ok,ws_ok,disk_free_mb,cpu_pct,mem_pct,status) VALUES (1,?,?,?,?,?,?,?)",
        (metrics["ts"], db_ok, ws_ok,
         metrics.get("disk_free_mb"), metrics.get("cpu_pct"),
         metrics.get("mem_pct"), status)
    )
    conn2.commit()
    conn2.close()

    # append to ring buffer
    snap = {**metrics, "db_ok": db_ok, "ws_ok": ws_ok, "status": status}
    _SYSMON_HISTORY.append(snap)
    if len(_SYSMON_HISTORY) > _SYSMON_MAX:
        _SYSMON_HISTORY.pop(0)


@app.get("/api/system/health")
async def system_health(request: Request):
    """Public lightweight health check endpoint."""
    await _run_health_check()
    conn = get_db()
    row = conn.execute("SELECT * FROM health_checks WHERE id=1").fetchone()
    conn.close()
    if row:
        return dict(row)
    return {"status": "ok", "db_ok": 1, "ws_ok": 1}


@app.get("/api/system/health/detailed")
async def system_health_detailed(user: dict = Depends(require_admin)):
    """Detailed health check for admins."""
    await _run_health_check()
    conn = get_db()
    row = conn.execute("SELECT * FROM health_checks WHERE id=1").fetchone()
    user_count   = conn.execute("SELECT COUNT(*) as c FROM users WHERE is_active=1").fetchone()["c"]
    session_count = conn.execute(
        "SELECT COUNT(*) as c FROM sessions WHERE expires_at > datetime('now')"
    ).fetchone()["c"]
    alert_count   = conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0").fetchone()["c"]
    incident_count = conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status='active'").fetchone()["c"]
    ws_clients    = len(manager.connections)
    conn.close()

    base = dict(row) if row else {}
    base.update({
        "active_users": user_count,
        "active_sessions": session_count,
        "active_alerts": alert_count,
        "active_incidents": incident_count,
        "websocket_connections": ws_clients,
        "app_name": APP_NAME,
        "app_version": APP_VERSION,
    })
    return base


@app.get("/api/system/monitor")
async def system_monitor(user: dict = Depends(require_admin)):
    """
    Full real-time system monitoring snapshot.
    Returns current metrics + last 60s history.
    """
    await _run_health_check()

    # DB stats
    conn = get_db()
    user_count    = conn.execute("SELECT COUNT(*) as c FROM users WHERE is_active=1").fetchone()["c"]
    session_count = conn.execute(
        "SELECT COUNT(*) as c FROM sessions WHERE expires_at > datetime('now')"
    ).fetchone()["c"]
    alert_count   = conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0").fetchone()["c"]
    incident_count = conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status='active'").fetchone()["c"]
    ws_clients    = len(manager.connections)

    # API request stats (last 24h)
    total_reqs = conn.execute(
        "SELECT COUNT(*) as c FROM audit_log WHERE ts > datetime('now','-24 hours')"
    ).fetchone()["c"]
    # Rate limit hits
    rl_hits = conn.execute(
        "SELECT COUNT(*) as c FROM rate_limit_log WHERE ts > datetime('now','-24 hours')"
    ).fetchone()["c"]
    # DB size
    try:
        import os as _os
        db_path = conn.execute("PRAGMA database_list").fetchone()[2]
        db_size_mb = round(_os.path.getsize(db_path) / 1_048_576, 2) if db_path else None
    except Exception:
        db_size_mb = None

    # Table row counts
    tables = ["users","sessions","alerts","incidents","fleet_vehicles","fleet_trips",
              "assets","sensors","chat_messages","audit_log","push_subscriptions","geo_fences"]
    table_counts = {}
    for t in tables:
        try:
            table_counts[t] = conn.execute(f"SELECT COUNT(*) as c FROM {t}").fetchone()["c"]
        except Exception:
            table_counts[t] = None
    conn.close()

    # Platform info (static)
    try:
        hostname = socket.gethostname()
    except Exception:
        hostname = "unknown"

    current = _SYSMON_HISTORY[-1] if _SYSMON_HISTORY else {}

    return {
        "current": current,
        "history": _SYSMON_HISTORY[-60:],
        "platform": {
            "hostname": hostname,
            "os": platform.system(),
            "os_version": platform.release(),
            "python_version": platform.python_version(),
            "arch": platform.machine(),
            "app_name": APP_NAME,
            "app_version": APP_VERSION,
        },
        "application": {
            "active_users": user_count,
            "active_sessions": session_count,
            "active_alerts": alert_count,
            "active_incidents": incident_count,
            "websocket_connections": ws_clients,
            "api_requests_24h": total_reqs,
            "rate_limit_hits_24h": rl_hits,
            "db_size_mb": db_size_mb,
        },
        "db_tables": table_counts,
    }


# ============================================================
# v2.8 – Predictive Resource Allocation (AI stub)
# ============================================================

@app.get("/api/analytics/predictions")
async def get_predictions(user: dict = Depends(require_admin)):
    """Return AI-based resource allocation predictions (heuristic model)."""
    conn = get_db()
    # Simple heuristics: alert frequency → predict peak hours
    alert_by_hour = [dict(r) for r in conn.execute(
        "SELECT strftime('%H',created_at) as hour, COUNT(*) as cnt FROM alerts "
        "WHERE created_at > datetime('now','-30 days') GROUP BY hour ORDER BY cnt DESC"
    ).fetchall()]
    incident_by_dow = [dict(r) for r in conn.execute(
        "SELECT strftime('%w',created_at) as dow, COUNT(*) as cnt FROM incidents "
        "WHERE created_at > datetime('now','-30 days') GROUP BY dow ORDER BY dow"
    ).fetchall()]
    vehicle_util = [dict(r) for r in conn.execute(
        "SELECT v.name, COUNT(t.id) as trips FROM fleet_vehicles v "
        "LEFT JOIN fleet_trips t ON t.vehicle_id=v.id AND t.departure_time > datetime('now','-30 days') "
        "GROUP BY v.id ORDER BY trips DESC LIMIT 10"
    ).fetchall()]

    # Peak hour prediction: top 3 hours
    peak_hours = [r["hour"] for r in alert_by_hour[:3]]
    # Staffing suggestion: more incidents on weekend?
    dow_map = {"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"}
    peak_days = [dow_map.get(r["dow"], r["dow"]) for r in sorted(incident_by_dow, key=lambda x: -x["cnt"])[:2]]

    conn.close()
    return {
        "peak_alert_hours": peak_hours,
        "peak_incident_days": peak_days,
        "vehicle_utilization": vehicle_util,
        "recommendations": [
            f"Increase staffing during hours {', '.join(peak_hours) or 'N/A'}" if peak_hours else "Insufficient data for staffing prediction",
            f"Plan extra resources on {', '.join(peak_days)}" if peak_days else "Insufficient incident data",
            "Consider maintenance windows during low-utilization periods",
        ],
        "model": "ControlCenterHQ Heuristic v1.0",
        "confidence": "low" if len(alert_by_hour) < 10 else "medium",
    }


# ============================================================
# v2.8 – Multi-Federation Sync Monitoring
# ============================================================

@app.get("/api/federation/sync-status")
async def federation_sync_status(user: dict = Depends(require_admin)):
    """Return sync status for all federation peers."""
    conn = get_db()
    try:
        peers = [dict(r) for r in conn.execute(
            "SELECT * FROM federation_peers ORDER BY id"
        ).fetchall()]
    except Exception:
        peers = []
    conn.close()

    # Augment with connectivity check (timeout 3s)
    import urllib.request
    statuses = []
    for p in peers:
        url = p.get("url", "")
        last_seen = p.get("last_seen", "")
        try:
            req = urllib.request.Request(f"{url}/api/system/health", headers={"User-Agent": "CCHQ-FedSync/2.8"})
            with urllib.request.urlopen(req, timeout=3) as resp:
                online = resp.status == 200
        except Exception:
            online = False
        statuses.append({
            "id": p.get("id"),
            "name": p.get("name", url),
            "url": url,
            "online": online,
            "last_seen": last_seen,
        })
    return {"peers": statuses, "checked_at": datetime.now().isoformat()}


# ═══════════════════════════════════════════════════════════════════════
# INVENTORY & DEVICE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════

def _generate_qr_code(data: str) -> str:
    """Generate a QR code as a base64 PNG data URI."""
    try:
        import qrcode
        qr = qrcode.QRCode(version=1, box_size=6, border=2)
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()
        return f"data:image/png;base64,{b64}"
    except ImportError:
        # qrcode not installed – return SVG-based QR placeholder
        encoded = data.replace("&", "&amp;").replace("<", "&lt;")
        return f"data:text/plain,{encoded}"
    except Exception:
        return ""

@app.get("/api/inventory")
async def get_inventory(
    category: str = None,
    status: str = None,
    q: str = None,
    user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        where, vals = ["1=1"], []
        if category: where.append("i.category=?"); vals.append(category)
        if status: where.append("i.status=?"); vals.append(status)
        if q:
            where.append("(i.name LIKE ? OR i.description LIKE ? OR i.serial_number LIKE ? OR i.location LIKE ? OR i.asset_number LIKE ? OR i.model_number LIKE ? OR i.part_number LIKE ?)")
            like = f"%{q}%"; vals.extend([like, like, like, like, like, like, like])
        rows = conn.execute(
            f"SELECT i.*, u.full_name as assigned_name, w.name as warehouse_name FROM inventory_items i LEFT JOIN users u ON u.id=i.assigned_to LEFT JOIN inventory_warehouses w ON w.id=i.warehouse_id WHERE {' AND '.join(where)} ORDER BY i.name",
            vals
        ).fetchall()
        items = [dict(r) for r in rows]
        cats = conn.execute("SELECT DISTINCT category FROM inventory_items ORDER BY category").fetchall()
        return {"items": items, "categories": [r["category"] for r in cats]}
    finally:
        conn.close()

@app.get("/api/inventory/qr/{qr_code}")
async def get_inventory_by_qr(qr_code: str, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM inventory_items WHERE qr_code=?", (qr_code,)).fetchone()
        if not row: raise HTTPException(404, "Item not found")
        return dict(row)
    finally:
        conn.close()

@app.get("/api/inventory/warehouses")
async def get_warehouses(user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT w.*, u.full_name as manager_name FROM inventory_warehouses w "
            "LEFT JOIN users u ON u.id=w.manager_id ORDER BY w.name"
        ).fetchall()
        return {"warehouses": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/inventory/warehouses")
async def create_warehouse(request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        row = conn.execute(
            "INSERT INTO inventory_warehouses (name, address, manager_id, description) VALUES (?,?,?,?)",
            (data.get("name","").strip(), data.get("address","") or None, data.get("manager_id") or None, data.get("description") or None)
        )
        conn.commit()
        log_action(user["id"], "warehouse_create", {"id": row.lastrowid, "name": data.get("name")})
        return {"id": row.lastrowid, "ok": True}
    finally:
        conn.close()

@app.put("/api/inventory/warehouses/{wid}")
async def update_warehouse(wid: int, request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        conn.execute(
            "UPDATE inventory_warehouses SET name=?,address=?,manager_id=?,description=? WHERE id=?",
            (data.get("name"), data.get("address") or None, data.get("manager_id") or None, data.get("description") or None, wid)
        )
        conn.commit()
        log_action(user["id"], "warehouse_update", {"id": wid})
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/inventory/warehouses/{wid}")
async def delete_warehouse(wid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM inventory_warehouses WHERE id=?", (wid,))
        conn.commit()
        log_action(user["id"], "warehouse_delete", {"id": wid})
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/inventory/orders")
async def get_orders(status: str = None, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        q = ("SELECT o.*, u.full_name as requester_name, w.name as warehouse_name "
             "FROM inventory_orders o LEFT JOIN users u ON o.requested_by=u.id "
             "LEFT JOIN inventory_warehouses w ON o.warehouse_id=w.id WHERE 1=1")
        params = []
        if status:
            q += " AND o.status=?"; params.append(status)
        q += " ORDER BY o.created_at DESC"
        rows = conn.execute(q, params).fetchall()
        return {"orders": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/inventory/orders")
async def create_order(request: Request, user: dict = Depends(get_current_user)):
    data = await request.json()
    conn = get_db()
    try:
        raw_items = data.get("items_json", None)
        if raw_items is None:
            raw_items = json.dumps(data.get("items", []))
        elif isinstance(raw_items, list):
            raw_items = json.dumps(raw_items)
        title = data.get("title", "Bestellung").strip() or "Bestellung"
        row = conn.execute(
            "INSERT INTO inventory_orders (title, description, items_json, warehouse_id, priority, supplier, estimated_cost, requested_by) "
            "VALUES (?,?,?,?,?,?,?,?)",
            (title, data.get("description") or None,
             raw_items, data.get("warehouse_id") or None,
             data.get("priority","normal"), data.get("supplier") or None,
             data.get("estimated_cost") or None, user["id"])
        )
        conn.commit()
        log_action(user["id"], "inventory_order_create", {"id": row.lastrowid})
        return {"id": row.lastrowid, "ok": True}
    finally:
        conn.close()

@app.put("/api/inventory/orders/{oid}")
async def update_order(oid: int, request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        extra = ""
        new_status = data.get("status","pending")
        params = [new_status, data.get("actual_cost") or None, data.get("tracking_number") or None, data.get("notes") or None]
        if new_status in ("received","delivered","completed"):
            extra = ", delivered_at=datetime('now')"
        conn.execute(
            f"UPDATE inventory_orders SET status=?,actual_cost=?,tracking_number=?,notes=?,updated_at=datetime('now'){extra} WHERE id=?",
            params + [oid]
        )
        conn.commit()
        log_action(user["id"], "inventory_order_update", {"id": oid, "status": new_status})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/inventory/orders/{oid}/approve")
async def approve_order(oid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute(
            "UPDATE inventory_orders SET status='approved', approved_by=?, approved_at=datetime('now'), updated_at=datetime('now') WHERE id=?",
            (user["id"], oid)
        )
        conn.commit()
        log_action(user["id"], "inventory_order_approve", {"id": oid})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/inventory/orders/{oid}/receive")
async def receive_order(oid: int, user: dict = Depends(require_admin)):
    """Mark order as received and create inventory_transactions for each item."""
    conn = get_db()
    try:
        order = conn.execute("SELECT * FROM inventory_orders WHERE id=?", (oid,)).fetchone()
        if not order:
            raise HTTPException(404, "Order not found")
        items = json.loads(order["items_json"] or "[]")
        for item in items:
            iid = item.get("item_id") or item.get("inventory_item_id")
            qty = item.get("quantity", 0)
            if iid and qty > 0:
                conn.execute(
                    "UPDATE inventory_items SET quantity=quantity+?, updated_at=datetime('now') WHERE id=?",
                    (qty, iid)
                )
                conn.execute(
                    "INSERT INTO inventory_transactions (item_id, type, quantity_change, user_id, notes) VALUES (?,?,?,?,?)",
                    (iid, "restock", qty, user["id"], f"Bestellung #{oid}")
                )
        conn.execute(
            "UPDATE inventory_orders SET status='received', delivered_at=datetime('now'), updated_at=datetime('now') WHERE id=?",
            (oid,)
        )
        conn.commit()
        log_action(user["id"], "inventory_order_receive", {"id": oid})
        return {"ok": True, "items_restocked": len(items)}
    finally:
        conn.close()

@app.get("/api/inventory/{iid}")
async def get_inventory_item(iid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT i.*, u.full_name as assigned_name, w.name as warehouse_name "
            "FROM inventory_items i "
            "LEFT JOIN users u ON u.id=i.assigned_to "
            "LEFT JOIN inventory_warehouses w ON w.id=i.warehouse_id "
            "WHERE i.id=?",
            (iid,)
        ).fetchone()
        if not row: raise HTTPException(404, "Item not found")
        item = dict(row)
        txns = conn.execute(
            "SELECT t.*, u.full_name as user_name FROM inventory_transactions t LEFT JOIN users u ON u.id=t.user_id WHERE t.item_id=? ORDER BY t.ts DESC LIMIT 20",
            (iid,)
        ).fetchall()
        item["transactions"] = [dict(t) for t in txns]
        return item
    finally:
        conn.close()

@app.post("/api/inventory")
async def create_inventory_item(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = body.get("name","").strip()
    if not name: raise HTTPException(400, "Name required")
    qr_code = "CCHQ-" + hashlib.sha256(f"{name}{datetime.now().isoformat()}".encode()).hexdigest()[:12].upper()
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO inventory_items (name,category,description,qr_code,serial_number,part_number,model_number,asset_number,warehouse_id,location,status,assigned_to,quantity,min_quantity,purchase_date,purchase_price,supplier,notes,custom_fields,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (name, body.get("category","general"), body.get("description"), qr_code,
             body.get("serial_number"), body.get("part_number"), body.get("model_number"),
             body.get("asset_number"), body.get("warehouse_id"), body.get("location"),
             body.get("status","available"), body.get("assigned_to"), body.get("quantity",1),
             body.get("min_quantity",0), body.get("purchase_date"), body.get("purchase_price"),
             body.get("supplier"), body.get("notes"), json.dumps(body.get("custom_fields",{})), user["id"])
        )
        conn.commit()
        iid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
        row = conn.execute("SELECT * FROM inventory_items WHERE id=?", (iid,)).fetchone()
        item = dict(row)
        item["qr_data_uri"] = _generate_qr_code(f"cchq://inventory/{qr_code}")
        log_action(user["id"], "inventory_create", {"name": name, "id": iid})
        return item
    finally:
        conn.close()

@app.put("/api/inventory/{iid}")
async def update_inventory_item(iid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM inventory_items WHERE id=?", (iid,)).fetchone()
        if not row: raise HTTPException(404, "Item not found")
        old_qty = row["quantity"]
        new_qty = body.get("quantity", old_qty)
        fields, vals = [], []
        for f in ["name","category","description","serial_number","part_number","model_number","asset_number","warehouse_id","location","status","assigned_to","quantity","min_quantity","purchase_date","purchase_price","supplier","notes","image_url"]:
            if f in body:
                fields.append(f"{f}=?"); vals.append(body[f])
        if "custom_fields" in body:
            fields.append("custom_fields=?"); vals.append(json.dumps(body["custom_fields"]))
        fields.append("updated_at=datetime('now')")
        vals.append(iid)
        conn.execute(f"UPDATE inventory_items SET {', '.join(fields)} WHERE id=?", vals)
        if new_qty != old_qty:
            conn.execute(
                "INSERT INTO inventory_transactions (item_id,type,quantity_change,user_id,notes) VALUES (?,?,?,?,?)",
                (iid, "adjustment", new_qty - old_qty, user["id"], body.get("notes","Manual adjustment"))
            )
        conn.commit()
        log_action(user["id"], "inventory_update", {"id": iid})
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/inventory/{iid}")
async def delete_inventory_item(iid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM inventory_items WHERE id=?", (iid,))
        conn.commit()
        log_action(user["id"], "inventory_delete", {"id": iid})
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/inventory/{iid}/qr")
async def get_item_qr(iid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        row = conn.execute("SELECT qr_code, name FROM inventory_items WHERE id=?", (iid,)).fetchone()
        if not row: raise HTTPException(404, "Item not found")
        qr_uri = _generate_qr_code(f"cchq://inventory/{row['qr_code']}")
        return {"qr_data_uri": qr_uri, "qr_code": row["qr_code"], "name": row["name"]}
    finally:
        conn.close()

@app.post("/api/inventory/{iid}/assign")
async def assign_inventory_item(iid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    uid = body.get("user_id")
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM inventory_items WHERE id=?", (iid,)).fetchone()
        if not row: raise HTTPException(404, "Item not found")
        conn.execute("UPDATE inventory_items SET assigned_to=?, status=?, updated_at=datetime('now') WHERE id=?",
                     (uid, "assigned" if uid else "available", iid))
        conn.execute(
            "INSERT INTO inventory_transactions (item_id,type,quantity_change,user_id,notes) VALUES (?,?,?,?,?)",
            (iid, "assign" if uid else "unassign", 0, user["id"], body.get("notes",""))
        )
        conn.commit()
        log_action(user["id"], "inventory_assign", {"id": iid, "assigned_to": uid})
        return {"ok": True}
    finally:
        conn.close()

# ═══════════════════════════════════════════════════════════════════════
# KNOWLEDGE DATABASES
# ═══════════════════════════════════════════════════════════════════════

@app.get("/api/knowledge/search")
async def search_knowledge(q: str = "", user: dict = Depends(get_current_user)):
    if not q: return {"results": []}
    conn = get_db()
    try:
        like = f"%{q}%"
        rows = conn.execute(
            "SELECT a.id, a.title, a.kb_id, kb.name as kb_name, kb.icon, SUBSTR(a.content,1,200) as excerpt FROM knowledge_articles a JOIN knowledge_bases kb ON kb.id=a.kb_id WHERE a.title LIKE ? OR a.content LIKE ? OR a.tags LIKE ? ORDER BY a.pinned DESC, a.views DESC LIMIT 20",
            (like, like, like)
        ).fetchall()
        return {"results": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.get("/api/knowledge")
async def get_knowledge_bases(user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT kb.*, COUNT(a.id) as article_count FROM knowledge_bases kb LEFT JOIN knowledge_articles a ON a.kb_id=kb.id GROUP BY kb.id ORDER BY kb.name"
        ).fetchall()
        return {"bases": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/knowledge")
async def create_knowledge_base(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = body.get("name","").strip()
    if not name: raise HTTPException(400, "Name required")
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO knowledge_bases (name,description,icon,color,access_role,created_by) VALUES (?,?,?,?,?,?)",
            (name, body.get("description",""), body.get("icon","📚"), body.get("color","#4caf7d"), body.get("access_role","operator"), user["id"])
        )
        conn.commit()
        row = conn.execute("SELECT * FROM knowledge_bases WHERE id=last_insert_rowid()").fetchone()
        return dict(row)
    finally:
        conn.close()

@app.put("/api/knowledge/{kbid}")
async def update_knowledge_base(kbid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        fields, vals = [], []
        for f in ["name","description","icon","color","access_role"]:
            if f in body: fields.append(f"{f}=?"); vals.append(body[f])
        if fields:
            vals.append(kbid)
            conn.execute(f"UPDATE knowledge_bases SET {', '.join(fields)} WHERE id=?", vals)
            conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/knowledge/{kbid}")
async def delete_knowledge_base(kbid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM knowledge_bases WHERE id=?", (kbid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/knowledge/{kbid}/articles")
async def get_articles(kbid: int, q: str = None, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        kb = conn.execute("SELECT * FROM knowledge_bases WHERE id=?", (kbid,)).fetchone()
        if not kb: raise HTTPException(404, "Knowledge base not found")
        where, vals = ["a.kb_id=?"], [kbid]
        if q:
            where.append("(a.title LIKE ? OR a.content LIKE ? OR a.tags LIKE ?)")
            like = f"%{q}%"; vals.extend([like, like, like])
        rows = conn.execute(
            f"SELECT a.*, u.full_name as author_name FROM knowledge_articles a LEFT JOIN users u ON u.id=a.author_id WHERE {' AND '.join(where)} ORDER BY a.pinned DESC, a.updated_at DESC",
            vals
        ).fetchall()
        return {"kb": dict(kb), "articles": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.get("/api/knowledge/{kbid}/articles/{aid}")
async def get_article(kbid: int, aid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT a.*, u.full_name as author_name FROM knowledge_articles a LEFT JOIN users u ON u.id=a.author_id WHERE a.id=? AND a.kb_id=?",
            (aid, kbid)
        ).fetchone()
        if not row: raise HTTPException(404, "Article not found")
        conn.execute("UPDATE knowledge_articles SET views=views+1 WHERE id=?", (aid,))
        conn.commit()
        return dict(row)
    finally:
        conn.close()

@app.post("/api/knowledge/{kbid}/articles")
async def create_article(kbid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    title = body.get("title","").strip()
    if not title: raise HTTPException(400, "Title required")
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO knowledge_articles (kb_id,title,content,tags,author_id,pinned) VALUES (?,?,?,?,?,?)",
            (kbid, title, body.get("content",""), json.dumps(body.get("tags",[])), user["id"], 1 if body.get("pinned") else 0)
        )
        conn.commit()
        row = conn.execute("SELECT * FROM knowledge_articles WHERE id=last_insert_rowid()").fetchone()
        return dict(row)
    finally:
        conn.close()

@app.put("/api/knowledge/{kbid}/articles/{aid}")
async def update_article(kbid: int, aid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    try:
        fields, vals = [], []
        for f in ["title","content","pinned"]:
            if f in body: fields.append(f"{f}=?"); vals.append(body[f])
        if "tags" in body: fields.append("tags=?"); vals.append(json.dumps(body["tags"]))
        fields.append("updated_at=datetime('now')")
        vals.extend([aid, kbid])
        conn.execute(f"UPDATE knowledge_articles SET {', '.join(fields)} WHERE id=? AND kb_id=?", vals)
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/knowledge/{kbid}/articles/{aid}")
async def delete_article(kbid: int, aid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM knowledge_articles WHERE id=? AND kb_id=?", (aid, kbid))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

# ═══════════════════════════════════════════════════════════════════════
# WORK REQUESTS / PERMISSIONS WORKFLOW
# ═══════════════════════════════════════════════════════════════════════

@app.get("/api/requests")
async def get_requests(status: str = None, user: dict = Depends(get_current_user)):
    is_admin = user["role"] in ("admin","owner")
    conn = get_db()
    try:
        where, vals = [], []
        if not is_admin:
            where.append("(wr.requester_id=? OR wr.assigned_to=?)")
            vals.extend([user["id"], user["id"]])
        if status: where.append("wr.status=?"); vals.append(status)
        base = "WHERE " + " AND ".join(where) if where else ""
        rows = conn.execute(
            f"SELECT wr.*, u1.full_name as requester_name, u2.full_name as assigned_name FROM work_requests wr LEFT JOIN users u1 ON u1.id=wr.requester_id LEFT JOIN users u2 ON u2.id=wr.assigned_to {base} ORDER BY wr.created_at DESC",
            vals
        ).fetchall()
        return {"requests": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/requests")
async def create_request(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    title = body.get("title","").strip()
    if not title: raise HTTPException(400, "Title required")
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO work_requests (title,description,type,priority,status,requester_id,assigned_to,due_date,custom_fields) VALUES (?,?,?,?,?,?,?,?,?)",
            (title, body.get("description",""), body.get("type","general"), body.get("priority","normal"),
             "pending", user["id"], body.get("assigned_to"), body.get("due_date"),
             json.dumps(body.get("custom_fields",{})))
        )
        conn.commit()
        rid = conn.execute("SELECT last_insert_rowid() as id").fetchone()["id"]
        row = conn.execute("SELECT * FROM work_requests WHERE id=?", (rid,)).fetchone()
        result = dict(row)
        log_action(user["id"], "request_create", {"id": rid, "title": title})
        await manager.broadcast({"type": "new_request", "data": result})
        return result
    finally:
        conn.close()

@app.get("/api/requests/{rid}")
async def get_request_detail(rid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT wr.*, u1.full_name as requester_name, u2.full_name as assigned_name FROM work_requests wr LEFT JOIN users u1 ON u1.id=wr.requester_id LEFT JOIN users u2 ON u2.id=wr.assigned_to WHERE wr.id=?",
            (rid,)
        ).fetchone()
        if not row: raise HTTPException(404, "Request not found")
        result = dict(row)
        comments = conn.execute(
            "SELECT c.*, u.full_name FROM request_comments c JOIN users u ON u.id=c.user_id WHERE c.request_id=? ORDER BY c.ts",
            (rid,)
        ).fetchall()
        result["comments"] = [dict(c) for c in comments]
        return result
    finally:
        conn.close()

@app.put("/api/requests/{rid}")
async def update_request(rid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM work_requests WHERE id=?", (rid,)).fetchone()
        if not row: raise HTTPException(404, "Request not found")
        is_admin = user["role"] in ("admin","owner")
        if not is_admin and row["requester_id"] != user["id"]:
            raise HTTPException(403, "Forbidden")
        fields, vals = [], []
        for f in ["title","description","type","priority","status","assigned_to","due_date"]:
            if f in body: fields.append(f"{f}=?"); vals.append(body[f])
        if "custom_fields" in body: fields.append("custom_fields=?"); vals.append(json.dumps(body["custom_fields"]))
        fields.append("updated_at=datetime('now')")
        if body.get("status") == "completed": fields.append("completed_at=datetime('now')")
        if not fields: return {"ok": True}
        vals.append(rid)
        conn.execute(f"UPDATE work_requests SET {', '.join(fields)} WHERE id=?", vals)
        conn.commit()
        log_action(user["id"], "request_update", {"id": rid, "status": body.get("status")})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/requests/{rid}/approve")
async def approve_request(rid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM work_requests WHERE id=?", (rid,)).fetchone()
        if not row: raise HTTPException(404, "Request not found")
        conn.execute(
            "UPDATE work_requests SET status='approved', approver_id=?, approved_at=datetime('now'), updated_at=datetime('now') WHERE id=?",
            (user["id"], rid)
        )
        conn.commit()
        log_action(user["id"], "request_approve", {"id": rid})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/requests/{rid}/reject")
async def reject_request(rid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM work_requests WHERE id=?", (rid,)).fetchone()
        if not row: raise HTTPException(404, "Request not found")
        conn.execute(
            "UPDATE work_requests SET status='rejected', approver_id=?, rejected_at=datetime('now'), rejection_reason=?, updated_at=datetime('now') WHERE id=?",
            (user["id"], body.get("reason",""), rid)
        )
        conn.commit()
        log_action(user["id"], "request_reject", {"id": rid})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/requests/{rid}/comments")
async def add_request_comment(rid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    content = body.get("content","").strip()
    if not content: raise HTTPException(400, "Content required")
    conn = get_db()
    try:
        conn.execute("INSERT INTO request_comments (request_id,user_id,content) VALUES (?,?,?)", (rid, user["id"], content))
        conn.commit()
        row = conn.execute("SELECT c.*, u.full_name FROM request_comments c JOIN users u ON u.id=c.user_id WHERE c.id=last_insert_rowid()").fetchone()
        return dict(row)
    finally:
        conn.close()

# ═══════════════════════════════════════════════════════════════════════
# RASPBERRY PI NODE MANAGER
# ═══════════════════════════════════════════════════════════════════════

@app.get("/api/pi/nodes")
async def get_pi_nodes(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM pi_nodes ORDER BY name").fetchall()
        return {"nodes": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/pi/nodes")
async def create_pi_node(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = body.get("name","").strip()
    hostname = body.get("hostname","").strip()
    if not name or not hostname: raise HTTPException(400, "Name and hostname required")
    api_key = "PI-" + secrets.token_urlsafe(24)
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO pi_nodes (name,hostname,ip,api_key,role,capabilities,is_backup,backup_priority) VALUES (?,?,?,?,?,?,?,?)",
            (name, hostname, body.get("ip"), api_key, body.get("role","sensor"),
             json.dumps(body.get("capabilities",[])), 1 if body.get("is_backup") else 0,
             body.get("backup_priority",0))
        )
        conn.commit()
        row = conn.execute("SELECT * FROM pi_nodes WHERE id=last_insert_rowid()").fetchone()
        log_action(user["id"], "pi_node_create", {"name": name})
        return dict(row)
    finally:
        conn.close()

@app.put("/api/pi/nodes/{nid}")
async def update_pi_node(nid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        fields, vals = [], []
        for f in ["name","hostname","ip","role","is_backup","backup_priority"]:
            if f in body: fields.append(f"{f}=?"); vals.append(body[f])
        if "capabilities" in body: fields.append("capabilities=?"); vals.append(json.dumps(body["capabilities"]))
        if "assigned_tasks" in body: fields.append("assigned_tasks=?"); vals.append(json.dumps(body["assigned_tasks"]))
        if fields:
            vals.append(nid)
            conn.execute(f"UPDATE pi_nodes SET {', '.join(fields)} WHERE id=?", vals)
            conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/pi/nodes/{nid}")
async def delete_pi_node(nid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM pi_nodes WHERE id=?", (nid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/pi/heartbeat")
async def pi_heartbeat(request: Request):
    """Called by Pi nodes to report status. No user auth – uses API key."""
    api_key = request.headers.get("X-Pi-Key","")
    if not api_key: raise HTTPException(401, "API key required")
    body = await request.json()
    conn = get_db()
    try:
        node = conn.execute("SELECT * FROM pi_nodes WHERE api_key=?", (api_key,)).fetchone()
        if not node: raise HTTPException(403, "Unknown node")
        conn.execute(
            "UPDATE pi_nodes SET status='online', last_seen=datetime('now'), cpu_pct=?, mem_pct=?, disk_free_mb=?, temp_c=?, uptime_s=?, ip=COALESCE(?,ip) WHERE id=?",
            (body.get("cpu_pct"), body.get("mem_pct"), body.get("disk_free_mb"),
             body.get("temp_c"), body.get("uptime_s"), body.get("ip"), node["id"])
        )
        conn.commit()
        assigned = json.loads(node["assigned_tasks"] or "[]")
        return {"ok": True, "node_id": node["id"], "tasks": assigned}
    finally:
        conn.close()

@app.get("/api/pi/nodes/{nid}/tasks")
async def get_pi_tasks(nid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        node = conn.execute("SELECT * FROM pi_nodes WHERE id=?", (nid,)).fetchone()
        if not node: raise HTTPException(404, "Node not found")
        tasks = json.loads(node["assigned_tasks"] or "[]")
        return {"node_id": nid, "tasks": tasks}
    finally:
        conn.close()

@app.post("/api/pi/nodes/{nid}/tasks")
async def assign_pi_task(nid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        node = conn.execute("SELECT * FROM pi_nodes WHERE id=?", (nid,)).fetchone()
        if not node: raise HTTPException(404, "Node not found")
        tasks = json.loads(node["assigned_tasks"] or "[]")
        task = body.get("task","")
        if task and task not in tasks:
            tasks.append(task)
            conn.execute("UPDATE pi_nodes SET assigned_tasks=? WHERE id=?", (json.dumps(tasks), nid))
            conn.commit()
        log_action(user["id"], "pi_task_assign", {"node_id": nid, "task": task})
        return {"ok": True, "tasks": tasks}
    finally:
        conn.close()

@app.delete("/api/pi/nodes/{nid}/tasks/{task}")
async def remove_pi_task(nid: int, task: str, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        node = conn.execute("SELECT * FROM pi_nodes WHERE id=?", (nid,)).fetchone()
        if not node: raise HTTPException(404, "Node not found")
        tasks = [t for t in json.loads(node["assigned_tasks"] or "[]") if t != task]
        conn.execute("UPDATE pi_nodes SET assigned_tasks=? WHERE id=?", (json.dumps(tasks), nid))
        conn.commit()
        return {"ok": True, "tasks": tasks}
    finally:
        conn.close()

# ═══════════════════════════════════════════════════════════════════════
# DEPARTMENTS
# ═══════════════════════════════════════════════════════════════════════

@app.get("/api/departments")
async def get_departments(user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM departments ORDER BY name").fetchall()
        return {"departments": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/departments")
async def create_department(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    name = body.get("name","").strip()
    if not name: raise HTTPException(400, "Name required")
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO departments (name,description,icon,color,head_user_id,parent_id) VALUES (?,?,?,?,?,?)",
            (name, body.get("description"), body.get("icon","🏢"), body.get("color","#6366f1"),
             body.get("head_user_id"), body.get("parent_id"))
        )
        conn.commit()
        row = conn.execute("SELECT * FROM departments WHERE id=last_insert_rowid()").fetchone()
        log_action(user["id"], "department_create", {"name": name})
        return dict(row)
    finally:
        conn.close()

@app.put("/api/departments/{did}")
async def update_department(did: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    try:
        fields, vals = [], []
        for f in ["name","description","icon","color","head_user_id","parent_id"]:
            if f in body: fields.append(f"{f}=?"); vals.append(body[f])
        if fields:
            vals.append(did)
            conn.execute(f"UPDATE departments SET {', '.join(fields)} WHERE id=?", vals)
            conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/departments/{did}")
async def delete_department(did: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM departments WHERE id=?", (did,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

# ═══════════════════════════════════════════════════════════════════════
# TARGETED PUSH NOTIFICATIONS
# ═══════════════════════════════════════════════════════════════════════

@app.post("/api/push/send-to-user")
async def push_to_user(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    target_uid = body.get("user_id")
    title = body.get("title","ControlCenterHQ")
    message = body.get("message","")
    if not target_uid or not message: raise HTTPException(400, "user_id and message required")
    conn = get_db()
    try:
        subs = conn.execute(
            "SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id=?",
            (target_uid,)
        ).fetchall()
    finally:
        conn.close()
    sent = 0
    payload = {"title": title, "body": message, "timestamp": datetime.utcnow().isoformat() + "Z"}
    for sub in subs:
        try:
            sub_dict = {"endpoint": sub["endpoint"], "p256dh": sub["p256dh"], "auth": sub["auth"]}
            await _send_web_push(sub_dict, payload)
            sent += 1
        except Exception:
            pass
    log_action(user["id"], "push_to_user", {"target": target_uid, "sent": sent})
    return {"ok": True, "sent": sent, "total_devices": len(subs)}

@app.post("/api/push/send-to-role")
async def push_to_role(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    role = body.get("role")
    title = body.get("title","ControlCenterHQ")
    message = body.get("message","")
    if not role or not message: raise HTTPException(400, "role and message required")
    conn = get_db()
    try:
        subs = conn.execute(
            "SELECT ps.endpoint, ps.p256dh, ps.auth FROM push_subscriptions ps JOIN users u ON u.id=ps.user_id WHERE u.role=? AND u.is_active=1",
            (role,)
        ).fetchall()
    finally:
        conn.close()
    sent = 0
    payload = {"title": title, "body": message, "timestamp": datetime.utcnow().isoformat() + "Z"}
    for sub in subs:
        try:
            sub_dict = {"endpoint": sub["endpoint"], "p256dh": sub["p256dh"], "auth": sub["auth"]}
            await _send_web_push(sub_dict, payload)
            sent += 1
        except Exception:
            pass
    log_action(user["id"], "push_to_role", {"role": role, "sent": sent})
    return {"ok": True, "sent": sent}

@app.get("/api/push/devices/{uid}")
async def get_user_devices(uid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT id, endpoint, user_agent, created_at FROM push_subscriptions WHERE user_id=? ORDER BY created_at DESC",
            (uid,)
        ).fetchall()
        return {"devices": [dict(r) for r in rows]}
    finally:
        conn.close()


# ─── Infrastructure Scanner: Custom Categories ────────────────────────────────

@app.get("/api/infrastructure/categories")
async def get_infra_categories(user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM infra_categories ORDER BY name").fetchall()
        return {"categories": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/infrastructure/categories")
async def create_infra_category(request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        row = conn.execute(
            "INSERT INTO infra_categories (name,icon,color,overpass_query,custom_type,enabled,created_by) VALUES (?,?,?,?,?,?,?)",
            (data.get("name","Kategorie"), data.get("icon","📍"), data.get("color","#6366f1"),
             data.get("overpass_query"), data.get("custom_type"), int(data.get("enabled",1)), user["id"])
        )
        conn.commit()
        return {"id": row.lastrowid, "ok": True}
    finally:
        conn.close()

@app.put("/api/infrastructure/categories/{cid}")
async def update_infra_category(cid: int, request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        conn.execute(
            "UPDATE infra_categories SET name=?,icon=?,color=?,overpass_query=?,custom_type=?,enabled=? WHERE id=?",
            (data.get("name"), data.get("icon"), data.get("color"),
             data.get("overpass_query"), data.get("custom_type"), int(data.get("enabled",1)), cid)
        )
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/infrastructure/categories/{cid}")
async def delete_infra_category(cid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM infra_categories WHERE id=?", (cid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/infrastructure/custom-items")
async def get_infra_custom_items(user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT i.*, c.name as cat_name, c.icon as cat_icon, c.color as cat_color "
            "FROM infra_custom_items i LEFT JOIN infra_categories c ON i.category_id=c.id ORDER BY i.name"
        ).fetchall()
        return {"items": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/infrastructure/custom-items")
async def create_infra_custom_item(request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        row = conn.execute(
            "INSERT INTO infra_custom_items (category_id,name,description,lat,lng,tags,created_by) VALUES (?,?,?,?,?,?,?)",
            (data.get("category_id"), data.get("name",""), data.get("description"),
             data.get("lat",0.0), data.get("lng",0.0),
             json.dumps(data.get("tags",{})), user["id"])
        )
        conn.commit()
        return {"id": row.lastrowid, "ok": True}
    finally:
        conn.close()

@app.put("/api/infrastructure/custom-items/{iid}")
async def update_infra_custom_item(iid: int, request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        conn.execute(
            "UPDATE infra_custom_items SET category_id=?,name=?,description=?,lat=?,lng=?,tags=?,updated_at=datetime('now') WHERE id=?",
            (data.get("category_id"), data.get("name"), data.get("description"),
             data.get("lat",0.0), data.get("lng",0.0),
             json.dumps(data.get("tags",{})), iid)
        )
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/infrastructure/custom-items/{iid}")
async def delete_infra_custom_item(iid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM infra_custom_items WHERE id=?", (iid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

# ─── Extended Infrastructure Scan (OSM + custom categories + custom items) ────

@app.get("/api/infrastructure/scan")
async def scan_infrastructure(lat: float, lng: float, radius: int = 300, user: dict = Depends(get_current_user)):
    """Extended infrastructure scan: built-in OSM types + user custom categories + custom items."""
    cfg = load_config()
    overpass_url = cfg.get("overpass_url", "https://overpass-api.de/api/interpreter")
    conn = get_db()
    try:
        custom_cats = conn.execute("SELECT * FROM infra_categories WHERE enabled=1").fetchall()
        custom_items = conn.execute(
            "SELECT i.*, c.icon as cat_icon, c.color as cat_color, c.name as cat_name "
            "FROM infra_custom_items i LEFT JOIN infra_categories c ON i.category_id=c.id"
        ).fetchall()
    finally:
        conn.close()

    # Built-in OSM query parts
    builtin_parts = [
        f'node["emergency"="fire_hydrant"](around:{radius},{lat},{lng});',
        f'node["emergency"="water_rescue_station"](around:{radius},{lat},{lng});',
        f'node["emergency"="suction_point"](around:{radius},{lat},{lng});',
        f'node["man_made"]="water_well"](around:{radius},{lat},{lng});',
        f'node["fire_access"](around:{radius},{lat},{lng});',
        f'node["amenity"="fire_station"](around:{radius*5},{lat},{lng});',
        f'node["man_made"="pipeline"](around:{radius},{lat},{lng});',
        f'node["hazmat"](around:{radius},{lat},{lng});',
        f'node["emergency"="assembly_point"](around:{radius},{lat},{lng});',
    ]

    # Custom category query parts (user-defined Overpass fragments)
    cat_parts = []
    for cat in custom_cats:
        if cat["overpass_query"]:
            q = cat["overpass_query"].strip()
            # Replace {radius},{lat},{lng} placeholders
            q = q.replace("{radius}", str(radius)).replace("{lat}", str(lat)).replace("{lng}", str(lng))
            cat_parts.append(q)

    all_parts = builtin_parts + cat_parts
    query = f'[out:json][timeout:20];\n(\n  ' + '\n  '.join(all_parts) + '\n);\nout body;>;out skel qt;'

    features = []
    try:
        import urllib.request as _ur
        import urllib.parse as _up
        data = _up.urlencode({"data": query}).encode()
        req = _ur.Request(overpass_url, data=data, headers={"User-Agent": "ControlCenterHQ/2.8"})
        with _ur.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read().decode())

        # OSM type mapping
        builtin_map = {
            ("emergency","fire_hydrant"): ("hydrant","🔴","#e53935"),
            ("amenity","fire_station"): ("fire_station","🚒","#f57c00"),
            ("emergency","assembly_point"): ("assembly_point","🟢","#43a047"),
            ("emergency","suction_point"): ("water_access","💧","#1e88e5"),
            ("emergency","water_rescue_station"): ("water_access","💧","#1e88e5"),
            ("man_made","pipeline"): ("pipeline","🟡","#fbc02d"),
            ("fire_access",True): ("fire_access","🚧","#8e24aa"),
        }

        for el in result.get("elements", []):
            tags = el.get("tags", {})
            lat_el = el.get("lat"); lng_el = el.get("lon")
            if lat_el is None or lng_el is None:
                continue
            feat_type = "unknown"; label = ""; icon = "🔵"; color = "#607d8b"
            matched = False
            if tags.get("emergency") == "fire_hydrant":
                feat_type,icon,color = "hydrant","🔴","#e53935"; label = f"Hydrant {tags.get('ref','')}"; matched=True
            elif tags.get("amenity") == "fire_station":
                feat_type,icon,color = "fire_station","🚒","#f57c00"; label = tags.get("name","Feuerwehr"); matched=True
            elif tags.get("emergency") == "assembly_point":
                feat_type,icon,color = "assembly_point","🟢","#43a047"; label = tags.get("name","Sammelstelle"); matched=True
            elif tags.get("emergency") in ("suction_point","water_rescue_station"):
                feat_type,icon,color = "water_access","💧","#1e88e5"; label = "Wasserentnahmestelle"; matched=True
            elif tags.get("man_made") == "pipeline":
                feat_type,icon,color = "pipeline","🟡","#fbc02d"; label = f"Leitung ({tags.get('substance','?')})"; matched=True
            elif tags.get("hazmat"):
                feat_type,icon,color = "hazmat","☢️","#d32f2f"; label = "Gefahrstoff"; matched=True
            elif tags.get("fire_access"):
                feat_type,icon,color = "fire_access","🚧","#8e24aa"; label = "Feuerwehrzufahrt"; matched=True
            else:
                # Check if matches a custom category type
                for cat in custom_cats:
                    if cat["custom_type"] and tags.get(cat["custom_type"]):
                        feat_type = f"custom_{cat['id']}"; icon = cat["icon"]; color = cat["color"]
                        label = tags.get("name", cat["name"]); matched = True; break
                if not matched:
                    feat_type = "building"; label = tags.get("name", tags.get("building","Gebäude")); icon = "🏢"; color = "#607d8b"
            features.append({
                "type": feat_type, "label": label, "icon": icon, "color": color,
                "lat": lat_el, "lng": lng_el, "source": "osm",
                "tags": {k:v for k,v in tags.items() if k in ("ref","name","operator","building","levels","addr:street","addr:housenumber","substance","pressure","diameter","material")},
            })
    except Exception as e:
        pass  # OSM failure is non-fatal — return custom items at least

    # Append custom items (always, regardless of OSM success)
    def _haversine_simple(lat1, lng1, lat2, lng2):
        R = 6371000
        dlat = math.radians(lat2-lat1); dlng = math.radians(lng2-lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlng/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    for ci in custom_items:
        dist = _haversine_simple(lat, lng, ci["lat"], ci["lng"])
        if dist <= radius * 5:  # Show custom items in wider radius
            features.append({
                "type": f"custom_{ci['category_id']}", "label": ci["name"],
                "icon": ci["cat_icon"] or "📍", "color": ci["cat_color"] or "#6366f1",
                "lat": ci["lat"], "lng": ci["lng"], "source": "custom",
                "tags": json.loads(ci["tags"] or "{}"),
                "description": ci["description"], "cat_name": ci["cat_name"],
            })

    return {"features": features, "count": len(features), "custom_categories": len(custom_cats)}

# ─── System Monitor (Overhaul) ────────────────────────────────────────────────

@app.get("/api/system/monitor/extended")
async def system_monitor_extended(user: dict = Depends(require_admin)):
    """Comprehensive system monitoring with process list, network, disk I/O, Pi nodes."""
    await _run_health_check()

    conn = get_db()
    try:
        user_count     = conn.execute("SELECT COUNT(*) as c FROM users WHERE is_active=1").fetchone()["c"]
        session_count  = conn.execute("SELECT COUNT(*) as c FROM sessions WHERE expires_at > datetime('now')").fetchone()["c"]
        alert_count    = conn.execute("SELECT COUNT(*) as c FROM alerts WHERE acknowledged=0").fetchone()["c"]
        incident_count = conn.execute("SELECT COUNT(*) as c FROM incidents WHERE status='active'").fetchone()["c"]
        ws_clients     = len(manager.connections)
        total_reqs     = conn.execute("SELECT COUNT(*) as c FROM audit_log WHERE ts > datetime('now','-24 hours')").fetchone()["c"]
        rl_hits        = conn.execute("SELECT COUNT(*) as c FROM rate_limit_log WHERE ts > datetime('now','-24 hours')").fetchone()["c"]

        # Request rate per hour (last 24h)
        req_by_hour = [dict(r) for r in conn.execute(
            "SELECT strftime('%H',ts) as h, COUNT(*) as c FROM audit_log WHERE ts > datetime('now','-24 hours') GROUP BY h ORDER BY h"
        ).fetchall()]

        # Top endpoints (audit_log uses 'action' not 'endpoint')
        top_endpoints = [dict(r) for r in conn.execute(
            "SELECT action as endpoint, COUNT(*) as c FROM audit_log WHERE ts > datetime('now','-24 hours') GROUP BY action ORDER BY c DESC LIMIT 10"
        ).fetchall()]

        # DB sizes
        tables = ["users","sessions","alerts","incidents","fleet_vehicles","fleet_trips",
                  "assets","sensors","chat_messages","audit_log","push_subscriptions","geo_fences",
                  "inventory_items","knowledge_articles","work_requests","pi_nodes","event_predictions"]
        table_counts = {}
        for t in tables:
            try:
                table_counts[t] = conn.execute(f"SELECT COUNT(*) as c FROM {t}").fetchone()["c"]
            except Exception:
                table_counts[t] = None

        # Pi nodes status
        pi_nodes = [dict(r) for r in conn.execute(
            "SELECT id,name,hostname,ip,status,cpu_pct,mem_pct,temp_c,uptime_s,last_seen,is_backup FROM pi_nodes ORDER BY name"
        ).fetchall()]

        # Upcoming scheduled tasks
        upcoming_tasks = [dict(r) for r in conn.execute(
            "SELECT title, next_run, priority FROM scheduled_tasks WHERE enabled=1 ORDER BY next_run LIMIT 5"
        ).fetchall()] if conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='scheduled_tasks'").fetchone() else []

        try:
            import os as _os
            db_path = conn.execute("PRAGMA database_list").fetchone()[2]
            db_size_mb = round(_os.path.getsize(db_path) / 1_048_576, 2) if db_path else None
        except Exception:
            db_size_mb = None

        # DB page stats
        try:
            page_size = conn.execute("PRAGMA page_size").fetchone()[0]
            page_count = conn.execute("PRAGMA page_count").fetchone()[0]
            free_pages = conn.execute("PRAGMA freelist_count").fetchone()[0]
            db_pages = {"page_size": page_size, "page_count": page_count, "free_pages": free_pages}
        except Exception:
            db_pages = {}

    finally:
        conn.close()

    # System metrics (psutil if available)
    system_info = {}
    try:
        import psutil
        # CPU
        cpu_per_core = psutil.cpu_percent(percpu=True)
        cpu_freq = psutil.cpu_freq()
        # Memory
        mem = psutil.virtual_memory()
        swap = psutil.swap_memory()
        # Disk
        disk_parts = []
        for dp in psutil.disk_partitions():
            try:
                du = psutil.disk_usage(dp.mountpoint)
                disk_parts.append({"mountpoint": dp.mountpoint, "fstype": dp.fstype,
                    "total_gb": round(du.total/1e9,2), "used_gb": round(du.used/1e9,2),
                    "free_gb": round(du.free/1e9,2), "pct": du.percent})
            except Exception:
                pass
        # Disk I/O
        try:
            dio = psutil.disk_io_counters()
            disk_io = {"read_mb": round(dio.read_bytes/1e6,1), "write_mb": round(dio.write_bytes/1e6,1),
                       "read_count": dio.read_count, "write_count": dio.write_count}
        except Exception:
            disk_io = {}
        # Network
        net_addrs = {}
        for iface, addrs in psutil.net_if_addrs().items():
            net_addrs[iface] = [{"family": str(a.family), "addr": a.address, "netmask": a.netmask} for a in addrs]
        try:
            net_io = psutil.net_io_counters()
            network_io = {"sent_mb": round(net_io.bytes_sent/1e6,1), "recv_mb": round(net_io.bytes_recv/1e6,1),
                          "packets_sent": net_io.packets_sent, "packets_recv": net_io.packets_recv,
                          "err_in": net_io.errin, "err_out": net_io.errout}
        except Exception:
            network_io = {}
        # Processes (top 15 by CPU)
        procs = []
        for p in sorted(psutil.process_iter(["pid","name","cpu_percent","memory_percent","status","username"]),
                        key=lambda p: -(p.info.get("cpu_percent") or 0))[:15]:
            procs.append(p.info)
        # Boot time
        import datetime as _dt
        boot_ts = psutil.boot_time()
        boot_dt = _dt.datetime.fromtimestamp(boot_ts)
        uptime_s = int(time.time() - boot_ts)
        # Temperatures
        temps = {}
        try:
            for name, entries in (psutil.sensors_temperatures() or {}).items():
                temps[name] = [{"label": e.label, "current": e.current, "high": e.high, "critical": e.critical} for e in entries]
        except Exception:
            pass
        # Battery
        battery = None
        try:
            bat = psutil.sensors_battery()
            if bat:
                battery = {"percent": bat.percent, "plugged": bat.power_plugged, "secs_left": bat.secsleft}
        except Exception:
            pass
        system_info = {
            "cpu": {"percent": sum(cpu_per_core)/len(cpu_per_core) if cpu_per_core else 0,
                    "per_core": cpu_per_core, "count": len(cpu_per_core),
                    "freq_mhz": round(cpu_freq.current,0) if cpu_freq else None,
                    "freq_max_mhz": round(cpu_freq.max,0) if cpu_freq and cpu_freq.max else None},
            "memory": {"total_gb": round(mem.total/1e9,2), "used_gb": round(mem.used/1e9,2),
                       "free_gb": round(mem.available/1e9,2), "pct": mem.percent,
                       "swap_total_gb": round(swap.total/1e9,2), "swap_used_pct": swap.percent},
            "disk": disk_parts, "disk_io": disk_io,
            "network": {"interfaces": net_addrs, "io": network_io},
            "processes": procs,
            "boot_time": boot_dt.isoformat(), "uptime_s": uptime_s,
            "temperatures": temps, "battery": battery,
        }
    except ImportError:
        # psutil not available — use basic OS stats
        import shutil as _shutil
        try:
            du = _shutil.disk_usage("/")
            system_info["disk"] = [{"mountpoint": "/", "total_gb": round(du.total/1e9,2),
                "used_gb": round(du.used/1e9,2), "free_gb": round(du.free/1e9,2),
                "pct": round(du.used/du.total*100,1)}]
        except Exception:
            pass
    except Exception:
        pass

    current = _SYSMON_HISTORY[-1] if _SYSMON_HISTORY else {}
    hostname = "unknown"
    try:
        hostname = socket.gethostname()
    except Exception:
        pass

    return {
        "current": current,
        "history": _SYSMON_HISTORY[-60:],
        "platform": {
            "hostname": hostname,
            "os": platform.system(), "os_version": platform.release(),
            "python_version": platform.python_version(), "arch": platform.machine(),
            "app_name": APP_NAME, "app_version": APP_VERSION,
        },
        "application": {
            "active_users": user_count, "active_sessions": session_count,
            "active_alerts": alert_count, "active_incidents": incident_count,
            "websocket_connections": ws_clients,
            "api_requests_24h": total_reqs, "rate_limit_hits_24h": rl_hits,
            "db_size_mb": db_size_mb, "db_pages": db_pages,
            "req_by_hour": req_by_hour, "top_endpoints": top_endpoints,
        },
        "db_tables": table_counts,
        "pi_nodes": pi_nodes,
        "upcoming_tasks": upcoming_tasks,
        "system": system_info,
    }

# ─── Event Predictions from Web/News ─────────────────────────────────────────

RSS_FEEDS = [
    {"url": "https://www.dwd.de/DE/warnungen/warnwetter_de/feeds/warnungen_bilder_de.rss", "name": "DWD Unwetterwarnungen", "category": "weather"},
    {"url": "https://warnung.bund.de/api31/dashboard.json", "name": "Bundeswarnung", "category": "emergency"},
    {"url": "https://feeds.bbci.co.uk/news/world/rss.xml", "name": "BBC World News", "category": "general"},
    {"url": "https://rss.dw.com/rdf/rss-de-all", "name": "DW Deutsch", "category": "general"},
]

def _parse_rss(url: str, source_name: str, category: str) -> list:
    """Fetch and parse an RSS feed; return list of prediction dicts."""
    items = []
    try:
        import urllib.request as _ur
        req = _ur.Request(url, headers={"User-Agent": "ControlCenterHQ/2.8 (event-monitor)"})
        with _ur.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
        # Very simple XML extraction (no lxml dependency)
        import re as _re
        titles = _re.findall(r'<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)</title>', raw, _re.DOTALL)
        descs  = _re.findall(r'<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)</description>', raw, _re.DOTALL)
        dates  = _re.findall(r'<pubDate>(.*?)</pubDate>', raw, _re.DOTALL)
        for i, (t1, t2) in enumerate(titles[1:], 0):  # skip channel title
            title = (t1 or t2).strip()
            if not title or title.lower() in ("", source_name.lower()):
                continue
            desc_pair = descs[i+1] if i+1 < len(descs) else ("","")
            summary = (desc_pair[0] or desc_pair[1]).strip()[:300]
            pub_date = dates[i] if i < len(dates) else None
            # Simple severity heuristic
            lower = (title+" "+summary).lower()
            severity = "info"
            if any(w in lower for w in ["gefahr","danger","warning","warnung","emergency","notfall","kritisch","critical","extrem"]):
                severity = "warning"
            if any(w in lower for w in ["alarm","katastrophe","disaster","severe","extreme","evakuier","evacuat"]):
                severity = "critical"
            items.append({
                "source_url": url, "source_name": source_name,
                "title": title[:200], "summary": summary,
                "category": category, "severity": severity,
                "predicted_date": pub_date, "confidence": 0.7,
                "tags": json.dumps([category]),
            })
    except Exception:
        pass
    return items[:20]

@app.post("/api/predictions/fetch")
async def fetch_event_predictions(user: dict = Depends(require_admin)):
    """Fetch current predictions from RSS feeds and store in DB."""
    conn = get_db()
    try:
        # Load custom feeds from config
        cfg = load_config()
        extra_feeds = cfg.get("prediction_feeds", [])
        all_feeds = RSS_FEEDS + extra_feeds

        inserted = 0
        for feed in all_feeds:
            items = _parse_rss(feed["url"], feed.get("name","Feed"), feed.get("category","general"))
            for item in items:
                try:
                    conn.execute(
                        "INSERT INTO event_predictions (source_url,source_name,title,summary,category,severity,predicted_date,confidence,tags) "
                        "VALUES (?,?,?,?,?,?,?,?,?)",
                        (item["source_url"], item["source_name"], item["title"], item["summary"],
                         item["category"], item["severity"], item["predicted_date"], item["confidence"], item["tags"])
                    )
                    inserted += 1
                except Exception:
                    pass
        conn.commit()

        # Update 6-month history aggregation
        conn.execute(
            "INSERT INTO event_prediction_history (month, category, count, avg_severity) "
            "SELECT strftime('%Y-%m', fetched_at), category, COUNT(*), "
            "AVG(CASE severity WHEN 'critical' THEN 3 WHEN 'warning' THEN 2 ELSE 1 END) "
            "FROM event_predictions WHERE strftime('%Y-%m', fetched_at) = strftime('%Y-%m', 'now') "
            "GROUP BY category "
            "ON CONFLICT DO NOTHING"
        )
        conn.commit()

        return {"ok": True, "inserted": inserted, "feeds_checked": len(all_feeds)}
    finally:
        conn.close()

@app.get("/api/predictions")
async def get_event_predictions(category: str = None, severity: str = None, limit: int = 50, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        q = "SELECT * FROM event_predictions WHERE 1=1"
        params = []
        if category:
            q += " AND category=?"; params.append(category)
        if severity:
            q += " AND severity=?"; params.append(severity)
        q += " ORDER BY fetched_at DESC LIMIT ?"
        params.append(limit)
        rows = conn.execute(q, params).fetchall()

        # 6-month history
        history = conn.execute(
            "SELECT month, category, count, avg_severity FROM event_prediction_history "
            "WHERE month >= strftime('%Y-%m', 'now', '-6 months') ORDER BY month, category"
        ).fetchall()

        # Category breakdown (current)
        breakdown = conn.execute(
            "SELECT category, severity, COUNT(*) as cnt FROM event_predictions "
            "WHERE fetched_at > datetime('now','-7 days') GROUP BY category, severity ORDER BY cnt DESC"
        ).fetchall()

        return {
            "predictions": [dict(r) for r in rows],
            "history_6m": [dict(r) for r in history],
            "breakdown": [dict(r) for r in breakdown],
            "total": len(rows),
        }
    finally:
        conn.close()

@app.put("/api/predictions/{pid}/confirm")
async def confirm_prediction(pid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("UPDATE event_predictions SET is_confirmed=1 WHERE id=?", (pid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/predictions/{pid}")
async def delete_prediction(pid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM event_predictions WHERE id=?", (pid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

# ─── Pi Failover & Access Shield Management ───────────────────────────────────

@app.post("/api/pi/nodes/{nid}/set-failover")
async def set_pi_failover(nid: int, request: Request, user: dict = Depends(require_admin)):
    """Configure a Pi node as automatic failover backup."""
    data = await request.json()
    conn = get_db()
    try:
        conn.execute(
            "UPDATE pi_nodes SET is_backup=?, backup_priority=? WHERE id=?",
            (int(data.get("is_backup", 1)), data.get("priority", 1), nid)
        )
        conn.commit()
        # Generate failover agent script content
        node = conn.execute("SELECT * FROM pi_nodes WHERE id=?", (nid,)).fetchone()
        if not node:
            raise HTTPException(404, "Node not found")
        cfg = load_config()
        primary_host = cfg.get("primary_host", socket.gethostname())
        primary_port = cfg.get("port", 8080)
        script = f'''#!/usr/bin/env python3
# ControlCenterHQ Pi Failover Agent
# Auto-generated for node: {node["name"]} ({node["hostname"]})
# © Felix Greis 2026

import time, subprocess, urllib.request, os, sys, socket

PRIMARY_URL = "http://{primary_host}:{primary_port}/api/health"
CHECK_INTERVAL = 10  # seconds between checks
FAIL_THRESHOLD = 3   # consecutive failures before failover
CCHQ_CMD = ["python3", os.path.expanduser("~/cchq/main.py")]  # path to local CCHQ copy
API_KEY = "{node["api_key"]}"

fail_count = 0
failover_active = False

def check_primary():
    try:
        req = urllib.request.Request(PRIMARY_URL, headers={{"X-Failover-Check": "1"}})
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.status == 200
    except Exception:
        return False

def start_failover():
    global failover_active
    print("[FAILOVER] Primary unreachable – starting local CCHQ instance...")
    subprocess.Popen(CCHQ_CMD)
    failover_active = True

def stop_failover():
    global failover_active
    print("[FAILOVER] Primary back online – stopping local instance...")
    subprocess.call(["pkill", "-f", "main.py"])
    failover_active = False

def report_status(is_failover):
    try:
        import json
        payload = json.dumps({{"failover_active": is_failover, "hostname": socket.gethostname()}}).encode()
        req = urllib.request.Request(
            f"http://{{socket.gethostname()}}:{primary_port}/api/pi/heartbeat",
            data=payload, headers={{"Content-Type":"application/json","X-Pi-Key":API_KEY}},method="POST"
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass

print("[FAILOVER AGENT] Starting — monitoring {primary_host}:{primary_port}")
while True:
    ok = check_primary()
    if ok:
        fail_count = 0
        if failover_active:
            stop_failover()
        report_status(False)
    else:
        fail_count += 1
        print(f"[FAILOVER] Primary check failed ({{fail_count}}/{{FAIL_THRESHOLD}})")
        if fail_count >= FAIL_THRESHOLD and not failover_active:
            start_failover()
    time.sleep(CHECK_INTERVAL)
'''
        return {"ok": True, "failover_script": script, "node": dict(node)}
    finally:
        conn.close()

@app.get("/api/pi/nodes/{nid}/failover-script")
async def get_failover_script(nid: int, user: dict = Depends(require_admin)):
    """Get the failover agent script for a specific Pi node."""
    conn = get_db()
    try:
        node = conn.execute("SELECT * FROM pi_nodes WHERE id=?", (nid,)).fetchone()
        if not node:
            raise HTTPException(404, "Node not found")
        cfg = load_config()
        primary_host = cfg.get("primary_host", socket.gethostname())
        primary_port = cfg.get("port", 8080)
        script = f'''#!/usr/bin/env python3
# ControlCenterHQ Pi Failover Agent — {node["name"]}
import time, subprocess, urllib.request, socket, os, json

PRIMARY_URL = "http://{primary_host}:{primary_port}/api/health"
CHECK_INTERVAL = 10
FAIL_THRESHOLD = 3
CCHQ_DIR = os.path.expanduser("~/cchq")
API_KEY = "{node["api_key"]}"

fail_count = 0; failover_proc = None

def is_primary_up():
    try:
        with urllib.request.urlopen(PRIMARY_URL, timeout=5) as r: return r.status == 200
    except: return False

while True:
    if is_primary_up():
        fail_count = 0
        if failover_proc and failover_proc.poll() is None:
            failover_proc.terminate(); failover_proc = None
            print("[Failover] Primary restored — local instance stopped.")
    else:
        fail_count += 1
        if fail_count >= FAIL_THRESHOLD and (not failover_proc or failover_proc.poll() is not None):
            print("[Failover] Starting local CCHQ...")
            failover_proc = subprocess.Popen(["python3", f"{{CCHQ_DIR}}/main.py"])
    time.sleep(CHECK_INTERVAL)
'''
        return {"script": script, "filename": f"failover_{node['hostname']}.py"}
    finally:
        conn.close()

@app.post("/api/pi/nodes/{nid}/generate-shield-config")
async def generate_shield_config(nid: int, request: Request, user: dict = Depends(require_admin)):
    """Generate nginx + iptables config for Pi as access shield/reverse proxy."""
    data = await request.json()
    conn = get_db()
    try:
        node = conn.execute("SELECT * FROM pi_nodes WHERE id=?", (nid,)).fetchone()
        if not node:
            raise HTTPException(404, "Node not found")
        cfg = load_config()
        primary_host = data.get("primary_host", cfg.get("primary_host", "192.168.1.100"))
        primary_port = data.get("primary_port", cfg.get("port", 8080))
        shield_port  = data.get("shield_port", 443)
        allowed_ips  = data.get("allowed_ips", [])  # list of CIDRs
        rate_limit   = data.get("rate_limit", "10r/s")
        ssl_cert     = data.get("ssl_cert", "/etc/ssl/certs/cchq.crt")
        ssl_key      = data.get("ssl_key", "/etc/ssl/private/cchq.key")

        nginx_conf = rf"""# ControlCenterHQ Pi Access Shield — {node["name"]}
# Generated by ControlCenterHQ v{APP_VERSION}
# Place in /etc/nginx/sites-available/cchq-shield

limit_req_zone $binary_remote_addr zone=cchq_limit:10m rate={rate_limit};

server {{
    listen {shield_port} ssl http2;
    server_name {node["hostname"]} {node["ip"] or "_"};

    ssl_certificate     {ssl_cert};
    ssl_certificate_key {ssl_key};
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req zone=cchq_limit burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' wss:;";

    # Upstream CCHQ
    location / {{
        proxy_pass         http://{primary_host}:{primary_port};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Shield-Node {node["name"]};
        proxy_read_timeout 300s;
    }}

    # Block common exploit paths
    location ~* (\.php|\.asp|\.env|wp-admin|\.git) {{
        return 444;
    }}
}}

# HTTP → HTTPS redirect
server {{
    listen 80;
    server_name {node["hostname"]} {node["ip"] or "_"};
    return 301 https://$host$request_uri;
}}
"""

        iptables_script = rf"""#!/bin/bash
# ControlCenterHQ Pi Access Shield — iptables rules
# Run as root on {node["hostname"]}

# Flush existing rules
iptables -F INPUT
iptables -F FORWARD
iptables -F OUTPUT

# Default policy: DROP all incoming
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow established/related connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (management)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTPS (shield port)
iptables -A INPUT -p tcp --dport {shield_port} -j ACCEPT

# Allow HTTP (for redirect)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Allow ICMP ping
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
""" + ("".join([f"\n# Allow specific IP/CIDR\niptables -A INPUT -s {ip} -j ACCEPT" for ip in allowed_ips]) if allowed_ips else "") + """

# Rate limit new connections (SYN flood protection)
iptables -A INPUT -p tcp --syn -m limit --limit 25/s --limit-burst 50 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Log dropped packets
iptables -A INPUT -j LOG --log-prefix "CCHQ-SHIELD-DROP: " --log-level 4
iptables -A INPUT -j DROP

# Save rules
iptables-save > /etc/iptables/rules.v4
echo "[Shield] iptables rules applied and saved."
"""

        setup_script = f"""#!/bin/bash
# Quick setup script for Pi Access Shield
apt-get update && apt-get install -y nginx iptables-persistent openssl
# Generate self-signed cert if no real cert available
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
    -keyout {ssl_key} -out {ssl_cert} \\
    -subj "/C=DE/ST=Bayern/O=ControlCenterHQ/CN={node['hostname']}"
# Enable nginx site
ln -sf /etc/nginx/sites-available/cchq-shield /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
echo "[Shield] Setup complete. Nginx proxying to {primary_host}:{primary_port}"
"""

        return {
            "ok": True,
            "nginx_config": nginx_conf,
            "iptables_script": iptables_script,
            "setup_script": setup_script,
            "node": dict(node),
        }
    finally:
        conn.close()

# ─── WireGuard Remote Access System ──────────────────────────────────────────

def _wg_generate_keypair():
    """Generate WireGuard keypair using wg tool or fallback."""
    try:
        import subprocess as _sp
        priv = _sp.check_output(["wg", "genkey"], stderr=_sp.DEVNULL).decode().strip()
        pub  = _sp.check_output(["wg", "pubkey"], input=priv.encode(), stderr=_sp.DEVNULL).decode().strip()
        return priv, pub
    except Exception:
        # Fallback: generate random base64 strings (placeholder)
        import base64 as _b64, os as _os
        priv = _b64.b64encode(_os.urandom(32)).decode()
        pub  = _b64.b64encode(_os.urandom(32)).decode()
        return priv, pub

@app.get("/api/wireguard/config")
async def get_wg_config(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM wireguard_config WHERE id=1").fetchone()
        peers = conn.execute(
            "SELECT wp.*, u.username, u.full_name FROM wireguard_peers wp LEFT JOIN users u ON wp.user_id=u.id ORDER BY wp.name"
        ).fetchall()
        return {"config": dict(row) if row else None, "peers": [dict(p) for p in peers]}
    finally:
        conn.close()

@app.post("/api/wireguard/init")
async def init_wg_server(request: Request, user: dict = Depends(require_admin)):
    """Initialize WireGuard server config with new keypair."""
    data = await request.json()
    conn = get_db()
    try:
        priv, pub = _wg_generate_keypair()
        cfg = load_config()
        endpoint = data.get("endpoint", f"{socket.gethostname()}:{data.get('listen_port',51820)}")
        conn.execute(
            "INSERT INTO wireguard_config (id, server_public_key, server_private_key, server_endpoint, listen_port, server_ip, dns) "
            "VALUES (1,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET server_public_key=excluded.server_public_key, "
            "server_private_key=excluded.server_private_key, server_endpoint=excluded.server_endpoint, "
            "listen_port=excluded.listen_port, server_ip=excluded.server_ip, dns=excluded.dns, updated_at=datetime('now')",
            (pub, priv, endpoint, data.get("listen_port",51820),
             data.get("server_ip","10.100.0.1/24"), data.get("dns","1.1.1.1"))
        )
        conn.commit()
        log_action(user["id"], "wireguard_init", {"endpoint": endpoint})
        return {"ok": True, "public_key": pub, "endpoint": endpoint}
    finally:
        conn.close()

@app.get("/api/wireguard/server-config")
async def get_wg_server_config(user: dict = Depends(require_admin)):
    """Generate wg0.conf for the server."""
    conn = get_db()
    try:
        cfg_row = conn.execute("SELECT * FROM wireguard_config WHERE id=1").fetchone()
        if not cfg_row:
            raise HTTPException(400, "WireGuard not initialized. POST /api/wireguard/init first.")
        peers = conn.execute("SELECT * FROM wireguard_peers WHERE enabled=1").fetchall()

        lines = [
            "[Interface]",
            f"PrivateKey = {cfg_row['server_private_key']}",
            f"Address = {cfg_row['server_ip']}",
            f"ListenPort = {cfg_row['listen_port']}",
            f"DNS = {cfg_row['dns']}",
            "# PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE",
            "# PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE",
            "",
        ]
        for peer in peers:
            lines += [
                f"# {peer['name']}",
                "[Peer]",
                f"PublicKey = {peer['public_key']}",
                f"AllowedIPs = {peer['allowed_ips']}",
            ]
            if peer["endpoint"]:
                lines.append(f"Endpoint = {peer['endpoint']}")
            if peer["preshared_key"]:
                lines.append(f"PresharedKey = {peer['preshared_key']}")
            if peer["keepalive"] and peer["keepalive"] > 0:
                lines.append(f"PersistentKeepalive = {peer['keepalive']}")
            lines.append("")

        return {"config": "\n".join(lines), "filename": "wg0.conf"}
    finally:
        conn.close()

@app.get("/api/wireguard/peers")
async def list_wg_peers(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT wp.*, u.username, u.full_name FROM wireguard_peers wp LEFT JOIN users u ON wp.user_id=u.id ORDER BY wp.name"
        ).fetchall()
        return {"peers": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/wireguard/peers")
async def create_wg_peer(request: Request, user: dict = Depends(require_admin)):
    """Create a new WireGuard peer; auto-generate keypair if not provided."""
    data = await request.json()
    conn = get_db()
    try:
        cfg_row = conn.execute("SELECT * FROM wireguard_config WHERE id=1").fetchone()
        if not cfg_row:
            raise HTTPException(400, "WireGuard server not initialized")

        priv, pub = _wg_generate_keypair()
        if data.get("public_key"):
            pub = data["public_key"]; priv = None  # User-provided key

        # Auto-assign IP in 10.100.0.x range
        existing_ips = conn.execute("SELECT allowed_ips FROM wireguard_peers").fetchall()
        used_hosts = set()
        for row in existing_ips:
            try:
                host = int(row["allowed_ips"].split(".")[3].split("/")[0])
                used_hosts.add(host)
            except Exception:
                pass
        server_host = int(cfg_row["server_ip"].split(".")[3].split("/")[0])
        used_hosts.add(server_host)
        next_host = next((i for i in range(2, 255) if i not in used_hosts), 2)
        base_net = ".".join(cfg_row["server_ip"].split(".")[:3])
        allowed_ips = data.get("allowed_ips", f"{base_net}.{next_host}/32")

        psk = data.get("preshared_key")
        if data.get("generate_psk"):
            import base64 as _b64, os as _os
            psk = _b64.b64encode(_os.urandom(32)).decode()

        row = conn.execute(
            "INSERT INTO wireguard_peers (name,public_key,allowed_ips,endpoint,role,user_id,preshared_key,keepalive,enabled,created_by) "
            "VALUES (?,?,?,?,?,?,?,?,1,?)",
            (data.get("name","Client"), pub, allowed_ips,
             data.get("endpoint"), data.get("role","client"),
             data.get("user_id"), psk, data.get("keepalive",25), user["id"])
        )
        conn.commit()
        pid = row.lastrowid

        # Generate client config
        server_ip = cfg_row["server_ip"].split("/")[0]  # e.g. 10.100.0.1
        client_conf = f"""[Interface]
PrivateKey = {priv or "(paste your private key here)"}
Address = {allowed_ips.replace('/32','/24')}
DNS = {cfg_row['dns']}

[Peer]
PublicKey = {cfg_row['server_public_key']}
""" + (f"PresharedKey = {psk}\n" if psk else "") + f"""AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = {cfg_row['server_endpoint']}
PersistentKeepalive = 25
"""
        # QR code for mobile client
        qr_data = _generate_qr_code(client_conf)
        log_action(user["id"], "wireguard_peer_create", {"name": data.get("name"), "ip": allowed_ips})
        return {
            "ok": True, "id": pid, "public_key": pub, "allowed_ips": allowed_ips,
            "private_key": priv, "preshared_key": psk,
            "client_config": client_conf, "client_config_qr": qr_data,
        }
    finally:
        conn.close()

@app.put("/api/wireguard/peers/{pid}")
async def update_wg_peer(pid: int, request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        conn.execute(
            "UPDATE wireguard_peers SET name=?,allowed_ips=?,endpoint=?,role=?,keepalive=?,enabled=? WHERE id=?",
            (data.get("name"), data.get("allowed_ips"), data.get("endpoint"),
             data.get("role","client"), data.get("keepalive",25), int(data.get("enabled",1)), pid)
        )
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/wireguard/peers/{pid}")
async def delete_wg_peer(pid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM wireguard_peers WHERE id=?", (pid,))
        conn.commit()
        log_action(user["id"], "wireguard_peer_delete", {"id": pid})
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/wireguard/peers/{pid}/config")
async def get_peer_client_config(pid: int, user: dict = Depends(require_admin)):
    """Get the client .conf and QR code for a peer."""
    conn = get_db()
    try:
        peer = conn.execute("SELECT * FROM wireguard_peers WHERE id=?", (pid,)).fetchone()
        cfg_row = conn.execute("SELECT * FROM wireguard_config WHERE id=1").fetchone()
        if not peer or not cfg_row:
            raise HTTPException(404, "Peer or server config not found")
        client_conf = f"""[Interface]
PrivateKey = (your private key — regenerate if lost)
Address = {peer['allowed_ips'].replace('/32','/24')}
DNS = {cfg_row['dns']}

[Peer]
PublicKey = {cfg_row['server_public_key']}
""" + (f"PresharedKey = {peer['preshared_key']}\n" if peer['preshared_key'] else "") + f"""AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = {cfg_row['server_endpoint']}
PersistentKeepalive = {peer['keepalive'] or 25}
"""
        qr = _generate_qr_code(client_conf)
        return {"config": client_conf, "qr": qr, "filename": f"{peer['name']}.conf"}
    finally:
        conn.close()

@app.post("/api/wireguard/apply")
async def apply_wg_config(user: dict = Depends(require_admin)):
    """Apply the current WireGuard config to the system (requires wg-quick)."""
    conn = get_db()
    try:
        cfg_row = conn.execute("SELECT * FROM wireguard_config WHERE id=1").fetchone()
        if not cfg_row:
            raise HTTPException(400, "WireGuard not initialized")
        peers = conn.execute("SELECT * FROM wireguard_peers WHERE enabled=1").fetchall()
    finally:
        conn.close()

    # Build config text
    lines = [
        "[Interface]",
        f"PrivateKey = {cfg_row['server_private_key']}",
        f"Address = {cfg_row['server_ip']}",
        f"ListenPort = {cfg_row['listen_port']}",
        "PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE",
        "PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE",
        "",
    ]
    for peer in peers:
        lines += [f"# {peer['name']}", "[Peer]", f"PublicKey = {peer['public_key']}", f"AllowedIPs = {peer['allowed_ips']}"]
        if peer["preshared_key"]: lines.append(f"PresharedKey = {peer['preshared_key']}")
        if peer["keepalive"]: lines.append(f"PersistentKeepalive = {peer['keepalive']}")
        lines.append("")
    config_text = "\n".join(lines)

    try:
        import subprocess as _sp, tempfile as _tf
        with _tf.NamedTemporaryFile(mode="w", suffix=".conf", delete=False) as f:
            f.write(config_text); tmpf = f.name
        result = _sp.run(["wg-quick", "up", tmpf], capture_output=True, text=True, timeout=15)
        import os as _os; _os.unlink(tmpf)
        if result.returncode != 0:
            return {"ok": False, "error": result.stderr, "config": config_text}
        log_action(user["id"], "wireguard_apply", {})
        return {"ok": True, "output": result.stdout, "config": config_text}
    except FileNotFoundError:
        return {"ok": False, "error": "wg-quick not found — install WireGuard first", "config": config_text}
    except Exception as e:
        return {"ok": False, "error": str(e), "config": config_text}


# ═══════════════════════════════════════════════════════════════════════════════
# SECURITY AI ENGINE  – Selbstlernende Anomalie-Erkennung
# ═══════════════════════════════════════════════════════════════════════════════

# ── In-memory state for real-time tracking ────────────────────────────────────
_AI_STATE: dict = {
    "last_analysis": None,
    "current_score": 0.0,       # 0-100 global threat score
    "ip_request_window": {},    # ip -> [timestamps]
    "user_action_window": {},   # user_id -> [timestamps]
    "endpoint_counts": {},      # endpoint -> count last minute
    "failed_login_ips": {},     # ip -> count last hour
    "session_geos": {},         # token -> first_ip (for geo-jump detection)
}

# ── Statistical helpers ────────────────────────────────────────────────────────
def _ai_update_baseline(conn, metric: str, value: float):
    """Online Welford algorithm: update mean/std without storing all samples."""
    row = conn.execute("SELECT * FROM ai_baselines WHERE metric=?", (metric,)).fetchone()
    if row is None:
        conn.execute(
            "INSERT INTO ai_baselines (metric,value_mean,value_std,value_min,value_max,sample_count) VALUES (?,?,1,?,?,1)",
            (metric, value, value, value)
        )
        return
    n = row["sample_count"] + 1
    old_mean = row["value_mean"]
    new_mean = old_mean + (value - old_mean) / n
    # Welford M2
    old_m2 = (row["value_std"] ** 2) * max(row["sample_count"] - 1, 1)
    new_m2 = old_m2 + (value - old_mean) * (value - new_mean)
    new_std = max(math.sqrt(new_m2 / max(n - 1, 1)), 0.001)
    conn.execute(
        "UPDATE ai_baselines SET value_mean=?,value_std=?,value_min=?,value_max=?,sample_count=?,last_updated=datetime('now') WHERE metric=?",
        (new_mean, new_std, min(row["value_min"] or value, value), max(row["value_max"] or value, value), n, metric)
    )

def _ai_z_score(conn, metric: str, value: float) -> float:
    """Return z-score of value vs stored baseline. High = anomalous."""
    row = conn.execute("SELECT * FROM ai_baselines WHERE metric=?", (metric,)).fetchone()
    if row is None or row["sample_count"] < 5:
        return 0.0  # not enough data yet
    std = max(row["value_std"], 0.001)
    return abs(value - row["value_mean"]) / std

def _ai_confidence(z: float) -> float:
    """Convert z-score to 0-1 confidence using sigmoid-like mapping."""
    # z=2 → ~0.5, z=3 → ~0.75, z=5 → ~0.95
    return min(0.98, max(0.0, (z - 1.5) / 4.0 + 0.3))

def _ai_severity_from_confidence(c: float) -> str:
    if c >= 0.85: return "critical"
    if c >= 0.65: return "high"
    if c >= 0.45: return "medium"
    return "low"

# ── Threat creation helper ─────────────────────────────────────────────────────
def _ai_create_threat(conn, threat_type: str, description: str, evidence: dict,
                       confidence: float, source_ip: str = None, source_user_id: int = None,
                       auto_action: str = None):
    sev = _ai_severity_from_confidence(confidence)
    tid = conn.execute(
        "INSERT INTO ai_threats (threat_type,severity,confidence,source_ip,source_user_id,description,evidence,auto_action) VALUES (?,?,?,?,?,?,?,?)",
        (threat_type, sev, round(confidence, 3), source_ip, source_user_id,
         description, json.dumps(evidence), auto_action)
    ).lastrowid
    conn.commit()
    return tid

# ── Auto-action executor ───────────────────────────────────────────────────────
def _ai_execute_action(conn, action: str, source_ip: str = None, source_user_id: int = None):
    """Execute an automatic defensive action."""
    if action == "block_ip" and source_ip:
        blocked_until = (datetime.utcnow() + timedelta(hours=2)).isoformat()
        conn.execute(
            "INSERT OR REPLACE INTO ip_blacklist (ip, reason, blocked_until) VALUES (?,?,?)",
            (source_ip, "AI auto-block", blocked_until)
        )
        conn.commit()
    elif action == "invalidate_sessions" and source_user_id:
        conn.execute("DELETE FROM sessions WHERE user_id=?", (source_user_id,))
        conn.commit()
    elif action == "force_mfa" and source_user_id:
        # Set a flag so next login requires re-auth (use existing is_active toggle as circuit-breaker)
        pass  # placeholder – extend when MFA is added

# ── Core analysis function ─────────────────────────────────────────────────────
def _ai_analyze(conn) -> dict:
    """Run full anomaly analysis. Returns a summary dict."""
    now = datetime.utcnow()
    threats_created = []

    # ── 1. Brute-force detection ──────────────────────────────────────────────
    failed_logins = conn.execute(
        "SELECT ip_addr, COUNT(*) as cnt FROM event_log WHERE action='login_failed' "
        "AND timestamp > datetime('now','-1 hour') GROUP BY ip_addr HAVING cnt >= 3"
    ).fetchall()
    for row in failed_logins:
        ip = row["ip_addr"]; cnt = row["cnt"]
        _ai_update_baseline(conn, "failed_logins_per_ip_1h", cnt)
        z = _ai_z_score(conn, "failed_logins_per_ip_1h", cnt)
        conf = max(0.4, min(0.99, cnt / 20.0))  # 5 fails=25%, 20 fails=99%
        if cnt >= 5:
            tid = _ai_create_threat(conn, "brute_force",
                f"{cnt} fehlgeschlagene Logins von {ip} in der letzten Stunde",
                {"ip": ip, "failed_count": cnt, "z_score": round(z,2)},
                conf, source_ip=ip,
                auto_action="block_ip" if cnt >= 15 else None)
            if cnt >= 15:
                _ai_execute_action(conn, "block_ip", source_ip=ip)
            threats_created.append(tid)

    # ── 2. Credential stuffing (many IPs hitting login) ───────────────────────
    distinct_ips_login = conn.execute(
        "SELECT COUNT(DISTINCT ip_addr) as c FROM event_log WHERE action='login_failed' "
        "AND timestamp > datetime('now','-10 minutes')"
    ).fetchone()["c"]
    _ai_update_baseline(conn, "distinct_failed_ips_10m", distinct_ips_login)
    z = _ai_z_score(conn, "distinct_failed_ips_10m", distinct_ips_login)
    if distinct_ips_login >= 5 and z > 2.5:
        conf = _ai_confidence(z)
        tid = _ai_create_threat(conn, "credential_stuffing",
            f"{distinct_ips_login} verschiedene IPs schlagen Login fehl (letzte 10 Min) — möglicher Credential-Stuffing-Angriff",
            {"distinct_ips": distinct_ips_login, "z_score": round(z,2)},
            conf, auto_action=None)
        threats_created.append(tid)

    # ── 3. Privilege escalation detection ────────────────────────────────────
    priv_changes = conn.execute(
        "SELECT COUNT(*) as c FROM event_log WHERE action IN ('role_change','user_promote','owner_transfer') "
        "AND timestamp > datetime('now','-1 hour')"
    ).fetchone()["c"]
    if priv_changes >= 2:
        details = conn.execute(
            "SELECT e.details, u.username FROM event_log e LEFT JOIN users u ON e.user_id=u.id "
            "WHERE e.action IN ('role_change','user_promote') AND e.timestamp > datetime('now','-1 hour') LIMIT 5"
        ).fetchall()
        tid = _ai_create_threat(conn, "privilege_escalation",
            f"{priv_changes} Rollenänderungen in letzter Stunde — mögliche Privilegieneskalation",
            {"count": priv_changes, "events": [dict(d) for d in details]},
            0.75)
        threats_created.append(tid)

    # ── 4. Session hijacking / geo-jump ──────────────────────────────────────
    # Detect sessions where the IP subnet changes drastically
    suspicious_sessions = conn.execute(
        "SELECT s.token, s.user_id, s.ip_addr, s.last_active, u.username "
        "FROM sessions s JOIN users u ON s.user_id=u.id "
        "WHERE s.expires_at > datetime('now') AND s.ip_addr IS NOT NULL"
    ).fetchall()
    for s in suspicious_sessions:
        first_ip = _AI_STATE["session_geos"].get(s["token"])
        cur_ip = s["ip_addr"]
        if first_ip and first_ip != cur_ip:
            # Check if first two octets differ (rough geo-jump heuristic)
            fp_parts = first_ip.split(".")
            cp_parts = cur_ip.split(".")
            if len(fp_parts) >= 2 and len(cp_parts) >= 2 and fp_parts[:2] != cp_parts[:2]:
                tid = _ai_create_threat(conn, "session_geo_jump",
                    f"Session von {s['username']} sprang von {first_ip} zu {cur_ip} — mögliche Session-Übernahme",
                    {"user": s["username"], "first_ip": first_ip, "current_ip": cur_ip},
                    0.70, source_user_id=s["user_id"], source_ip=cur_ip,
                    auto_action="invalidate_sessions")
                _ai_execute_action(conn, "invalidate_sessions", source_user_id=s["user_id"])
                threats_created.append(tid)
                _AI_STATE["session_geos"].pop(s["token"], None)
        elif not first_ip:
            _AI_STATE["session_geos"][s["token"]] = cur_ip

    # ── 5. API abuse / rate anomaly ───────────────────────────────────────────
    api_per_ip = conn.execute(
        "SELECT ip, COUNT(*) as c FROM audit_log WHERE ts > datetime('now','-5 minutes') "
        "GROUP BY ip ORDER BY c DESC LIMIT 5"
    ).fetchall()
    for row in api_per_ip:
        ip = row["ip"]; cnt = row["c"]
        if not ip: continue
        _ai_update_baseline(conn, "api_reqs_per_ip_5m", cnt)
        z = _ai_z_score(conn, "api_reqs_per_ip_5m", cnt)
        if cnt >= 100 and z > 3.0:
            conf = _ai_confidence(z)
            tid = _ai_create_threat(conn, "api_abuse",
                f"IP {ip} hat {cnt} API-Anfragen in 5 Minuten gestellt (z={z:.1f})",
                {"ip": ip, "count": cnt, "z_score": round(z,2)},
                conf, source_ip=ip, auto_action="block_ip" if conf > 0.85 else None)
            if conf > 0.85:
                _ai_execute_action(conn, "block_ip", source_ip=ip)
            threats_created.append(tid)

    # ── 6. Off-hours admin activity ───────────────────────────────────────────
    current_hour = now.hour
    if current_hour >= 1 and current_hour <= 5:  # 01:00–05:00 UTC
        admin_actions = conn.execute(
            "SELECT e.user_id, u.username, u.role, COUNT(*) as c FROM event_log e "
            "JOIN users u ON e.user_id=u.id WHERE u.role IN ('admin','owner') "
            "AND e.timestamp > datetime('now','-30 minutes') GROUP BY e.user_id HAVING c >= 10"
        ).fetchall()
        for row in admin_actions:
            _ai_update_baseline(conn, "admin_actions_offhours", row["c"])
            z = _ai_z_score(conn, "admin_actions_offhours", row["c"])
            conf = min(0.85, 0.5 + z * 0.08)
            tid = _ai_create_threat(conn, "off_hours_activity",
                f"Admin '{row['username']}' aktiv um {now.strftime('%H:%M')} UTC mit {row['c']} Aktionen in 30min",
                {"user": row["username"], "role": row["role"], "action_count": row["c"], "hour_utc": current_hour},
                conf, source_user_id=row["user_id"])
            threats_created.append(tid)

    # ── 7. Data exfiltration (large response patterns) ────────────────────────
    export_actions = conn.execute(
        "SELECT user_id, COUNT(*) as c FROM event_log WHERE action IN ('export','csv_export','report_generate','backup_download') "
        "AND timestamp > datetime('now','-1 hour') GROUP BY user_id HAVING c >= 3"
    ).fetchall()
    for row in export_actions:
        uid = row["user_id"]; cnt = row["c"]
        _ai_update_baseline(conn, "exports_per_user_1h", cnt)
        z = _ai_z_score(conn, "exports_per_user_1h", cnt)
        if z > 2.5:
            uname = conn.execute("SELECT username FROM users WHERE id=?", (uid,)).fetchone()
            conf = _ai_confidence(z)
            tid = _ai_create_threat(conn, "data_exfiltration",
                f"Nutzer {uname['username'] if uname else uid} hat {cnt} Exporte in 1h ausgeführt",
                {"user_id": uid, "export_count": cnt, "z_score": round(z,2)},
                conf, source_user_id=uid)
            threats_created.append(tid)

    # ── 8. Account enumeration ────────────────────────────────────────────────
    enum_ips = conn.execute(
        "SELECT ip_addr, COUNT(DISTINCT details) as uniq FROM event_log "
        "WHERE action='login_failed' AND timestamp > datetime('now','-10 minutes') "
        "GROUP BY ip_addr HAVING uniq >= 5"
    ).fetchall()
    for row in enum_ips:
        ip = row["ip_addr"]; uniq = row["uniq"]
        conf = min(0.9, 0.4 + uniq * 0.05)
        tid = _ai_create_threat(conn, "account_enumeration",
            f"IP {ip} versucht {uniq} verschiedene Nutzernamen in 10 Minuten",
            {"ip": ip, "distinct_usernames": uniq},
            conf, source_ip=ip, auto_action="block_ip" if conf > 0.7 else None)
        if conf > 0.7:
            _ai_execute_action(conn, "block_ip", source_ip=ip)
        threats_created.append(tid)

    # ── 9. Impossible travel (login from two distant IPs within minutes) ──────
    recent_logins = conn.execute(
        "SELECT user_id, ip_addr, timestamp FROM event_log WHERE action='login_ok' "
        "AND timestamp > datetime('now','-30 minutes') ORDER BY timestamp DESC"
    ).fetchall()
    seen_users: dict = {}
    for row in recent_logins:
        uid = row["user_id"]; ip = row["ip_addr"]
        if uid in seen_users and seen_users[uid] != ip:
            prev_ip = seen_users[uid]
            pp = prev_ip.split("."); cp = ip.split(".")
            if len(pp) >= 2 and len(cp) >= 2 and pp[:2] != cp[:2]:
                uname = conn.execute("SELECT username FROM users WHERE id=?", (uid,)).fetchone()
                tid = _ai_create_threat(conn, "impossible_travel",
                    f"Nutzer {uname['username'] if uname else uid} loggten sich von {prev_ip} und {ip} in 30 Min ein — Impossible Travel",
                    {"user_id": uid, "ip_a": prev_ip, "ip_b": ip},
                    0.80, source_user_id=uid, auto_action="invalidate_sessions")
                _ai_execute_action(conn, "invalidate_sessions", source_user_id=uid)
                threats_created.append(tid)
        seen_users[uid] = ip

    # ── 10. Custom rule evaluation ─────────────────────────────────────────────
    rules = conn.execute("SELECT * FROM ai_rules WHERE enabled=1").fetchall()
    for rule in rules:
        try:
            cond = json.loads(rule["condition_json"])
            rtype = rule["rule_type"]
            triggered = False; evidence = {}

            if rtype == "threshold":
                metric = cond.get("metric", "")
                threshold = cond.get("threshold", 0)
                window = cond.get("window_minutes", 60)
                cnt_row = conn.execute(
                    f"SELECT COUNT(*) as c FROM event_log WHERE action=? AND timestamp > datetime('now','-{window} minutes')",
                    (metric,)
                ).fetchone()
                val = cnt_row["c"] if cnt_row else 0
                if val >= threshold:
                    triggered = True
                    evidence = {"metric": metric, "value": val, "threshold": threshold}

            elif rtype == "pattern":
                pattern = cond.get("pattern", "")
                window = cond.get("window_minutes", 60)
                cnt_row = conn.execute(
                    "SELECT COUNT(*) as c FROM event_log WHERE action LIKE ? AND timestamp > datetime('now',?)",
                    (f"%{pattern}%", f"-{window} minutes")
                ).fetchone()
                val = cnt_row["c"] if cnt_row else 0
                if val > 0:
                    triggered = True
                    evidence = {"pattern": pattern, "matches": val}

            if triggered:
                tid = _ai_create_threat(conn, f"rule:{rule['id']}",
                    f"Regel '{rule['name']}' ausgelöst: {rule['description'] or ''}",
                    evidence, 0.7)
                conn.execute("UPDATE ai_rules SET trigger_count=trigger_count+1, last_triggered=datetime('now') WHERE id=?", (rule["id"],))
                conn.commit()
                threats_created.append(tid)
        except Exception:
            pass

    # ── Compute global threat score ────────────────────────────────────────────
    open_threats = conn.execute(
        "SELECT severity, COUNT(*) as c FROM ai_threats WHERE status='open' AND false_positive=0 GROUP BY severity"
    ).fetchall()
    score = 0.0
    weight = {"critical": 30, "high": 15, "medium": 7, "low": 2}
    for row in open_threats:
        score += weight.get(row["severity"], 2) * row["c"]
    score = min(100.0, score)
    _AI_STATE["current_score"] = score
    _AI_STATE["last_analysis"] = now.isoformat()

    # Update baselines for normal operational metrics
    try:
        active_users = conn.execute("SELECT COUNT(*) as c FROM sessions WHERE expires_at > datetime('now')").fetchone()["c"]
        alerts_1h = conn.execute("SELECT COUNT(*) as c FROM alerts WHERE created_at > datetime('now','-1 hour')").fetchone()["c"]
        _ai_update_baseline(conn, "active_sessions", active_users)
        _ai_update_baseline(conn, "alerts_per_hour", alerts_1h)
    except Exception:
        pass

    # Save snapshot
    try:
        open_count = conn.execute("SELECT COUNT(*) as c FROM ai_threats WHERE status='open' AND false_positive=0").fetchone()["c"]
        conn.execute(
            "INSERT INTO ai_snapshots (metrics, anomaly_score, threats_open) VALUES (?,?,?)",
            (json.dumps({"score": score}), score, open_count)
        )
        # Keep only last 500 snapshots
        conn.execute("DELETE FROM ai_snapshots WHERE id NOT IN (SELECT id FROM ai_snapshots ORDER BY ts DESC LIMIT 500)")
        conn.commit()
    except Exception:
        pass

    return {"threats_created": len(threats_created), "score": score, "threat_ids": threats_created}


# Background AI analysis loop
async def _ai_background_loop():
    """Run AI analysis every 60 seconds."""
    await asyncio.sleep(30)  # initial delay
    while True:
        try:
            conn = get_db()
            try:
                _ai_analyze(conn)
            finally:
                conn.close()
        except Exception:
            pass
        await asyncio.sleep(60)


# Register the background task
# (AI background loop started via the lifespan handler defined at app creation)


# ─── Security AI API Endpoints ────────────────────────────────────────────────

@app.get("/api/security-ai/status")
async def ai_status(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        open_by_sev = {r["severity"]: r["c"] for r in conn.execute(
            "SELECT severity, COUNT(*) as c FROM ai_threats WHERE status='open' AND false_positive=0 GROUP BY severity"
        ).fetchall()}
        recent_threats = conn.execute(
            "SELECT t.*, u.username as user_name FROM ai_threats t LEFT JOIN users u ON t.source_user_id=u.id "
            "WHERE t.status='open' AND t.false_positive=0 ORDER BY t.detected_at DESC LIMIT 20"
        ).fetchall()
        fp_rate = conn.execute(
            "SELECT ROUND(SUM(false_positive)*100.0/COUNT(*),1) as r FROM ai_threats WHERE detected_at > datetime('now','-7 days')"
        ).fetchone()
        baselines = conn.execute("SELECT metric, value_mean, value_std, sample_count, last_updated FROM ai_baselines ORDER BY metric").fetchall()
        snapshots = conn.execute("SELECT ts, anomaly_score, threats_open FROM ai_snapshots ORDER BY ts DESC LIMIT 120").fetchall()
        rules = conn.execute("SELECT * FROM ai_rules ORDER BY trigger_count DESC").fetchall()
        return {
            "global_score": _AI_STATE["current_score"],
            "last_analysis": _AI_STATE["last_analysis"],
            "open_by_severity": open_by_sev,
            "recent_threats": [dict(r) for r in recent_threats],
            "false_positive_rate_7d": fp_rate["r"] if fp_rate else 0,
            "baselines": [dict(r) for r in baselines],
            "snapshots": [dict(r) for r in reversed(list(snapshots))],
            "rules": [dict(r) for r in rules],
        }
    finally:
        conn.close()

@app.post("/api/security-ai/analyze")
async def trigger_ai_analysis(user: dict = Depends(require_admin)):
    """Manually trigger an AI analysis run."""
    conn = get_db()
    try:
        result = _ai_analyze(conn)
        log_action(user["id"], "ai_analysis_manual", result)
        return {"ok": True, **result}
    finally:
        conn.close()

@app.get("/api/security-ai/threats")
async def list_ai_threats(status: str = None, severity: str = None, limit: int = 50, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        q = ("SELECT t.*, u.username as user_name FROM ai_threats t "
             "LEFT JOIN users u ON t.source_user_id=u.id WHERE 1=1")
        params = []
        if status:
            q += " AND t.status=?"; params.append(status)
        else:
            q += " AND t.false_positive=0"
        if severity:
            q += " AND t.severity=?"; params.append(severity)
        q += " ORDER BY t.detected_at DESC LIMIT ?"; params.append(limit)
        rows = conn.execute(q, params).fetchall()
        return {"threats": [dict(r) for r in rows], "total": len(rows)}
    finally:
        conn.close()

@app.put("/api/security-ai/threats/{tid}/resolve")
async def resolve_threat(tid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute(
            "UPDATE ai_threats SET status='resolved', reviewed_by=?, reviewed_at=datetime('now') WHERE id=?",
            (user["id"], tid)
        )
        conn.commit()
        log_action(user["id"], "ai_threat_resolved", {"id": tid})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/security-ai/threats/{tid}/feedback")
async def submit_feedback(tid: int, request: Request, user: dict = Depends(require_admin)):
    """Submit false-positive or confirm feedback to improve the AI."""
    data = await request.json()
    conn = get_db()
    try:
        feedback = data.get("feedback", "false_positive")  # or "confirmed"
        notes = data.get("notes", "")
        conn.execute(
            "INSERT INTO ai_feedback (threat_id, user_id, feedback, notes) VALUES (?,?,?,?)",
            (tid, user["id"], feedback, notes)
        )
        if feedback == "false_positive":
            conn.execute(
                "UPDATE ai_threats SET false_positive=1, status='dismissed', reviewed_by=?, reviewed_at=datetime('now') WHERE id=?",
                (user["id"], tid)
            )
            # If this threat type has many false positives, auto-adjust baseline
            threat = conn.execute("SELECT threat_type, source_ip FROM ai_threats WHERE id=?", (tid,)).fetchone()
            if threat:
                fp_count = conn.execute(
                    "SELECT COUNT(*) as c FROM ai_threats WHERE threat_type=? AND false_positive=1",
                    (threat["threat_type"],)
                ).fetchone()["c"]
                if fp_count >= 3:
                    # Widen the baseline std (make detector less sensitive for this metric)
                    conn.execute(
                        "UPDATE ai_baselines SET value_std=value_std*1.5, last_updated=datetime('now') "
                        "WHERE metric LIKE ?", (f"%{threat['threat_type'].split(':')[0]}%",)
                    )
        elif feedback == "confirmed":
            conn.execute(
                "UPDATE ai_threats SET status='confirmed', reviewed_by=?, reviewed_at=datetime('now') WHERE id=?",
                (user["id"], tid)
            )
        conn.commit()
        log_action(user["id"], "ai_feedback", {"id": tid, "feedback": feedback})
        return {"ok": True, "feedback": feedback}
    finally:
        conn.close()

@app.delete("/api/security-ai/threats/{tid}")
async def delete_threat(tid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM ai_threats WHERE id=?", (tid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/security-ai/rules")
async def list_ai_rules(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM ai_rules ORDER BY created_at DESC").fetchall()
        return {"rules": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/security-ai/rules")
async def create_ai_rule(request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        row = conn.execute(
            "INSERT INTO ai_rules (name,description,rule_type,condition_json,action,severity,enabled,created_by) VALUES (?,?,?,?,?,?,?,?)",
            (data.get("name","Regel"), data.get("description",""),
             data.get("rule_type","threshold"), json.dumps(data.get("condition",{})),
             data.get("action","alert"), data.get("severity","medium"),
             int(data.get("enabled",1)), user["id"])
        )
        conn.commit()
        log_action(user["id"], "ai_rule_create", {"name": data.get("name")})
        return {"id": row.lastrowid, "ok": True}
    finally:
        conn.close()

@app.put("/api/security-ai/rules/{rid}")
async def update_ai_rule(rid: int, request: Request, user: dict = Depends(require_admin)):
    data = await request.json()
    conn = get_db()
    try:
        conn.execute(
            "UPDATE ai_rules SET name=?,description=?,condition_json=?,action=?,severity=?,enabled=? WHERE id=?",
            (data.get("name"), data.get("description"), json.dumps(data.get("condition",{})),
             data.get("action","alert"), data.get("severity","medium"), int(data.get("enabled",1)), rid)
        )
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.delete("/api/security-ai/rules/{rid}")
async def delete_ai_rule(rid: int, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute("DELETE FROM ai_rules WHERE id=?", (rid,))
        conn.commit()
        return {"ok": True}
    finally:
        conn.close()

@app.get("/api/security-ai/baselines")
async def get_baselines(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM ai_baselines ORDER BY metric").fetchall()
        return {"baselines": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/security-ai/baselines/reset")
async def reset_baselines(user: dict = Depends(require_admin)):
    """Reset all learned baselines (re-learns from scratch)."""
    conn = get_db()
    try:
        conn.execute("DELETE FROM ai_baselines")
        conn.commit()
        log_action(user["id"], "ai_baselines_reset", {})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/security-ai/baselines/train")
async def train_baselines(user: dict = Depends(require_admin)):
    """Train baselines from historical data (last 30 days)."""
    conn = get_db()
    try:
        trained = 0
        # Train failed_logins_per_ip_1h from historical data
        rows = conn.execute(
            "SELECT ip_addr, strftime('%Y-%m-%dT%H',timestamp) as h, COUNT(*) as c "
            "FROM event_log WHERE action='login_failed' AND timestamp > datetime('now','-30 days') "
            "GROUP BY ip_addr, h"
        ).fetchall()
        for r in rows:
            _ai_update_baseline(conn, "failed_logins_per_ip_1h", r["c"])
        trained += len(rows)

        # Train API request rate
        rows2 = conn.execute(
            "SELECT ip, strftime('%Y-%m-%dT%H:%M',ts) as m, COUNT(*) as c "
            "FROM audit_log WHERE ts > datetime('now','-7 days') GROUP BY ip, m"
        ).fetchall()
        for r in rows2:
            _ai_update_baseline(conn, "api_reqs_per_ip_5m", r["c"] * 5)  # scale to 5-min window
        trained += len(rows2)

        # Train active sessions
        rows3 = conn.execute(
            "SELECT strftime('%Y-%m-%dT%H',last_active) as h, COUNT(*) as c "
            "FROM sessions GROUP BY h ORDER BY h DESC LIMIT 200"
        ).fetchall()
        for r in rows3:
            _ai_update_baseline(conn, "active_sessions", r["c"])
        trained += len(rows3)

        conn.commit()
        log_action(user["id"], "ai_baselines_train", {"samples": trained})
        return {"ok": True, "samples_processed": trained}
    finally:
        conn.close()

@app.get("/api/security-ai/report")
async def ai_security_report(user: dict = Depends(require_admin)):
    """Generate a comprehensive security AI report."""
    conn = get_db()
    try:
        # Threat breakdown
        by_type = conn.execute(
            "SELECT threat_type, COUNT(*) as total, SUM(false_positive) as fp, "
            "AVG(confidence) as avg_conf FROM ai_threats WHERE detected_at > datetime('now','-30 days') GROUP BY threat_type"
        ).fetchall()
        # Timeline
        timeline = conn.execute(
            "SELECT date(detected_at) as day, severity, COUNT(*) as c "
            "FROM ai_threats WHERE detected_at > datetime('now','-30 days') "
            "GROUP BY day, severity ORDER BY day"
        ).fetchall()
        # Most targeted IPs
        top_ips = conn.execute(
            "SELECT source_ip, COUNT(*) as c, GROUP_CONCAT(DISTINCT threat_type) as types "
            "FROM ai_threats WHERE source_ip IS NOT NULL AND detected_at > datetime('now','-30 days') "
            "GROUP BY source_ip ORDER BY c DESC LIMIT 10"
        ).fetchall()
        # Most targeted users
        top_users = conn.execute(
            "SELECT t.source_user_id, u.username, COUNT(*) as c FROM ai_threats t "
            "LEFT JOIN users u ON t.source_user_id=u.id "
            "WHERE t.source_user_id IS NOT NULL AND t.detected_at > datetime('now','-30 days') "
            "GROUP BY t.source_user_id ORDER BY c DESC LIMIT 10"
        ).fetchall()
        # Auto-actions taken
        auto_actions = conn.execute(
            "SELECT auto_action, COUNT(*) as c FROM ai_threats "
            "WHERE auto_action IS NOT NULL AND detected_at > datetime('now','-30 days') GROUP BY auto_action"
        ).fetchall()
        # Score history
        score_hist = conn.execute(
            "SELECT ts, anomaly_score FROM ai_snapshots ORDER BY ts DESC LIMIT 200"
        ).fetchall()
        return {
            "by_type": [dict(r) for r in by_type],
            "timeline": [dict(r) for r in timeline],
            "top_ips": [dict(r) for r in top_ips],
            "top_users": [dict(r) for r in top_users],
            "auto_actions": [dict(r) for r in auto_actions],
            "score_history": [dict(r) for r in reversed(list(score_hist))],
            "generated_at": datetime.utcnow().isoformat(),
        }
    finally:
        conn.close()


# ─── License Endpoints ────────────────────────────────────────────────────────

@app.get("/api/license/check")
async def license_check():
    """Public: Returns license validity + grace period remaining (no auth needed)."""
    valid = is_license_valid()
    grace = is_grace_period_active()
    cfg = load_config()
    first_run = cfg.get("first_run_at")
    grace_remaining_s = 0
    if first_run and not valid:
        try:
            first_dt = datetime.fromisoformat(first_run)
            elapsed = (datetime.now() - first_dt).total_seconds()
            grace_remaining_s = max(0, int(7200 - elapsed))
        except Exception:
            pass
    return {
        "valid": valid,
        "grace_active": grace,
        "grace_remaining_seconds": grace_remaining_s,
    }

@app.get("/api/license")
async def get_license(user: dict = Depends(require_admin)):
    """Return current license tier and features (never returns the key itself)."""
    lic = get_current_license()
    cfg = load_config()
    # Mask the key: show prefix (first segment) and last segment, hide middle
    # e.g. CCHQ-PRO-2026-FG-X7K9M → CCHQ-***-****-**-X7K9M
    raw_key = cfg.get("license_key", "")
    if raw_key:
        parts = raw_key.split("-")
        if len(parts) >= 2:
            masked_parts = [parts[0]] + ["*" * len(p) for p in parts[1:-1]] + [parts[-1]]
            masked = "-".join(masked_parts)
        else:
            # Fallback: show first 4 + stars + last 5
            masked = raw_key[:4] + "-***-****-**-" + raw_key[-5:] if len(raw_key) > 9 else raw_key
    else:
        masked = ""
    grace = is_grace_period_active()
    first_run = cfg.get("first_run_at")
    grace_remaining_s = 0
    if first_run and not lic["valid"]:
        try:
            first_dt = datetime.fromisoformat(first_run)
            elapsed = (datetime.now() - first_dt).total_seconds()
            grace_remaining_s = max(0, int(7200 - elapsed))
        except Exception:
            pass
    return {
        "valid": lic["valid"],
        "active": lic["valid"],
        "tier": lic["tier"],
        "features": lic["features"],
        "masked_key": masked,
        "grace_active": grace,
        "grace_remaining_seconds": grace_remaining_s,
    }

@app.post("/api/license/activate")
async def activate_license(request: Request, user: dict = Depends(require_admin)):
    """Validate and store a license key."""
    data = await request.json()
    key = data.get("key", "").strip()
    result = validate_license_key(key)
    if not result["valid"]:
        raise HTTPException(400, "Ungültiger Lizenzkey")

    # Determine previous tier before overwriting config
    old_lic = get_current_license()
    old_tier = old_lic.get("tier")
    new_tier = result["tier"]

    # Store in config
    cfg = load_config()
    cfg["license_key"] = key
    with open(CONFIG_PATH, "w") as f:
        json.dump(cfg, f, indent=2)

    log_action(user["id"], "license_activated", {"tier": new_tier, "from_tier": old_tier})
    return {"ok": True, "tier": new_tier, "features": result["features"]}

@app.delete("/api/license")
async def deactivate_license(user: dict = Depends(require_admin)):
    """Remove the license key (reverts to basic mode)."""
    old_lic = get_current_license()
    cfg = load_config()
    cfg.pop("license_key", None)
    with open(CONFIG_PATH, "w") as f:
        json.dump(cfg, f, indent=2)
    log_action(user["id"], "license_deactivated", {"from_tier": old_lic.get("tier")})
    return {"ok": True}

# ─── License Administration (Owner-only) ─────────────────────────────────────

def require_owner(user: dict = Depends(get_current_user)):
    """Dependency: only the owner role may manage licenses."""
    if user.get("role") != "owner":
        raise HTTPException(403, "Nur der Eigentümer kann Lizenzen verwalten")
    return user

@app.get("/api/licenses")
async def list_licenses(user: dict = Depends(require_admin)):
    """List all licenses with activation counts. Keys are masked."""
    conn = get_db()
    try:
        rows = conn.execute("""
            SELECT l.id, l.key_display, l.tier, l.customer_name, l.customer_email,
                   l.notes, l.status, l.expires_at, l.max_activations,
                   l.created_at,
                   (SELECT COUNT(*) FROM license_activations a WHERE a.license_id = l.id) AS activations
            FROM licenses l ORDER BY l.created_at DESC
        """).fetchall()
        out = []
        for r in rows:
            d = dict(r)
            d["days_remaining"] = None
            if d["expires_at"]:
                try:
                    delta = datetime.fromisoformat(d["expires_at"]) - datetime.now()
                    d["days_remaining"] = max(0, delta.days)
                except ValueError:
                    pass
            out.append(d)
        return {"licenses": out, "tiers": {k: {"max_users": v["max_users"]} for k, v in _LIC_TIERS.items()}}
    finally:
        conn.close()

@app.post("/api/licenses")
async def create_license(request: Request, user: dict = Depends(require_owner)):
    """Generate a new license key. The plaintext key is returned ONCE."""
    body = await request.json()
    tier = (body.get("tier") or "STANDARD").upper()
    if tier not in _LIC_TIERS:
        raise HTTPException(400, f"Unbekannter Tier: {tier}")
    expires_at = (body.get("expires_at") or "").strip() or None
    if expires_at:
        try:
            datetime.fromisoformat(expires_at)
        except ValueError:
            raise HTTPException(400, "Ablaufdatum im Format YYYY-MM-DD angeben")
    max_activations = int(body.get("max_activations", 3))
    if max_activations < 1 or max_activations > 100:
        raise HTTPException(400, "Aktivierungen müssen zwischen 1 und 100 liegen")

    key = generate_license_key(tier)
    key_hash = _hash_license_key(key)
    conn = get_db()
    try:
        conn.execute("""
            INSERT INTO licenses (key_hash, key_display, tier, customer_name, customer_email,
                                  notes, expires_at, max_activations, created_by)
            VALUES (?,?,?,?,?,?,?,?,?)
        """, (key_hash, _mask_key(key), tier, body.get("customer_name", "").strip()[:200],
              body.get("customer_email", "").strip()[:200], body.get("notes", "").strip()[:1000],
              expires_at, max_activations, user["id"]))
        conn.commit()
        new_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    finally:
        conn.close()
    log_action(user["id"], "license_created", {"id": new_id, "tier": tier})
    return {"ok": True, "id": new_id, "key": key, "masked": _mask_key(key)}

@app.put("/api/licenses/{lid}")
async def update_license(lid: int, request: Request, user: dict = Depends(require_owner)):
    """Update customer data, expiry, activation limit, or revoke/reactivate."""
    body = await request.json()
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM licenses WHERE id=?", (lid,)).fetchone()
        if not row:
            raise HTTPException(404, "Lizenz nicht gefunden")
        fields, vals = [], []
        for col in ("customer_name", "customer_email", "notes"):
            if col in body:
                fields.append(f"{col}=?"); vals.append(str(body[col]).strip()[:1000])
        if "expires_at" in body:
            exp = (body["expires_at"] or "").strip() or None
            if exp:
                try: datetime.fromisoformat(exp)
                except ValueError: raise HTTPException(400, "Ablaufdatum im Format YYYY-MM-DD")
            fields.append("expires_at=?"); vals.append(exp)
        if "max_activations" in body:
            ma = int(body["max_activations"])
            if ma < 1 or ma > 100: raise HTTPException(400, "Aktivierungen 1-100")
            fields.append("max_activations=?"); vals.append(ma)
        if "status" in body:
            if body["status"] not in ("active", "revoked"):
                raise HTTPException(400, "Status muss 'active' oder 'revoked' sein")
            fields.append("status=?"); vals.append(body["status"])
        if fields:
            vals.append(lid)
            conn.execute(f"UPDATE licenses SET {', '.join(fields)}, updated_at=datetime('now') WHERE id=?", vals)
            conn.commit()
    finally:
        conn.close()
    log_action(user["id"], "license_updated", {"id": lid})
    return {"ok": True}

@app.delete("/api/licenses/{lid}")
async def delete_license(lid: int, user: dict = Depends(require_owner)):
    """Delete a license and all its activations."""
    conn = get_db()
    try:
        row = conn.execute("SELECT tier FROM licenses WHERE id=?", (lid,)).fetchone()
        if not row:
            raise HTTPException(404, "Lizenz nicht gefunden")
        conn.execute("DELETE FROM license_activations WHERE license_id=?", (lid,))
        conn.execute("DELETE FROM licenses WHERE id=?", (lid,))
        conn.commit()
    finally:
        conn.close()
    log_action(user["id"], "license_deleted", {"id": lid, "tier": row["tier"]})
    return {"ok": True}

@app.get("/api/licenses/{lid}/activations")
async def list_license_activations(lid: int, user: dict = Depends(require_admin)):
    """List device activations for a license."""
    conn = get_db()
    try:
        row = conn.execute("SELECT id, key_display, max_activations FROM licenses WHERE id=?", (lid,)).fetchone()
        if not row:
            raise HTTPException(404, "Lizenz nicht gefunden")
        acts = conn.execute("""
            SELECT id, device_id, device_name, app_version, ip, first_seen, last_seen
            FROM license_activations WHERE license_id=? ORDER BY last_seen DESC
        """, (lid,)).fetchall()
        return {"license_id": lid, "key_display": row["key_display"],
                "max_activations": row["max_activations"],
                "activations": [dict(a) for a in acts]}
    finally:
        conn.close()

@app.delete("/api/licenses/{lid}/activations/{aid}")
async def release_license_activation(lid: int, aid: int, user: dict = Depends(require_owner)):
    """Release one device activation (frees a slot for a new device)."""
    conn = get_db()
    try:
        conn.execute("DELETE FROM license_activations WHERE id=? AND license_id=?", (aid, lid))
        conn.commit()
    finally:
        conn.close()
    log_action(user["id"], "license_activation_released", {"license_id": lid, "activation_id": aid})
    return {"ok": True}

# ─── Public License Validation (for client programs) ─────────────────────────
# Rate-limited like the login endpoint: 30 validations per IP per minute.

_lic_validate_attempts: dict[str, list[float]] = {}
_LIC_VALIDATE_MAX = 30
_LIC_VALIDATE_WINDOW = 60

def _check_license_validate_rate_limit(ip: str) -> None:
    now = time.time()
    attempts = [t for t in _lic_validate_attempts.get(ip, []) if now - t < _LIC_VALIDATE_WINDOW]
    _lic_validate_attempts[ip] = attempts
    if len(attempts) >= _LIC_VALIDATE_MAX:
        raise HTTPException(429, "Too many validation requests. Please wait before trying again.")
    attempts.append(now)

@app.post("/api/license/validate")
async def license_validate(request: Request):
    """PUBLIC: validate a license key from an external client program.
    Body: {key, device_id?, device_name?, app_version?}
    On success registers/updates the device activation (enforces max_activations).
    Returns features + tier so the client can unlock modules."""
    client_ip = request.client.host if request.client else "unknown"
    _check_license_validate_rate_limit(client_ip)
    body = await request.json()
    key = (body.get("key") or "").strip()
    device_id = (body.get("device_id") or "").strip()[:128]
    device_name = (body.get("device_name") or "").strip()[:200]
    app_version = (body.get("app_version") or "").strip()[:32]

    result = validate_license_key(key)
    if not result["valid"]:
        return {"valid": False, "reason": result.get("reason", "invalid")}

    # DB licenses track activations; offline fallback keys don't
    row = _get_license_row(key)
    activation_info = None
    if row is not None:
        conn = get_db()
        try:
            if device_id:
                existing = conn.execute(
                    "SELECT id FROM license_activations WHERE license_id=? AND device_id=?",
                    (row["id"], device_id)).fetchone()
                if existing:
                    conn.execute(
                        "UPDATE license_activations SET last_seen=datetime('now'), ip=?,"
                        " device_name=?, app_version=? WHERE id=?",
                        (client_ip, device_name or device_name, app_version, existing["id"]))
                else:
                    count = conn.execute(
                        "SELECT COUNT(*) AS c FROM license_activations WHERE license_id=?",
                        (row["id"],)).fetchone()["c"]
                    if count >= row["max_activations"]:
                        return {"valid": False, "reason": "activation_limit_reached",
                                "activations_used": count,
                                "max_activations": row["max_activations"]}
                    conn.execute(
                        "INSERT INTO license_activations (license_id, device_id, device_name,"
                        " app_version, ip) VALUES (?,?,?,?,?)",
                        (row["id"], device_id, device_name, app_version, client_ip))
                conn.commit()
            used = conn.execute(
                "SELECT COUNT(*) AS c FROM license_activations WHERE license_id=?",
                (row["id"],)).fetchone()["c"]
            activation_info = {"activations_used": used, "max_activations": row["max_activations"]}
        finally:
            conn.close()

    resp = {
        "valid": True,
        "tier": result["tier"],
        "features": result["features"],
        "expires_at": result.get("expires_at"),
    }
    if activation_info:
        resp.update(activation_info)
    return resp

@app.get("/api/licenses/stats")
async def license_stats(user: dict = Depends(require_admin)):
    """Summary counters for the admin dashboard."""
    conn = get_db()
    try:
        total = conn.execute("SELECT COUNT(*) AS c FROM licenses").fetchone()["c"]
        active = conn.execute("SELECT COUNT(*) AS c FROM licenses WHERE status='active'").fetchone()["c"]
        expired = conn.execute(
            "SELECT COUNT(*) AS c FROM licenses WHERE status='active' AND expires_at IS NOT NULL"
            " AND expires_at < ?", (datetime.now().isoformat(),)).fetchone()["c"]
        by_tier = {r["tier"]: r["c"] for r in conn.execute(
            "SELECT tier, COUNT(*) AS c FROM licenses GROUP BY tier").fetchall()}
        acts = conn.execute("SELECT COUNT(*) AS c FROM license_activations").fetchone()["c"]
        return {"total": total, "active": active, "expired": expired,
                "revoked": total - active, "by_tier": by_tier, "total_activations": acts}
    finally:
        conn.close()

@app.get("/api/inventory/{iid}/checkout")
async def get_item_checkouts(iid: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT c.*, u.full_name as person_name FROM inventory_checkouts c "
            "LEFT JOIN users u ON c.user_id=u.id WHERE c.item_id=? ORDER BY c.checked_out_at DESC LIMIT 50",
            (iid,)
        ).fetchall()
        return {"checkouts": [dict(r) for r in rows]}
    finally:
        conn.close()

@app.post("/api/inventory/{iid}/checkout")
async def checkout_item(iid: int, request: Request, user: dict = Depends(get_current_user)):
    """Check out an item to a user."""
    data = await request.json()
    conn = get_db()
    try:
        item = conn.execute("SELECT * FROM inventory_items WHERE id=?", (iid,)).fetchone()
        if not item:
            raise HTTPException(404, "Item not found")
        if item["quantity"] < data.get("quantity", 1):
            raise HTTPException(400, "Nicht genug auf Lager")
        qty = data.get("quantity", 1)
        conn.execute(
            "INSERT INTO inventory_checkouts (item_id, user_id, quantity, notes, issued_by) VALUES (?,?,?,?,?)",
            (iid, data.get("user_id", user["id"]), qty, data.get("notes"), user["id"])
        )
        conn.execute(
            "UPDATE inventory_items SET quantity=quantity-?, updated_at=datetime('now') WHERE id=?",
            (qty, iid)
        )
        conn.execute(
            "INSERT INTO inventory_transactions (item_id, type, quantity_change, user_id, notes) VALUES (?,?,?,?,?)",
            (iid, "checkout", -qty, user["id"], data.get("notes", ""))
        )
        conn.commit()
        log_action(user["id"], "inventory_checkout", {"item_id": iid, "qty": qty})
        return {"ok": True}
    finally:
        conn.close()

@app.post("/api/inventory/{iid}/return")
async def return_item(iid: int, request: Request, user: dict = Depends(get_current_user)):
    """Return a checked-out item."""
    data = await request.json()
    conn = get_db()
    try:
        checkout_id = data.get("checkout_id")
        qty = data.get("quantity", 1)
        if checkout_id:
            conn.execute(
                "UPDATE inventory_checkouts SET returned_at=datetime('now'), status='returned' WHERE id=? AND item_id=?",
                (checkout_id, iid)
            )
        conn.execute(
            "UPDATE inventory_items SET quantity=quantity+?, updated_at=datetime('now') WHERE id=?",
            (qty, iid)
        )
        conn.execute(
            "INSERT INTO inventory_transactions (item_id, type, quantity_change, user_id, notes) VALUES (?,?,?,?,?)",
            (iid, "return", qty, user["id"], data.get("notes",""))
        )
        conn.commit()
        log_action(user["id"], "inventory_return", {"item_id": iid, "qty": qty})
        return {"ok": True}
    finally:
        conn.close()


if __name__ == "__main__":
    port = int(CONFIG.get("port", 8000))
    # Always bind to 0.0.0.0 so all interfaces (eth0, wlan0, Tailscale) are reachable.
    # config.json "host" can override this, but never falls back to 127.0.0.1.
    host = CONFIG.get("host") or "0.0.0.0"
    uvicorn.run(app, host=host, port=port, log_level="info")
