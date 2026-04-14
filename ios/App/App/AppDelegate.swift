import UIKit
import Capacitor
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self

        let stopAction = UNNotificationAction(
            identifier: "ALARM_STOP",
            title: "アラーム停止",
            options: [.foreground]
        )
        let snoozeAction = UNNotificationAction(
            identifier: "ALARM_SNOOZE",
            title: "スヌーズ",
            options: []
        )
        let alarmCategory = UNNotificationCategory(
            identifier: "ALARM_CATEGORY",
            actions: [stopAction, snoozeAction],
            intentIdentifiers: [],
            options: []
        )
        UNUserNotificationCenter.current().setNotificationCategories([alarmCategory])

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void) {
        let actionId = response.actionIdentifier

        if actionId == "ALARM_STOP" || actionId == "ALARM_SNOOZE" {
            let action = actionId == "ALARM_STOP" ? "stop" : "snooze"
            DispatchQueue.main.async {
                if let webView = (self.window?.rootViewController as? CAPBridgeViewController)?.webView {
                    let js = "window.dispatchEvent(new CustomEvent('AlarmAction', {detail: {action: '\(action)'}}))"
                    webView.evaluateJavaScript(js, completionHandler: nil)
                }
            }
        }
        completionHandler()
    }
}
