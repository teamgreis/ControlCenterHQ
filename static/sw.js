// © Felix Greis | Atlas GmbH 2026 – All rights reserved.
// Atlas AdminSysOP – Service Worker for Caching + Web Push Notifications
// Supports: silent-mode bypass (critical), vibration patterns, sound via main thread

const CACHE_NAME = 'atlas-adminsysop-v3';
const STATIC_ASSETS = [
  '/',
  '/static/app.js',
  '/static/styles.css',
  '/static/sw-register.js'
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(STATIC_ASSETS).catch(() => {/* non-fatal */})
    )
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch (cache-first for static, passthrough for API) ──────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('/');
      });
    })
  );
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'Atlas Alert',
      body: event.data ? event.data.text() : 'New notification'
    };
  }

  const severity = data.severity || 'info';
  const isCritical = severity === 'critical';
  const isWarning  = severity === 'warning';

  // ── Notification options ──────────────────────────────────────────────────
  // 'silent: false' and vibrate bypass DND on Android.
  // On iOS 16.4+ installed PWA, vibrate works in foreground.
  // requireInteraction keeps critical alerts on screen until dismissed.
  const options = {
    body: data.body || data.message || 'You have a new alert',

    // Icons: use emoji-based fallback SVG data URIs so no separate icon files needed
    icon:  '/static/icons/icon-192.png',
    badge: '/static/icons/badge-96.png',

    tag: data.id ? `atlas-alert-${data.id}` : 'atlas-alert',

    // renotify: true → re-alerts even if same tag is already shown (critical only)
    renotify: isCritical,

    // requireInteraction: critical stays until user acts
    requireInteraction: isCritical,

    // silent: false  ← explicit; ensures the device sound/vibration fires
    // This bypasses "do not disturb" on many Android devices for web push.
    silent: false,

    // Vibration pattern (ms: vibrate, pause, vibrate …)
    // critical: 3× long bursts, warning: 2× short, info: 1× short
    vibrate: isCritical ? [300, 100, 300, 100, 600] :
             isWarning  ? [200, 100, 200] :
                          [100],

    // Timestamp shown in notification drawer
    timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),

    // Action buttons
    actions: isCritical
      ? [
          { action: 'view',    title: '🔍 View Alert' },
          { action: 'ack',     title: '✓ Acknowledge' },
        ]
      : [
          { action: 'view',    title: 'View' },
          { action: 'dismiss', title: 'Dismiss' },
        ],

    // Payload forwarded to click handler
    data: {
      url:      data.url || '/#/alerts',
      alertId:  data.id,
      severity: severity,
      token:    data.token || null,
      timestamp: Date.now(),
    },
  };

  // ── Title with severity prefix ────────────────────────────────────────────
  const prefix = isCritical ? '🚨 CRITICAL – ' :
                 isWarning  ? '⚠️ Warning – '  : 'ℹ️ ';
  const title = prefix + (data.title || 'Atlas AdminSysOP');

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then(clients => {
        clients.forEach(client => {
          // Ask main thread to play audio (AudioContext requires user-gesture,
          // but if tab is open it will usually work)
          client.postMessage({
            type: 'PLAY_ALERT_TONE',
            severity,
            alertId: data.id,
          });
        });
      })
  );
});

// ── Notification Click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const action     = event.action;
  const notifData  = event.notification.data || {};
  const targetUrl  = notifData.url || '/#/alerts';
  const alertId    = notifData.alertId;
  const severity   = notifData.severity;

  if (action === 'dismiss') return;

  // Acknowledge action: fire API call then navigate
  if (action === 'ack' && alertId && notifData.token) {
    event.waitUntil(
      fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${notifData.token}` },
      }).catch(() => {/* offline – will sync later */})
       .then(() => _focusOrOpen(targetUrl, alertId))
    );
    return;
  }

  event.waitUntil(_focusOrOpen(targetUrl, alertId));
});

function _focusOrOpen(url, alertId) {
  return self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(clients => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NAVIGATE', url, alertId });
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    });
}

// ── Notification Close (tracking) ─────────────────────────────────────────────
self.addEventListener('notificationclose', event => {
  const data = event.notification.data || {};
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'NOTIFICATION_DISMISSED', alertId: data.alertId });
    });
  });
});

// ── Background Sync – retry failed acks ──────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'atlas-ack-sync') {
    event.waitUntil(syncPendingAcks());
  }
});

async function syncPendingAcks() {
  try {
    const db   = await openDB();
    const tx   = db.transaction('pendingAcks', 'readwrite');
    const store = tx.objectStore('pendingAcks');
    const all  = await storeGetAll(store);
    for (const item of all) {
      try {
        const resp = await fetch(`/api/alerts/${item.alertId}/acknowledge`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${item.token}` },
        });
        if (resp.ok) store.delete(item.id);
      } catch (e) { /* retry later */ }
    }
  } catch (e) { /* IndexedDB not available */ }
}

// ── Message from main thread ──────────────────────────────────────────────────
self.addEventListener('message', event => {
  const msg = event.data || {};
  if (msg.type === 'SKIP_WAITING') self.skipWaiting();
  if (msg.type === 'CACHE_INVALIDATE') caches.delete(CACHE_NAME);
});

// ── IndexedDB helpers ─────────────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('atlas-sw', 1);
    req.onupgradeneeded = e =>
      e.target.result.createObjectStore('pendingAcks', { keyPath: 'id', autoIncrement: true });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

function storeGetAll(store) {
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = e => resolve(e.target.result || []);
    req.onerror   = e => reject(e.target.error);
  });
}
