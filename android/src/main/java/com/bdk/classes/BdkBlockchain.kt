package com.bdk.classes

import com.bdk.ServerType
import com.bdk.getServerType
import org.bitcoindevkit.*

class BdkBlockchain(serverUrl: String?) {
  lateinit var blockchain: Blockchain
  private lateinit var blockchainConfig: BlockchainConfig

  var defaultServerUrl = "ssl://electrum.blockstream.info:60002"
  private var defaultBlockchainConfig =
    BlockchainConfig.Electrum(
      ElectrumConfig(defaultServerUrl, null, 5u, null, 10u)
    )

  init {
    try {
      this.blockchainConfig = setConfig(serverUrl ?: "ssl://electrum.blockstream.info:60002", null, "5u", null, "Electrum")
      this.blockchain = Blockchain(config = blockchainConfig)
    } catch (error: Exception) {
      throw error
    }
  }

  fun setConfig(
    blockChainConfigUrl: String?, blockChainSocket5: String?,
    retry: String?, timeOut: String?, blockchainName: String?
  ): BlockchainConfig {
    try {
      val serverType = getServerType(blockchainName)
      val serverUrl = if (blockChainConfigUrl != "") blockChainConfigUrl else "ssl://electrum.blockstream.info:60002"
      val socks5 = if (blockChainSocket5 != "") blockChainSocket5 else null
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
