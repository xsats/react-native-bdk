import { Result } from '@synonymdev/result';
import { BdkClient } from './BdkClient';
import { Balance, LocalUtxo, TransactionDetails } from './classes/Bindings';
import {
  CreateTransactionInput,
  LoadWalletInput,
  LoadWalletResponse,
  SendTransactionInput,
  SendTransactionResult,
  AddRecipientInput,
  AddressInfo,
  GetAddressInput,
  PsbtSerialised,
} from './utils/types';
declare class BdkInterface extends BdkClient {
  protected handleResult<T>(fn: () => Promise<T>): Promise<Result<T>>;
  /**
   * Generate a new mnemonic
   * @returns {Promise<Result<string>>}
   */
  generateMnemonic(wordCount?: number): Promise<Result<string>>;
  /**
   * Load wallet to rn-bdk singleton from mnemonic/descriptor + config
   * Defaults to testnet
   * @returns {Promise<Result<Ok<LoadWalletResponse>>>}
   */
  loadWallet(args: LoadWalletInput): Promise<Result<LoadWalletResponse>>;
  /**
   * Delete current wallet
   * @returns {Promise<Result<string>>}
   */
  unloadWallet(): Promise<Result<boolean>>;
  /**
   * Sync wallet with configured block explorer
   * @returns {Promise<Result<string>>}
   */
  syncWallet(): Promise<Result<string>>;
  /**
   * Get address of type AddressIndexVariant
   * (new, lastUnused, peek, reset)
   * See bdk rust/kotlin docs for more info.
   * @returns {Promise<Result<string>>}
   */
  getAddress(args: GetAddressInput): Promise<Result<AddressInfo>>;
  /**
   * Get wallet balance
   * @returns {Promise<Result<string>>}
   */
  getBalance(): Promise<Result<Balance>>;
  /**
   * Set blockchain config (block explorer/wallet server)
   * @returns {Promise<Result<Ok<string>>>}
   */
  setBlockchain(): Promise<Result<string>>;
  /**
   * Construct psbt from tx parameters
   * @returns {Promise<Result<CreateTransactionResult>>}
   */
  createTransaction(args: CreateTransactionInput): Promise<
    Result<{
      txdetails: TransactionDetails;
      psbt: PsbtSerialised;
    }>
  >;
  /**
   * Sign and broadcast a transaction via the
   * corresponding psbt using the current wallet
   * @returns {Promise<Result<string>>}
   */
  sendTransaction(
    args: SendTransactionInput
  ): Promise<Result<SendTransactionResult>>;
  /**
   * Get transactions associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  getTransactions(): Promise<Result<Array<TransactionDetails>>>;
  /**
   * List local UTXOs associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  listUnspent(): Promise<Result<Array<LocalUtxo>>>;
  /**
   * Add recipient to txbuilder instance
   * @returns {Promise<Result<string>>}
   */
  addTxRecipient(args: AddRecipientInput): Promise<Result<string>>;
}
declare const Bdk: BdkInterface;
export default Bdk;
