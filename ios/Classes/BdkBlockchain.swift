//
//  BdkBlockchain.swift
//  react-native-bdk
//

import Foundation

class BdkBlockchain: NSObject {
    var blockchain: Blockchain
    private var _blockchainConfig: BlockchainConfig
    static let defaultServerUrl = "ssl://electrum.blockstream.info:60002"
    let defaultBlockchainConfig = BlockchainConfig.electrum(
        config: ElectrumConfig(
            url: "ssl://electrum.blockstream.info:60002",
            socks5: nil,
            retry: 5,
            timeout: nil,
            stopGap: 10
        ))

    init(serverUrl: String = BdkBlockchain.defaultServerUrl) throws {
        do {
            _blockchainConfig = BlockchainConfig.electrum(
                config: ElectrumConfig(url: serverUrl, socks5: nil, retry: 5, timeout: nil, stopGap: 10))
            blockchain = try Blockchain(config: _blockchainConfig)
        } catch {
            throw error
        }
    }

    func initElectrum(
        url: String,
        retry: String?,
        stopGap: String?,
        timeOut: String?
    ) throws -> UInt32 {
        do {
            _blockchainConfig = BlockchainConfig.electrum(
                config: ElectrumConfig(
                    url: url,
                    socks5: nil,
                    retry: UInt8(retry ?? "") ?? 5,
                    timeout: UInt8(timeOut ?? "") ?? nil,
                    stopGap: UInt64(stopGap ?? "") ?? 10
                )
            )
            blockchain = try Blockchain(config: _blockchainConfig)
            return try blockchain.getHeight()
        } catch {
            throw error
        }
    }

    func initEsplora(
        url: String,
        proxy: String?,
        concurrency: String?,
        stopGap: String?,
        timeOut: String?
    ) throws -> UInt32 {
        do {
            _blockchainConfig = BlockchainConfig.esplora(
                config: EsploraConfig(
                    baseUrl: url,
                    proxy: nil,
                    concurrency: UInt8(concurrency ?? "") ?? nil,
                    stopGap: UInt64(stopGap ?? "") ?? 10,
                    timeout: UInt64(timeOut ?? "") ?? 10
                )
            )
            blockchain = try Blockchain(config: _blockchainConfig)
            return try blockchain.getHeight()
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
        try blockchain.broadcast(psbt: psbt)
    }
}
