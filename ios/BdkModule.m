#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkModule, NSObject)

RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getLastUnusedAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncWallet:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(
    createWallet: (nonnull NSString*)mnemonic
    password:(nonnull NSString *)password  
    network:(nonnull NSString *)network
    blockchainConfigUrl:(nonnull NSString *)blockchainConfigUrl
    blockchainSocket5:(nonnull NSString *)blockchainSocket5
    retry:(nonnull NSString *)retry
    timeOut:(nonnull NSString *)timeOut
    blockchainName:(nonnull NSString *)blockchainName
    descriptor:(nonnull NSString *)descriptor
    resolve: (RCTPromiseResolveBlock)resolve 
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  generateMnemonic: (nonnull NSNumber *)wordCount
                  network:(nonnull NSString *)network
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
    getExtendedKeyInfo: (nonnull NSString*)network
    mnemonic:(nonnull NSString *)mnemonic
    password:(nonnull NSString *)password
    resolve: (RCTPromiseResolveBlock)resolve
    reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  broadcastTx: (nonnull NSString *)recipient
                  amount: (nonnull NSNumber *)amount
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(listTransactions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
