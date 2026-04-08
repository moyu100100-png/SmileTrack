import UIKit
import Capacitor
import WebKit

class ViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 15.0, *) {
            webView?.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        }
    }

    override func webViewConfiguration() -> WKWebViewConfiguration {
        let config = super.webViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        return config
    }
}
