import Foundation

let TAG = "BDK"

@objc(Bdk)
class Bdk: NSObject {
    let bdkFunctions = BdkFunctions()
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    func createWallet(_
        mnemonic: String? = nil,
        password: String? = nil,
        network: String? = nil,
        blockChainConfigUrl: String? = nil,
        blockChainSocket5: String? = nil,
        retry: String? = nil,
        timeOut: String? = nil,
        blockChainName: String? = nil,
        descriptor: String? = nil,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let responseObject = try bdkFunctions.createWallet(
                mnemonic: mnemonic,
                password: password,
                network: network,
                blockChainConfigUrl: blockChainConfigUrl,
                blockChainSocket5: blockChainSocket5,
                retry: retry,
                timeOut: timeOut,
                blockChainName: blockChainName,
                descriptor: descriptor
            )
            resolve(responseObject)
        } catch let error {
            reject("Init Wallet Error", error.localizedDescription, error)
        }
    }

    @objc
    func getNewAddress(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        let address = bdkFunctions.getNewAddress()
        return resolve(address)
    }
    
    @objc
    func syncWallet(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        bdkFunctions.syncWallet()
        return resolve("wallet sync complete")
    }

}


