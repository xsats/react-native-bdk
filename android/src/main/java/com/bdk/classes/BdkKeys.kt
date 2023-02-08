package com.bdk.classes

import com.bdk.DescriptorPair
import com.bdk.getNetwork
import org.bitcoindevkit.*

class BdkKeys {
  fun generateMnemonic(wordCount: Int = 24): String {
    // default 24 words
    var number: WordCount = when (wordCount) {
      12 -> WordCount.WORDS12
      15 -> WordCount.WORDS15
      18 -> WordCount.WORDS18
      21 -> WordCount.WORDS21
      24 -> WordCount.WORDS24
      else -> {
        WordCount.WORDS24
      }
    }
    return Mnemonic(number).asString()
  }

  // only creates BIP84 compatible wallets TODO generalise for any descriptor type
  private fun createExternalDescriptor(rootKey: DescriptorSecretKey): String {
    val externalPath = DerivationPath("m/84h/1h/0h/0")
    return "wpkh(${rootKey.extend(externalPath).asString()})"
  }

  private fun createInternalDescriptor(rootKey: DescriptorSecretKey): String {
    val internalPath = DerivationPath("m/84h/1h/0h/1")
    return "wpkh(${rootKey.extend(internalPath).asString()})"
  }

  private fun createInternalDescriptorFromExternal(descriptor: String): String {
    return descriptor.replace("m/84h/1h/0h/0", "m/84h/1h/0h/1")
  }

  fun setDescriptors(mnemonic: String?, descriptor: String?, password: String?, network: String? = "testnet"): DescriptorPair {
    val externalDescriptor: String
    val internalDescriptor: String

    try {
      if (mnemonic != null) {
        val networkObj = getNetwork(networkStr = network)
        val mnemonicObj = Mnemonic.fromString(mnemonic)
        val bip32RootKey = DescriptorSecretKey(
          network = networkObj,
          mnemonic = mnemonicObj,
          password = password
        )
        externalDescriptor = createExternalDescriptor(bip32RootKey)
        internalDescriptor = createInternalDescriptor(bip32RootKey)
      } else {
        // external descriptor provided directly
        externalDescriptor = descriptor!!
        internalDescriptor = createInternalDescriptorFromExternal(externalDescriptor)
      }
    } catch (error: Throwable) {
      throw(error)
    }
    return DescriptorPair(externalDescriptor, internalDescriptor)
  }
}
