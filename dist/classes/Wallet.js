import {
  AddressInfo,
  Balance,
  BlockTime,
  LocalUtxo,
  OutPoint,
  TransactionDetails,
  TxOut,
} from './Bindings';
import { AddressIndexVariant, Network } from '../utils/types';
import { BdkClient } from '../BdkClient';
/**
 * Wallet methods
 */
class Wallet extends BdkClient {
  constructor() {
    super(...arguments);
    this.isInit = false;
  }
  /**
   * Wallet constructor
   * @param descriptor
   * @param network
   * @returns {Promise<Wallet>}
   */
  async init(args) {
    var _a, _b, _c;
    let created = await this._bdk.initWallet(
      (_a = args.mnemonic) !== null && _a !== void 0 ? _a : '',
      (_b = args.passphrase) !== null && _b !== void 0 ? _b : '',
      (_c = args.descriptor) !== null && _c !== void 0 ? _c : '',
      Network.Testnet // hardcode testnet for now TODO - implement properly when stable
    );
    if (created) this.isInit = created;
    return this;
  }
  /**
   * Return a derived address using the external descriptor.
   * @param addressIndex
   * @returns {Promise<AddressInfo>}
   */
  async getAddress(addressIndex = AddressIndexVariant.NEW, index) {
    let addressInfo = await this._bdk.getAddress(addressIndex, index);
    return new AddressInfo(addressInfo.index, addressInfo.address);
  }
  /**
   * Return balance of current wallet
   * @returns {Promise<Balance>}
   */
  async getBalance() {
    let balance = await this._bdk.getBalance();
    return new Balance(
      balance.trustedPending,
      balance.untrustedPending,
      balance.confirmed,
      balance.spendable,
      balance.total
    );
  }
  /**
   * Get the Bitcoin network the wallet is using.
   * @returns {Promise<string>}
   */
  async network() {
    return await this._bdk.getNetwork();
  }
  /**
   * Sync the internal database with the Blockchain
   * @returns {Promise<boolean>}
   */
  async sync() {
    return await this._bdk.syncWallet();
  }
  /**
   * Return the list of unspent outputs of this wallet
   * @returns {Promise<Array<LocalUtxo>>}
   */
  async listUnspent() {
    let output = await this._bdk.listUnspent();
    let localUtxo = [];
    output.map((item) => {
      let localObj = new LocalUtxo(
        new OutPoint(item.outpoint.txid, item.outpoint.vout),
        new TxOut(item.txout.value, item.txout.address),
        item.isSpent,
        item.keychain
      );
      localUtxo.push(localObj);
    });
    return localUtxo;
  }
  /**
   * Return an unsorted list of transactions made and received by the wallet
   * @returns {Promise<Array<TransactionDetails>>}
   */
  async listTransactions() {
    let list = await this._bdk.listTransactions();
    console.log(list);
    let transactions = [];
    list.map((item) => {
      var _a, _b;
      let tx = new TransactionDetails(
        item.txid,
        item.received,
        item.sent,
        item === null || item === void 0 ? void 0 : item.fee,
        new BlockTime(
          (_a = item.confirmationTime) === null || _a === void 0
            ? void 0
            : _a.height,
          (_b = item.confirmationTime) === null || _b === void 0
            ? void 0
            : _b.timestamp
        )
      );
      transactions.push(tx);
    });
    return transactions;
  }
}
export default new Wallet();
//# sourceMappingURL=Wallet.js.map
