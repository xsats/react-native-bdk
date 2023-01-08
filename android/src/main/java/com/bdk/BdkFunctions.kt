package io.bdk

import android.util.Log
import org.bitcoindevkit.*
import java.io.FileDescriptor
import org.bitcoindevkit.Wallet as BdkWallet

object BdkFunctions {
    private lateinit var wallet: BdkWallet
    private lateinit var blockchain: Blockchain
    const val TAG = "BDK-F"
    private val databaseConfig = DatabaseConfig.Memory
    val defaultBlockChainConfigUrl = "ssl://electrum.blockstream.info:60002"
    val defaultBlockChain = "ELECTRUM"
    private var defaultBlockchainConfig =
        BlockchainConfig.Electrum(
            ElectrumConfig(defaultBlockChainConfigUrl, null, 5u, null, 10u)
        )
    private var nodeNetwork = Network.TESTNET

    object ProgressLog : Progress {
        override fun update(progress: Float, message: String?) {
            Log.i(progress.toString(), "Progress Log")
        }
    }

    //Init wallet
    init {
        initWallet()
    }

    // Default wallet for initialization, which must be replaced with custom wallet for personal
    // use
    private fun initWallet(): BdkWallet {
        val network = setNetwork();
        // Todo - handle optional mnemonic
        val walletMnemonic = Mnemonic.fromString("forget odor toilet donkey radio offer law scatter ahead hidden soup limit")

        val bip32RootKey = DescriptorSecretKey(
            network,
            walletMnemonic,
          null
        )

        val descriptor = createDefaultDescriptor(bip32RootKey.asString())
        val changeDescriptor = createChangeDescriptorFromDescriptor(descriptor)

        this.wallet = BdkWallet(
          descriptor,
          changeDescriptor,
          network,
          databaseConfig
        )
        return this.wallet
    }

   fun createWallet(
        mnemonic: String = "", password: String?, network: String?,
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockChainName: String?, descriptor: String = ""
    ): Map<String, Any?> {
        try {
            var networkName: Network = setNetwork(network);
            val walletMnemonic: Mnemonic = Mnemonic.fromString(mnemonic)

            val bip32RootKey: DescriptorSecretKey = DescriptorSecretKey(
                network = networkName,
                mnemonic = walletMnemonic,
                password = password
            )

            val descriptor: String = createDefaultDescriptor(bip32RootKey.asString())
            val changeDescriptor: String = createChangeDescriptorFromDescriptor(descriptor)

            createBlockchainConfig(
              blockChainConfigUrl,
              blockChainSocket5,
              retry,
              timeOut,
              blockChainName
            )
            this.wallet = BdkWallet(
              descriptor,
              changeDescriptor,
              networkName,
              databaseConfig
            )

            val responseObject = mutableMapOf<String, Any?>()
            responseObject["address"] = getNewAddress()
            return responseObject

        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun getNewAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.NEW)
            return addressInfo.address
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun resetWallet(): Boolean {
        try {
            wallet.destroy()
            return true
        } catch (error: Throwable) {
            throw(error)
        }
    }

    fun getLastUnusedAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.LAST_UNUSED)
            return addressInfo.address
        } catch (error: Throwable) {
            throw(error)
        }
    }
    // Bitcoin js functions
    private fun createDefaultDescriptor(xprv: String): String {
        return "wpkh(" + xprv + "/84'/1'/0'/0/*)"
    }

    private fun createChangeDescriptorFromDescriptor(descriptor: String): String {
        return descriptor.replace("/84'/1'/0'/0/*", "/84'/1'/0'/1/*")
    }

    fun syncWallet(): Unit {
        this.blockchain = Blockchain(defaultBlockchainConfig)
        this.wallet.sync(this.blockchain, ProgressLog)
    }

    private fun createBlockchainConfig(
        blockChainConfigUrl: String, blockChainSocket5: String?,
        retry: String?, timeOut: String?, blockchain: String?
    ) {
      try {
        val updatedConfig: BlockchainConfig;
        val _blockChainName = if (blockchain != "") blockchain else defaultBlockChain;
        val _blockChainUrl = if (blockChainConfigUrl != "") blockChainConfigUrl else defaultBlockChainConfigUrl;
        val _socks = if (blockChainSocket5 != "") blockChainSocket5 else null;
        when (_blockChainName) {
          "ELECTRUM" -> updatedConfig = BlockchainConfig.Electrum(
            ElectrumConfig(
              _blockChainUrl,
              null, 5u, null, 10u
            )
          )
          "ESPLORA" -> updatedConfig = BlockchainConfig.Esplora(
            EsploraConfig(
              _blockChainUrl,
              _socks,
              retry?.toUByte() ?: 5u,
              timeOut?.toULong() ?: 5u,
              10u
            )
          )
          else -> {
            updatedConfig = this.defaultBlockchainConfig
          }
        }
        this.defaultBlockchainConfig = updatedConfig as BlockchainConfig.Electrum
      } catch (e: Throwable){
        throw e
      }
    }

    fun setNetwork(networkStr: String? = "testnet"): Network {
        return when (networkStr) {
            "testnet" -> Network.TESTNET
            "bitcoin" -> Network.BITCOIN
            "regtest" -> Network.REGTEST
            "signet" -> Network.SIGNET
            else -> {
                Network.TESTNET
            }
        }
    }
}
