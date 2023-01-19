//
//  BdkKeys.swift
//  react-native-bdk
//

import Foundation

class BdkKeys: NSObject {
    func generateMnemonic(_ wordCount: NSNumber? = 24) -> String {
      var number: WordCount
        switch wordCount?.int8Value {
      case 15: number = WordCount.words15
      case 18: number = WordCount.words18
      case 21: number = WordCount.words21
      case 24: number = WordCount.words24
      default: number = WordCount.words12
      }
      let mnemonicStr = Mnemonic(wordCount: number).asString()
      return mnemonicStr
    }
}
