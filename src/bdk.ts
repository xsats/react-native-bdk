import { Result, ok, err } from '@synonymdev/result';
import { NativeModules, Platform } from 'react-native';
import { allPropertiesDefined, _exists } from './utils/helpers';
import {
  CreateTransactionArgs,
  ImportWalletArgs,
  InitWalletResponse,
  TransactionDetails,
  CreateTransactionResult,
  SignTransactionArgs,
  SendTransactionResult,
  LocalUtxoFlat,
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
   * Get all transactions
   * @returns {Promise<Result<string>>}
   */
  async listTransactions(): Promise<Result<Array<TransactionDetails>>> {
    try {
      const txs: Array<TransactionDetails> = await this._bdk.listTransactions();
      return ok(txs);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Create new wallet
   * @returns {Promise<Result<InitWalletResponse>>}
   */
  async createWallet(): Promise<Result<InitWalletResponse>> {
    try {
      const wallet = await this._bdk.createWallet();
      return ok(wallet);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Import an existing wallet from mnemonic
   * @returns {Promise<Result<Ok<InitWalletResponse>>>}
   */
  async importWallet(
    args: ImportWalletArgs
  ): Promise<Result<InitWalletResponse>> {
    try {
      const {
        mnemonic,
        descriptor,
        password,
        network,
        blockchainConfigUrl,
        blockchainSocket5,
        retry,
        timeOut,
        blockchainName,
      } = args;

      if (!_exists(descriptor) && !_exists(mnemonic))
        throw 'Required param mnemonic or descriptor is missing.';
      if (_exists(descriptor) && _exists(mnemonic))
        throw 'Only one parameter is required either mnemonic or descriptor.';

      const useDescriptor = _exists(descriptor);
      if (useDescriptor && descriptor?.includes(' '))
        throw 'Descriptor is not valid.';
      if (!useDescriptor && (!_exists(mnemonic) || !_exists(network)))
        throw 'One or more required parameters are missing (Mnemonic, Network).';

      const wallet: InitWalletResponse = await this._bdk.importWallet(
        mnemonic ?? '',
        password ?? '',
        network ?? '',
        blockchainConfigUrl ?? '',
        blockchainSocket5 ?? '',
        retry ?? '',
        timeOut ?? '',
        blockchainName ?? '',
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
  async destroyWallet(): Promise<Result<boolean>> {
    try {
      const response: boolean = await this._bdk.destroyWallet();
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
   * Check if wallet has been configured with block explorer/backend connection info
   * @returns {Promise<Result<boolean>>}
   */
  async isBlockchainSet(): Promise<Result<boolean>> {
    try {
      const response: boolean = await this._bdk.isBlockchainSet();
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
    args: CreateTransactionArgs
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
    args: SignTransactionArgs
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
}

const Bdk = new BdkInterface();

export default Bdk;
