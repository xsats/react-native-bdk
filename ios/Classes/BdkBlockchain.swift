//
//  BdkBlockchain.swift
//  react-native-bdk
//

import Foundation

class BdkBlockchain: NSObject {
    var blockchain: Blockchain?
    var blockchainConfig: BlockchainConfig?
    let defaultBlockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(
            url: "ssl://electrum.blockstream.info:60002",
            socks5: nil,
            retry: 5,
            timeout: nil,
            stopGap: 10
        ))

    init(serverUrl: String?) throws {
        super.init()
        do {
            try setConfig(serverUrl: serverUrl ?? "ssl://electrum.blockstream.info:60002")
        } catch {
            throw error
        }
    }

    func setConfig(serverUrl: String? = "ssl://electrum.blockstream.info:60002") throws {
        do {
            blockchainConfig = BlockchainConfig.electrum(
                config: ElectrumConfig(url: serverUrl!, socks5: nil, retry: 5, timeout: nil, stopGap: 10))
            blockchain = try Blockchain(config: defaultBlockchainConfig)
        } catch {
            print("Error: \(error)")
            throw error
        }
    }

    private func createBlockchainConfig(
        serverUrl: String?, socks5: String?,
        retry: Int?, timeout: Int?, name: BlockchainType
    ) -> BlockchainConfig {
        if serverUrl == nil { return defaultBlockchainConfig }

        let socks5 = socks5 ?? nil

        switch name {
        case .Electrum: return BlockchainConfig.electrum(config:
                ElectrumConfig(
                    url: serverUrl!,
                    socks5: socks5,
                    retry: UInt8(retry ?? 5),
                    timeout: UInt8(timeout ?? 0),
                    stopGap: 10
                )
            )
        case .Esplora: return BlockchainConfig.esplora(config:
                EsploraConfig(
                    baseUrl: serverUrl!,
                    proxy: nil,
                    concurrency: UInt8(retry ?? 5),
                    stopGap: UInt64(timeout ?? 5),
                    timeout: UInt64(timeout ?? 5)
                )
            )
        default: return defaultBlockchainConfig
        }
    }

    func broadcast(psbt: PartiallySignedTransaction) throws {
        try blockchain?.broadcast(psbt: psbt)
    }
}
