import UIKit
import Capacitor
import UserNotifications
import AppTrackingTransparency
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    static var pendingAlarmAction: String? = nil

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        UNUserNotificationCenter.current().delegate = self

        // ATT許可ダイアログ：初回のみ、起動120秒後に表示（オンボーディング完了後を想定）
        if #available(iOS 14, *) {
            let attShown = UserDefaults.standard.bool(forKey: "att_shown")
            if !attShown {
                UserDefaults.standard.set(true, forKey: "att_shown")
                DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
                    ATTrackingManager.requestTrackingAuthorization { _ in }
                }
            }
        }

        let stopAction = UNNotificationAction(identifier: "ALARM_STOP", title: "Stop Alarm", options: [.foreground])
        let snoozeAction = UNNotificationAction(identifier: "ALARM_SNOOZE", title: "Snooze", options: [.foreground])
        let alarmCategory = UNNotificationCategory(identifier: "ALARM_CATEGORY", actions: [stopAction, snoozeAction], intentIdentifiers: [], options: [])
        UNUserNotificationCenter.current().setNotificationCategories([alarmCategory])
        return true
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        if let action = AppDelegate.pendingAlarmAction {
            AppDelegate.pendingAlarmAction = nil
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { self.sendAlarmActionToJS(action: action) }
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    func sendNotifTapToJS(type: String) {
        if let webView = (self.window?.rootViewController as? CAPBridgeViewController)?.webView {
            let js = "window.dispatchEvent(new CustomEvent('NotificationTap', {detail: {type: '\(type)'}}))"
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }

    func sendAlarmActionToJS(action: String) {
        if let webView = (self.window?.rootViewController as? CAPBridgeViewController)?.webView {
            let js = "window.dispatchEvent(new CustomEvent('AlarmAction', {detail: {action: '\(action)'}}))"
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let actionId = response.actionIdentifier
        let notifId = response.notification.request.identifier

        if actionId == "ALARM_STOP" { AppDelegate.pendingAlarmAction = "stop" }
        else if actionId == "ALARM_SNOOZE" { AppDelegate.pendingAlarmAction = "snooze" }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            // デバッグ: rawIdとactionIdをJSに送る
            if let webView = (self.window?.rootViewController as? CAPBridgeViewController)?.webView {
                let debugJs = "window._debugNotifId && window._debugNotifId('\(notifId)_action:\(actionId)')"
                webView.evaluateJavaScript(debugJs, completionHandler: nil)
            }
            // 交換・写真リマインダーの判定
            if notifId.contains("2001") {
                self.sendNotifTapToJS(type: "exchange")
            } else if notifId.contains("3001") {
                self.sendNotifTapToJS(type: "photo")
            }
        }

        completionHandler()
    }
}
