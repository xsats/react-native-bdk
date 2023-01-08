package com.bdk

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

import org.bitcoindevkit.Network

class BdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun createWallet(
      mnemonic: String = "",
      password: String?,
      network: String?,
      blockChainConfigUrl: String,
      blockChainSocket5: String?,
      retry: String?,
      timeOut: String?,
      blockchain: String?,
      descriptor: String = "",
      result: Promise
  ) {
      try {
          val responseObject =
              BdkFunctions.createWallet(
                  mnemonic,
                  password,
                  network,
                  blockChainConfigUrl,
                  blockChainSocket5,
                  retry,
                  timeOut,
                  blockchain,
                  descriptor
              )
          result.resolve(Arguments.makeNativeMap(responseObject))
      } catch (error: Throwable) {
          return result.reject("Init Wallet Error", error.localizedMessage, error)
      }
  }

  @ReactMethod
  fun getNewAddress(result: Promise) {
      try {
          val address: String = BdkFunctions.getNewAddress()
          result.resolve(address)
      } catch (error: Throwable) {
          return result.reject("Get address Error", error.localizedMessage, error)
      }
  }

  @ReactMethod
  fun syncWallet(result: Promise) {
      try {
          BdkFunctions.syncWallet()
          result.resolve("wallet sync complete")
      } catch (error: Throwable) {
          return result.reject("Get address Error", error.localizedMessage, error)
      }
  }

  companion object {
    const val NAME = "Bdk"
  }
}
