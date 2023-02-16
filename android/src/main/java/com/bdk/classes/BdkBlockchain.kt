package com.bdk.classes

import com.bdk.ServerType
import com.bdk.getServerType
import org.bitcoindevkit.*

class BdkBlockchain(serverUrl: String) {
  var blockchain: Blockchain
  private var blockchainConfig: BlockchainConfig

  private var defaultBlockchainConfig =
    BlockchainConfig.Electrum(
      ElectrumConfig(serverUrl, null, 10u, null, 10u)
    )

  init {
    try {
      blockchainConfig = BlockchainConfig.Electrum(ElectrumConfig(serverUrl, null, 5u, null, 10u))
      blockchain = Blockchain(blockchainConfig)
    } catch (error: Exception) {
      throw error
    }
  }

  fun setConfig(
    blockchainConfigUrl: String?, blockchainSocket5: String?,
    retry: String?, timeout: String?, blockchainName: String?
  ): BlockchainConfig {
    try {
      val serverType = getServerType(blockchainName)
      val serverUrl = if (blockchainConfigUrl != "") blockchainConfigUrl else "ssl://electrum.blockstream.info:60002"
      val socks5 = if (blockchainSocket5 != "") blockchainSocket5 else null
      return when (serverType) {
        ServerType.Electrum -> BlockchainConfig.Electrum(
          ElectrumConfig(
            serverUrl!!,
            null, 5u, null, 10u
          )
        )
        ServerType.Esplora -> BlockchainConfig.Esplora(
          EsploraConfig(
            serverUrl!!,
            socks5,
            retry?.toUByte() ?: 5u,
            timeOut?.toULong() ?: 5u,
            10u
          )
        )
        else -> {
          defaultBlockchainConfig
        }
      }
    } catch (e: Throwable){
      throw e
    }
  }

  fun broadcast(psbt: PartiallySignedTransaction) {
    try {
      blockchain.broadcast(psbt)
    } catch (error: Exception) {
      throw error
    }
  }
}
