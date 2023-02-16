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
