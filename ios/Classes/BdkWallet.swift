//
//  BdkWallet.swift
//  react-native-bdk
//

import Foundation

class BdkWallet: NSObject {
    lazy var logger = ProgressLogger()

    var wallet: Wallet

    var blockchainConfig: BlockchainConfig?
    var blockchain: Blockchain?

    let externalDescriptor: String
    let internalDescriptor: String

    init(
        externalDescriptor: String,
        internalDescriptor: String,
        network: Network?
    ) throws {
        do {
            let database = DatabaseConfig.memory
            wallet = try Wallet(
                descriptor: externalDescriptor,
                changeDescriptor: internalDescriptor,
                network: network ?? Network.testnet,
                databaseConfig: database
            )
            self.externalDescriptor = externalDescriptor
            self.internalDescriptor = internalDescriptor
        } catch {
            throw error
        }
    }

    func getNetwork() -> Network {
        return wallet.network()
    }

    func sync(blockchain: BdkBlockchain) throws {
        try wallet.sync(blockchain: blockchain.blockchain, progress: logger)
    }

    func getBalance() throws -> Balance {
        return try wallet.getBalance()
    }

    func getAddress(_ addressIndex: AddressIndex) throws -> AddressInfo {
        return try wallet.getAddress(addressIndex: addressIndex)
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
                .finish(wallet: wallet)
        } catch {
            print("Error: \(error)")
            throw error
        }
    }

    func signTransaction(_ psbt: PartiallySignedTransaction) throws {
        let _ = try wallet.sign(psbt: psbt)
    }

    func listTransactions() throws -> [TransactionDetails] {
        return try wallet.listTransactions()
    }

    func listLocalUnspent() throws -> [LocalUtxo] {
        return try wallet.listUnspent()
    }
}

class ProgressLogger: Progress {
    func update(progress: Float, message: String?) {
        print("Sync wallet: \(progress)")
    }
}
