import Foundation

enum BdkErrors: String {
  case init_wallet_config = "init_wallet_config"
  case already_init = "already_init"
  case import_wallet_failed = "import_wallet_failed"
  case destroy_wallet_failed = "destroy_wallet_failed"
  case get_new_address_failed = "get_new_address_failed"
  case get_last_unused_address_failed = "get_last_unused_address_failed"
  case sync_wallet_failed = "sync_wallet_failed"
  case get_balance_failed = "get_balance_failed"
  case set_blockchain_failed = "set_blockchain_failed"
  case create_tx_failed = "create_tx_failed"
  case send_tx_failed = "send_tx_failed"
  case get_txs_failed = "get_txs_failed"
  case list_unspent_failed = "list_unspent_failed"
}

enum EventTypes: String, CaseIterable {
  case bdk_log = "bdk_log"
  case native_log = "native_log"
}

@objc(BdkModule)
class Bdk: NSObject {
  lazy var keys = { BdkKeys() }()
  var wallet: BdkWallet?

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

  // TODO function should return wallet properties e.g. fingerprint + (some of?) descriptor
  @objc
  func initWallet(
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

      try wallet = BdkWallet()

      guard let wallet = wallet else {
        return handleReject(reject, .init_wallet_config)
      }

      let responseObject = try wallet.initWallet(
        mnemonic: mnemonic, password: password, network: network,
        blockchainConfigUrl: blockchainConfigUrl, blockchainSocket5: blockchainSocket5,
        retry: retry, timeOut: timeOut, blockchainName: blockchainName, descriptor: descriptor)
      resolve(responseObject)
    } catch {
      return handleReject(reject, BdkErrors.import_wallet_failed, error, "Import wallet error")
    }
  }

  // @objc
  //  func destroyWallet(_ resolve: @escaping RCTPromiseResolveBlock,
  //                     reject: @escaping RCTPromiseRejectBlock)) {
  //    do {
  //      let responseObject = try wallet.destroyWallet()
  //      resolve(nil, responseObject)
  //    } catch {
  //      return handleReject(reject, BdkErrors.destroy_wallet_failed, error, "Destroy wallet error")
  //    }
  //  }

  @objc
  func getNewAddress(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let wallet = wallet else {
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let responseObject = try wallet.getNewAddress()
      resolve(responseObject)
    } catch {
      return handleReject(reject, BdkErrors.get_new_address_failed, error, "Get new address error")
    }
  }

  @objc
  func getLastUnusedAddress(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let wallet = wallet else {
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let responseObject = try wallet.getLastUnusedAddress()
      resolve(responseObject)
    } catch {
      return handleReject(
        reject, BdkErrors.get_last_unused_address_failed, error, "Get last unused address error")
    }
  }

  @objc
  func syncWallet(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let wallet = wallet else {
      return handleReject(reject, .init_wallet_config)
    }
    do {
      try wallet.sync()
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
      try wallet?.setBlockchain()
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
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let balance = try wallet.getBalance()
      resolve(balance)
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
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let response = try wallet.createTransaction(
        recipient: recipient, amount: amount, feeRate: fee_rate)
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
  //        return handleReject(reject, .init_wallet_config)
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
    guard let wallet = wallet else {
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let psbt = try PartiallySignedTransaction(psbtBase64: psbt_base64)
      let broadcastResult = try wallet.sendTransaction(psbt)
      resolve(broadcastResult.asfinalJson)
    } catch {
      return handleReject(
        reject, BdkErrors.send_tx_failed, error, "Send (sign + broadcast) tx error")
    }
  }

  @objc
  func getTransactions(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let wallet = wallet else {
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let response = try wallet.getTransactions()
      resolve(response.map { $0.asJson })
    } catch {
      return handleReject(
        reject, BdkErrors.get_txs_failed, error, "Send (sign + broadcast) tx error")
    }
  }

  @objc
  func listUnspent(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let wallet = wallet else {
      return handleReject(reject, .init_wallet_config)
    }
    do {
      let response = try wallet.listLocalUnspent()
      resolve(response.map { $0.asJson })
    } catch {
      return handleReject(reject, BdkErrors.list_unspent_failed, error, "List unspent error")
    }
  }
}

//MARK: Singleton react native event emitter
@objc(BdkEventEmitter)
class BdkEventEmitter: RCTEventEmitter {
  public static var shared: BdkEventEmitter!

  override init() {
    super.init()
    BdkEventEmitter.shared = self
  }

  public func send(withEvent eventType: EventTypes, body: Any) {
    //TODO convert all bytes to hex here
    sendEvent(withName: eventType.rawValue, body: body)
  }

  override func supportedEvents() -> [String] {
    return EventTypes.allCases.map { $0.rawValue }
  }
}
