package com.bdk

import com.bdk.classes.BdkKeys
import com.bdk.classes.BdkWallet
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

enum class BdkErrors {
  init_wallet_config,
  already_init,
  load_wallet_failed,
  unload_wallet_failed,
  get_new_address_failed,
  get_last_unused_address_failed,
  sync_wallet_failed,
  get_balance_failed,
  set_blockchain_failed,
  create_tx_failed,
  send_tx_failed,
  get_txs_failed,
  list_unspent_failed,
}

enum class EventTypes {
  bdk_log,
  native_log,
}

class BdkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BdkModule"
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }

  // lazy load zero conf objects when required
  private val keys: BdkKeys by lazy { BdkKeys() }

  // objects requiring initialisation with config
  private var wallet: BdkWallet? = null

  // keys
  @ReactMethod
  fun generateMnemonic(
                      wordCount: Int, result: Promise
                      ) {
    try {
      result.resolve(keys.generateMnemonic(wordCount))
    } catch (error: Throwable) {
      return result.reject("Generate mnemonic error", error.localizedMessage, error)
    }
  }

  // wallet
  @ReactMethod
  // TODO function should return wallet properties e.g. fingerprint + (some of?) descriptor
  fun loadWallet(
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
    if (wallet !== null) {
      return handleReject(result, BdkErrors.already_init)
    }

    wallet = BdkWallet()

    try {
        val responseObject = wallet?.loadWallet(
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
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.load_wallet_failed, Error(e))
    }
  }

    @ReactMethod
    fun unloadWallet(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
            result.resolve(wallet!!.unloadWallet())
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.unload_wallet_failed, Error(e))
        }
    }

//  // TODO implement upstream
//  @ReactMethod
//  fun getAddress(index: Int, keychain: String, result: Promise) {
//    wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
//    try {
//      val responseObject = wallet!!.getAddress()
//      result.resolve(responseObject)
//    } catch (error: Throwable) {
//      return handleReject(result, BdkErrors.get_address_failed, Error(e))
//    }
//  }

    @ReactMethod
    fun getNewAddress(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
        val responseObject = wallet!!.getNewAddress()
        result.resolve(responseObject)
      } catch (e: Exception) {
        return handleReject(result, BdkErrors.get_new_address_failed, Error(e))
      }
    }

    @ReactMethod
    fun getLastUnusedAddress(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
        val responseObject = wallet!!.getLastUnusedAddress()
        result.resolve(responseObject)
      } catch (e: Exception) {
        return handleReject(result, BdkErrors.get_last_unused_address_failed, Error(e))
      }
    }

    @ReactMethod
    fun syncWallet(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
            wallet!!.sync()
            result.resolve("Wallet sync complete")
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.sync_wallet_failed, Error(e))
        }
    }

    @ReactMethod
    fun setBlockchain(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
            wallet!!.setBlockchain()
            result.resolve("Blockchain set")
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.set_blockchain_failed, Error(e))
        }
    }

    @ReactMethod
    fun getBalance(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
            val balance: String = wallet!!.getBalance().toString()
            result.resolve(balance)
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.get_balance_failed, Error(e))
        }
    }

    @ReactMethod
    fun createTransaction(recipient: String, amount: Double, fee_rate: Float, result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
      try {
            val txBuilderResult = wallet!!.createTransaction(recipient, amount, fee_rate)
            result.resolve(txBuilderResult.asJson)
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.create_tx_failed, Error(e))
      }
    }

//  @ReactMethod
//  fun signTransaction(psbt_base64: String, result: Promise) {
//      wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
//      try {
//        val psbt = PartiallySignedTransaction(psbt_base64)
//        wallet!!.sign(psbt)
//        result.resolve(psbt.asJson)
//    } catch (e: Exception) {
//        return handleReject(result, BdkErrors.sign_tx_failed, Error(e))
//    }
//  }

  @ReactMethod
  fun sendTransaction(psbt_base64: String, result: Promise) {
    wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
    try {
          val response = wallet!!.send(psbt_base64)
          result.resolve(response.asfinalJson)
      } catch (e: Exception) {
          return handleReject(result, BdkErrors.send_tx_failed, Error(e))
      }
  }

  @ReactMethod
  fun getTransactions(result: Promise) {
    wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
    try {
      val list = Arguments.createArray()
      wallet!!.getTransactions().iterator().forEach { list.pushMap(it.asJson) }
      result.resolve(list)
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.get_txs_failed, Error(e))
    }
  }

  @ReactMethod
  fun listLocalUnspent(result: Promise) {
    wallet ?: return handleReject(result, BdkErrors.init_wallet_config)
    try {
      val list = Arguments.createArray()
      wallet!!.listLocalUnspent().iterator().forEach { list.pushMap(it.asJson) }
      result.resolve(list)
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.list_unspent_failed, Error(e))
    }
  }
}

object BdkEventEmitter {
  private var reactContext: ReactContext? = null

  fun setContext(reactContext: ReactContext) {
    this.reactContext = reactContext
  }

  fun send(eventType: EventTypes, body: Any) {
    if (this.reactContext === null) {
      return
    }

    this.reactContext!!.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventType.toString(), body)
  }
}
