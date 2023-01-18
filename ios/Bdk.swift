import Foundation

@objc(BdkModule)
class Bdk: NSObject {
  let Wallet = BdkWallet()
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

  // TODO function should return wallet properties e.g. fingerprint + (some of?) descriptor
  @objc
  func createWallet(
    _ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let responseObject = try Wallet.createWallet()
      resolve(responseObject)
    } catch let error {
      reject("Create wallet error", error.localizedDescription, error)
    }
  }

  @objc
  func importWallet(
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
      let responseObject = try Wallet.importWallet(
        mnemonic: mnemonic, password: password, network: network,
        blockchainConfigUrl: blockchainConfigUrl, blockchainSocket5: blockchainSocket5,
        retry: retry, timeOut: timeOut, blockchainName: blockchainName, descriptor: descriptor)
      resolve(responseObject)
    } catch {
      reject("Import wallet error", error.localizedDescription, error)
    }
  }

  // @objc
  //  func destroyWallet(_ resolve: @escaping RCTPromiseResolveBlock,
  //                     reject: @escaping RCTPromiseRejectBlock)) {
  //    do {
  //      let responseObject = try Wallet.destroyWallet()
  //      resolve(nil, responseObject)
  //    } catch {
  //      reject("Destroy wallet error", error.localizedDescription, error)
  //    }
  //  }

  @objc
  func getNewAddress(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let responseObject = try Wallet.getNewAddress()
      resolve(responseObject)
    } catch {
      reject("Get new address error", error.localizedDescription, error)
    }
  }

  @objc
  func getLastUnusedAddress(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let responseObject = try Wallet.getLastUnusedAddress()
      resolve(responseObject)
    } catch {
      reject("Get last unused address error", error.localizedDescription, error)
    }
  }

  @objc
  func syncWallet(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      try Wallet.sync()
      resolve("Wallet sync complete")
    } catch {
      reject("Wallet sync error", error.localizedDescription, error)
    }
  }

  @objc
  func setBlockchain(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      try Wallet.setBlockchain()
      resolve("Blockchain set")
    } catch {
      reject("Set blockchain error", error.localizedDescription, error)
    }
  }

  @objc
  func isBlockchainSet(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    resolve(Wallet.isBlockchainSet())
  }

  @objc
  func getBalance(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let balance = try Wallet.getBalance()
      resolve(balance)
    } catch {
      reject("Get balance error", error.localizedDescription, error)
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
    do {
      let response = try Wallet.createTransaction(
        recipient: recipient, amount: amount, feeRate: fee_rate)
      resolve(response.asJson)
    } catch {
      reject("Create tx error", error.localizedDescription, error)
    }
  }

  //  @objc
  //  func signTransaction(_
  //    psbt_base64: String,
  //    resolve: @escaping RCTPromiseResolveBlock,
  //    reject: @escaping RCTPromiseRejectBlock)
  //   {
  //    do {
  //      let signedTransaction = try Wallet.signTransaction(transaction: transaction)
  //      resolve(signedTransaction.asJson)
  //    } catch {
  //      reject("Set blockchain error", error.localizedDescription, error)
  //    }
  //  }

  @objc
  func sendTransaction(
    _ psbt_base64: String, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let psbt = try PartiallySignedTransaction(psbtBase64: psbt_base64)
      let broadcastResult = try Wallet.sendTransaction(psbt)
      resolve(broadcastResult.asfinalJson)
    } catch {
      reject("Send (sign + broadcast) tx error", error.localizedDescription, error)
    }
  }

  @objc
  func getTransactions(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let response = try Wallet.getTransactions()
      resolve(response.map { $0.asJson })
    } catch {
      reject("Get txs error", error.localizedDescription, error)
    }
  }

  @objc
  func listUnspent(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    do {
      let response = try Wallet.listLocalUnspent()
      resolve(response.map { $0.asJson })
    } catch {
      reject("List unspent error", error.localizedDescription, error)
    }
  }
}
