// h/t thunderbiscuit DevKit Wallet
// https://github.com/thunderbiscuit/devkit-wallet

package com.bdk.classes

import android.util.Log
import org.bitcoindevkit.*
import org.bitcoindevkit.Wallet

object BdkWallet {
    private lateinit var wallet: Wallet
    // private const val regtestEsploraUrl: String = "http://10.0.2.2:3002"
    private const val electrumURL: String = "ssl://electrum.blockstream.info:60002"
    private lateinit var blockchainConfig: BlockchainConfig
    private lateinit var blockchain: Blockchain

    object LogProgress: Progress {
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

    fun importWallet(
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
        // Repository.saveWallet(path, externalDescriptor, internalDescriptor)
        // Repository.saveMnemonic(mnemonic.toString())
        val responseObject = mutableMapOf<String, Any?>()
        responseObject["address"] = getNewAddress()
        return responseObject
    }

    fun destroyWallet(): Boolean {
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
        val longAmt: Long = amount.toLong()
        val scriptPubkey: Script = Address(recipient).scriptPubkey()

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
        wallet.sync(blockchain, LogProgress)
    }

    fun getBalance(): ULong = wallet.getBalance().total

    fun getNewAddress(): String {
        try {
            val addressInfo = wallet.getAddress(AddressIndex.NEW)
            return addressInfo.address
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

    fun isBlockchainSet() = BdkWallet::blockchain.isInitialized

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
