import Foundation
import Capacitor
import RevenueCat

@objc(RCBridge)
public class RCBridge: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "RCBridge"
    public let jsName = "RCBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getOfferings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchasePackage", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restorePurchases", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getCustomerInfo", returnType: CAPPluginReturnPromise),
    ]

    @objc func getOfferings(_ call: CAPPluginCall) {
        var logs: [String] = []

        logs.append("isConfigured: \(Purchases.isConfigured)")
        print("[RC] getOfferings called")
        print("[RC] isConfigured: \(Purchases.isConfigured)")

        if !Purchases.isConfigured {
            logs.append("❌ Purchases未初期化 → AppDelegate確認必要")
            call.resolve(["packages": [], "debugLogs": logs])
            return
        }

        logs.append("getOfferings呼び出し中...")
        print("[RC] calling Purchases.shared.getOfferings...")

        Purchases.shared.getOfferings { offerings, error in
            if let error = error {
                let rcError = error as NSError
                let msg = "❌ ERROR: \(error.localizedDescription)"
                let code = "code: \(rcError.code)"
                let domain = "domain: \(rcError.domain)"
                logs.append(msg)
                logs.append(code)
                logs.append(domain)
                print("[RC] \(msg)")
                print("[RC] \(code)")
                print("[RC] \(domain)")
                if let underlying = rcError.userInfo[NSUnderlyingErrorKey] as? NSError {
                    let u = "underlying: \(underlying.localizedDescription) (code:\(underlying.code))"
                    logs.append(u)
                    print("[RC] \(u)")
                }
                call.resolve(["packages": [], "debugLogs": logs])
                return
            }

            guard let offerings = offerings else {
                logs.append("❌ offerings nil（エラーなしでnilは想定外）")
                print("[RC] offerings is nil")
                call.resolve(["packages": [], "debugLogs": logs])
                return
            }

            let allCount = offerings.all.count
            let currentId = offerings.current?.identifier ?? "nil"
            logs.append("offerings.all.count: \(allCount)")
            logs.append("offerings.current: \(currentId)")
            print("[RC] offerings.all.count: \(allCount)")
            print("[RC] offerings.current: \(currentId)")

            if allCount == 0 {
                logs.append("⚠️ offeringsが空 → RevenueCat Dashboard / StoreKit設定を確認")
            }

            var result: [[String: Any]] = []
            for (key, offering) in offerings.all {
                let pkgCount = offering.availablePackages.count
                logs.append("offering[\(key)] packages:\(pkgCount)")
                print("[RC] offering[\(key)] packages:\(pkgCount)")
                for package in offering.availablePackages {
                    let product = package.storeProduct
                    let line = "  pkg:\(package.identifier) / \(product.productIdentifier) / \(product.localizedPriceString)"
                    logs.append(line)
                    print("[RC] \(line)")
                    result.append([
                        "identifier": product.productIdentifier,
                        "priceString": product.localizedPriceString,
                        "packageIdentifier": package.identifier,
                        "offeringIdentifier": offering.identifier,
                    ])
                }
            }

            logs.append("✅ 完了 packages:\(result.count)")
            print("[RC] resolve packages:\(result.count)")
            call.resolve(["packages": result, "debugLogs": logs])
        }
    }

    @objc func purchasePackage(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("productId is required")
            return
        }
        Purchases.shared.getOfferings { offerings, error in
            if let error = error {
                call.reject("getOfferings failed: \(error.localizedDescription)")
                return
            }
            var targetPackage: Package? = nil
            if let allOfferings = offerings?.all {
                outer: for (_, offering) in allOfferings {
                    for package in offering.availablePackages {
                        if package.storeProduct.productIdentifier == productId {
                            targetPackage = package
                            break outer
                        }
                    }
                }
            }
            guard let pkg = targetPackage else {
                call.reject("Product not found: \(productId)")
                return
            }
            Purchases.shared.purchase(package: pkg) { transaction, customerInfo, error, userCancelled in
                if userCancelled {
                    call.reject("PURCHASE_CANCELLED")
                    return
                }
                if let error = error {
                    call.reject("Purchase failed: \(error.localizedDescription)")
                    return
                }
                let isPremium = customerInfo?.entitlements["premium"]?.isActive == true
                let noAds = customerInfo?.entitlements["no_ads"]?.isActive == true
                call.resolve(["isPremium": isPremium, "noAds": noAds])
            }
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        Purchases.shared.restorePurchases { customerInfo, error in
            if let error = error {
                call.reject("Restore failed: \(error.localizedDescription)")
                return
            }
            let isPremium = customerInfo?.entitlements["premium"]?.isActive == true
            let noAds = customerInfo?.entitlements["no_ads"]?.isActive == true
            call.resolve(["isPremium": isPremium, "noAds": noAds])
        }
    }

    @objc func getCustomerInfo(_ call: CAPPluginCall) {
        Purchases.shared.getCustomerInfo { customerInfo, error in
            if let error = error {
                call.reject("getCustomerInfo failed: \(error.localizedDescription)")
                return
            }
            let isPremium = customerInfo?.entitlements["premium"]?.isActive == true
            let noAds = customerInfo?.entitlements["no_ads"]?.isActive == true
            call.resolve(["isPremium": isPremium, "noAds": noAds])
        }
    }
}
