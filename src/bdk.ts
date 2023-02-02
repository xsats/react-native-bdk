import { Result, ok, err } from '@synonymdev/result';
import { BdkClient } from './BdkClient';
import { Balance } from './classes/Bindings';
import { allPropertiesDefined, _exists } from './utils/helpers';
import {
  CreateTransactionInput,
  LoadWalletInput,
  LoadWalletResponse,
  TransactionDetails,
  CreateTransactionResult,
  SendTransactionInput,
  SendTransactionResult,
  LocalUtxoFlat,
  AddRecipientInput,
  AddressIndexVariant,
  AddressIndex,
  AddressInfo,
  GetAddressInput,
  Network,
} from './utils/types';

class BdkInterface extends BdkClient {
  protected handleResult<T>(fn: () => Promise<T>): Promise<Result<T>> {
    try {
      const result = fn();
      if (!result) throw new Error('Failed to retrieve result');
      return result.then(ok);
    } catch (e: any) {
      return Promise.resolve(err(e));
    }
  }

  /**
   * Generate a new mnemonic
   * @returns {Promise<Result<string>>}
   */
  async generateMnemonic(wordCount: number = 24): Promise<Result<string>> {
    return this.handleResult(() => this._bdk.generateMnemonic(wordCount));
  }

  /**
   * Load wallet to rn-bdk singleton from mnemonic/descriptor + config
   * Defaults to testnet
   * @returns {Promise<Result<Ok<LoadWalletResponse>>>}
   */
  async loadWallet(args: LoadWalletInput): Promise<Result<LoadWalletResponse>> {
    return this.handleResult(() => {
      const { mnemonic, descriptor, passphrase, config } = args;

      // TODO add comprehensive descriptor validation
      const useDescriptor = _exists(descriptor);
      if (useDescriptor && descriptor?.includes(' '))
        throw 'Descriptor is not valid.';
      if (!useDescriptor && !_exists(mnemonic))
        throw 'One or more required parameters are missing (Mnemonic, Network).';

      if (!config) {
        return this._bdk.loadWallet(mnemonic ?? '', descriptor ?? '');
      }
      return this._bdk.loadWallet(
        mnemonic ?? '',
        passphrase ?? '',
        config.network ?? Network.Testnet,
        config.blockchainConfigUrl ?? '',
        config.blockchainSocket5 ?? '',
        config.retry ?? '',
        config.timeOut ?? '',
        config.blockchainName ?? '',
        descriptor ?? ''
      );
    });
  }

  /**
   * Delete current wallet
   * @returns {Promise<Result<string>>}
   */
  async unloadWallet(): Promise<Result<boolean>> {
    return this.handleResult(() => this._bdk.unloadWallet());
  }

  /**
   * Sync wallet with configured block explorer
   * @returns {Promise<Result<string>>}
   */
  async syncWallet(): Promise<Result<string>> {
    return this.handleResult(() => this._bdk.syncWallet());
  }

  /**
   * Get address of type AddressIndexVariant
   * (new, lastUnused, peek, reset)
   * See bdk rust/kotlin docs for more info.
   * @returns {Promise<Result<string>>}
   */
  async getAddress(args: GetAddressInput): Promise<Result<AddressInfo>> {
    return this.handleResult(() => {
      const { indexVariant, index } = args;
      return this._bdk.getAddress(indexVariant, index ?? 0);
    });
  }

  /**
   * Get wallet balance
   * @returns {Promise<Result<string>>}
   */
  async getBalance(): Promise<Result<Balance>> {
    return this.handleResult(() => this._bdk.getBalance());
  }

  /**
   * Set blockchain config (block explorer/wallet server)
   * @returns {Promise<Result<Ok<string>>>}
   */
  async setBlockchain(): Promise<Result<string>> {
    return this.handleResult(() => this._bdk.setBlockchain());
  }

  /**
   * Construct psbt from tx parameters
   * @returns {Promise<Result<CreateTransactionResult>>}
   */
  async createTransaction(
    args: CreateTransactionInput
  ): Promise<Result<CreateTransactionResult>> {
    return this.handleResult(() => {
      const { address, amount, fee_rate } = args;
      if (!allPropertiesDefined(args)) throw 'Missing required parameter';
      if (isNaN(amount)) throw 'Invalid amount';
      return this._bdk.createTransaction(address, amount, fee_rate);
    });
  }

  /**
   * Sign and broadcast a transaction via the
   * corresponding psbt using the current wallet
   * @returns {Promise<Result<string>>}
   */
  async sendTransaction(
    args: SendTransactionInput
  ): Promise<Result<SendTransactionResult>> {
    return this.handleResult(() => {
      const { psbt_base64 } = args;
      if (!allPropertiesDefined(psbt_base64))
        throw 'Missing required parameter';
      return this._bdk.sendTransaction(psbt_base64);
    });
  }

  /**
   * Get transactions associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  async getTransactions(): Promise<Result<Array<TransactionDetails>>> {
    return this.handleResult(() => this._bdk.getTransactions());
  }

  /**
   * List local UTXOs associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  async listUnspent(): Promise<Result<Array<LocalUtxoFlat>>> {
    return this.handleResult(() => this._bdk.listUnspent());
  }

  /**
   * Add recipient to txbuilder instance
   * @returns {Promise<Result<string>>}
   */
  async addTxRecipient(args: AddRecipientInput): Promise<Result<string>> {
    return this.handleResult(() => {
      const { recipient, amount } = args;
      return this._bdk.addTxRecipient(recipient, amount);
    });
  }
}

const Bdk = new BdkInterface();

export default Bdk;
