#!/usr/bin/env bash
# © Felix Greis | Atlas GmbH 2026 – All rights reserved.
# Atlas AdminSysOP – Setup, Installer & Launcher
# Usage: chmod +x setup.sh && ./setup.sh
#
# Flags:
#   --reset     Delete config.json + atlas.db and reconfigure
#   --service   Install as systemd service (Linux only)
#   --stop      Stop the systemd service

set -euo pipefail

# ── Constants ─────────────────────────────────────────────────────────────────
ATLAS_COPYRIGHT="Felix Greis | Atlas GmbH 2026"
APP_NAME="Atlas AdminSysOP"
VERSION="1.0.0"
DEFAULT_PORT=8080
CONFIG_FILE="config.json"
DB_FILE="atlas.db"
REQ_FILE="requirements.txt"
MAIN_PY="main.py"
VENV_DIR=".venv"
SERVICE_NAME="atlas-adminsysop"

# Resolve script directory so paths work even if called from elsewhere
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

banner() {
  printf "${CYAN}"
  echo "  ╔═══════════════════════════════════════════════════════╗"
  printf "  ║   ${BOLD}%-52s${CYAN}║\n" "Atlas AdminSysOP  v${VERSION}"
  echo "  ║   © Felix Greis | Atlas GmbH 2026                    ║"
  echo "  ║   Enterprise Operations Management Platform           ║"
  echo "  ╚═══════════════════════════════════════════════════════╝"
  printf "${RESET}\n"
}

ok()   { printf "  ${GREEN}✓${RESET}  %s\n" "$*"; }
info() { printf "  ${BLUE}→${RESET}  %s\n" "$*"; }
warn() { printf "  ${YELLOW}⚠${RESET}  %s\n" "$*"; }
err()  { printf "  ${RED}✗${RESET}  %s\n" "$*" >&2; }
step() { printf "\n${BOLD}${BLUE}[%s]${RESET} %s\n" "$1" "$2"; }
hr()   { printf "  %s\n" "─────────────────────────────────────────────"; }

# ── Handle --stop flag ────────────────────────────────────────────────────────
if [ "${1:-}" = "--stop" ]; then
  if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
    sudo systemctl stop "$SERVICE_NAME"
    ok "Service $SERVICE_NAME stopped."
  else
    warn "Service $SERVICE_NAME is not running."
  fi
  exit 0
fi

# ── Handle --reset flag ───────────────────────────────────────────────────────
if [ "${1:-}" = "--reset" ]; then
  printf "${RED}  This will delete config.json and atlas.db (ALL DATA LOST).${RESET}\n"
  printf "  Type 'yes' to confirm: "
  read -r CONFIRM
  if [ "$CONFIRM" = "yes" ]; then
    rm -f "$CONFIG_FILE" "$DB_FILE"
    ok "Reset complete. Run ./setup.sh to reconfigure."
  else
    echo "  Cancelled."
  fi
  exit 0
fi

# ── 1. DEPENDENCY CHECK ───────────────────────────────────────────────────────
clear
banner
step "1/5" "Checking dependencies"

# Detect Python 3
PYTHON=""
for cmd in python3 python; do
  if command -v "$cmd" &>/dev/null; then
    PY_VER=$("$cmd" -c "import sys; print(sys.version_info.major)" 2>/dev/null || echo 0)
    if [ "$PY_VER" = "3" ]; then
      PYTHON="$cmd"
      PY_FULL=$("$cmd" --version 2>&1 | head -1)
      ok "Python found: $PY_FULL ($(command -v "$cmd"))"
      break
    fi
  fi
done

if [ -z "$PYTHON" ]; then
  err "Python 3 is required but not found."
  echo ""
  echo "  Install from: https://www.python.org/downloads/"
  echo "  Or via package manager:"
  echo "    macOS:  brew install python3"
  echo "    Ubuntu: sudo apt install python3 python3-pip python3-venv"
  echo "    RHEL:   sudo dnf install python3"
  exit 1
fi

# Detect pip
if ! "$PYTHON" -m pip --version &>/dev/null 2>&1; then
  err "pip not found. Install it:"
  echo "    $PYTHON -m ensurepip --upgrade"
  exit 1
fi
ok "pip: available"

# Detect OS for systemd check
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macos"
fi
ok "OS: $OS"

HAVE_SYSTEMD=false
if [ "$OS" = "linux" ] && command -v systemctl &>/dev/null; then
  HAVE_SYSTEMD=true
  ok "systemd: available"
fi

HAVE_CURL=false
if command -v curl &>/dev/null; then
  HAVE_CURL=true
fi

# ── 2. PYTHON ENVIRONMENT + PACKAGES ─────────────────────────────────────────
step "2/5" "Setting up Python environment"

# Write requirements.txt
cat > "$REQ_FILE" << 'EOF'
fastapi==0.111.0
uvicorn[standard]==0.29.0
python-multipart==0.0.9
bcrypt==4.1.3
EOF
ok "requirements.txt written"

# Create venv
if [ ! -d "$VENV_DIR" ]; then
  info "Creating virtual environment..."
  "$PYTHON" -m venv "$VENV_DIR"
  ok "Virtual environment created at .venv/"
else
  ok "Virtual environment already exists"
fi

VENV_PIP="$SCRIPT_DIR/$VENV_DIR/bin/pip"

info "Installing packages (this may take a moment)..."
"$VENV_PIP" install -q --upgrade pip
"$VENV_PIP" install -q -r "$REQ_FILE"
ok "Packages installed: fastapi, uvicorn, python-multipart, bcrypt"

# Resolve the actual python binary in the venv (handles python3, python3.x symlinks)
VENV_PY=""
for candidate in "$SCRIPT_DIR/$VENV_DIR/bin/python3" "$SCRIPT_DIR/$VENV_DIR/bin/python"; do
  if [ -f "$candidate" ] || [ -L "$candidate" ]; then
    VENV_PY="$candidate"
    break
  fi
done
if [ -z "$VENV_PY" ]; then
  err "Could not find Python binary in virtual environment."
  exit 1
fi
ok "venv Python: $VENV_PY"

# ── 3. FIRST-RUN WIZARD ───────────────────────────────────────────────────────
step "3/5" "Configuration"

if [ -f "$CONFIG_FILE" ]; then
  ok "config.json already exists – skipping wizard"
  # Read existing port for display
  SERVER_PORT=$("$VENV_PY" -c "
import json
try:
  d = json.load(open('$CONFIG_FILE'))
  print(d.get('port', $DEFAULT_PORT))
except:
  print($DEFAULT_PORT)
" 2>/dev/null || echo "$DEFAULT_PORT")
else
  echo ""
  printf "  ${BOLD}First-Time Setup Wizard${RESET}\n"
  printf "  Answer the questions below (press Enter for defaults).\n\n"

  # Organization name
  printf "  Company / Organization name [Atlas GmbH]: "
  read -r ORG_NAME
  ORG_NAME="${ORG_NAME:-Atlas GmbH}"

  # Facility type
  printf "  Facility type [operations]: "
  read -r FACILITY_TYPE
  FACILITY_TYPE="${FACILITY_TYPE:-operations}"

  # Admin full name
  printf "  Admin full name [Administrator]: "
  read -r ADMIN_NAME
  ADMIN_NAME="${ADMIN_NAME:-Administrator}"

  # Admin username
  while true; do
    printf "  Admin login username [admin]: "
    read -r ADMIN_USER
    ADMIN_USER="${ADMIN_USER:-admin}"
    # Strip invalid chars
    ADMIN_USER=$(printf '%s' "$ADMIN_USER" | tr -cd 'a-zA-Z0-9_-')
    if [ -z "$ADMIN_USER" ]; then
      warn "Username cannot be empty. Try again."
    else
      break
    fi
  done

  # Admin password
  while true; do
    printf "  Admin password (min 8 chars) [atlas2026]: "
    read -rs ADMIN_PASS; echo ""
    ADMIN_PASS="${ADMIN_PASS:-atlas2026}"
    if [ ${#ADMIN_PASS} -lt 8 ]; then
      warn "Password must be at least 8 characters."
      continue
    fi
    printf "  Confirm password: "
    read -rs ADMIN_PASS2; echo ""
    ADMIN_PASS2="${ADMIN_PASS2:-atlas2026}"
    if [ "$ADMIN_PASS" = "$ADMIN_PASS2" ]; then
      break
    else
      warn "Passwords don't match. Try again."
    fi
  done

  # Port
  printf "  Server port [$DEFAULT_PORT]: "
  read -r IN_PORT
  SERVER_PORT="$DEFAULT_PORT"
  if [[ "$IN_PORT" =~ ^[0-9]+$ ]] && [ "$IN_PORT" -ge 1024 ] && [ "$IN_PORT" -le 65535 ]; then
    SERVER_PORT="$IN_PORT"
  fi

  # Tailscale (Linux only)
  TAILSCALE_ENABLED="false"
  TAILSCALE_AUTH_KEY=""
  if [ "$OS" = "linux" ] && [ "$HAVE_CURL" = true ]; then
    printf "\n  Enable Tailscale VPN? [y/N]: "
    read -r USE_TS
    if [[ "$USE_TS" =~ ^[Yy]$ ]]; then
      printf "  Tailscale auth key (tskey-auth-...): "
      read -rs TS_KEY; echo ""
      if [ -n "$TS_KEY" ]; then
        TAILSCALE_AUTH_KEY="$TS_KEY"
        info "Installing Tailscale..."
        if curl -fsSL https://tailscale.com/install.sh | sh 2>/dev/null; then
          if sudo tailscale up --authkey="$TS_KEY" --accept-routes 2>/dev/null; then
            TAILSCALE_ENABLED="true"
            ok "Tailscale connected"
          else
            warn "Tailscale auth failed – skipping"
          fi
        else
          warn "Tailscale install failed – skipping"
        fi
      fi
    fi
  fi

  # Hash password via bcrypt in venv
  PW_HASH=$("$VENV_PY" -c "
import bcrypt, sys
pw = sys.argv[1].encode()
print(bcrypt.hashpw(pw, bcrypt.gensalt(12)).decode())
" "$ADMIN_PASS" 2>/dev/null || echo "")

  # Write config.json
  cat > "$CONFIG_FILE" << CFGJSON
{
  "org_name": "$ORG_NAME",
  "facility_type": "$FACILITY_TYPE",
  "admin_name": "$ADMIN_NAME",
  "admin_username": "$ADMIN_USER",
  "admin_password": "$ADMIN_PASS",
  "admin_password_hash": "$PW_HASH",
  "port": $SERVER_PORT,
  "host": "0.0.0.0",
  "tailscale_enabled": $TAILSCALE_ENABLED,
  "copyright": "$ATLAS_COPYRIGHT",
  "app_name": "$APP_NAME",
  "version": "$VERSION"
}
CFGJSON

  ok "Configuration saved to config.json"
  echo ""
  hr
  printf "  ${BOLD}Summary:${RESET}\n"
  printf "  %-20s %s\n" "Organization:" "$ORG_NAME"
  printf "  %-20s %s\n" "Facility type:" "$FACILITY_TYPE"
  printf "  %-20s %s\n" "Admin user:" "$ADMIN_USER"
  printf "  %-20s http://localhost:%s\n" "Server URL:" "$SERVER_PORT"
  printf "  %-20s %s\n" "Tailscale:" "$TAILSCALE_ENABLED"
  hr
fi

# ── 4. VERIFY main.py EXISTS ──────────────────────────────────────────────────
step "4/5" "Checking application files"

if [ ! -f "$MAIN_PY" ]; then
  err "main.py not found in $SCRIPT_DIR"
  echo ""
  echo "  main.py must exist alongside setup.sh."
  echo "  If you deleted it, restore it from a backup or re-download the package."
  exit 1
fi
ok "main.py found ($(wc -l < "$MAIN_PY" | tr -d ' ') lines)"

if [ ! -d "static" ]; then
  err "static/ directory not found"
  exit 1
fi
ok "static/ directory found"

for f in static/index.html static/app.js static/styles.css; do
  if [ ! -f "$f" ]; then
    warn "$f not found – some features may be missing"
  else
    ok "$f OK"
  fi
done

# ── 5. SYSTEMD SERVICE (optional, Linux only) ─────────────────────────────────
step "5/5" "Service setup"

install_systemd_service() {
  local user; user="$(whoami)"
  local workdir="$SCRIPT_DIR"
  local venv_py="$workdir/$VENV_DIR/bin/python3"
  local main_py="$workdir/$MAIN_PY"

  local service_file="/etc/systemd/system/${SERVICE_NAME}.service"

  sudo tee "$service_file" > /dev/null << SVCEOF
[Unit]
Description=Atlas AdminSysOP – Enterprise Operations Platform
After=network.target
Wants=network.target

[Service]
Type=simple
User=$user
WorkingDirectory=$workdir
ExecStart=$venv_py $main_py
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${SERVICE_NAME}
Environment="PYTHONUNBUFFERED=1"

[Install]
WantedBy=multi-user.target
SVCEOF

  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME"
  sudo systemctl restart "$SERVICE_NAME"

  sleep 2
  if systemctl is-active --quiet "$SERVICE_NAME"; then
    ok "Systemd service '$SERVICE_NAME' installed and running"
    ok "Auto-starts on boot: enabled"
    echo ""
    info "Service commands:"
    info "  sudo systemctl status $SERVICE_NAME"
    info "  sudo systemctl restart $SERVICE_NAME"
    info "  sudo systemctl stop $SERVICE_NAME"
    info "  sudo journalctl -u $SERVICE_NAME -f"
    return 0
  else
    warn "Service installed but failed to start. Check logs:"
    warn "  sudo journalctl -u $SERVICE_NAME -n 30"
    return 1
  fi
}

LAUNCH_MODE="foreground"

if [ "$HAVE_SYSTEMD" = true ]; then
  echo ""
  printf "  ${BOLD}How do you want to run Atlas AdminSysOP?${RESET}\n\n"
  printf "  ${CYAN}1)${RESET} Foreground  – run in this terminal (Ctrl+C to stop)\n"
  printf "  ${CYAN}2)${RESET} Background  – run in background (nohup)\n"
  printf "  ${CYAN}3)${RESET} System service – install as systemd service (auto-start on boot)\n"
  echo ""
  printf "  Your choice [1]: "
  read -r LAUNCH_CHOICE
  LAUNCH_CHOICE="${LAUNCH_CHOICE:-1}"

  case "$LAUNCH_CHOICE" in
    2) LAUNCH_MODE="background" ;;
    3) LAUNCH_MODE="systemd" ;;
    *) LAUNCH_MODE="foreground" ;;
  esac
else
  if [ "$OS" = "macos" ]; then
    echo ""
    printf "  ${BOLD}How do you want to run Atlas AdminSysOP?${RESET}\n\n"
    printf "  ${CYAN}1)${RESET} Foreground  – run in this terminal (Ctrl+C to stop)\n"
    printf "  ${CYAN}2)${RESET} Background  – run in background (nohup)\n"
    printf "  ${CYAN}3)${RESET} LaunchAgent – install as macOS launch agent (auto-start on login)\n"
    echo ""
    printf "  Your choice [1]: "
    read -r LAUNCH_CHOICE
    LAUNCH_CHOICE="${LAUNCH_CHOICE:-1}"
    case "$LAUNCH_CHOICE" in
      2) LAUNCH_MODE="background" ;;
      3) LAUNCH_MODE="launchd" ;;
      *) LAUNCH_MODE="foreground" ;;
    esac
  fi
fi

# ── LAUNCH ────────────────────────────────────────────────────────────────────
echo ""
hr

PORT="$SERVER_PORT"
ORG=$("$VENV_PY" -c "
import json
try:
  d=json.load(open('$CONFIG_FILE'))
  print(d.get('org_name','Atlas AdminSysOP'))
except:
  print('Atlas AdminSysOP')
" 2>/dev/null || echo "Atlas AdminSysOP")

printf "\n  ${BOLD}${GREEN}Atlas AdminSysOP is ready!${RESET}\n\n"
printf "  ${CYAN}%-18s${RESET} http://localhost:%s\n" "URL:" "$PORT"
printf "  ${CYAN}%-18s${RESET} %s\n"                 "Organization:" "$ORG"
printf "  ${CYAN}%-18s${RESET} admin / atlas2026 (if not changed)\n" "Default login:"
echo ""

case "$LAUNCH_MODE" in

  "systemd")
    if install_systemd_service; then
      printf "\n  ${GREEN}Service is running. Open: http://localhost:$PORT${RESET}\n\n"
    fi
    ;;

  "launchd")
    # macOS LaunchAgent
    PLIST_DIR="$HOME/Library/LaunchAgents"
    PLIST_FILE="$PLIST_DIR/com.atlas.adminsysop.plist"
    mkdir -p "$PLIST_DIR"
    cat > "$PLIST_FILE" << PLISTEOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.atlas.adminsysop</string>
  <key>ProgramArguments</key>
  <array>
    <string>$SCRIPT_DIR/$VENV_DIR/bin/python3</string>
    <string>$SCRIPT_DIR/$MAIN_PY</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$SCRIPT_DIR</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$SCRIPT_DIR/atlas.log</string>
  <key>StandardErrorPath</key>
  <string>$SCRIPT_DIR/atlas.error.log</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PYTHONUNBUFFERED</key>
    <string>1</string>
  </dict>
</dict>
</plist>
PLISTEOF
    launchctl unload "$PLIST_FILE" 2>/dev/null || true
    launchctl load "$PLIST_FILE"
    ok "macOS LaunchAgent installed and started"
    ok "Auto-starts on login: enabled"
    echo ""
    info "LaunchAgent commands:"
    info "  launchctl stop com.atlas.adminsysop"
    info "  launchctl start com.atlas.adminsysop"
    info "  launchctl unload ~/Library/LaunchAgents/com.atlas.adminsysop.plist"
    info "  tail -f $SCRIPT_DIR/atlas.log"
    echo ""
    printf "  ${GREEN}Service running at: http://localhost:$PORT${RESET}\n\n"
    ;;

  "background")
    LOG_FILE="$SCRIPT_DIR/atlas.log"
    nohup "$SCRIPT_DIR/$VENV_DIR/bin/python3" "$SCRIPT_DIR/$MAIN_PY" > "$LOG_FILE" 2>&1 &
    BG_PID=$!
    echo $BG_PID > "$SCRIPT_DIR/atlas.pid"
    sleep 1
    if kill -0 "$BG_PID" 2>/dev/null; then
      ok "Running in background (PID: $BG_PID)"
      ok "Log: $LOG_FILE"
      ok "PID file: atlas.pid"
      echo ""
      info "To stop: kill \$(cat atlas.pid)"
      info "To view logs: tail -f atlas.log"
      printf "\n  ${GREEN}Open: http://localhost:$PORT${RESET}\n\n"
    else
      err "Failed to start in background. Check atlas.log"
    fi
    ;;

  "foreground"|*)
    printf "  ${YELLOW}Press Ctrl+C to stop the server${RESET}\n\n"
    exec "$SCRIPT_DIR/$VENV_DIR/bin/python3" "$SCRIPT_DIR/$MAIN_PY"
    ;;

esac
