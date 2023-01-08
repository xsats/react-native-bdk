//
//  BdkFunctions.swift
//  Bdk
//
//  Created by Ed Ball on 07/01/2023.
//

import Foundation
//import BitcoinDevKit

class BdkProgress: Progress {
    func update(progress: Float, message: String?) {
        print("progress", progress, message as Any)
    }
}

class BdkFunctions: NSObject {
    var wallet: Wallet
    var blockchain: Blockchain
    let databaseConfig = DatabaseConfig.memory
    let defaultBlockChainConfigUrl: String = "ssl://electrum.blockstream.info:60002"
    let defaultBlockChain = "ELECTRUM"
    var blockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(
            url: "ssl://electrum.blockstream.info:60002",
            socks5: nil,
            retry: 5,
            timeout: nil,
            stopGap: 10))
    let defaultNodeNetwork = "testnet"
    let defaultDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/0/*)"
    let defaultChangeDescriptor = "wpkh([c258d2e4/84h/1h/0h]tpubDDYkZojQFQjht8Tm4jsS3iuEmKjTiEGjG6KnuFNKKJb5A6ZUCUZKdvLdSDWofKi4ToRCwb9poe1XdqfUnP4jaJjCB2Zwv11ZLgSbnZSNecE/1/*)"


    override init() {
        self.blockchain = try! Blockchain(config: blockchainConfig)
        self.wallet = try! Wallet.init(descriptor: defaultDescriptor, changeDescriptor: defaultChangeDescriptor, network: Network.testnet, databaseConfig: databaseConfig)
    }


    func syncWallet() {
        try? self.wallet.sync(blockchain: Blockchain.init(config: blockchainConfig), progress: BdkProgress())
    }

    func setNetwork(networkStr: String?) -> Network {
        switch (networkStr) {
            case "testnet": return Network.testnet
            case "bitcoin": return Network.bitcoin
            case "regtest": return Network.regtest
            case "signet": return Network.signet
            default: return Network.testnet
        }
    }


    func createDefaultDescriptor(xprv: String) -> String {
        return ("wpkh(" + xprv + "/84'/1'/0'/0/*)")
    }

    func createChangeDescriptorFromDescriptor(descriptor: String) -> String {
        return descriptor.replacingOccurrences(of: "/84'/1'/0'/0/*", with: "/84'/1'/0'/1/*")
    }


    private func createBlockchainConfig(
        blockChainConfigUrl: String?, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?
    ) -> BlockchainConfig {
        let blockChainUrl =  blockChainConfigUrl != "" ? blockChainConfigUrl! :  defaultBlockChainConfigUrl;
        let socks5 = blockChainSocket5 != "" ? blockChainSocket5! :  nil;
        switch (blockChainName) {
        case "ELECTRUM": return BlockchainConfig.electrum(config:
                    ElectrumConfig(
                    url: blockChainUrl, socks5: socks5,
                    retry: UInt8(retry ?? "") ?? 5, timeout: UInt8(timeOut ?? "") ?? 5,
                    stopGap: 5
                )
            )
        case "ESPLORA": return BlockchainConfig.esplora(config:
                    EsploraConfig(
                    baseUrl: blockChainUrl, proxy: nil,
                    concurrency: UInt8(retry ?? "") ?? 5, stopGap: UInt64(timeOut ?? "") ?? 5,
                    timeout: 5
                )
            )
        default: return blockchainConfig

        }
    }

    func createWallet(
        mnemonic: String?,
        password: String? = nil,
        network: String?,
        blockChainConfigUrl: String?,
        blockChainSocket5: String?,
        retry: String?,
        timeOut: String?,
        blockChainName: String?,
        descriptor: String?
    ) throws -> [String: Any?] {
        do {

            let walletNetwork: Network = setNetwork(networkStr: network)
            // Todo - handle optional mnemonic
            let walletMnemonic: Mnemonic = try! Mnemonic.fromString(mnemonic: mnemonic!)

            let bip32RootKey = DescriptorSecretKey(
                network: walletNetwork,
                mnemonic: walletMnemonic,
                password: password
            )

            let descriptor: String = createDefaultDescriptor(xprv: bip32RootKey.asString())
            let changeDescriptor: String = createChangeDescriptorFromDescriptor(descriptor: descriptor)

            self.blockchainConfig = createBlockchainConfig(blockChainConfigUrl: blockChainConfigUrl, blockChainSocket5: blockChainSocket5, retry: retry, timeOut: timeOut, blockChainName: blockChainName != "" ? blockChainName : defaultBlockChain)

            self.wallet = try Wallet.init(
                descriptor: descriptor,
                changeDescriptor: changeDescriptor,
                network: walletNetwork,
                databaseConfig: databaseConfig)

            let addressInfo = try! self.wallet.getAddress(addressIndex: AddressIndex.new)
            let responseObject = ["address": addressInfo.address] as [String: Any]
            return responseObject
        } catch {
            throw error
        }
    }

    func getNewAddress() -> String {
        let addressInfo = try! self.wallet.getAddress(addressIndex: AddressIndex.new)
        return addressInfo.address
    }

}

