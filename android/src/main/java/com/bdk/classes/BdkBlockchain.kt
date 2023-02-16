package com.bdk.classes

import com.bdk.ServerType
import com.bdk.getServerType
import org.bitcoindevkit.*

class BdkBlockchain {
  companion object {
    private val defaultServerUrl = "ssl://electrum.blockstream.info:60002"
  }

  var blockchain: Blockchain
  private var blockchainConfig: BlockchainConfig

  private var defaultBlockchainConfig =
    BlockchainConfig.Electrum(
      ElectrumConfig(defaultServerUrl, null, 10u, null, 10u)
    )

  @Throws(Exception::class)
  constructor(
    serverUrl: String = defaultServerUrl,
    type: ServerType? = ServerType.Electrum,
    socks5: String? = "",
    retry: String? = null,
    timeout: String? = null,
    stopGap: String? = null,
    proxy: String? = null,
    concurrency: String? = null
  ) {
    try {
      blockchainConfig = createBlockchainConfig(
        type = type ?: ServerType.Electrum,
        serverUrl = serverUrl,
        retry = retry,
        timeout = timeout,
        stopGap = stopGap,
        proxy = proxy,
        concurrency = concurrency
      )
      blockchain = Blockchain(blockchainConfig)
    } catch (e: Exception) {
      throw e
    }
  }

  fun createBlockchainConfig(
    type: ServerType,
    serverUrl: String? = defaultServerUrl,
    retry: String?,
    timeout: String?,
    stopGap: String? = null,
    proxy: String? = null,
    concurrency: String? = null
  ): BlockchainConfig {
    val url = serverUrl ?: return defaultBlockchainConfig

    return when (type) {
      ServerType.Electrum -> BlockchainConfig.Electrum(
        ElectrumConfig(
          url = url,
          socks5 = null,
          retry = retry?.toUByteOrNull() ?: 5u,
          timeout = timeout?.toUByteOrNull(),
          stopGap = stopGap?.toULongOrNull() ?: 10u
        )
      )
      ServerType.Esplora -> BlockchainConfig.Esplora(
        EsploraConfig(
          baseUrl = url,
          proxy = proxy,
          concurrency = concurrency?.toUByteOrNull(),
          stopGap = stopGap?.toULongOrNull() ?: 10u,
          timeout = timeout?.toULongOrNull() ?: 10u
        )
      )
      else -> defaultBlockchainConfig
    }
  }

  @Throws(Exception::class)
  fun getHeight(): Int {
    return try {
      blockchain.getHeight().toInt()
    } catch (e: Exception) {
      throw e
    }
  }

  @Throws(Exception::class)
  fun getBlockHash(height: Int): String {
    return try {
      blockchain.getBlockHash(height.toUInt())
    } catch (e: Exception) {
      throw e
    }
  }

  @Throws(Exception::class)
  fun broadcast(psbt: PartiallySignedTransaction) {
    try {
      blockchain.broadcast(psbt)
    } catch (error: Exception) {
      throw error
    }
  }
}
