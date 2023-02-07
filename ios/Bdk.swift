import Foundation

enum BdkErrors: String {
    case init_wallet_failed
    case already_init
    case init_blockchain_failed
    case load_wallet_failed
    case unload_wallet_failed
    case get_address_failed
    case sync_wallet_failed
    case get_balance_failed
    case set_blockchain_failed
    case create_tx_failed
    case send_tx_failed
    case get_txs_failed
    case list_unspent_failed
}

enum EventTypes: String, CaseIterable {
    case bdk_log
    case native_log
}

@objc(BdkModule)
class Bdk: NSObject {
    lazy var keys = BdkKeys()
    var wallet: BdkWallet?
    var blockchain: BdkBlockchain?

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    let constants: [String: Any] = ["count": 1]

    func getName() -> String {
        return "Bdk"
    }

    func getConstants() -> [String: Any] {
        return constants
    }

    @objc
    func generateMnemonic(
        _ wordCount: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let mnemonicStr = keys.generateMnemonic(wordCount)
        resolve(mnemonicStr)
    }

    @objc
    func loadWallet(
        _ mnemonic: String = "",
        password: String?,
        network: String?,
        blockchainConfigUrl: String,
        blockchainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockchainName: String?,
        descriptor: String = "",
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            guard wallet == nil else {
                return handleReject(reject, .already_init)
            }

            let networkObj = getNetwork(networkStr: network)
            // get descriptors
            let descriptors = try keys.setDescriptors(mnemonic, descriptor: descriptor, password: password, network: network)
            blockchain = try BdkBlockchain(serverUrl: blockchainConfigUrl)
            wallet = try BdkWallet(externalDescriptor: descriptors.externalDescriptor, internalDescriptor: descriptors.internalDescriptor, network: networkObj)

            guard let wallet = wallet else {
                return handleReject(reject, .init_wallet_failed)
            }

            var responseObject = [String: Any?]()
            responseObject["descriptor_external"] = wallet.externalDescriptor //  descriptors.externalDescriptor
            responseObject["descriptor_internal"] = wallet.internalDescriptor
            responseObject["address_external_zero"] = try wallet.getAddress(AddressIndex.new).address

            resolve(responseObject)
        } catch {
            return handleReject(reject, BdkErrors.load_wallet_failed, error, "Import wallet error")
        }
    }

    // @objc
    //  func unloadWallet(_ resolve: @escaping RCTPromiseResolveBlock,
    //                     reject: @escaping RCTPromiseRejectBlock)) {
    //    do {
    //      let responseObject = try wallet.unloadWallet()
    //      resolve(nil, responseObject)
    //    } catch {
    //      return handleReject(reject, BdkErrors.unload_wallet_failed, error, "Unload wallet error")
    //    }
    //  }

    @objc
    func getAddress(
        _ indexType: String,

        index: NSNumber?, // TODO: implement when Peek and Reset arrive
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet else {
            return handleReject(reject, .init_wallet_failed)
        }
        do {
            let addressIndex = getAddressIndex(indexVariant: indexType)
            resolve(try wallet.getAddress(addressIndex).asJson)
        } catch {
            return handleReject(reject, BdkErrors.get_address_failed, error, "Get address error")
        }
    }

    @objc
    func syncWallet(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet else {
            return handleReject(reject, .init_wallet_failed)
        }
        guard let blockchain = blockchain else {
            return handleReject(reject, .init_wallet_failed)
        }
        do {
            try wallet.sync(blockchain: blockchain)
            resolve("Wallet sync complete")
        } catch {
            return handleReject(reject, BdkErrors.sync_wallet_failed, error, "Wallet sync error")
        }
    }

    @objc
    func setBlockchain(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        do {
            let _ = try blockchain?.setConfig(serverUrl: "ssl://electrum.blockstream.info:60002")
            resolve("Blockchain set")
        } catch {
            return handleReject(reject, BdkErrors.set_blockchain_failed, error, "Set blockchain error")
        }
    }

    @objc
    func getBalance(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet else {
            return handleReject(reject, .init_wallet_failed)
        }
        do {
            let balance = try wallet.getBalance()
            resolve(balance.asJson)
        } catch {
            return handleReject(reject, BdkErrors.get_balance_failed, error, "Get balance error")
        }
    }

    @objc
    func createTransaction(
        _ recipient: String,
        amount: NSNumber,
        fee_rate: NSNumber,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet else {
            return handleReject(reject, .init_wallet_failed)
        }
        do {
            let response = try wallet.createTransaction(
                recipient: recipient, amount: amount, feeRate: fee_rate
            )
            resolve(response.asJson)
        } catch {
            return handleReject(reject, BdkErrors.create_tx_failed, error, "Create tx error")
        }
    }

    //  @objc
    //  func signTransaction(_
    //    psbt_base64: String,
    //    resolve: @escaping RCTPromiseResolveBlock,
    //    reject: @escaping RCTPromiseRejectBlock)
    //   {
    //    guard let wallet = wallet else {
    //        return handleReject(reject, .init_wallet_failed)
    //    }
    //    do {
    //      let signedTransaction = try wallet.signTransaction(transaction: transaction)
    //      resolve(signedTransaction.asJson)
    //    } catch {
    //      return handleReject(reject, BdkErrors.sign_transaction_failed, error, "Sign transaction error")
    //    }
    //  }

    @objc
    func sendTransaction(
        _ psbt_base64: String, resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet, let blockchain = blockchain else {
            if wallet == nil {
                return handleReject(reject, .init_wallet_failed)
            }
            return handleReject(reject, .init_blockchain_failed)
        }

        do {
            var psbt = try PartiallySignedTransaction(psbtBase64: psbt_base64)
            try wallet.signTransaction(psbt)
            try blockchain.broadcast(psbt: psbt)
            resolve(psbt.asfinalJson)
        } catch {
            return handleReject(
                reject, BdkErrors.send_tx_failed, error, "Send (sign + broadcast) tx error"
            )
        }
    }

    @objc
    func getTransactions(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet else {
            return handleReject(reject, .init_wallet_failed)
        }
        do {
            let response = try wallet.getTransactions()
            resolve(response.map { $0.asJson })
        } catch {
            return handleReject(
                reject, BdkErrors.get_txs_failed, error, "Send (sign + broadcast) tx error"
            )
        }
    }

    @objc
    func listUnspent(
        _ resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let wallet = wallet else {
            return handleReject(reject, .init_wallet_failed)
        }
        do {
            let response = try wallet.listLocalUnspent()
            resolve(response.map { $0.asJson })
        } catch {
            return handleReject(reject, BdkErrors.list_unspent_failed, error, "List unspent error")
        }
    }
}

// MARK: Singleton react native event emitter

@objc(BdkEventEmitter)
class BdkEventEmitter: RCTEventEmitter {
    public static var shared: BdkEventEmitter!

    override init() {
        super.init()
        BdkEventEmitter.shared = self
    }

    public func send(withEvent eventType: EventTypes, body: Any) {
        // TODO: convert all bytes to hex here
        sendEvent(withName: eventType.rawValue, body: body)
    }

    override func supportedEvents() -> [String] {
        return EventTypes.allCases.map { $0.rawValue }
    }
}
