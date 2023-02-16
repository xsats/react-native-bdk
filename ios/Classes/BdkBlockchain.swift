//
//  BdkBlockchain.swift
//  react-native-bdk
//

import Foundation

// TODO: should be privacy preserving by default
let defaultServerUrl = "ssl://electrum.blockstream.info:60002"
let defaultBlockchainConfig = BlockchainConfig.electrum(
    config: ElectrumConfig(
        url: defaultServerUrl,
        socks5: nil,
        retry: 5,
        timeout: nil,
        stopGap: 10
    ))

func createBlockchainConfig(
    type: ServerType, serverUrl: String? = defaultServerUrl,
    retry: String?, timeout: String?, stopGap: String? = nil, proxy: String? = nil, concurrency: String? = nil
) -> BlockchainConfig {
    guard let url = serverUrl else {
        return defaultBlockchainConfig
    }

    switch type {
    case .Electrum: return BlockchainConfig.electrum(config:
            ElectrumConfig(
                url: url,
                socks5: nil,
                retry: UInt8(retry ?? "") ?? 5,
                timeout: UInt8(timeout ?? ""),
                stopGap: UInt64(stopGap ?? "") ?? 10
            )
        )
    case .Esplora: return BlockchainConfig.esplora(config:
            EsploraConfig(
                baseUrl: url,
                proxy: proxy,
                concurrency: UInt8(concurrency ?? ""),
                stopGap: UInt64(stopGap ?? "") ?? 10,
                timeout: UInt64(timeout ?? "") ?? 10
            )
        )
    default: return defaultBlockchainConfig
    }
}

class BdkBlockchain: NSObject {
    var blockchain: Blockchain
    private var _blockchainConfig: BlockchainConfig

    init(serverUrl: String = defaultServerUrl, type: ServerType? = ServerType.Electrum, socks5: String? = "", retry: String? = nil, timeout: String? = nil, stopGap: String? = nil, proxy: String? = nil, concurrency: String? = nil) throws {
        do {
            _blockchainConfig = createBlockchainConfig(type: type ?? ServerType.Electrum, serverUrl: serverUrl, retry: retry, timeout: timeout)
            blockchain = try Blockchain(config: _blockchainConfig)
        } catch {
            throw error
        }
    }

    func getHeight() throws -> UInt32 {
        do {
            return try blockchain.getHeight()
        } catch {
            throw error
        }
    }

    func getBlockHash(height: NSNumber) throws -> String {
        do {
            return try blockchain.getBlockHash(height: UInt32(truncating: height))
        } catch {
            throw error
        }
    }

    func setConfig(serverUrl: String? = "ssl://electrum.blockstream.info:60002") throws {
        do {
            _blockchainConfig = BlockchainConfig.electrum(
                config: ElectrumConfig(url: serverUrl!, socks5: nil, retry: 5, timeout: nil, stopGap: 10))
            blockchain = try Blockchain(config: _blockchainConfig)
        } catch {
            print("Error: \(error)")
            throw error
        }
    }

    func broadcast(psbt: PartiallySignedTransaction) throws {
        try blockchain.broadcast(psbt: psbt)
    }
}
