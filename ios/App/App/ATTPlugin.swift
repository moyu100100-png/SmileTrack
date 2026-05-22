import Foundation
import Capacitor
import AppTrackingTransparency

@objc(ATTPlugin)
public class ATTPlugin: CAPPlugin {
    @objc public func requestPermission(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                call.resolve(["status": status.rawValue])
            }
        } else {
            call.resolve(["status": 3]) // authorized on iOS < 14
        }
    }
}
