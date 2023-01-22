package com.bdk.classes

import org.bitcoindevkit.Mnemonic
import org.bitcoindevkit.WordCount

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
}
