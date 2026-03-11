// © Felix Greis | Atlas GmbH 2026 – All rights reserved.
// Atlas AdminSysOP – Service Worker Registration + Push Subscription Manager

(function () {
  'use strict';

  window.AtlasSW = {
    registration: null,
    subscription: null,
    supported: ('serviceWorker' in navigator && 'PushManager' in window),

    // ── Register Service Worker ────────────────────────────────────────────
    async register() {
      if (!this.supported) {
        console.info('[SW] Push not supported in this browser');
        return false;
      }
      try {
        this.registration = await navigator.serviceWorker.register('/static/sw.js', {
          scope: '/',
          updateViaCache: 'none', // always check for SW updates
        });
        console.info('[SW] Registered, scope:', this.registration.scope);

        // Handle SW updates silently
        this.registration.addEventListener('updatefound', () => {
          const w = this.registration.installing;
          if (!w) return;
          w.addEventListener('statechange', () => {
            if (w.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW ready – will activate on next load
              console.info('[SW] New version ready');
            }
          });
        });

        // Listen for messages from SW (sound requests, navigate events)
        navigator.serviceWorker.addEventListener('message', e => this._onMessage(e));

        // Try to restore existing subscription
        await this._restoreSubscription();

        return true;
      } catch (err) {
        console.warn('[SW] Registration failed:', err);
        return false;
      }
    },

    // ── Restore existing subscription from PushManager ────────────────────
    async _restoreSubscription() {
      if (!this.registration) return;
      try {
        this.subscription = await this.registration.pushManager.getSubscription();
        if (this.subscription) {
          console.info('[SW] Existing push subscription found');
        }
      } catch (e) {
        console.warn('[SW] Could not restore subscription:', e);
      }
    },

    // ── Request Push Permission + Subscribe ───────────────────────────────
    async subscribePush(token) {
      if (!this.supported) {
        console.warn('[SW] Push not supported');
        return null;
      }
      if (!this.registration) {
        const ok = await this.register();
        if (!ok) return null;
      }

      try {
        // 1. Check / request permission first
        let perm = Notification.permission;
        if (perm === 'denied') {
          console.warn('[SW] Notifications blocked by user');
          return null;
        }
        if (perm !== 'granted') {
          perm = await Notification.requestPermission();
          if (perm !== 'granted') {
            console.info('[SW] Push permission not granted:', perm);
            return null;
          }
        }

        // 2. Check for existing subscription
        let sub = await this.registration.pushManager.getSubscription();
        if (sub) {
          // Already subscribed – re-sync with server in case endpoint changed
          this.subscription = sub;
          await this._syncWithServer(sub, token);
          return sub;
        }

        // 3. Get VAPID public key from server
        let vapidKey = null;
        try {
          const resp = await fetch('/api/push/vapid-public-key', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (resp.ok) {
            const data = await resp.json();
            vapidKey = data.public_key || null;
          }
        } catch (e) {
          console.warn('[SW] Could not fetch VAPID key:', e);
        }

        if (!vapidKey) {
          console.warn('[SW] No VAPID key available – cannot subscribe');
          return null;
        }

        // 4. Subscribe
        sub = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this._urlBase64ToUint8Array(vapidKey),
        });
        this.subscription = sub;
        console.info('[SW] Push subscription created');

        // 5. Register on server
        await this._syncWithServer(sub, token);
        return sub;

      } catch (err) {
        console.warn('[SW] Push subscription failed:', err);
        return null;
      }
    },

    // ── Send subscription to server ────────────────────────────────────────
    async _syncWithServer(sub, token) {
      try {
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(sub.toJSON()),
        });
        console.info('[SW] Subscription synced with server');
      } catch (e) {
        console.warn('[SW] Failed to sync subscription:', e);
      }
    },

    // ── Unsubscribe Push ──────────────────────────────────────────────────
    async unsubscribePush(token) {
      if (!this.subscription) {
        // Try to get from PushManager
        if (this.registration) {
          this.subscription = await this.registration.pushManager.getSubscription().catch(()=>null);
        }
        if (!this.subscription) return;
      }
      try {
        const endpoint = this.subscription.endpoint;
        await this.subscription.unsubscribe();
        this.subscription = null;
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ endpoint }),
        }).catch(() => {});
        console.info('[SW] Push unsubscribed');
      } catch (err) {
        console.warn('[SW] Unsubscribe failed:', err);
      }
    },

    // ── Show local notification (in-app, no server push needed) ───────────
    async showLocalNotification(title, body, options = {}) {
      if (!this.registration) return false;
      const perm = await Notification.requestPermission().catch(()=>'denied');
      if (perm !== 'granted') return false;
      try {
        await this.registration.showNotification(title, {
          body,
          icon:               options.icon    || undefined,
          badge:              options.badge   || undefined,
          tag:                options.tag     || 'atlas-local',
          requireInteraction: options.requireInteraction || false,
          silent:             false,  // never silent for Atlas alerts
          vibrate:            options.vibrate || [100, 50, 100],
          data:               options.data    || {},
          actions:            options.actions || [],
        });
        return true;
      } catch (e) {
        console.warn('[SW] showLocalNotification failed:', e);
        return false;
      }
    },

    // ── Send test push via server ──────────────────────────────────────────
    async sendTestPush(token) {
      try {
        const resp = await fetch('/api/push/test', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        return resp.ok;
      } catch (e) {
        return false;
      }
    },

    // ── Handle messages from SW ────────────────────────────────────────────
    _onMessage(event) {
      const msg = event.data || {};

      switch (msg.type) {

        case 'PLAY_ALERT_TONE':
          // Play the user's configured alert tone
          if (window.ATLAS?.audio) {
            try {
              const ctx = ATLAS.audio.getCtx();
              // Resume context if suspended (needed after user-gesture)
              if (ctx.state === 'suspended') {
                ctx.resume().then(() => ATLAS.audio.play(msg.severity));
              } else {
                ATLAS.audio.play(msg.severity);
              }
            } catch (e) {
              console.warn('[SW→Audio] Play failed:', e);
            }
          }
          break;

        case 'NAVIGATE':
          // Navigate the open tab to the alert
          if (window.ATLAS?.router && msg.url) {
            const page = (msg.url.split('/').pop() || 'alerts').replace('#', '');
            ATLAS.router.go(page || 'alerts');
          }
          if (msg.alertId && window.ATLAS?.ui) {
            // Show a toast pointing to the alert
            ATLAS.ui.toast(`Alert #${msg.alertId} – click Alerts to view`, 'warning');
          }
          break;

        case 'NOTIFICATION_DISMISSED':
          // Could log analytics
          break;
      }
    },

    // ── Utility: URL-safe base64 → Uint8Array (VAPID key decoding) ─────────
    _urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      const out     = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; i++) {
        out[i] = rawData.charCodeAt(i);
      }
      return out;
    },

    // ── Push status helpers ────────────────────────────────────────────────
    isPushEnabled() {
      return !!(this.subscription && Notification.permission === 'granted');
    },

    getPushStatus() {
      if (!this.supported)                         return 'unsupported';
      if (Notification.permission === 'denied')    return 'denied';
      if (!this.subscription)                      return 'not_subscribed';
      return 'active';
    },

    // More detailed status for settings page
    async getDetailedStatus(token) {
      const base = this.getPushStatus();
      if (base !== 'active') return { status: base };
      try {
        const resp = await fetch('/api/push/status', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (resp.ok) {
          const data = await resp.json();
          return { status: base, ...data };
        }
      } catch (e) {}
      return { status: base };
    },
  };

  // Auto-register on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AtlasSW.register());
  } else {
    AtlasSW.register();
  }

})();
