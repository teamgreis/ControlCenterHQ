// © Felix Greis 2026 – All rights reserved.
// Atlas Control Center – Service Worker for Caching + Web Push Notifications
// Supports: silent-mode bypass (critical), vibration patterns, sound via main thread

const CACHE_NAME = 'atlas-adminsysop-v7';
const STATIC_ASSETS = [
  '/',
  '/static/app.js?v=2.9.0',
  '/static/styles.css?v=2.9.0',
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

    // Payload forwarded to click handler.
    // NOTE: Never store auth tokens in notification data – they are readable
    // by the OS notification system.  The acknowledge action is handled by
    // the main thread via postMessage once the window is focused.
    data: {
      url:      data.url || '/#/alerts',
      alertId:  data.id,
      severity: severity,
      timestamp: Date.now(),
    },
  };

  // ── Title with severity prefix ────────────────────────────────────────────
  const prefix = isCritical ? '🚨 CRITICAL – ' :
                 isWarning  ? '⚠️ Warning – '  : 'ℹ️ ';
  const title = prefix + (data.title || 'Atlas Control Center');

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
      .catch(err => console.warn('[SW] Push notification failed:', err))
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

  // Acknowledge action: delegate to the main thread which holds the auth token.
  // The SW never stores the token; instead it sends a message to all open
  // windows so the authenticated tab can perform the API call.
  if (action === 'ack' && alertId) {
    event.waitUntil(
      self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => {
          let handled = false;
          for (const client of clients) {
            if (client.url.startsWith(self.location.origin)) {
              client.postMessage({ type: 'ACK_ALERT', alertId });
              client.focus();
              handled = true;
              break;
            }
          }
          // If no window open, open the app and it will ack on load
          if (!handled && self.clients.openWindow) {
            return self.clients.openWindow(`${targetUrl}?ack=${alertId}`);
          }
        })
        .catch(err => console.warn('[SW] Ack delegation failed:', err))
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
  // Background sync for pending acknowledges.
  // Tokens are no longer stored in the SW / IndexedDB for security reasons.
  // Instead, when the app comes back online the main thread will re-check
  // unacknowledged alerts and sync them using its in-memory session token.
  // This function notifies any open windows to trigger that re-sync.
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({ type: 'SYNC_ACKS' });
    }
  } catch (e) { /* no clients available */ }
}

// ── Message from main thread ──────────────────────────────────────────────────
self.addEventListener('message', event => {
  const msg = event.data || {};
  if (msg.type === 'SKIP_WAITING') self.skipWaiting();
  if (msg.type === 'CACHE_INVALIDATE') {
    event.waitUntil(caches.delete(CACHE_NAME));
  }
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
