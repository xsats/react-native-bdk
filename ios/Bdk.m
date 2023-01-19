#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkModule, NSObject)

//MARK: Wallet methods
RCT_EXTERN_METHOD(generateMnemonic: (nonnull NSNumber *)wordCount
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(importWallet: (nonnull NSString*)mnemonic
                  password:(nonnull NSString *)password
                  network:(nonnull NSString *)network
                  blockchainConfigUrl:(nonnull NSString *)blockchainConfigUrl
                  blockchainSocket5:(nonnull NSString *)blockchainSocket5
                  retry:(nonnull NSString *)retry
                  timeOut:(nonnull NSString *)timeOut
                  blockchainName:(nonnull NSString *)blockchainName
                  descriptor:(nonnull NSString *)descriptor
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNewAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getLastUnusedAddress:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncWallet:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setBlockchain:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isBlockchainSet:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createTransaction: (nonnull NSString *)recipient
                  amount: (nonnull NSNumber *)amount
                  fee_rate: (nonnull NSNumber *)fee_rate
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(sendTransaction: (nonnull NSString *)psbt_base64
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getTransactions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listUnspent:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
