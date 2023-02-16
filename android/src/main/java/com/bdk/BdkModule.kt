package com.bdk

import com.bdk.classes.BdkBlockchain
import com.bdk.classes.BdkKeys
import com.bdk.classes.BdkWallet
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.bitcoindevkit.*

enum class BdkErrors {
  // wallet
  init_wallet_failed,
  already_init,
  load_wallet_failed,
  unload_wallet_failed,
  get_address_failed,
  sync_wallet_failed,
  get_balance_failed,
  create_tx_failed,
  send_tx_failed,
  get_txs_failed,
  list_unspent_failed,
  // blockchain
  init_blockchain_failed,
  set_blockchain_failed,
  // keys - secret
  create_mnemonic_failed,
  descriptor_sec_create_failed,
  descriptor_sec_derive_failed,
  descriptor_sec_extend_failed,
  // keys - public
  descriptor_pub_create_failed,
  descriptor_pub_derive_failed,
  descriptor_pub_extend_failed,
}

enum class EventTypes {
  bdk_log,
  native_log,
}

class BdkModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "BdkModule"

  private val defaultServerUrl = "ssl://electrum.blockstream.info:60002"
  // lazy load zero conf objects when required
  private val keys: BdkKeys by lazy { BdkKeys() }

  // objects requiring initialisation with config
  private var wallet: BdkWallet? = null
  private var blockchain: BdkBlockchain? = null


  // keys
  @ReactMethod
  fun generateMnemonic(
    wordCount: Int, result: Promise
  ) {
    try {
      result.resolve(keys.generateMnemonic(wordCount))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.create_mnemonic_failed, Error(e))
    }
  }

  // descriptor secret
  @ReactMethod
  fun createDescriptorSecret(
    network: String,
    mnemonic: String,
    password: String? = null,
    result: Promise
  ) {
    try {
      result.resolve(keys.createDescriptorSecret(network, mnemonic, password))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.descriptor_sec_create_failed, Error(e))
    }
  }

  @ReactMethod
  fun descriptorSecretDerive(
    path: String,
    result: Promise
  ) {
    try {
      result.resolve(keys.descriptorSecretDerive(path))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.descriptor_sec_derive_failed, Error(e))
    }
  }

  @ReactMethod
  fun descriptorSecretExtend(
    path: String,
    result: Promise
  ) {
    try {
      result.resolve(keys.descriptorSecretExtend(path))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.descriptor_sec_extend_failed, Error(e))
    }
  }

  @ReactMethod
  fun descriptorSecretAsPublic(
    result: Promise
  ) {
    result.resolve(keys.descriptorSecretAsPublic())
  }

  @ReactMethod
  fun descriptorSecretAsSecretBytes(
    result: Promise
  ) {
    result.resolve(keys.descriptorSecretAsSecretBytes().asString)
  }

  // Descriptor public
  @ReactMethod
  fun createDescriptorPublic(
    publicKey: String,
    result: Promise
  ) {
    try {
      result.resolve(keys.createDescriptorPublic(publicKey))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.descriptor_pub_create_failed, Error(e))
    }
  }

  @ReactMethod
  fun descriptorPublicDerive(
    path: String,
    result: Promise
  ) {
    try {
      result.resolve(keys.descriptorPublicDerive(path))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.descriptor_pub_derive_failed, Error(e))
    }
  }

  @ReactMethod
  fun descriptorPublicExtend(
    path: String,
    result: Promise
  ) {
    try {
      result.resolve(keys.descriptorPublicExtend(path))
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.descriptor_pub_extend_failed, Error(e))
    }
  }


  // wallet
  @ReactMethod
  fun loadWallet(
    mnemonic: String = "",
    password: String?,
    network: String?,
    blockchainConfigUrl: String?,
    blockchainSocket5: String?,
    retry: String?,
    timeout: String?,
    blockchainName: String?,
    descriptor: String = "",
    result: Promise
  ) {
      if (wallet != null) {
          return handleReject(result, BdkErrors.already_init)
      }

      try {
        // get descriptors
       val descriptors = keys.setDescriptors(mnemonic, descriptor, password, network)

       val networkObj = getNetwork(network)
       wallet = BdkWallet( descriptors.externalDescriptor, descriptors.externalDescriptor, networkObj)
       wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
        val serverUrl = blockchainConfigUrl ?: defaultServerUrl
       blockchain =  BdkBlockchain(serverUrl)

        blockchain ?: return handleReject(result, BdkErrors.init_blockchain_failed)

        val responseObject = mutableMapOf<String, Any?>()
        responseObject["externalDescriptor"] = descriptors.externalDescriptor
        responseObject["internalDescriptor"] = descriptors.internalDescriptor
        responseObject["externalAddressZero"] = wallet!!.getAddress(AddressIndex.NEW).address
       result.resolve(Arguments.makeNativeMap(responseObject))
      } catch (e: Exception) {
        return handleReject(result, BdkErrors.load_wallet_failed, Error(e))
      }
  }

    @ReactMethod
    fun unloadWallet(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
      try {
            result.resolve(wallet!!.unloadWallet())
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.unload_wallet_failed, Error(e))
        }
    }

  // TODO implement peek, reset + internal when merged in bdk-ffi
  @ReactMethod
  fun getAddress(indexType: String, index: Int?, result: Promise) {
    wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
    return try {
      val addressIndex = getAddressIndex(indexType)
      result.resolve(wallet!!.getAddress(addressIndex).asJson)
    } catch (e: Exception) {
      handleReject(result, BdkErrors.get_address_failed, Error(e))
    }
  }

    @ReactMethod
    fun syncWallet(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
      blockchain ?: return handleReject(result, BdkErrors.init_blockchain_failed)
      try {
            wallet!!.sync(blockchain!!.blockchain)
            result.resolve("Wallet sync complete")
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.sync_wallet_failed, Error(e))
        }
    }

    @ReactMethod
    fun setServer(
      blockchainConfigUrl: String?,
      blockchainSocket5: String?,
      retry: String?,
      timeout: String?,
      blockchainName: String?,
      result: Promise
    ) {
      blockchain ?: return handleReject(result, BdkErrors.init_blockchain_failed)
      try {
            blockchain!!.setConfig(blockchainConfigUrl, blockchainSocket5, retry, timeout, blockchainName)
            result.resolve("Blockchain set")
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.set_blockchain_failed, Error(e))
        }
    }

    @ReactMethod
    fun getBalance(result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
      try {
            val balance = wallet!!.getBalance()
            result.resolve(balance.asJson)
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.get_balance_failed, Error(e))
        }
    }

    @ReactMethod
    fun createTransaction(recipient: String, amount: Double, fee_rate: Float, result: Promise) {
      wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
      try {
            val txBuilderResult = wallet!!.createTransaction(recipient, amount, fee_rate)
            result.resolve(txBuilderResult.asJson)
        } catch (e: Exception) {
          return handleReject(result, BdkErrors.create_tx_failed, Error(e))
      }
    }

//  @ReactMethod
//  fun signTransaction(psbt_base64: String, result: Promise) {
//      wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
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
    wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
    blockchain ?: return handleReject(result, BdkErrors.init_blockchain_failed)
    try {
      var psbt = PartiallySignedTransaction(psbt_base64)
      wallet!!.sign(psbt)
      blockchain!!.broadcast(psbt)
      result.resolve(psbt.asfinalJson)
      } catch (e: Exception) {
          return handleReject(result, BdkErrors.send_tx_failed, Error(e))
      }
  }

  @ReactMethod
  fun getTransactions(result: Promise) {
    wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
    try {
      var list = Arguments.createArray()
      wallet!!.getTransactions().iterator().forEach { list.pushMap(it.asJson) }
      result.resolve(list)
    } catch (e: Exception) {
      return handleReject(result, BdkErrors.get_txs_failed, Error(e))
    }
  }

  @ReactMethod
  fun listUnspent(result: Promise) {
    wallet ?: return handleReject(result, BdkErrors.init_wallet_failed)
    try {
      var list = Arguments.createArray()
      wallet!!.listUnspent().iterator().forEach { list.pushMap(it.asJson) }
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
