#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(ATTPlugin, "ATTPlugin",
    CAP_PLUGIN_METHOD(requestPermission, CAPPluginReturnPromise);
)
