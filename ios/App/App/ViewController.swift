import UIKit
import Capacitor
import WebKit

class ViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        webView?.uiDelegate = self
        // RCBridgeプラグインを登録
        bridge?.registerPluginInstance(RCBridge())
    }
}

extension ViewController: WKUIDelegate {
    @available(iOS 15.0, *)
    func webView(_ webView: WKWebView,
                 requestMediaCapturePermissionFor origin: WKSecurityOrigin,
                 initiatedByFrame frame: WKFrameInfo,
                 type: WKMediaCaptureType,
                 decisionHandler: @escaping (WKPermissionDecision) -> Void) {
        decisionHandler(.grant)
    }
}
