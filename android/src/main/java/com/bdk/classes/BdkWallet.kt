// h/t thunderbiscuit DevKit Wallet
// https://github.com/thunderbiscuit/devkit-wallet

package com.bdk.classes

import android.util.Log
import org.bitcoindevkit.*
import org.bitcoindevkit.Wallet

class BdkWallet {
    private var externalDescriptor: String
    private var internalDescriptor: String
    private var wallet: Wallet
    private val databaseConfig = DatabaseConfig.Memory
    // private const val regtestEsploraUrl: String = "http://10.0.2.2:3002"

  constructor(externalDescriptor: String, internalDescriptor: String, network: Network?) {
    try {
      this.wallet = Wallet(
        externalDescriptor,
        internalDescriptor,
        network ?: Network.TESTNET,
        databaseConfig,
      )
      this.externalDescriptor = externalDescriptor
      this.internalDescriptor = internalDescriptor
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

    fun setBlockchain() {
        try {
            blockchainConfig = BlockchainConfig.Electrum(ElectrumConfig(electrumURL, null, 5u, null, 10u))
            // blockchainConfig = BlockchainConfig.Esplora(EsploraConfig(esploraUrl, null, 5u, 20u, 10u))
            blockchain = Blockchain(blockchainConfig)
        } catch (error: Throwable) {
            throw(error)
        }

    }

    // only create BIP84 compatible wallets
    private fun createExternalDescriptor(rootKey: DescriptorSecretKey): String {
        val externalPath = DerivationPath("m/84h/1h/0h/0")
        return "wpkh(${rootKey.extend(externalPath).asString()})"
    }

    private fun createInternalDescriptor(rootKey: DescriptorSecretKey): String {
        val internalPath = DerivationPath("m/84h/1h/0h/1")
        return "wpkh(${rootKey.extend(internalPath).asString()})"
    }

    fun loadWallet(
        mnemonic: String = "", password: String?, network: String?,
        blockchainConfigUrl: String, blockchainSocket5: String?,
        retry: String?, timeOut: String?, blockchainName: String?, descriptor: String = ""
    ): Map<String, Any?> {

        val mnemonicObj = Mnemonic.fromString(mnemonic)
        val bip32RootKey = DescriptorSecretKey(
            network = setNetwork(network),
            mnemonic = mnemonicObj,
            password = password
        )
        val externalDescriptor = createExternalDescriptor(bip32RootKey)
        val internalDescriptor = createInternalDescriptor(bip32RootKey)
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
        } catch (e: Exception) {
            return false
        }
    }

    // .finish() returns TxBuilderResult = Result<(Psbt, TransactionDetails), Error>
    fun createTransaction(recipient: String, amount: Double, feeRate: Float):  TxBuilderResult {
        val scriptPubkey: Script = Address(recipient).scriptPubkey()
        val longAmt: Long = amount.toLong()

        return TxBuilder()
            .addRecipient(scriptPubkey, longAmt.toULong())
            .feeRate(satPerVbyte = feeRate)
            .finish(wallet)
    }

  fun sign(psbt: PartiallySignedTransaction) {
      try {
        wallet.sign(psbt)
      } catch (error: Throwable) {
        throw(error)
      }
    }

    fun getTransactions(): List<TransactionDetails> = wallet.listTransactions()

    fun listUnspent(): List<LocalUtxo>  {
      val u = wallet.listUnspent()
      Log.d("TAG", u.toString())
      return u
    }

    fun sync(blockchain: Blockchain) {
        wallet.sync(blockchain, ProgressLogger)
    }

    fun getBalance(): Balance = wallet.getBalance()

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
