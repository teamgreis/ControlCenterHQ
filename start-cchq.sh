#!/bin/bash
# ControlCenterHQ – Server starten/stoppen/Status
# Nutzung: bash start-cchq.sh [start|stop|status]
cd "$(dirname "$0")" || exit 1
APP="ControlCenterHQ"
PORT=8000
LOG="server.log"

is_running() {
  curl -s -m 3 "http://localhost:$PORT/api/system/health" >/dev/null 2>&1
}

case "${1:-start}" in
  start)
    if is_running; then
      echo "$APP laeuft bereits auf Port $PORT"
      exit 0
    fi
    echo "Starte $APP auf 0.0.0.0:$PORT ..."
    nohup env PYTHONPYCACHEPREFIX=/tmp/cchqpyc .venv/bin/python main.py >> "$LOG" 2>&1 &
    for i in $(seq 1 20); do
      sleep 1
      if is_running; then
        echo "$APP gestartet"
        exit 0
      fi
    done
    echo "FEHLER: keine Antwort in 20s. Letzte Log-Zeilen:" >&2
    tail -20 "$LOG" >&2
    exit 1
    ;;
  stop)
    pkill -f "python main.py" 2>/dev/null
    echo "$APP gestoppt"
    ;;
  status)
    if is_running; then
      echo "$APP laeuft auf Port $PORT"
      curl -s "http://localhost:$PORT/api/system/health"
    else
      echo "$APP laeuft NICHT"
      exit 1
    fi
    ;;
esac
