// © Felix Greis 2026 – All rights reserved.
import SwiftUI
import UserNotifications
import FirebaseCore
import FirebaseMessaging
import BackgroundTasks

@main
struct AtlasApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var auth = AuthService.shared
    @StateObject private var themeManager = ThemeManager.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(auth)
                .environmentObject(themeManager)
                // Remove .preferredColorScheme(.dark) so themes can adapt
        }
    }
}

struct RootView: View {
    @EnvironmentObject var auth: AuthService
    @ObservedObject private var tm = ThemeManager.shared

    var body: some View {
        if #available(iOS 17.0, *) {
            rootContent
                .onChange(of: auth.serverURL) { _, newURL in
                    if !newURL.isEmpty { PermissionService.shared.requestAll() }
                }
                .onChange(of: auth.isLoggedIn) { _, loggedIn in
                    if loggedIn { PermissionService.shared.requestAll() }
                }
        } else {
            rootContent
                .onChange(of: auth.serverURL) { newURL in
                    if !newURL.isEmpty { PermissionService.shared.requestAll() }
                }
                .onChange(of: auth.isLoggedIn) { loggedIn in
                    if loggedIn { PermissionService.shared.requestAll() }
                }
        }
    }

    @ViewBuilder
    private var rootContent: some View {
        ZStack {
            tm.current.bgPrimary
                .ignoresSafeArea()
                .animation(.easeInOut(duration: 0.3), value: tm.current.id)

            if auth.serverURL.isEmpty {
                OnboardingView()
                    .transition(.asymmetric(
                        insertion: .move(edge: .leading).combined(with: .opacity),
                        removal:   .move(edge: .leading).combined(with: .opacity)
                    ))
            } else if !auth.isLoggedIn {
                LoginView()
                    .transition(.asymmetric(
                        insertion: .move(edge: .trailing).combined(with: .opacity),
                        removal:   .move(edge: .trailing).combined(with: .opacity)
                    ))
            } else {
                MainView()
                    .transition(.asymmetric(
                        insertion: .opacity.combined(with: .scale(scale: 0.97)),
                        removal:   .opacity.combined(with: .scale(scale: 0.97))
                    ))
            }
        }
        .animation(.spring(response: 0.38, dampingFraction: 0.88), value: auth.serverURL.isEmpty)
        .animation(.spring(response: 0.38, dampingFraction: 0.88), value: auth.isLoggedIn)
    }
}

private let bgTaskIdentifier = "de.controlcenterhq.app.refresh"

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        // Initialize Firebase
        FirebaseApp.configure()

        // Set PushService as the UNUserNotificationCenter delegate so foreground
        // notifications are shown and critical alerts can bypass DND/silent mode.
        UNUserNotificationCenter.current().delegate = PushService.shared

        // Setup FCM delegate to receive FCM tokens
        FCMService.shared.setup()

        // Request all notification permissions including .criticalAlert so that
        // emergency sounds can override silent mode and Focus filters.
        PushService.shared.requestPermission()

        // Register background task handler – must happen before app finishes launching.
        BGTaskScheduler.shared.register(forTaskWithIdentifier: bgTaskIdentifier, using: nil) { task in
            AppDelegate.handleBackgroundRefresh(task: task as! BGAppRefreshTask)
        }

        return true
    }

    // MARK: - Background App Refresh

    /// Schedule the next background refresh. Call this whenever the app enters the background.
    static func scheduleBackgroundRefresh() {
        let request = BGAppRefreshTaskRequest(identifier: bgTaskIdentifier)
        // Ask iOS to wake the app in ≈10 seconds – the OS may delay this.
        request.earliestBeginDate = Date(timeIntervalSinceNow: 10)
        do {
            try BGTaskScheduler.shared.submit(request)
        } catch {
            print("[BGTask] Could not schedule refresh: \(error)")
        }
    }

    /// Called by iOS when the background refresh fires.
    private static func handleBackgroundRefresh(task: BGAppRefreshTask) {
        // Immediately reschedule so the cycle continues.
        scheduleBackgroundRefresh()

        // Perform one poll and fire a local notification if there is a new alert.
        let fetchTask = Task {
            AlertPollingService.shared.performBackgroundFetch { result in
                task.setTaskCompleted(success: result != .failed)
            }
        }

        // If iOS kills the task early, cancel the fetch gracefully.
        task.expirationHandler = {
            fetchTask.cancel()
            task.setTaskCompleted(success: false)
        }
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Schedule the first background refresh every time the app goes to background.
        AppDelegate.scheduleBackgroundRefresh()
    }

    // MARK: - Home Screen Quick Actions

    func application(_ application: UIApplication,
                     performActionFor shortcutItem: UIApplicationShortcutItem,
                     completionHandler: @escaping (Bool) -> Void) {
        switch shortcutItem.type {
        case "de.controlcenterhq.app.sos":
            NotificationCenter.default.post(name: .atlasQuickActionSOS, object: nil)
        case "de.controlcenterhq.app.ptt":
            NotificationCenter.default.post(name: .atlasQuickActionPTT, object: nil)
        case "de.controlcenterhq.app.alerts":
            NotificationCenter.default.post(name: .atlasQuickActionAlerts, object: nil)
        default: break
        }
        completionHandler(true)
    }

    /// Set up static quick actions – called once after login.
    static func setupQuickActions() {
        let sos = UIApplicationShortcutItem(
            type: "de.controlcenterhq.app.sos",
            localizedTitle: "SOS Alarm",
            localizedSubtitle: "Notfall auslösen",
            icon: UIApplicationShortcutIcon(systemImageName: "exclamationmark.triangle.fill")
        )
        let ptt = UIApplicationShortcutItem(
            type: "de.controlcenterhq.app.ptt",
            localizedTitle: "Sprachkanal",
            localizedSubtitle: "Walkie-Talkie öffnen",
            icon: UIApplicationShortcutIcon(systemImageName: "antenna.radiowaves.left.and.right")
        )
        let alerts = UIApplicationShortcutItem(
            type: "de.controlcenterhq.app.alerts",
            localizedTitle: "Alarme",
            localizedSubtitle: "Alarme anzeigen",
            icon: UIApplicationShortcutIcon(systemImageName: "bell.badge.fill")
        )
        UIApplication.shared.shortcutItems = [sos, ptt, alerts]
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // Pass APNs token to Firebase so it can map to an FCM token
        Messaging.messaging().apnsToken = deviceToken

        let auth = AuthService.shared
        guard !auth.token.isEmpty, !auth.serverURL.isEmpty else { return }
        // Register with Atlas server via APNs path (requires paid dev account)
        PushService.shared.registerDeviceToken(deviceToken, serverURL: auth.serverURL, authToken: auth.token)
    }

    func application(_ application: UIApplication,
                     didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("[APNs] Registration failed: \(error.localizedDescription)")
    }

    func application(_ application: UIApplication,
                     didReceiveRemoteNotification userInfo: [AnyHashable: Any],
                     fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        let notifType  = userInfo["type"] as? String ?? ""
        let severity   = userInfo["severity"] as? String ?? ""
        let isCritical = severity == "critical" || notifType == "emergency_broadcast"
        let isDispatch = notifType == "dispatch_request"

        if isCritical || isDispatch {
            let title     = (userInfo["title"] as? String) ?? (isCritical ? "🚨 NOTFALLALARM" : "🚨 Einsatzauftrag")
            let body      = (userInfo["body"] as? String) ?? (userInfo["message"] as? String) ?? ""
            let soundName: String = isDispatch ? "dispatch_tone" : "emergency_siren"
            PushService.shared.showCriticalLocalNotification(title: title, body: body, soundName: soundName)
        }
        completionHandler(.newData)
    }
}
