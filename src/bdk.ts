import { Result, ok, err } from '@synonymdev/result';
import { BdkClient } from './BdkClient';
import {
  Balance,
  BlockTime,
  LocalUtxo,
  OutPoint,
  TransactionDetails,
  TxOut,
} from './classes/Bindings';
import { allPropertiesDefined, _exists } from './utils/helpers';
import {
  CreateTransactionInput,
  LoadWalletInput,
  LoadWalletResponse,
  SendTransactionInput,
  SendTransactionResult,
  AddRecipientInput,
  AddressInfo,
  GetAddressInput,
  Network,
  PsbtSerialised,
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

      return this._bdk.loadWallet(
        mnemonic ?? '',
        passphrase ?? '',
        config?.network ?? Network.Testnet,
        config?.blockchainConfigUrl ?? 'ssl://electrum.blockstream.info:60002',
        config?.blockchainSocket5 ?? '',
        config?.retry ?? '',
        config?.timeout ?? '',
        config?.blockchainName ?? '',
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
   * @returns {Promise<Result<boolean>>}
   */
  async syncWallet(): Promise<Result<boolean>> {
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
   * Construct psbt from tx parameters
   * @returns {Promise<Result<CreateTransactionResult>>}
   */
  async createTransaction(
    args: CreateTransactionInput
  ): Promise<Result<{ txdetails: TransactionDetails; psbt: PsbtSerialised }>> {
    return this.handleResult(async () => {
      const { address, amount, fee_rate } = args;
      if (!allPropertiesDefined(args)) throw 'Missing required parameter';
      if (isNaN(amount)) throw 'Invalid amount';
      const txbr = await this._bdk.createTransaction(address, amount, fee_rate);
      let localObj = {
        txdetails: new TransactionDetails(
          txbr.txdetails.txid,
          txbr.txdetails.received,
          txbr.txdetails.sent,
          txbr.txdetails.fee,
          new BlockTime(
            txbr.txdetails.confirmationTime?.height,
            txbr.txdetails.confirmationTime?.timestamp
          )
        ),
        psbt: txbr.psbt,
      };
      return localObj;
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
  async listTransactions(): Promise<Result<Array<TransactionDetails>>> {
    return this.handleResult(() => this._bdk.listTransactions());
  }

  /**
   * List local UTXOs associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  async listUnspent(): Promise<Result<Array<LocalUtxo>>> {
    return this.handleResult(async () => {
      const unspents = await this._bdk.listUnspent();
      let localUtxos: Array<LocalUtxo> = [];
      unspents.map((u) => {
        let localObj = new LocalUtxo(
          new OutPoint(u.outpoint.txid, u.outpoint.vout),
          new TxOut(u.txout.value, u.txout.address),
          u.isSpent,
          u.keychain
        );
        localUtxos.push(localObj);
      });
      return localUtxos;
    });
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
