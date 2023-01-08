#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Bdk, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncWallet:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(
    createWallet: (nonnull NSString*)mnemonic
    password:(nonnull NSString *)password
    network:(nonnull NSString *)network
    blockChainConfigUrl:(nonnull NSString *)blockChainConfigUrl
    blockChainSocket5:(nonnull NSString *)blockChainSocket5
    retry:(nonnull NSString *)retry
    timeOut:(nonnull NSString *)timeOut
    blockChainName:(nonnull NSString *)blockChainName
    descriptor:(nonnull NSString *)descriptor
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
