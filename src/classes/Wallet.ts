import {
  AddressInfo,
  Balance,
  BlockTime,
  LocalUtxo,
  OutPoint,
  TransactionDetails,
  TxOut,
} from './Bindings';
import { AddressIndexVariant, InitWalletInput, Network } from '../utils/types';
import { BdkClient } from '../BdkClient';

/**
 * Wallet methods
 */
class Wallet extends BdkClient {
  isInit: boolean = false;

  /**
   * Wallet constructor
   * @param descriptor
   * @param network
   * @returns {Promise<Wallet>}
   */
  async init(args: InitWalletInput): Promise<Wallet> {
    let created = await this._bdk.initWallet(
      args.mnemonic ?? '',
      args.passphrase ?? '',
      args.descriptor ?? '',
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
  async getAddress(
    addressIndex: AddressIndexVariant = AddressIndexVariant.NEW,
    index: number
  ): Promise<AddressInfo> {
    let addressInfo = await this._bdk.getAddress(addressIndex, index);
    return new AddressInfo(addressInfo.index, addressInfo.address);
  }

  /**
   * Return balance of current wallet
   * @returns {Promise<Balance>}
   */
  async getBalance(): Promise<Balance> {
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
  async network(): Promise<string> {
    return await this._bdk.getNetwork();
  }

  /**
   * Sync the internal database with the Blockchain
   * @returns {Promise<boolean>}
   */
  async sync(): Promise<boolean> {
    return await this._bdk.syncWallet();
  }

  /**
   * Return the list of unspent outputs of this wallet
   * @returns {Promise<Array<LocalUtxo>>}
   */
  async listUnspent(): Promise<Array<LocalUtxo>> {
    let output = await this._bdk.listUnspent();
    let localUtxo: Array<LocalUtxo> = [];
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
  async listTransactions(): Promise<Array<TransactionDetails>> {
    let list = await this._bdk.listTransactions();
    console.log(list);
    let transactions: Array<TransactionDetails> = [];
    list.map((item) => {
      let tx = new TransactionDetails(
        item.txid,
        item.received,
        item.sent,
        item?.fee,
        new BlockTime(
          item.confirmationTime?.height,
          item.confirmationTime?.timestamp
        )
      );
      transactions.push(tx);
    });
    return transactions;
  }
}

export default new Wallet();
