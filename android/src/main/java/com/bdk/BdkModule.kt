package com.bdk

import com.facebook.react.bridge.*

class BdkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

    @ReactMethod
    // TODO function should return wallet properties e.g. fingerprint + (some of?) descriptor
    fun createWallet(result: Promise) {
        try {
            val responseObject = BdkWallet.createWallet()
            result.resolve(Arguments.makeNativeMap(responseObject))
        } catch (error: Throwable) {
            return result.reject("Create new wallet error", error.localizedMessage, error)
        }
    }

  @ReactMethod
  fun importWallet(
                  mnemonic: String = "",
                  password: String?,
                  network: String?,
                  blockchainConfigUrl: String,
                  blockchainSocket5: String?,
                  retry: String?,
                  timeOut: String?,
                  blockchain: String?,
                  descriptor: String = "",
                  result: Promise
  ) {
    try {
        val responseObject =
            BdkWallet.importWallet(
                mnemonic,
                password,
                network,
                blockchainConfigUrl,
                blockchainSocket5,
                retry,
                timeOut,
                blockchain,
                descriptor
            )
        result.resolve(Arguments.makeNativeMap(responseObject))
    } catch (error: Throwable) {
        return result.reject("Init wallet error", error.localizedMessage, error)
    }
  }

    @ReactMethod
    fun destroyWallet(result: Promise) {
        try {
            result.resolve(BdkWallet.destroyWallet())
        } catch (error: Throwable) {
            return result.reject("Destroy wallet error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getNewAddress(result: Promise) {
      try {
        val responseObject = BdkWallet.getNewAddress()
        result.resolve(responseObject)
      } catch (error: Throwable) {
        return result.reject("Get new address error", error.localizedMessage, error)
      }
    }

    @ReactMethod
    fun getLastUnusedAddress(result: Promise) {
      try {
        val responseObject = BdkWallet.getLastUnusedAddress()
        result.resolve(responseObject)
      } catch (error: Throwable) {
        return result.reject("Get last unused address error", error.localizedMessage, error)
      }
    }

    @ReactMethod
    fun syncWallet(result: Promise) {
        try {
            BdkWallet.sync()
            result.resolve("Wallet sync complete")
        } catch (error: Throwable) {
            return result.reject("Sync wallet error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun setBlockchain(result: Promise) {
        try {
            BdkWallet.setBlockchain()
            result.resolve("blockchain set")
        } catch (error: Throwable) {
            return result.reject("Set blockchain error", error.localizedMessage, error)
        }
    }

    // TODO broken - FIX
    @ReactMethod
    fun isBlockchainSet(result: Promise) {
        try {
            val isSet = BdkWallet.isBlockchainSet()
            result.resolve(isSet)
        } catch (error: Throwable) {
            return result.reject("Blockchain set query error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun getBalance(result: Promise) {
        try {
            val balance: String = BdkWallet.getBalance().toString()
            result.resolve(balance)
        } catch (error: Throwable) {
            return result.reject("Get balance error", error.localizedMessage, error)
        }
    }

    @ReactMethod
    fun createTransaction(recipient: String, amount: Double, fee_rate: Float, result: Promise) {
        try {
            val txBuilderResult = BdkWallet.createTransaction(recipient, amount, fee_rate)
            result.resolve(txBuilderResult.asJson)
        } catch (error: Throwable) {
            return result.reject("Create transaction error", error.localizedMessage, error)
        }
    }

//  @ReactMethod
//  fun signTransaction(psbt_base64: String, result: Promise) {
//    try {
//      val psbt = PartiallySignedTransaction(psbt_base64)
//      BdkWallet.sign(psbt)
//      result.resolve(psbt.asJson)
//    } catch (error: Throwable) {
//      return result.reject("Sign transaction error", error.localizedMessage, error)
//    }
//  }

  @ReactMethod
  fun sendTransaction(psbt_base64: String, result: Promise) {
      try {
          val response = BdkWallet.send(psbt_base64)
          result.resolve(response.asfinalJson)
      } catch (error: Throwable) {
          return result.reject("Send transaction error", error.localizedMessage, error)
      }
  }

  @ReactMethod
  fun getTransactions(result: Promise) {
    try {
      val list = Arguments.createArray()
      BdkWallet.getTransactions().iterator().forEach { list.pushMap(it.asJson) }

      result.resolve(list)
    } catch (error: Throwable) {
      return result.reject("Get transactions error", error.localizedMessage, error)
    }
  }

  @ReactMethod
  fun listLocalUnspent(result: Promise) {
    try {
      val list = Arguments.createArray()
      BdkWallet.listLocalUnspent().iterator().forEach { list.pushMap(it.asJson) }

      result.resolve(list)
    } catch (error: Throwable) {
      return result.reject("List unspent error", error.localizedMessage, error)
    }
  }
}

