//
//  BdkKeys.swift
//  react-native-bdk
//

import Foundation

class BdkKeys: NSObject {
    var _descriptorSecretKey: DescriptorSecretKey
    var _descriptorPublicKey: DescriptorPublicKey

    override init() {
        self._descriptorSecretKey = DescriptorSecretKey(
            network: getNetwork(networkStr: ""),
            mnemonic: Mnemonic(wordCount: getWordCount(wordCount: 0)),
            password: ""
        )
        self._descriptorPublicKey = DescriptorPublicKey(unsafeFromRawPointer: UnsafeMutableRawPointer.allocate(byteCount: 8, alignment: 4))
    }

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

    /** Descriptor config methods start */
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
            externalDescriptor = try self.createExternalDescriptor(bip32RootKey)
            internalDescriptor = try self.createInternalDescriptor(bip32RootKey)
        } else {
            // external descriptor provided directly
            externalDescriptor = descriptor!
            internalDescriptor = try self.createInternalDescriptorFromExternal(descriptor!)
        }
        return (externalDescriptor, internalDescriptor)
    }
    /** Descriptor config methods end */

    /** Descriptor secret key methods starts */
    func createDescriptorSecret(
        _ network: String,
        mnemonic: String,
        password: String? = nil
    ) throws -> String {
        let networkName = getNetwork(networkStr: network)
        let mnemonicObj = try Mnemonic.fromString(mnemonic: mnemonic)
        let keyInfo = DescriptorSecretKey(
            network: networkName,
            mnemonic: mnemonicObj,
            password: password
        )
        self._descriptorSecretKey = keyInfo
        return keyInfo.asString()
    }

    func descriptorSecretDerive(_ path: String) throws -> String {
        let _path = try DerivationPath(path: path)
        let keyInfo = try self._descriptorSecretKey.derive(path: _path)
        return keyInfo.asString()
    }

    func descriptorSecretExtend(_ path: String) throws -> String {
        let _path = try DerivationPath(path: path)
        let keyInfo = try self._descriptorSecretKey.extend(path: _path)
        return keyInfo.asString()
    }

    func descriptorSecretAsPublic() -> String {
        return self._descriptorSecretKey.asPublic().asString()
    }

    func descriptorSecretAsSecretBytes() -> [UInt8] {
        return self._descriptorSecretKey.secretBytes()
    }

    /** Descriptor secret key methods ends */

    /** Descriptor public key methods starts */
    func createDescriptorPublic(
        _ publicKey: String
    ) throws -> String {
        let keyInfo = try DescriptorPublicKey.fromString(publicKey: publicKey)
        self._descriptorPublicKey = keyInfo
        return keyInfo.asString()
    }

    func descriptorPublicDerive(_ path: String) throws -> String {
        let _path = try DerivationPath(path: path)
        let keyInfo = try _descriptorPublicKey.derive(path: _path)
        return keyInfo.asString()
    }

    func descriptorPublicExtend(_ path: String) throws -> String {
        let _path = try DerivationPath(path: path)
        let keyInfo = try _descriptorPublicKey.extend(path: _path)
        return keyInfo.asString()
    }
    /** Descriptor public key methods end */
}
