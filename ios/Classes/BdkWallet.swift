//
//  BdkWallet.swift
//  react-native-bdk
//

import Foundation

class BdkWallet: NSObject {
  lazy var logger = {ProgressLogger()}()
    
  var wallet: Wallet?

    var blockchainConfig: BlockchainConfig?
    var blockchain: Blockchain?
    
    init (serverUrl: String? = "ssl://electrum.blockstream.info:60002") throws {
        super.init()
        do {
            blockchain = try setBlockchain(serverUrl: serverUrl)!
        } catch {
            throw error
        }
    }

  private func initialize(
    externalDescriptor: String,
    internalDescriptor: String
  ) throws {
    do {
      let database = DatabaseConfig.memory
      self.wallet = try Wallet.init(
        descriptor: externalDescriptor,
        changeDescriptor: internalDescriptor,
        network: Network.testnet,
        databaseConfig: database)
    } catch {
      throw error
    }
  }

  func setBlockchain(serverUrl: String? = "ssl://electrum.blockstream.info:60002") throws -> Blockchain? {
    do {
      blockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(url: serverUrl!, socks5: nil, retry: 5, timeout: nil, stopGap: 10))
        blockchain = try Blockchain.init(config: blockchainConfig!)
        return blockchain
    } catch {
      print("Error: \(error)")
        throw error
    }
  }

  private func createExternalDescriptor(_ rootKey: DescriptorSecretKey) throws -> String {
    do {
      let externalPath = try DerivationPath(path: "m/84h/1h/0h/0")
      return "wpkh(\(try rootKey.extend(path: externalPath).asString()))"
    } catch {
      throw error
    }
  }

  private func createInternalDescriptor(_ rootKey: DescriptorSecretKey) throws -> String {
    let internalPath = try DerivationPath(path: "m/84h/1h/0h/1")
    return "wpkh(\(try rootKey.extend(path: internalPath).asString()))"
  }

  private func createInternalDescriptorFromExternal(_ descriptor: String) throws -> String {
    return descriptor.replacingOccurrences(of: "m/84h/1h/0h/0", with: "m/84h/1h/0h/1")
  }

  func loadWallet(
    mnemonic: String = "", password: String?, network: String?,
    blockchainConfigUrl: String, blockchainSocket5: String?,
    retry: String?, timeOut: String?, blockchainName: String?, descriptor: String = ""
  ) throws -> [String: Any?] {
    do {
        let externalDescriptor: String
        let internalDescriptor: String
        if(!mnemonic.isEmpty){
            let mnemonicObj = try Mnemonic.fromString(mnemonic: mnemonic)
            let bip32RootKey = DescriptorSecretKey(
                network: getNetwork(networkStr: network),
                mnemonic: mnemonicObj,
                password: password
            )
            externalDescriptor = try createExternalDescriptor(bip32RootKey)
            internalDescriptor = try createInternalDescriptor(bip32RootKey)
        } else {
            externalDescriptor = descriptor
            internalDescriptor = try createInternalDescriptorFromExternal(descriptor)
        }
            try initialize(
                externalDescriptor: externalDescriptor,
                internalDescriptor: internalDescriptor
            )
            // Repository.saveWallet(path, externalDescriptor, internalDescriptor)
            // Repository.saveMnemonic(mnemonic.toString())
            var responseObject = [String: Any?]()
            responseObject["descriptor_external"] = externalDescriptor
            responseObject["descriptor_internal"] = internalDescriptor
            responseObject["address_external_zero"] = try getNewAddress()
            return responseObject

    } catch { 
      throw error
    }
  }

  //    func unloadWallet() -> Bool {
  //        do {
  //            try wallet.destroy()
  //            return true
  //        } catch {
  //            print("Error: \(error)")
  //            return false
  //        }
  //    }

  // .finish() returns TxBuilderResult = Result<(Psbt, TransactionDetails), Error>
  func createTransaction(recipient: String, amount: NSNumber, feeRate: NSNumber) throws
    -> TxBuilderResult
  {
    do {
      let longAmt = UInt64(truncating: amount)
      let floatFeeRate = Float(truncating: feeRate)
      let scriptPubkey = try Address(address: recipient).scriptPubkey()

      return try TxBuilder()
        .addRecipient(script: scriptPubkey, amount: longAmt)
        .feeRate(satPerVbyte: floatFeeRate)
        .finish(wallet: wallet!)
    } catch {
      print("Error: \(error)")
      throw error
    }
  }

  private func signTransaction(_ psbt: PartiallySignedTransaction) throws {
      let _ = try wallet?.sign(psbt: psbt)
  }

  func sendTransaction(_ psbt: PartiallySignedTransaction) throws -> PartiallySignedTransaction {
    do {
      try signTransaction(psbt)
        try blockchain!.broadcast(psbt: psbt)
      return psbt
    } catch {
      print("Error: \(error)")
      throw error
    }
  }

  func getTransactions() throws -> [TransactionDetails] {
      return try wallet!.listTransactions()
  }

  func listLocalUnspent() throws -> [LocalUtxo] {
    return try wallet!.listUnspent()
  }

  func sync() throws {
      try wallet!.sync(blockchain: blockchain!, progress: logger)
  }

  func getBalance() throws -> UInt64 {
      return try wallet!.getBalance().total
  }
    
    func getAddress(_ addressIndex: AddressIndex) throws -> AddressInfo {
        return try wallet!.getAddress(addressIndex: addressIndex)
    }

  func getNetwork(networkStr: String? = "testnet") -> Network {
    switch networkStr {
    case "testnet":
      return Network.testnet
    case "bitcoin":
      return Network.bitcoin
    case "regtest":
      return Network.regtest
    case "signet":
      return Network.signet
    default:
      return Network.testnet
    }
  }
}

class ProgressLogger: Progress {
    func update(progress: Float, message: String?) {
      print("Sync wallet: \(progress)")
    }
}
