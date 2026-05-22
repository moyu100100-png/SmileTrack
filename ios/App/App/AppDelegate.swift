import UIKit
import Capacitor
import UserNotifications
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    static var pendingAlarmAction: String? = nil

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        UNUserNotificationCenter.current().delegate = self

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
        if actionId == "ALARM_STOP" { AppDelegate.pendingAlarmAction = "stop" }
        else if actionId == "ALARM_SNOOZE" { AppDelegate.pendingAlarmAction = "snooze" }
        completionHandler()
    }
}
