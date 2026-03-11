# © Felix Greis | Atlas GmbH 2026 – All rights reserved.
# Atlas AdminSysOP – Unauthorized modification prohibited.
# This software is proprietary and confidential.

NEXUS_COPYRIGHT = "Felix Greis | Atlas GmbH 2026"
APP_NAME = "Atlas AdminSysOP"
APP_VERSION = "1.0.0"

import sys
import os
import json
import sqlite3
import hashlib
import secrets
import asyncio
import math
import time
import csv
import io
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from typing import Optional, List
from pathlib import Path

# Copyright integrity check
_EXPECTED = "Felix Greis | Atlas GmbH 2026"
if NEXUS_COPYRIGHT != _EXPECTED:
    print("=" * 60)
    print("ERROR: Copyright integrity check failed.")
    print("Atlas AdminSysOP has been tampered with.")
    print("This software is proprietary to Felix Greis | Atlas GmbH 2026.")
    print("Unauthorized modification is prohibited.")
    print("=" * 60)
    sys.exit(1)

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
        return bcrypt.checkpw(pw.encode(), hashed.encode())
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

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "atlas.db"
CONFIG_PATH = BASE_DIR / "config.json"

def load_config() -> dict:
    if CONFIG_PATH.exists():
        return json.loads(CONFIG_PATH.read_text())
    return {"org_name": "Atlas AdminSysOP", "facility_type": "operations", "admin_name": "Administrator"}

CONFIG = load_config()

# ─── Database ───────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

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
        FOREIGN KEY(user_id) REFERENCES users(id)
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
    """)
    conn.commit()

    # Migrate existing tables with new columns (safe ALTER TABLE)
    _migrate_db(conn)
    conn.commit()

    # Seed default data if empty
    row = c.execute("SELECT COUNT(*) as cnt FROM users").fetchone()
    if row["cnt"] == 0:
        _seed_data(c, conn)

    # Ensure pager_config row exists (for existing databases)
    c.execute("INSERT OR IGNORE INTO pager_config (id) VALUES (1)")
    # Ensure all modules exist
    for mod in ["pager","scheduler","calendar","travel","weather"]:
        c.execute("INSERT OR IGNORE INTO modules (name, enabled) VALUES (?,1)", (mod,))
    # Ensure weather_cache row exists
    c.execute("INSERT OR IGNORE INTO weather_cache (id, data) VALUES (1, '{}')")
    conn.commit()

    conn.close()

def _seed_data(c, conn):
    cfg = load_config()
    admin_user = cfg.get("admin_username", "admin")
    admin_pw = cfg.get("admin_password", "atlas2026")
    admin_name = cfg.get("admin_name", "Administrator")
    pw_hash = hash_password(admin_pw)
    c.execute("INSERT INTO users (username, password_hash, full_name, role) VALUES (?,?,?,'admin')",
              (admin_user, pw_hash, admin_name))

    # Default modules
    for mod in ["command_control","alert_system","intelligence","communication",
                "data_logging","hardware_sensors","ai_analytics","user_management",
                "fleet_management","navigation","pager","scheduler","calendar","travel","weather"]:
        c.execute("INSERT OR IGNORE INTO modules (name, enabled) VALUES (?,1)", (mod,))

    # Default chat rooms
    for room in [("general","General Discussion","public"),("ops","Operations","public"),("alerts","Alert Channel","public")]:
        c.execute("INSERT OR IGNORE INTO chat_rooms (name, description, type) VALUES (?,?,?)", room)

    # Default pager config
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

    def online_users(self) -> list[int]:
        return list(self.connections.keys())

manager = ConnectionManager()

# ─── Background Tasks ────────────────────────────────────────────────────────

async def pi_sensor_updater():
    """Read Raspberry Pi CPU temperature and voltage, update virtual sensors."""
    while True:
        await asyncio.sleep(30)
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
                if temp_val > 80:
                    existing = conn.execute("SELECT id FROM alerts WHERE source='pi_temp' AND acknowledged=0").fetchone()
                    if not existing:
                        conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES ('sensor','Pi CPU Temperature critical: {:.1f}°C'.format(temp_val),'critical','pi_temp')")
            if volt_val is not None:
                conn.execute("INSERT INTO sensor_readings (sensor_id,value,timestamp) VALUES (?,?,?)", (volt_id, volt_val, now))
                conn.execute("UPDATE sensors SET last_seen=?,status='online' WHERE id=?", (now, volt_id))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[PiSensor] Error: {e}")

async def kpi_snapshotter():
    while True:
        await asyncio.sleep(60)
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

async def alert_escalator():
    while True:
        await asyncio.sleep(30)
        try:
            conn = get_db()
            threshold = (datetime.utcnow() - timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
            old_critical = conn.execute(
                "SELECT * FROM alerts WHERE severity='critical' AND acknowledged=0 AND created_at < ?", (threshold,)
            ).fetchall()
            for alert in old_critical:
                await manager.broadcast({
                    "type": "alert_escalated",
                    "data": {"id": alert["id"], "message": alert["message"], "severity": "critical"}
                })
            conn.close()
        except Exception as e:
            print(f"Escalator error: {e}")

async def session_cleaner():
    while True:
        await asyncio.sleep(300)
        try:
            conn = get_db()
            conn.execute("DELETE FROM sessions WHERE expires_at < datetime('now')")
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Session cleaner error: {e}")

async def check_fleet_alerts():
    while True:
        await asyncio.sleep(3600)  # hourly
        try:
            conn = get_db()
            soon = (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d")
            urgent = (datetime.utcnow() + timedelta(days=14)).strftime("%Y-%m-%d")
            vehicles = conn.execute("SELECT * FROM fleet_vehicles").fetchall()
            for v in vehicles:
                if v["insurance_expiry"] and v["insurance_expiry"] <= soon:
                    days = (datetime.strptime(v["insurance_expiry"], "%Y-%m-%d") - datetime.utcnow()).days
                    sev = "critical" if days <= 7 else "warning"
                    msg = f"Insurance expires in {days} days: {v['name']}"
                    existing = conn.execute("SELECT id FROM alerts WHERE message=? AND acknowledged=0", (msg,)).fetchone()
                    if not existing:
                        conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES ('fleet',?,?,'fleet:insurance')", (msg, sev))
                if v["tuev_expiry"] and v["tuev_expiry"] <= urgent:
                    days = (datetime.strptime(v["tuev_expiry"], "%Y-%m-%d") - datetime.utcnow()).days
                    sev = "critical" if days <= 7 else "warning"
                    msg = f"TÜV expires in {days} days: {v['name']}"
                    existing = conn.execute("SELECT id FROM alerts WHERE message=? AND acknowledged=0", (msg,)).fetchone()
                    if not existing:
                        conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES ('fleet',?,?,'fleet:tuev')", (msg, sev))
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
        loop = asyncio.get_event_loop()
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
        loop = asyncio.get_event_loop()
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
        loop = asyncio.get_event_loop()
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
        loop = asyncio.get_event_loop()
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
        loop = asyncio.get_event_loop()
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
        await asyncio.sleep(30)
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

def create_token(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    conn = get_db()
    expires = (datetime.utcnow() + timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S")
    conn.execute("INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)", (token, user_id, expires))
    conn.commit()
    conn.close()
    return token

def get_current_user(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Unauthorized")
    token = auth[7:]
    conn = get_db()
    session = conn.execute(
        "SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id=u.id WHERE s.token=? AND s.expires_at > datetime('now')",
        (token,)
    ).fetchone()
    conn.close()
    if not session:
        raise HTTPException(401, "Invalid or expired token")
    return dict(session)

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(403, "Admin required")
    return user

def log_action(user_id: int, action: str, details: dict = None, ip: str = None):
    conn = get_db()
    conn.execute("INSERT INTO event_log (action,user_id,details,ip_addr) VALUES (?,?,?,?)",
                 (action, user_id, json.dumps(details or {}), ip))
    conn.commit()
    conn.close()

# ─── App Lifecycle ─────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    _tasks = [
        asyncio.create_task(kpi_snapshotter()),
        asyncio.create_task(alert_escalator()),
        asyncio.create_task(session_cleaner()),
        asyncio.create_task(check_fleet_alerts()),
        asyncio.create_task(pocsag_receiver()),
        asyncio.create_task(pi_sensor_updater()),
        asyncio.create_task(scheduled_items_runner()),
    ]
    print(f"\n{'='*55}")
    print(f"  {APP_NAME} v{APP_VERSION}")
    print(f"  © {NEXUS_COPYRIGHT}")
    print(f"  Running at: http://0.0.0.0:8080")
    print(f"  Organization: {CONFIG.get('org_name', 'Atlas AdminSysOP')}")
    print(f"{'='*55}\n")
    yield
    # Graceful shutdown – cancel all background tasks
    for t in _tasks:
        t.cancel()
    await asyncio.gather(*_tasks, return_exceptions=True)

app = FastAPI(title=APP_NAME, version=APP_VERSION, lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

static_path = BASE_DIR / "static"
static_path.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    index = static_path / "index.html"
    if index.exists():
        return HTMLResponse(index.read_text())
    return HTMLResponse("<h1>Atlas AdminSysOP</h1><p>Static files not found.</p>")

@app.get("/api/info")
async def api_info():
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "copyright": NEXUS_COPYRIGHT,
        "org": CONFIG.get("org_name", "Atlas AdminSysOP"),
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
    body = await request.json()
    username = body.get("username", "").strip()
    password = body.get("password", "")
    if not username or not password:
        raise HTTPException(400, "Username and password required")
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username=? AND is_active=1", (username,)).fetchone()
    conn.close()
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_token(user["id"])
    conn = get_db()
    conn.execute("UPDATE users SET last_seen=datetime('now') WHERE id=?", (user["id"],))
    conn.commit()
    conn.close()
    log_action(user["id"], "login", {"username": username}, request.client.host if request.client else None)
    return {"token": token, "user": {
        "id": user["id"], "username": user["username"], "full_name": user["full_name"],
        "role": user["role"], "language": user["language"], "theme": user["theme"], "alert_tone": user["alert_tone"]
    }}

@app.post("/api/auth/logout")
async def logout(request: Request, user: dict = Depends(get_current_user)):
    auth = request.headers.get("Authorization", "")[7:]
    conn = get_db()
    conn.execute("DELETE FROM sessions WHERE token=?", (auth,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.get("/api/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"id": user["id"], "username": user["username"], "full_name": user["full_name"],
            "role": user["role"], "language": user["language"], "theme": user["theme"], "alert_tone": user["alert_tone"]}

@app.put("/api/auth/me")
async def update_me(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    fields = {}
    if "language" in body: fields["language"] = body["language"]
    if "theme" in body: fields["theme"] = body["theme"]
    if "alert_tone" in body: fields["alert_tone"] = body["alert_tone"]
    if "full_name" in body: fields["full_name"] = body["full_name"]
    if not fields:
        return {"ok": True}
    set_clause = ", ".join(f"{k}=?" for k in fields)
    conn = get_db()
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
    c = conn.execute("INSERT INTO assets (name,type,lat,lng,status,description) VALUES (?,?,?,?,?,?)",
                     (body["name"], body.get("type","vehicle"), body.get("lat"), body.get("lng"),
                      body.get("status","active"), body.get("description","")))
    conn.commit()
    asset = dict(conn.execute("SELECT * FROM assets WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"asset_new","data":asset})
    log_action(user["id"], "asset_create", {"name": body["name"]})
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
    conn.execute("UPDATE assets SET lat=?,lng=?,updated_at=datetime('now') WHERE id=?", (body["lat"], body["lng"], aid))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"asset_move","data":{"id":aid,"lat":body["lat"],"lng":body["lng"]}})
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
    c = conn.execute("INSERT INTO incidents (title,description,severity,status,lat,lng,created_by) VALUES (?,?,?,?,?,?,?)",
                     (body["title"], body.get("description",""), body.get("severity","warning"),
                      body.get("status","open"), body.get("lat"), body.get("lng"), user["id"]))
    conn.commit()
    incident = dict(conn.execute("SELECT * FROM incidents WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"incident_new","data":incident})
    log_action(user["id"], "incident_create", {"title": body["title"]})
    return incident

@app.put("/api/incidents/{iid}")
async def update_incident(iid: int, request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    resolved_at = "datetime('now')" if body.get("status") == "resolved" else "NULL"
    conn = get_db()
    conn.execute(f"UPDATE incidents SET title=?,description=?,severity=?,status=?,updated_at=datetime('now'),resolved_at=CASE WHEN ?='resolved' THEN datetime('now') ELSE resolved_at END WHERE id=?",
                 (body.get("title"), body.get("description"), body.get("severity"), body.get("status"), body.get("status"), iid))
    conn.commit()
    incident = dict(conn.execute("SELECT * FROM incidents WHERE id=?", (iid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"incident_update","data":incident})
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
    c = conn.execute("INSERT INTO alerts (type,message,severity,source) VALUES (?,?,?,?)",
                     (body.get("type","system"), body["message"], body.get("severity","info"), body.get("source","")))
    conn.commit()
    alert = dict(conn.execute("SELECT * FROM alerts WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    await manager.broadcast({"type":"alert_new","data":alert})
    # Fire push notification + all channels for warning/critical alerts
    severity = alert.get("severity","info")
    if severity in ("warning", "critical"):
        title_prefix = "🚨 CRITICAL ALERT" if severity == "critical" else "⚠️ Warning Alert"
        asyncio.create_task(broadcast_push_notification(
            title=title_prefix,
            body=alert["message"],
            severity=severity,
            alert_id=alert["id"],
            url="/#/alerts",
        ))
    # Dispatch to all configured channels (ntfy, DAPNET, apprise, etc.)
    asyncio.create_task(_dispatch_all_channels(alert))
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
    c = conn.execute("INSERT INTO chat_rooms (name,description,type) VALUES (?,?,?)",
                     (body["name"], body.get("description",""), body.get("type","public")))
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
    c = conn.execute("INSERT INTO chat_messages (room_id,sender_id,content) VALUES (?,?,?)",
                     (rid, user["id"], body["content"]))
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
    c = conn.execute("INSERT INTO direct_messages (from_user,to_user,content) VALUES (?,?,?)",
                     (user["id"], other_id, body["content"]))
    conn.commit()
    msg = {"id":c.lastrowid,"from_user":user["id"],"to_user":other_id,"content":body["content"],"username":user["username"],"full_name":user["full_name"]}
    conn.close()
    await manager.send_to(other_id, {"type":"dm_message","data":msg})
    return msg

# Sensors
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
    c = conn.execute("INSERT INTO sensors (name,type,location,lat,lng,unit,min_val,max_val) VALUES (?,?,?,?,?,?,?,?)",
                     (body["name"], body.get("type","generic"), body.get("location",""), body.get("lat"), body.get("lng"), body.get("unit",""), body.get("min_val",0), body.get("max_val",100)))
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
    conn.execute("INSERT INTO sensor_readings (sensor_id,value) VALUES (?,?)", (sid, body["value"]))
    conn.execute("UPDATE sensors SET last_seen=datetime('now') WHERE id=?", (sid,))
    conn.commit()
    conn.close()
    await manager.broadcast({"type":"sensor_reading","data":{"sensor_id":sid,"value":body["value"],"unit":sensor["unit"]}})
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
        if std == 0:
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
        except (ValueError, TypeError):
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
    pw_hash = hash_password(body["password"])
    conn = get_db()
    try:
        c = conn.execute("INSERT INTO users (username,password_hash,full_name,role,language) VALUES (?,?,?,?,?)",
                         (body["username"], pw_hash, body["full_name"], body.get("role","operator"), body.get("language","en")))
        conn.commit()
        new_user = dict(conn.execute("SELECT id,username,full_name,role,language FROM users WHERE id=?", (c.lastrowid,)).fetchone())
        conn.close()
        log_action(user["id"], "user_create", {"username": body["username"]})
        return new_user
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(400, "Username already exists")

@app.put("/api/users/{uid}")
async def update_user(uid: int, request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    conn = get_db()
    extra_fields = ""
    extra_vals = []
    if "email" in body:
        extra_fields += ", email=?"
        extra_vals.append(body["email"] or "")
    if "phone" in body:
        extra_fields += ", phone=?"
        extra_vals.append(body["phone"] or "")
    if "password" in body and body["password"]:
        conn.execute(
            f"UPDATE users SET full_name=?,role=?,is_active=?,password_hash=?{extra_fields} WHERE id=?",
            [body.get("full_name",""), body.get("role","viewer"), body.get("is_active",1),
             hash_password(body["password"])] + extra_vals + [uid]
        )
    else:
        conn.execute(
            f"UPDATE users SET full_name=?,role=?,is_active=?{extra_fields} WHERE id=?",
            [body.get("full_name",""), body.get("role","viewer"), body.get("is_active",1)] + extra_vals + [uid]
        )
    conn.commit()
    conn.close()
    log_action(user["id"], "user_update", {"uid": uid})
    return {"ok": True}

# Audit Log
@app.get("/api/audit")
async def get_audit(user: dict = Depends(get_current_user), limit: int = 100):
    conn = get_db()
    rows = conn.execute("""
        SELECT e.*, u.username FROM event_log e
        LEFT JOIN users u ON e.user_id=u.id
        ORDER BY e.timestamp DESC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

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

# Config
@app.get("/api/config")
async def get_config(user: dict = Depends(get_current_user)):
    return load_config()

@app.put("/api/config")
async def update_config(request: Request, user: dict = Depends(require_admin)):
    body = await request.json()
    cfg = load_config()
    cfg.update(body)
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2))
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
    c = conn.execute("""INSERT INTO fleet_vehicles 
        (name,type,subtype,license_plate,vin,make,model,year,color,seats,payload_kg,fuel_type,status,lat,lng,odometer_km,insurance_expiry,tuev_expiry,notes)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (body["name"],body.get("type","car"),body.get("subtype"),body.get("license_plate"),body.get("vin"),
         body.get("make"),body.get("model"),body.get("year"),body.get("color"),body.get("seats"),
         body.get("payload_kg",0),body.get("fuel_type","diesel"),body.get("status","available"),
         body.get("lat"),body.get("lng"),body.get("odometer_km",0),body.get("insurance_expiry"),
         body.get("tuev_expiry"),body.get("notes")))
    conn.commit()
    vehicle = dict(conn.execute("SELECT * FROM fleet_vehicles WHERE id=?", (c.lastrowid,)).fetchone())
    conn.close()
    log_action(user["id"], "fleet_vehicle_create", {"name": body["name"]})
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
    c = conn.execute("INSERT INTO fleet_drivers (full_name,license_class,license_expiry,phone,email,notes) VALUES (?,?,?,?,?,?)",
                     (body["full_name"],body.get("license_class","B"),body.get("license_expiry"),body.get("phone"),body.get("email"),body.get("notes")))
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
    c = conn.execute("INSERT INTO fleet_trips (vehicle_id,driver_id,title,origin,destination,waypoints,departure_time,estimated_arrival,distance_km,notes) VALUES (?,?,?,?,?,?,?,?,?,?)",
                     (body["vehicle_id"],body.get("driver_id"),body["title"],body.get("origin"),body.get("destination"),
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
        "waypoints":         json.dumps(body.get("waypoints", json.loads(ex.get("waypoints") or "[]"))),
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
    c = conn.execute("INSERT INTO fleet_maintenance (vehicle_id,type,description,scheduled_date,cost,technician,notes) VALUES (?,?,?,?,?,?,?)",
                     (body["vehicle_id"],body["type"],body.get("description"),body.get("scheduled_date"),body.get("cost"),body.get("technician"),body.get("notes")))
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
    total = body.get("total_cost") or (body.get("liters",0) * body.get("cost_per_liter",0))
    conn = get_db()
    c = conn.execute("INSERT INTO fleet_fuel_logs (vehicle_id,date,liters,cost_per_liter,total_cost,odometer_km,station,notes) VALUES (?,?,?,?,?,?,?,?)",
                     (body["vehicle_id"],body["date"],body["liters"],body.get("cost_per_liter"),total,body.get("odometer_km"),body.get("station"),body.get("notes")))
    if body.get("odometer_km"):
        conn.execute("UPDATE fleet_vehicles SET odometer_km=? WHERE id=?", (body["odometer_km"], body["vehicle_id"]))
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
    c = conn.execute("INSERT INTO fleet_inspections (vehicle_id,driver_id,type,date,items,passed,notes) VALUES (?,?,?,?,?,?,?)",
                     (body["vehicle_id"],body.get("driver_id"),body.get("type","pre_trip"),body["date"],json.dumps(body.get("items",{})),body.get("passed",1),body.get("notes")))
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
    c = conn.execute("INSERT INTO fleet_documents (vehicle_id,name,type,expiry_date,notes) VALUES (?,?,?,?,?)",
                     (body["vehicle_id"],body["name"],body.get("type","other"),body.get("expiry_date"),body.get("notes")))
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
                conn.execute("DELETE FROM push_subscriptions WHERE endpoint=?",
                             (subscription["endpoint"],))
                conn.commit()
                conn.close()
                print(f"[Push] Removed stale subscription: {subscription['endpoint'][:60]}…")
            except Exception:
                pass
        return False

async def broadcast_push_notification(title: str, body: str, severity: str = "info",
                                       alert_id: int = None, url: str = "/#/alerts"):
    """Send push to all subscribed users (called from alert creation etc.)"""
    conn = get_db()
    rows = conn.execute("SELECT * FROM push_subscriptions").fetchall()
    conn.close()
    payload = {
        "title": title,
        "body": body,
        "severity": severity,
        "id": alert_id,
        "url": url,
        "timestamp": datetime.now().isoformat(),
    }
    for row in rows:
        sub = {"endpoint": row["endpoint"], "p256dh": row["p256dh"], "auth": row["auth"]}
        await _send_web_push(sub, payload)

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
    conn.execute(f"UPDATE pager_config SET {sets} WHERE id=1", list(updates.values()))
    conn.commit()
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
        text="Atlas AdminSysOP – DAPNET Test",
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
        title="Atlas Test", body="Gotify test from Atlas AdminSysOP",
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
    conn.execute("""INSERT INTO scheduled_items
        (type, title, description, severity, source, recurrence, recurrence_data, next_run, enabled, created_by)
        VALUES (?,?,?,?,?,?,?,?,1,?)""", (
        body.get("type", "alert"),
        body["title"],
        body.get("description", ""),
        body.get("severity", "info"),
        body.get("source", "scheduled"),
        body.get("recurrence", "once"),
        json.dumps(body.get("recurrence_data", {})),
        body["next_run"],
        user["id"],
    ))
    conn.commit()
    row = dict(conn.execute("SELECT * FROM scheduled_items WHERE id=last_insert_rowid()").fetchone())
    conn.close()
    return row

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
        "recurrence_data": json.dumps(body.get("recurrence_data", json.loads(ex.get("recurrence_data") or "{}"))),
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
            fetched = datetime.fromisoformat(cached["fetched_at"])
            if (now_ts - fetched).total_seconds() < 900 and abs((cached.get("lat") or 0) - lat) < 0.1:
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
    def _restart():
        time.sleep(2)
        os.execv(sys.executable, [sys.executable] + sys.argv)
    threading.Thread(target=_restart, daemon=True).start()
    return {"ok": True, "message": "Server restarting in 2 seconds..."}

# ─── Permissions API ──────────────────────────────────────────────────────────

ROLE_PRESETS = {
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
    conn.execute("INSERT INTO user_groups (name, description, base_role, permissions) VALUES (?,?,?,?)",
                 (body["name"], body.get("description",""), body.get("base_role","viewer"), json.dumps(body.get("permissions",{}))))
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
         json.dumps(body.get("passengers", json.loads(req.get("passengers") or "[]"))),
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
        conn.execute("UPDATE fleet_vehicles SET fuel_current_l=MAX(0,fuel_current_l-?),updated_at=datetime('now') WHERE id=?",
                     (fuel_used, trip["vehicle_id"]))
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
            fields.append(f"{f}=?")
            vals.append(body[f])
    if not fields:
        conn.close()
        raise HTTPException(400, "No fuel fields provided")
    vals.append(vid)
    conn.execute(f"UPDATE fleet_vehicles SET {','.join(fields)},updated_at=datetime('now') WHERE id=?", vals)
    conn.commit()
    v = conn.execute("SELECT fuel_capacity_l,fuel_current_l,fuel_avg_l100km FROM fleet_vehicles WHERE id=?", (vid,)).fetchone()
    conn.close()
    return dict(v) if v else {"ok": True}

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

# WebSocket
@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
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
    await manager.broadcast({"type":"user_online","data":{"user_id":user_id,"username":username}})
    try:
        while True:
            data = await websocket.receive_json()
            # Handle ping
            if data.get("type") == "ping":
                await websocket.send_json({"type":"pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        await manager.broadcast({"type":"user_offline","data":{"user_id":user_id,"username":username}})

if __name__ == "__main__":
    port = int(CONFIG.get("port", 8080))
    host = CONFIG.get("host", "0.0.0.0")
    uvicorn.run(app, host=host, port=port, log_level="info")
