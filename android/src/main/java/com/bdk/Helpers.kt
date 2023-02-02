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

fun ByteArray.hexEncodedString(): String {
    return joinToString("") { "%02x".format(it) }
}

val ByteArray.base64: String
  get() = Base64.encodeToString(this, Base64.NO_WRAP)

val List<UByte>.asByteArray: ByteArray
  get() = ByteArray(size) { this[it].toByte() }

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

    result.putString("txdetails_txid", this.transactionDetails.txid)
    result.putInt("txdetails_sent", this.transactionDetails.sent.toInt())
    result.putInt("txdetails_received", this.transactionDetails.received.toInt())
    this.transactionDetails.fee?.toInt()?.let { result.putInt("txdetails_fee", it) }
    this.transactionDetails.confirmationTime?.timestamp?.let { result.putInt("txdetails_confirmation_timestamp", it.toInt()) }
    this.transactionDetails.confirmationTime?.height?.let { result.putInt("txdetails_confirmation_blockheight", it.toInt()) }
    result.putBase64String("psbt_tx_base64", this.psbt.extractTx().asByteArray)
    result.putString("psbt_serialised_base64", this.psbt.serialize())

    return result
  }

val TransactionDetails.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("txid", this.txid)
    result.putInt("sent", this.sent.toInt())
    result.putInt("received", this.received.toInt())
    this.fee?.let { result.putInt("fee", it.toInt()) }
    this.confirmationTime?.timestamp?.let { result.putInt("confirmation_timestamp", it.toInt()) }
    this.confirmationTime?.height?.let { result.putInt("confirmation_blockheight", it.toInt()) }

    return result
  }

val LocalUtxo.asJson: WritableMap
  get() {
    val result = Arguments.createMap()

    result.putString("outpoint_txid", this.outpoint.txid)
    result.putInt("outpoint_vout", this.outpoint.vout.toInt())
    result.putInt("txout_value", this.txout.value.toInt())
    result.putString("txout_address", this.txout.address)
    result.putString("keychain", this.keychain.toString())
    result.putBoolean("is_spent", this.isSpent)

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

fun getAddressIndex(indexType: String?): AddressIndex {
  return when (indexType) {
    "NEW" -> AddressIndex.NEW
    "LAST_UNUSED" -> AddressIndex.LAST_UNUSED
    else -> {
      AddressIndex.NEW
    }
  }
}

