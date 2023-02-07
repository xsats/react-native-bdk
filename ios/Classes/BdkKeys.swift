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

    private func createExternalDescriptor(_ rootKey: DescriptorSecretKey) throws -> String {
        do {
            let externalPath = try DerivationPath(path: "m/84h/1h/0h/0")
            return "wpkh(\(try rootKey.extend(path: externalPath).asString()))"
        } catch {
            throw error
        }
    }

    private func createInternalDescriptor(_ rootKey: DescriptorSecretKey) throws -> String {
        let internalPath = try DerivationPath(path: "m/84h/1h/0h/1")
        return "wpkh(\(try rootKey.extend(path: internalPath).asString()))"
    }

    private func createInternalDescriptorFromExternal(_ descriptor: String) throws -> String {
        return descriptor.replacingOccurrences(of: "m/84h/1h/0h/0", with: "m/84h/1h/0h/1")
    }

    func setDescriptors(_ mnemonic: String?, descriptor: String?, password: String?, network: String? = "testnet") throws -> DescriptorPair {
        let externalDescriptor: String
        let internalDescriptor: String
        if mnemonic != nil {
            let mnemonicObj = try Mnemonic.fromString(mnemonic: mnemonic!)
            let bip32RootKey = DescriptorSecretKey(
                network: getNetwork(networkStr: network),
                mnemonic: mnemonicObj,
                password: password
            )
            externalDescriptor = try createExternalDescriptor(bip32RootKey)
            internalDescriptor = try createInternalDescriptor(bip32RootKey)
        } else {
            // external descriptor provided directly
            externalDescriptor = descriptor!
            internalDescriptor = try createInternalDescriptorFromExternal(descriptor!)
        }
        return (externalDescriptor, internalDescriptor)
    }
}
