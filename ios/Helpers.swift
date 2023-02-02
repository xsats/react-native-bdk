//
//  Helpers.swift
//  react-native-bdk
//
//  Created by Ed Ball on 2023/01/17.
//

import Foundation

func handleReject(
  _ reject: RCTPromiseRejectBlock, _ bdkError: BdkErrors, _ error: Error? = nil,
  _ message: String? = nil
) {
  if let error = error as? NSError {
    BdkEventEmitter.shared.send(
      withEvent: .native_log,
      body: "Error: \(error.localizedDescription). Message: '\(message ?? "")'")
    reject(bdkError.rawValue, message ?? error.localizedDescription, error)
    return
  }

  BdkEventEmitter.shared.send(
    withEvent: .native_log, body: "Error: \(bdkError.rawValue). Message: '\(message ?? "")'")
  reject(
    bdkError.rawValue, message ?? bdkError.rawValue,
    NSError(domain: bdkError.rawValue, code: bdkError.hashValue))
}

extension Data {
  struct HexEncodingOptions: OptionSet {
    let rawValue: Int
    static let upperCase = HexEncodingOptions(rawValue: 1 << 0)
  }

  func hexEncodedString(options: HexEncodingOptions = []) -> String {
    let format = options.contains(.upperCase) ? "%02hhX" : "%02hhx"
    return map { String(format: format, $0) }.joined()
  }
}

extension TxBuilderResult {
  var asJson: [String: Any] {

    return [
      "txdetails_txid": transactionDetails.txid,
      "txdetails_sent": transactionDetails.sent,
      "txdetails_received": transactionDetails.received,
      "txdetails_fee": transactionDetails.fee ?? 0,
      "txdetails_confirmation_timestamp": transactionDetails.confirmationTime?.timestamp ?? 0,
      "txdetails_confirmation_height": transactionDetails.confirmationTime?.height ?? 0,
      "psbt_tx_base64": Data(_: psbt.extractTx()).base64EncodedString(
        options: NSData.Base64EncodingOptions(rawValue: 0)),
      "psbt_serialised_base64": psbt.serialize(),
    ]
  }
}

extension TransactionDetails {
  var asJson: [String: Any] {

    return [
      "txid": txid,
      "sent": sent,
      "received": received,
      "fee": fee ?? 0,
      "confirmation_timestamp": confirmationTime?.timestamp ?? 0,
      "confirmation_height": confirmationTime?.height ?? 0,
    ]
  }
}

extension LocalUtxo {
  var asJson: [String: Any] {

    return [
      "outpoint_txid": outpoint.txid,
      "outpoint_vout": outpoint.vout,
      "txout_value": txout.value,
      "txout_address": txout.address,
      "keychain": keychain,
      "is_spent": isSpent,
    ]
  }
}

extension PartiallySignedTransaction {
  var asJson: [String: Any] {

    return [
      "signed_psbt_base64": serialize(),
      "signed_tx_hex": Data(_: extractTx()).hexEncodedString(),
    ]
  }
}

extension PartiallySignedTransaction {
  var asfinalJson: [String: Any] {

    return [
      "txid": txid(),
      "fee_amount": feeAmount() ?? 0,
    ]
  }
}

extension AddressInfo {
  var asJson: [String: Any] {

    return [
      "address": address,
      "index": index,
    ]
  }
}

func getAddressIndex(indexVariant: String?) -> AddressIndex {
    switch (indexVariant) {
        case "NEW": return AddressIndex.new
        case "LAST_UNUSED": return AddressIndex.lastUnused
        default: return AddressIndex.new
    }
}
