// h/t thunderbiscuit DevKit Wallet
// https://github.com/thunderbiscuit/devkit-wallet

package com.bdk.classes

import android.util.Log
import org.bitcoindevkit.*
import org.bitcoindevkit.Wallet

class BdkWallet {
    private lateinit var wallet: Wallet
    // private const val regtestEsploraUrl: String = "http://10.0.2.2:3002"
    private lateinit var blockchainConfig: BlockchainConfig
    private var blockchain: Blockchain

  @Throws(Exception::class)
  constructor(serverUrl: String? = "ssl://electrum.blockstream.info:60002") {
    try {
      blockchain = setBlockchain(serverUrl)
    } catch (error: Exception) {
      throw error
    }
  }

    object ProgressLogger: Progress {
        override fun update(progress: Float, message: String?) {
            Log.i(progress.toString(), "Sync wallet")
        }
    }

    private fun initialize(
        externalDescriptor: String,
        internalDescriptor: String,
    ) {
        val database = DatabaseConfig.Memory
        wallet = Wallet(
            externalDescriptor,
            internalDescriptor,
            // Network.REGTEST,
            Network.TESTNET,
            database,
        )
    }

    fun setBlockchain(serverUrl: String? = "ssl://electrum.blockstream.info:60002"): Blockchain {
        try {
            blockchainConfig = BlockchainConfig.Electrum(ElectrumConfig(serverUrl!!, null, 5u, null, 10u))
            // blockchainConfig = BlockchainConfig.Esplora(EsploraConfig(esploraUrl, null, 5u, 20u, 10u))
            blockchain = Blockchain(blockchainConfig)
          return blockchain
        } catch (error: Throwable) {
            throw(error)
        }

    }

    // only creates BIP84 compatible wallets TODO generalise for any descriptor type
    private fun createExternalDescriptor(rootKey: DescriptorSecretKey): String {
        val externalPath = DerivationPath("m/84h/1h/0h/0")
        return "wpkh(${rootKey.extend(externalPath).asString()})"
    }

    private fun createInternalDescriptor(rootKey: DescriptorSecretKey): String {
        val internalPath = DerivationPath("m/84h/1h/0h/1")
        return "wpkh(${rootKey.extend(internalPath).asString()})"
    }

    private fun getInternalDescriptorFromExternal(descriptor: String): String {
        return descriptor.replace("m/84h/1h/0h/0", "m/84h/1h/0h/1")
    }

    fun loadWallet(
        mnemonic: String = "", password: String?, network: String?,
        blockchainConfigUrl: String, blockchainSocket5: String?,
        retry: String?, timeOut: String?, blockchainName: String?, descriptor: String = ""
    ): Map<String, Any?> {
      val externalDescriptor: String
      val internalDescriptor: String
      if (!mnemonic.isNullOrEmpty()) {
        val mnemonicObj = Mnemonic.fromString(mnemonic)
        val bip32RootKey = DescriptorSecretKey(
          network = setNetwork(network),
          mnemonic = mnemonicObj,
          password = password
        )
        externalDescriptor = createExternalDescriptor(bip32RootKey)
        internalDescriptor = createInternalDescriptor(bip32RootKey)
      } else {
        // descriptor must be non null
        externalDescriptor = descriptor
        internalDescriptor = getInternalDescriptorFromExternal(externalDescriptor)
      }

        initialize(
            externalDescriptor = externalDescriptor,
            internalDescriptor = internalDescriptor,
        )
        val responseObject = mutableMapOf<String, Any?>()
        responseObject["descriptor_external"] = externalDescriptor
        responseObject["descriptor_internal"] = internalDescriptor
        responseObject["address_external_zero"] = getNewAddress()
        return responseObject
    }

    fun unloadWallet(): Boolean {
        try {
            wallet.destroy()
            return true
        } catch (error: Throwable) {
            return false
        }
    }

    // .finish() returns TxBuilderResult = Result<(Psbt, TransactionDetails), Error>
    fun createTransaction(recipient: String, amount: Double, feeRate: Float):  TxBuilderResult {
      try {
        val scriptPubkey: Script = Address(recipient).scriptPubkey()
        val longAmt: Long = amount.toLong()

        return TxBuilder()
            .addRecipient(scriptPubkey, longAmt.toULong())
            .feeRate(satPerVbyte = feeRate)
            .finish(wallet)
      } catch (error: Throwable) {
            throw(error)
      }
    }

    private fun sign(psbt: PartiallySignedTransaction) {
      try {
        wallet.sign(psbt)
      } catch (error: Throwable) {
        throw(error)
      }
    }

    fun send(psbt_base64: String): PartiallySignedTransaction {
      try {
        val psbt = PartiallySignedTransaction(psbt_base64)
        sign(psbt)
        blockchain.broadcast(psbt)
        return psbt
      } catch (error: Throwable) {
        throw(error)
      }
    }

    fun getTransactions(): List<TransactionDetails> = wallet.listTransactions()

    fun listLocalUnspent(): List<LocalUtxo> = wallet.listUnspent()

    fun sync() {
        wallet.sync(blockchain, ProgressLogger)
    }

    fun getBalance(): ULong = wallet.getBalance().total

    fun getAddress(addressIndex: AddressIndex): AddressInfo {
        try {
            return wallet.getAddress(addressIndex);
        } catch (error: Throwable) {
            throw(error)
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
