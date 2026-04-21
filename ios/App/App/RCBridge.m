#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(RCBridge, "RCBridge",
    CAP_PLUGIN_METHOD(getOfferings, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(purchasePackage, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(restorePurchases, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(getCustomerInfo, CAPPluginReturnPromise);
)
