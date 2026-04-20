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
        Purchases.shared.getOfferings { offerings, error in
            if let error = error {
                call.reject("getOfferings failed: \(error.localizedDescription)")
                return
            }
            guard let offerings = offerings else {
                call.reject("No offerings returned")
                return
            }
            var result: [[String: Any]] = []
            for (_, offering) in offerings.all {
                for package in offering.availablePackages {
                    let product = package.storeProduct
                    result.append([
                        "identifier": product.productIdentifier,
                        "priceString": product.localizedPriceString,
                        "packageIdentifier": package.identifier,
                        "offeringIdentifier": offering.identifier,
                    ])
                }
            }
            call.resolve(["packages": result])
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
