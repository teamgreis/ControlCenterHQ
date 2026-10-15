// © Felix Greis 2026 – All rights reserved.
import SwiftUI
import WebKit

// MARK: - Script message handler proxy
// WKUserContentController retains script message handlers strongly, which would
// create a retain cycle:  WKWebView → WKUserContentController → Coordinator → WKWebView
// This lightweight proxy holds a weak reference to the real Coordinator and
// breaks the cycle without affecting any functionality.
private final class WeakScriptMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ target: WKScriptMessageHandler) { self.target = target }
    func userContentController(_ controller: WKUserContentController,
                                didReceive message: WKScriptMessage) {
        target?.userContentController(controller, didReceive: message)
    }
}

struct WebContainerView: UIViewRepresentable {
    let serverURL: String
    let token: String
    @Binding var isLoading: Bool
    @Binding var showOfflineBanner: Bool
    var onPageLoad: (() -> Void)?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        // Safely JSON-encode the token so any special characters
        // (quotes, backslashes, newlines, etc.) can't break out of the JS string.
        let tokenJSON = (try? JSONEncoder().encode(token))
            .flatMap { String(data: $0, encoding: .utf8) } ?? "\"\""

        let script = """
        window.__ATLAS_TOKEN__ = \(tokenJSON);
        window.__ATLAS_NATIVE__ = true;
        try { localStorage.setItem('atlas_token', \(tokenJSON)); } catch(_) {}
        """
        let userScript = WKUserScript(source: script,
                                       injectionTime: .atDocumentStart,
                                       forMainFrameOnly: true)
        config.userContentController.addUserScript(userScript)

        // Use the proxy to avoid a retain cycle between WKUserContentController and Coordinator
        let proxy = WeakScriptMessageHandler(context.coordinator)
        config.userContentController.add(proxy, name: "atlasNative")

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.bounces = true
        webView.backgroundColor = UIColor(red: 0.04, green: 0.055, blue: 0.10, alpha: 1)
        webView.isOpaque = false
        // Prevent status-bar colour conflicts with the dark background
        if #available(iOS 16.4, *) {
            webView.isInspectable = false // disable remote Web Inspector in release
        }

        // Pull-to-refresh
        let refresh = UIRefreshControl()
        refresh.addTarget(context.coordinator,
                          action: #selector(Coordinator.pullToRefresh(_:)),
                          for: .valueChanged)
        webView.scrollView.refreshControl = refresh

        context.coordinator.webView = webView
        context.coordinator.load()
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        // Only reload when the server URL genuinely changes.
        // loadedServerURL prevents re-triggering on every SwiftUI re-render
        // while WKWebView is still navigating (webView.url not yet updated).
        guard !serverURL.isEmpty,
              serverURL != context.coordinator.loadedServerURL else { return }
        context.coordinator.parent = self
        context.coordinator.load()
    }

    // MARK: - Coordinator

    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        var parent: WebContainerView
        weak var webView: WKWebView?
        private weak var activeRefreshControl: UIRefreshControl?
        private var retryCount = 0
        private var retryTimer: DispatchWorkItem?

        /// Tracks the serverURL we last dispatched a load for, preventing
        /// duplicate loads while WKWebView.url hasn't updated yet.
        private(set) var loadedServerURL: String = ""

        init(_ parent: WebContainerView) {
            self.parent = parent
        }

        func load() {
            retryTimer?.cancel()
            retryCount = 0
            guard let url = URL(string: parent.serverURL) else { return }
            loadedServerURL = parent.serverURL
            var req = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
            req.timeoutInterval = 15
            webView?.load(req)
        }

        @objc func pullToRefresh(_ sender: UIRefreshControl) {
            activeRefreshControl = sender
            webView?.reload()
        }

        // MARK: WKNavigationDelegate

        func webView(_ webView: WKWebView,
                     didStartProvisionalNavigation navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = true
            }
        }

        func webView(_ webView: WKWebView,
                     didFinish navigation: WKNavigation!) {
            DispatchQueue.main.async {
                self.parent.isLoading = false
                self.parent.showOfflineBanner = false
                self.retryCount = 0
                self.retryTimer?.cancel()
                self.activeRefreshControl?.endRefreshing()
                self.activeRefreshControl = nil
                self.parent.onPageLoad?()
            }
        }

        func webView(_ webView: WKWebView,
                     didFail navigation: WKNavigation!,
                     withError error: Error) {
            handleLoadError(error)
        }

        func webView(_ webView: WKWebView,
                     didFailProvisionalNavigation navigation: WKNavigation!,
                     withError error: Error) {
            handleLoadError(error)
        }

        private func handleLoadError(_ error: Error) {
            // NSURLErrorCancelled (-999) fires when WKWebView cancels the previous
            // request to start a new one – not a real failure, just ignore it.
            let nsErr = error as NSError
            guard nsErr.code != NSURLErrorCancelled else { return }

            DispatchQueue.main.async {
                self.parent.isLoading = false
                self.parent.showOfflineBanner = true
                self.activeRefreshControl?.endRefreshing()
                self.activeRefreshControl = nil
            }

            // Exponential back-off retry (max 3 attempts: 2s, 4s, 8s)
            guard retryCount < 3 else { return }
            retryCount += 1
            let delay = Double(retryCount) * 2.0
            let item = DispatchWorkItem { [weak self] in self?.load() }
            retryTimer = item
            DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: item)
        }

        // MARK: WKScriptMessageHandler – receive messages from JS

        func userContentController(_ controller: WKUserContentController,
                                    didReceive message: WKScriptMessage) {
            guard message.name == "atlasNative",
                  let body = message.body as? [String: Any],
                  let type = body["type"] as? String else { return }
            // Extension point: native actions requested by the web app
            switch type {
            case "logout":
                DispatchQueue.main.async {
                    // Trigger native logout if the web app requests it
                    NotificationCenter.default.post(name: Notification.Name("atlasWebLogout"), object: nil)
                }
            default:
                print("[WebContainerView] JS→Native: \(type)")
            }
        }
    }
}
