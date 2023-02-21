import {
  AddressInfo,
  Balance,
  LocalUtxo,
  TransactionDetails,
} from './Bindings';
import { AddressIndexVariant, InitWalletInput } from '../utils/types';
import { BdkClient } from '../BdkClient';
/**
 * Wallet methods
 */
declare class Wallet extends BdkClient {
  isInit: boolean;
  /**
   * Wallet constructor
   * @param descriptor
   * @param network
   * @returns {Promise<Wallet>}
   */
  init(args: InitWalletInput): Promise<Wallet>;
  /**
   * Return a derived address using the external descriptor.
   * @param addressIndex
   * @returns {Promise<AddressInfo>}
   */
  getAddress(
    addressIndex: AddressIndexVariant | undefined,
    index: number
  ): Promise<AddressInfo>;
  /**
   * Return balance of current wallet
   * @returns {Promise<Balance>}
   */
  getBalance(): Promise<Balance>;
  /**
   * Get the Bitcoin network the wallet is using.
   * @returns {Promise<string>}
   */
  network(): Promise<string>;
  /**
   * Sync the internal database with the Blockchain
   * @returns {Promise<boolean>}
   */
  sync(): Promise<boolean>;
  /**
   * Return the list of unspent outputs of this wallet
   * @returns {Promise<Array<LocalUtxo>>}
   */
  listUnspent(): Promise<Array<LocalUtxo>>;
  /**
   * Return an unsorted list of transactions made and received by the wallet
   * @returns {Promise<Array<TransactionDetails>>}
   */
  listTransactions(): Promise<Array<TransactionDetails>>;
}
declare const _default: Wallet;
export default _default;
