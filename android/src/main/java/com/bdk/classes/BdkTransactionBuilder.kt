package com.bdk.classes

import org.bitcoindevkit.*

object BdkTransactionBuilder {
  private var txBuilder = TxBuilder()

  fun addRecipient(recipient: String, amount: Double): TxBuilder {
    try {
      val scriptPubkey: Script = Address(recipient).scriptPubkey()
      val longAmt: Long = amount.toLong()

      return txBuilder.addRecipient(scriptPubkey, longAmt.toULong())
    } catch (error: Throwable) {
      throw(error)
    }
  }

  fun feeRate(satPerVbyte: Float): TxBuilder {
    try {
      return txBuilder.feeRate(satPerVbyte)
    } catch (error: Throwable) {
      throw(error)
    }
  }

  fun addUtxos(utxos: List<OutPoint>): TxBuilder {
    try {
      return txBuilder.addUtxos(utxos)
    } catch (error: Throwable) {
      throw(error)
    }
  }

  fun config(excludeChange: Boolean, enableRbf: Boolean): TxBuilder {
    try {
      return txBuilder.addUtxos(utxos)
    } catch (error: Throwable) {
      throw(error)
    }
  }
}
