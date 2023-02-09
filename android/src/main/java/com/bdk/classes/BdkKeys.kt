package com.bdk.classes

import com.bdk.DescriptorPair
import com.bdk.getNetwork
import com.bdk.getWordCount
import org.bitcoindevkit.*

class BdkKeys {
  private var _descriptorSecretKey: DescriptorSecretKey
  private var _descriptorPublicKey: DescriptorPublicKey
  // TODO - get rid of dummy
  private val dummyPubkey = "tpubD6NzVbkrYhZ4XWZ6fufSD767svACEGHNNHwH8JRrMYpxaDp3Uoa7dt2QFceXX1pmHTqHQ6CV14jC5Dw6fQcwcJE8zdHgQYJBDxbdeBdJiwW/*"

  constructor() {
      this._descriptorSecretKey = DescriptorSecretKey(
        getNetwork(""),
        Mnemonic(getWordCount(0)),
        ""
      )
    this._descriptorPublicKey = DescriptorPublicKey.fromString(dummyPubkey)
  }


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
  private fun create_externalDescriptor(rootKey: DescriptorSecretKey): String {
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
      if (!mnemonic.isNullOrEmpty()) {
        val networkObj = getNetwork(networkStr = network)
        val mnemonicObj = Mnemonic.fromString(mnemonic)
        val bip32RootKey = DescriptorSecretKey(
          network = networkObj,
          mnemonic = mnemonicObj,
          password = password
        )
        externalDescriptor = create_externalDescriptor(bip32RootKey)
        internalDescriptor = createInternalDescriptor(bip32RootKey)
      } else {
        // external descriptor provided directly
        externalDescriptor = descriptor!!
        internalDescriptor = createInternalDescriptorFromExternal(externalDescriptor)
      }
    } catch (e: Exception) {
      throw(e)
    }
    return DescriptorPair(externalDescriptor, internalDescriptor)
  }

  /* Descriptor secret key methods start */
  fun createDescriptorSecret(network: String, mnemonic: String, password: String? = null): String {
    val networkName = getNetwork(network)
    val mnemonicObj = Mnemonic.fromString(mnemonic)
    val keyInfo = DescriptorSecretKey(
      networkName,
      mnemonicObj,
      password
    )
    this._descriptorSecretKey = keyInfo
    return keyInfo.asString()
  }

  fun descriptorSecretDerive(path: String): String {
    val _path = DerivationPath(path)
    val keyInfo = this._descriptorSecretKey.derive(_path)
    return keyInfo.asString()
  }

  fun descriptorSecretExtend(path: String): String {
    val _path = DerivationPath(path)
    val keyInfo = this._descriptorSecretKey.extend(_path)
    return keyInfo.asString()
  }

  fun descriptorSecretAsPublic(): String {
    return this._descriptorSecretKey.asPublic().asString()
  }

  fun descriptorSecretAsSecretBytes(): List<UByte> {
    return this._descriptorSecretKey.secretBytes()
  }
  /* Descriptor secret key methods end */

  /* Descriptor public key methods start */
  fun createDescriptorPublic(publicKey: String): String {
    val keyInfo = DescriptorPublicKey.fromString(publicKey)
    val _descriptorPublicKey = keyInfo
    return keyInfo.asString()
  }

  fun descriptorPublicDerive(path: String): String {
    val _path = DerivationPath(path)
    val keyInfo = this._descriptorPublicKey.derive(_path)
    return keyInfo.asString()
  }

  fun descriptorPublicExtend(path: String): String {
    val _path = DerivationPath(path)
    val keyInfo = this._descriptorPublicKey.extend(_path)
    return keyInfo.asString()
  }
  /* Descriptor public key methods end */
}
