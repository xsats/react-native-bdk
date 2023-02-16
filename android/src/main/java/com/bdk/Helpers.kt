package com.bdk

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import android.util.Base64
import com.facebook.react.bridge.Promise
import org.bitcoindevkit.*

fun handleReject(promise: Promise, bdkError: BdkErrors, error: Error? = null) {
  if (error !== null) {
    BdkEventEmitter.send(EventTypes.native_log, "Error: ${bdkError}. Message: ${error.toString()}")
    promise.reject(bdkError.toString(), error);
  } else {
    BdkEventEmitter.send(EventTypes.native_log, "Error: ${bdkError}")
    promise.reject(bdkError.toString(), bdkError.toString())
  }
}

// data utils
fun ByteArray.hexEncodedString(): String {
    return joinToString("") { "%02x".format(it) }
}

val ByteArray.base64: String
  get() = Base64.encodeToString(this, Base64.NO_WRAP)

val List<UByte>.asByteArray: ByteArray
  get() = ByteArray(size) { this[it].toByte() }

val List<UByte>.asString: String
  get() = this.joinToString(", ") { it.toInt().toString() }


fun WritableMap.putHexString(key: String, bytes: ByteArray?) {
  if (bytes != null) {
    putString(key, bytes.hexEncodedString())
  } else {
    putString(key, null)
  }
}

fun WritableMap.putBase64String(key: String, bytes: ByteArray?) {
  if (bytes != null) {
    putString(key, bytes.base64)
  } else {
    putString(key, null)
  }
}

// wallet
val TxBuilderResult.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    val txDetails = Arguments.createMap()
    txDetails.putString("txid", this.transactionDetails.txid)
    txDetails.putInt("sent", this.transactionDetails.sent.toInt())
    txDetails.putInt("received", this.transactionDetails.received.toInt())
    this.transactionDetails.fee?.toInt()?.let { txDetails.putInt("fee", it) }

    val confTime = Arguments.createMap()
    confTime.putInt("timestamp", this.transactionDetails.confirmationTime?.timestamp?.toInt() ?: 0)
    confTime.putInt("height", this.transactionDetails.confirmationTime?.height?.toInt() ?: 0)
    this.transactionDetails.confirmationTime?.height?.let { confTime.putInt("height", it.toInt()) }
    txDetails.putMap("confirmationTime", confTime)
    result.putMap("txDetails", txDetails)

    val psbt = Arguments.createMap()
    psbt.putBase64String("txBase64", this.psbt.extractTx().asByteArray)
    psbt.putString("serialised", this.psbt.serialize())
    result.putMap("psbt", psbt)

    return result
  }

val TransactionDetails.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("txid", this.txid)
    result.putInt("sent", this.sent.toInt())
    result.putInt("received", this.received.toInt())
    this.fee?.let { result.putInt("fee", it.toInt()) }

    val confirmationTime = Arguments.createMap()
    this.confirmationTime?.timestamp?.let { confirmationTime.putInt("timestamp", it.toInt()) }
    this.confirmationTime?.height?.let { confirmationTime.putInt("height", it.toInt()) }
    result.putMap("confirmationTime", confirmationTime)

    return result
  }

val LocalUtxo.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    val outpoint = Arguments.createMap()
    outpoint.putString("txid", this.outpoint.txid)
    outpoint.putInt("vout", this.outpoint.vout.toInt())

    val txout = Arguments.createMap()
    txout.putInt("value", this.txout.value.toInt())
    txout.putString("address", this.txout.address)

    result.putMap("outpoint", outpoint)
    result.putMap("txout", txout)
    result.putString("keychain", this.keychain.toString())
    result.putBoolean("isSpent", this.isSpent)

    return result
  }

val PartiallySignedTransaction.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("signed_psbt_base64", this.serialize())
    result.putHexString("signed_tx_hex", this.extractTx().asByteArray)

    return result
  }

val PartiallySignedTransaction.asfinalJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("txid", this.txid())
    this.feeAmount()?.let { result.putInt("fee_amount", it.toInt()) }

    return result
  }

val AddressInfo.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("address", this.address)
    result.putInt("index", this.index.toInt())

    return result
  }

val Balance.asJson: WritableMap
  get() = Arguments.createMap().apply {
    putInt("trustedPending", trustedPending.toInt())
    putInt("untrustedPending", untrustedPending.toInt())
    putInt("confirmed", confirmed.toInt())
    putInt("spendable", spendable.toInt())
    putInt("total", total.toInt())
  }

fun getAddressIndex(indexVariant: String?): AddressIndex {
  return when (indexVariant) {
    "NEW" -> AddressIndex.NEW
    "LAST_UNUSED" -> AddressIndex.LAST_UNUSED
    else -> {
      AddressIndex.NEW
    }
  }
}


fun getNetwork(networkStr: String?): Network {
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

fun getWordCount(wordCount: Int): WordCount {
  return when (wordCount) {
    12 -> WordCount.WORDS12
    15 -> WordCount.WORDS15
    18 -> WordCount.WORDS18
    21 -> WordCount.WORDS21
    else -> {
      WordCount.WORDS24
    }
  }
}

data class DescriptorPair(val externalDescriptor: String, val internalDescriptor: String)

enum class ServerType(val value: String) {
  Electrum("ELECTRUM"),
  Esplora("ESPLORA"),
  RPC("RPC")
}

fun getServerType(type: String?): ServerType {
  return when (type) {
    "Electrum" -> ServerType.Electrum
    "Esplora" -> ServerType.Esplora
    else -> {
      ServerType.Electrum
    }
  }
}

// txbuilder
val TxBuilder.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("txbuilder", "NOT_IMPLEMENTED")

    return result
  }
