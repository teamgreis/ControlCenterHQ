#!/usr/bin/env bash
# © Felix Greis | Atlas GmbH 2026 – All rights reserved.
# Atlas AdminSysOP – Raspberry Pi Pager Gateway Setup
# =====================================================
# Sets up POCSAG RX/TX + Universal Push on Raspberry Pi 5
# Run as: bash setup-pager.sh
# =====================================================

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BOLD}${BLUE}"
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║   Atlas AdminSysOP – Pager Gateway Setup  ║"
echo "  ║   © Felix Greis | Atlas GmbH 2026         ║"
echo "  ╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# ── Detect OS / Architecture ──────────────────────────────────────────────────
if [[ "$(uname -m)" != "aarch64" ]] && [[ "$(uname -m)" != "armv7l" ]]; then
  echo -e "${YELLOW}⚠ Warning: This script is optimized for Raspberry Pi (ARM).${NC}"
  echo -e "  Detected: $(uname -m). Some features may not work on this architecture."
  read -rp "Continue anyway? [y/N] " cont
  [[ "$cont" =~ ^[Yy]$ ]] || exit 0
fi

# ── Require root for apt / system installs ────────────────────────────────────
if [[ "$EUID" -ne 0 ]]; then
  echo -e "${RED}✗ Please run as root: sudo bash setup-pager.sh${NC}"
  exit 1
fi

echo -e "\n${BOLD}Step 1/6: System packages${NC}"
apt-get update -qq
apt-get install -y \
  rtl-sdr \
  multimon-ng \
  python3-pip \
  curl \
  wget \
  usbutils \
  librtlsdr-dev 2>&1 | tail -5
echo -e "${GREEN}✓ RTL-SDR + multimon-ng installed${NC}"

# ── Blacklist DVB kernel module (required for RTL-SDR) ────────────────────────
echo -e "\n${BOLD}Step 2/6: RTL-SDR kernel module setup${NC}"
if ! grep -q "blacklist dvb_usb_rtl28xxu" /etc/modprobe.d/rtlsdr.conf 2>/dev/null; then
  cat > /etc/modprobe.d/rtlsdr.conf << 'EOF'
blacklist dvb_usb_rtl28xxu
blacklist rtl2832
blacklist rtl2830
EOF
  echo -e "${GREEN}✓ DVB modules blacklisted (RTL-SDR can now claim the device)${NC}"
else
  echo -e "${GREEN}✓ DVB blacklist already configured${NC}"
fi

# Allow non-root USB access to RTL-SDR
if ! grep -q "RTL-SDR" /etc/udev/rules.d/rtlsdr.rules 2>/dev/null; then
  cat > /etc/udev/rules.d/rtlsdr.rules << 'EOF'
# RTL-SDR USB dongles
SUBSYSTEM=="usb", ATTRS{idVendor}=="0bda", ATTRS{idProduct}=="2832", GROUP="plugdev", MODE="0664", SYMLINK+="rtl_sdr"
SUBSYSTEM=="usb", ATTRS{idVendor}=="0bda", ATTRS{idProduct}=="2838", GROUP="plugdev", MODE="0664", SYMLINK+="rtl_sdr"
EOF
  udevadm control --reload-rules && udevadm trigger
  echo -e "${GREEN}✓ udev rules set (non-root RTL-SDR access)${NC}"
fi

# ── Python: apprise ───────────────────────────────────────────────────────────
echo -e "\n${BOLD}Step 3/6: Python packages${NC}"
pip3 install --break-system-packages apprise 2>&1 | tail -3 || \
pip3 install apprise 2>&1 | tail -3
echo -e "${GREEN}✓ apprise installed${NC}"

# ── ntfy server ───────────────────────────────────────────────────────────────
echo -e "\n${BOLD}Step 4/6: ntfy push server${NC}"
if command -v ntfy &>/dev/null; then
  echo -e "${GREEN}✓ ntfy already installed ($(ntfy --version 2>&1 | head -1))${NC}"
else
  echo "Installing ntfy..."
  NTFY_VERSION=$(curl -s "https://api.github.com/repos/binwiederhier/ntfy/releases/latest" | grep '"tag_name"' | sed 's/.*"v\([^"]*\)".*/\1/')
  NTFY_VERSION=${NTFY_VERSION:-2.11.0}
  ARCH="arm64"
  [[ "$(uname -m)" == "armv7l" ]] && ARCH="armv7"
  wget -q "https://github.com/binwiederhier/ntfy/releases/download/v${NTFY_VERSION}/ntfy_${NTFY_VERSION}_linux_${ARCH}.tar.gz" \
    -O /tmp/ntfy.tar.gz
  tar -xzf /tmp/ntfy.tar.gz -C /tmp
  mv /tmp/ntfy_${NTFY_VERSION}_linux_${ARCH}/ntfy /usr/local/bin/ntfy
  chmod +x /usr/local/bin/ntfy
  echo -e "${GREEN}✓ ntfy v${NTFY_VERSION} installed${NC}"
fi

# ntfy config directory
mkdir -p /etc/ntfy
if [[ ! -f /etc/ntfy/server.yml ]]; then
  cat > /etc/ntfy/server.yml << 'EOF'
# ntfy server configuration for Atlas AdminSysOP Pager Gateway
# © Felix Greis | Atlas GmbH 2026

base-url: ""          # Set to your public URL, e.g. https://ntfy.yourdomain.com
                      # or your Tailscale hostname: https://pi-hostname.ts.net
listen-http: ":2586"

# iOS Push Notifications via APNs relay through ntfy.sh:
# Set the line below to enable iOS support
# upstream-base-url: "https://ntfy.sh"

# Authentication (optional)
# auth-file: "/var/lib/ntfy/user.db"
# auth-default-access: "deny-all"

# Persistence
cache-file: "/var/cache/ntfy/cache.db"
attachment-cache-dir: "/var/cache/ntfy/attachments"
attachment-total-size: "500m"
EOF
  mkdir -p /var/cache/ntfy/attachments
  echo -e "${GREEN}✓ ntfy config created: /etc/ntfy/server.yml${NC}"
  echo -e "${YELLOW}  → Edit /etc/ntfy/server.yml to set base-url and optionally upstream-base-url for iOS${NC}"
else
  echo -e "${GREEN}✓ ntfy config already exists${NC}"
fi

# ntfy systemd service
if [[ ! -f /etc/systemd/system/ntfy.service ]]; then
  cat > /etc/systemd/system/ntfy.service << 'EOF'
[Unit]
Description=ntfy push notification server (Atlas AdminSysOP)
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ntfy serve --config /etc/ntfy/server.yml
Restart=on-failure
RestartSec=5s
User=root

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable ntfy
  systemctl start ntfy
  echo -e "${GREEN}✓ ntfy service started (port 2586)${NC}"
else
  systemctl restart ntfy 2>/dev/null || true
  echo -e "${GREEN}✓ ntfy service restarted${NC}"
fi

# ── Test RTL-SDR ──────────────────────────────────────────────────────────────
echo -e "\n${BOLD}Step 5/6: RTL-SDR device check${NC}"
if rtl_test -t 2>&1 | grep -q "Found"; then
  echo -e "${GREEN}✓ RTL-SDR device detected!${NC}"
  rtl_test -t 2>&1 | grep "Found"
else
  echo -e "${YELLOW}⚠ No RTL-SDR device detected right now.${NC}"
  echo "  → Plug in your RTL-SDR dongle and re-run 'rtl_test -t' to verify."
  echo "  → The Atlas receiver will start automatically once configured."
fi

# ── Tailscale HTTPS hint ──────────────────────────────────────────────────────
echo -e "\n${BOLD}Step 6/6: Optional – Tailscale HTTPS${NC}"
if command -v tailscale &>/dev/null; then
  HOSTNAME=$(tailscale status --json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('Self',{}).get('DNSName','').rstrip('.'))" 2>/dev/null || echo "")
  if [[ -n "$HOSTNAME" ]]; then
    echo -e "${GREEN}✓ Tailscale connected: ${BOLD}$HOSTNAME${NC}"
    echo -e "  → Enable HTTPS: ${BOLD}tailscale serve --https=443 http://localhost:8080${NC}"
    echo -e "  → ntfy with iOS:  set ${BOLD}base-url: https://$HOSTNAME${NC} in /etc/ntfy/server.yml"
    echo -e "    and add:        ${BOLD}upstream-base-url: https://ntfy.sh${NC}"
    echo -e "  → Then restart ntfy: ${BOLD}systemctl restart ntfy${NC}"
  fi
else
  echo -e "${YELLOW}  Tailscale not installed. For remote access + HTTPS:${NC}"
  echo "  curl -fsSL https://tailscale.com/install.sh | sh"
  echo "  tailscale up"
  echo "  tailscale serve --https=443 http://localhost:8080"
fi

# ── Final summary ─────────────────────────────────────────────────────────────
echo -e "\n${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  ✅ Atlas Pager Gateway setup complete!${NC}"
echo ""
echo -e "  ${BOLD}Services:${NC}"
echo -e "  • Atlas AdminSysOP:  http://$(hostname -I | awk '{print $1}'):8080"
echo -e "  • ntfy push server:  http://$(hostname -I | awk '{print $1}'):2586"
echo ""
echo -e "  ${BOLD}Next steps:${NC}"
echo -e "  1. Log into Atlas → Sidebar → 📟 Pager Gateway"
echo -e "  2. Tab 'Push Channels' → enter ntfy URL and topic"
echo -e "  3. Install ntfy app on iOS (App Store) or Android (Play/F-Droid)"
echo -e "     Subscribe to topic: ${BOLD}atlas-alerts${NC} (or your custom topic)"
echo -e "  4. Tab 'Receive' → Start Receiver → plug in RTL-SDR"
echo -e "  5. Tab 'Send' → enter DAPNET callsign and send a test page"
echo -e "  6. Scheduler → create recurring alerts/incidents"
echo ""
echo -e "  ${BOLD}Hardware needed:${NC}"
echo -e "  • RTL-SDR V3/V4 USB dongle (receive 439.9875 MHz POCSAG)"
echo -e "  • RPiTX (GPIO4 + low-pass filter) or HackRF One (transmit)"
echo ""
echo -e "  ${BOLD}DAPNET registration:${NC}"
echo -e "  • https://hampager.de  (Amateurfunk-Lizenz erforderlich)"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
