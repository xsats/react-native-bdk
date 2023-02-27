#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BdkModule, NSObject)

//MARK: Keys methods
RCT_EXTERN_METHOD(generateMnemonic: (nonnull NSNumber *)wordCount
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createDescriptorSecret: (nonnull NSString*)network
                  mnemonic:(nonnull NSString *)mnemonic
                  password:(nonnull NSString *)password
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorSecretDerive: (nonnull NSString*)path
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorSecretExtend: (nonnull NSString*)path
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorSecretAsPublic:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorSecretAsSecretBytes:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createDescriptorPublic: (nonnull NSString*)publicKey
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorPublicDerive: (nonnull NSString*)path
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(descriptorPublicExtend: (nonnull NSString*)path
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Blockchain methods
RCT_EXTERN_METHOD(initElectrumBlockchain: (nonnull NSString*)url
                  retry: (nonnull NSString *)retry
                  timeout: (nonnull NSString *)timeout
                  stopGap: (nonnull NSString *)stopGap
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(initEsploraBlockchain: (nonnull NSString*)url
                  proxy: (nonnull NSString *)proxy
                  concurrency: (nonnull NSString *)concurrency
                  stopGap: (nonnull NSString *)stopGap
                  timeout: (nonnull NSString *)timeout
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBlockchainHeight:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBlockHash: (nonnull NSNumber*)height
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

//MARK: Wallet methods
RCT_EXTERN_METHOD(initWallet: (nonnull NSString*)mnemonic
                  password:(nonnull NSString *)password
                  descriptor:(nonnull NSString *)descriptor
                  network:(nonnull NSString *)network
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(loadWallet: (nonnull NSString*)mnemonic
                  password:(nonnull NSString *)password
                  network:(nonnull NSString *)network
                  blockchainConfigUrl:(nonnull NSString *)blockchainConfigUrl
                  blockchainSocket5:(nonnull NSString *)blockchainSocket5
                  retry:(nonnull NSString *)retry
                  timeout:(nonnull NSString *)timeout
                  blockchainName:(nonnull NSString *)blockchainName
                  descriptor:(nonnull NSString *)descriptor
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNetwork:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(syncWallet:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getBalance:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getAddress: (nonnull NSString*)indexType
                  index: (nonnull NSNumber *)index
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(createTransaction: (nonnull NSString *)recipient
                  amount: (nonnull NSNumber *)amount
                  fee_rate: (nonnull NSNumber *)fee_rate
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(sendTransaction: (nonnull NSString *)psbt_base64
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listTransactions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(listUnspent:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
