var _a;
import { ok, err } from '@synonymdev/result';
import { NativeModules, Platform } from 'react-native';
import { allPropertiesDefined, _exists } from './utils/helpers';
const LINKING_ERROR =
  "The package 'react-native-bdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';
const NativeBDK =
  (_a =
    NativeModules === null || NativeModules === void 0
      ? void 0
      : NativeModules.BdkModule) !== null && _a !== void 0
    ? _a
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        }
      );
class BdkInterface {
  constructor() {
    this._bdk = NativeBDK;
  }
  handleResult(fn) {
    try {
      const result = fn();
      if (!result) throw new Error('Failed to retrieve result');
      return result.then(ok);
    } catch (e) {
      return Promise.resolve(err(e));
    }
  }
  /**
   * Generate a new mnemonic
   * @returns {Promise<Result<string>>}
   */
  async generateMnemonic(wordCount = 24) {
    return this.handleResult(() => this._bdk.generateMnemonic(wordCount));
  }
  /**
   * Load wallet to rn-bdk singleton from mnemonic/descriptor + config
   * Defaults to testnet
   * @returns {Promise<Result<Ok<LoadWalletResponse>>>}
   */
  async loadWallet(args) {
    return this.handleResult(() => {
      var _a, _b, _c, _d, _e, _f;
      const { mnemonic, descriptor, passphrase, config } = args;
      // TODO add comprehensive descriptor validation
      const useDescriptor = _exists(descriptor);
      if (
        useDescriptor &&
        (descriptor === null || descriptor === void 0
          ? void 0
          : descriptor.includes(' '))
      )
        throw 'Descriptor is not valid.';
      if (!useDescriptor && !_exists(mnemonic))
        throw 'One or more required parameters are missing (Mnemonic, Network).';
      if (!config) {
        return this._bdk.loadWallet(
          mnemonic !== null && mnemonic !== void 0 ? mnemonic : '',
          descriptor !== null && descriptor !== void 0 ? descriptor : ''
        );
      }
      return this._bdk.loadWallet(
        mnemonic !== null && mnemonic !== void 0 ? mnemonic : '',
        passphrase !== null && passphrase !== void 0 ? passphrase : '',
        (_a = config.network) !== null && _a !== void 0 ? _a : '',
        (_b = config.blockchainConfigUrl) !== null && _b !== void 0 ? _b : '',
        (_c = config.blockchainSocket5) !== null && _c !== void 0 ? _c : '',
        (_d = config.retry) !== null && _d !== void 0 ? _d : '',
        (_e = config.timeOut) !== null && _e !== void 0 ? _e : '',
        (_f = config.blockchainName) !== null && _f !== void 0 ? _f : '',
        descriptor !== null && descriptor !== void 0 ? descriptor : ''
      );
    });
  }
  /**
   * Delete current wallet
   * @returns {Promise<Result<string>>}
   */
  async unloadWallet() {
    return this.handleResult(() => this._bdk.unloadWallet());
  }
  /**
   * Sync wallet with configured block explorer
   * @returns {Promise<Result<string>>}
   */
  async syncWallet() {
    return this.handleResult(() => this._bdk.syncWallet());
  }
  /**
   * Get address of type AddressIndexVariant
   * (new, lastUnused, peek, reset)
   * See bdk rust/kotlin docs for more info.
   * @returns {Promise<Result<string>>}
   */
  async getAddress(addressIndex) {
    return this.handleResult(() => {
      var _a;
      return this._bdk.getAddress(
        addressIndex.type,
        (_a = addressIndex.index) !== null && _a !== void 0 ? _a : 0
      );
    });
  }
  // TODO - deprecate
  /**
   * Get next new address
   * @returns {Promise<Result<string>>}
   */
  async getNewAddress() {
    return this.handleResult(() => this._bdk.getNewAddress());
  }
  /**
   * Get last unused address
   * @returns {Promise<Result<string>>}
   */
  async getLastUnusedAddress() {
    return this.handleResult(() => this._bdk.getLastUnusedAddress());
  }
  /**
   * Get wallet balance
   * @returns {Promise<Result<string>>}
   */
  async getBalance() {
    return this.handleResult(() => this._bdk.getBalance());
  }
  /**
   * Set blockchain config (block explorer/wallet server)
   * @returns {Promise<Result<Ok<string>>>}
   */
  async setBlockchain() {
    return this.handleResult(() => this._bdk.setBlockchain());
  }
  /**
   * Construct psbt from tx parameters
   * @returns {Promise<Result<CreateTransactionResult>>}
   */
  async createTransaction(args) {
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
  async sendTransaction(args) {
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
  async getTransactions() {
    return this.handleResult(() => this._bdk.getTransactions());
  }
  /**
   * List local UTXOs associated with current wallet
   * @returns {Promise<Result<string>>}
   */
  async listUnspent() {
    return this.handleResult(() => this._bdk.listUnspent());
  }
  /**
   * Add recipient to txbuilder instance
   * @returns {Promise<Result<string>>}
   */
  async addTxRecipient(args) {
    return this.handleResult(() => {
      const { recipient, amount } = args;
      return this._bdk.addTxRecipient(recipient, amount);
    });
  }
}
const Bdk = new BdkInterface();
export default Bdk;
//# sourceMappingURL=bdk.js.map
