import { Result, ok, err } from '@synonymdev/result';
import { NativeModules, Platform } from 'react-native';
import { allPropertiesDefined, _exists } from './utils/helpers';
import {
  CreateTransactionInput,
  LoadWalletInput,
  LoadWalletResponse,
  TransactionDetails,
  CreateTransactionResult,
  SignTransactionInput,
  SendTransactionResult,
  LocalUtxoFlat,
  AddRecipientInput,
} from './utils/types';

const LINKING_ERROR =
  "The package 'react-native-bdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeBDK =
  NativeModules?.BdkModule ??
  new Proxy(
    {},
    {
      get(): void {
        throw new Error(LINKING_ERROR);
      },
    }
  );

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeBDK;
  }

  /**
   * Generate a new mnemonic
   * @returns {Promise<Result<string>>}
   */
  async generateMnemonic(wordCount: number = 24): Promise<Result<string>> {
    try {
      const response = await this._bdk.generateMnemonic(wordCount);
      return ok(response);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Load wallet to rn-bdk singleton from mnemonic/descriptor + config
   * Defaults to testnet
   * @returns {Promise<Result<Ok<LoadWalletResponse>>>}
   */
  async loadWallet(args: LoadWalletInput): Promise<Result<LoadWalletResponse>> {
    try {
      const { mnemonic, descriptor, config } = args;

      if (!_exists(descriptor) && !_exists(mnemonic))
        throw 'Required param mnemonic or descriptor is missing.';
      if (_exists(descriptor) && _exists(mnemonic))
        throw 'Only one parameter is required either mnemonic or descriptor.';

      const useDescriptor = _exists(descriptor);
      if (useDescriptor && descriptor?.includes(' '))
        throw 'Descriptor is not valid.';
      if (!useDescriptor && !_exists(mnemonic))
        throw 'One or more required parameters are missing (Mnemonic, Network).';

      if (!config) {
        const wallet: LoadWalletResponse = await this._bdk.loadWallet(
          mnemonic ?? '',
          descriptor ?? ''
        );
        return ok(wallet);
      }
      const wallet: LoadWalletResponse = await this._bdk.loadWallet(
        mnemonic ?? '',
        config.password ?? '',
        config.network ?? '',
        config.blockchainConfigUrl ?? '',
        config.blockchainSocket5 ?? '',
        config.retry ?? '',
        config.timeOut ?? '',
        config.blockchainName ?? '',
        descriptor ?? ''
      );
      return ok(wallet);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Delete current wallet
   * @returns {Promise<Result<string>>}
   */
  async unloadWallet(): Promise<Result<boolean>> {
    try {
      const response: boolean = await this._bdk.unloadWallet();
      return ok(response);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Sync wallet with configured block explorer
   * @returns {Promise<Result<string>>}
   */
  async syncWallet(): Promise<Result<string>> {
    try {
      const response: string = await this._bdk.syncWallet();
      return ok(response);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Get next new address
   * @returns {Promise<Result<string>>}
   */
  async getNewAddress(): Promise<Result<string>> {
    try {
      const address: string = await this._bdk.getNewAddress();
      return ok(address);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Get last unused address
   * @returns {Promise<Result<string>>}
   */
  async getLastUnusedAddress(): Promise<Result<string>> {
    try {
      const address: string = await this._bdk.getLastUnusedAddress();
      return ok(address);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Get wallet balance
   * @returns {Promise<Result<string>>}
   */
  async getBalance(): Promise<Result<string>> {
    try {
      const balance: string = await this._bdk.getBalance();
      return ok(balance);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Set blockchain config (block explorer/wallet server)
   * @returns {Promise<Result<Ok<string>>>}
   */
  async setBlockchain(): Promise<Result<string>> {
    try {
      const response: string = await this._bdk.setBlockchain();
      return ok(response);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Construct psbt from tx parameters
   * @returns {Promise<Result<TxBuilderResult>>}
   */
  async createTransaction(
    args: CreateTransactionInput
  ): Promise<Result<CreateTransactionResult>> {
    try {
      const { address, amount, fee_rate } = args;
      if (!allPropertiesDefined(args)) throw 'Missing required parameter';
      if (isNaN(amount)) throw 'Invalid amount';
      const response = await this._bdk.createTransaction(
        address,
        amount,
        fee_rate
      );
      return ok(response);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Sign and broadcast a transaction via the
   * corresponding psbt using the current wallet
   * @returns {Promise<Result<string>>}
   */
  async sendTransaction(
    args: SignTransactionInput
  ): Promise<Result<SendTransactionResult>> {
    try {
      const { psbt_base64 } = args;
      if (!allPropertiesDefined(psbt_base64))
        throw 'Missing required parameter';
      const response = await this._bdk.sendTransaction(psbt_base64);
      return ok(response);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Get transactions associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  async getTransactions(): Promise<Result<Array<TransactionDetails>>> {
    try {
      const txs = await this._bdk.getTransactions();
      return ok(txs);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * List local UTXOs associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  async listUnspent(): Promise<Result<Array<LocalUtxoFlat>>> {
    try {
      const utxos = await this._bdk.listUnspent();
      return ok(utxos);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Add recipient to txbuilder instance
   * @returns {Promise<Result<string>>}
   */
  async addTxRecipient(args: AddRecipientInput): Promise<Result<string>> {
    try {
      const { recipient, amount } = args;
      const txbuilder = await this._bdk.addTxRecipient(recipient, amount);
      return ok(txbuilder);
    } catch (e: any) {
      return err(e);
    }
  }
}

const Bdk = new BdkInterface();

export default Bdk;
