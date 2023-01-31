var _a;
import { ok, err } from '@synonymdev/result';
import { NativeModules, Platform } from 'react-native';
import { allPropertiesDefined, _exists } from './utils/helpers';
const LINKING_ERROR = "The package 'react-native-bdk' doesn't seem to be linked. Make sure: \n\n" +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo managed workflow\n';
const NativeBDK = (_a = NativeModules === null || NativeModules === void 0 ? void 0 : NativeModules.BdkModule) !== null && _a !== void 0 ? _a : new Proxy({}, {
    get() {
        throw new Error(LINKING_ERROR);
    },
});
class BdkInterface {
    constructor() {
        this._bdk = NativeBDK;
    }
    /**
     * Generate a new mnemonic
     * @returns {Promise<Result<string>>}
     */
    async generateMnemonic(wordCount = 24) {
        try {
            const response = await this._bdk.generateMnemonic(wordCount);
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Load wallet to rn-bdk singleton from mnemonic/descriptor + config
     * Defaults to testnet
     * @returns {Promise<Result<Ok<LoadWalletResponse>>>}
     */
    async loadWallet(args) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const { mnemonic, descriptor, passphrase, config } = args;
            if (!_exists(descriptor) && !_exists(mnemonic))
                throw 'Required param mnemonic or descriptor is missing.';
            if (_exists(descriptor) && _exists(mnemonic))
                throw 'Only one parameter is required either mnemonic or descriptor.';
            const useDescriptor = _exists(descriptor);
            if (useDescriptor && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.includes(' ')))
                throw 'Descriptor is not valid.';
            if (!useDescriptor && !_exists(mnemonic))
                throw 'One or more required parameters are missing (Mnemonic, Network).';
            if (!config) {
                const wallet = await this._bdk.loadWallet(mnemonic !== null && mnemonic !== void 0 ? mnemonic : '', descriptor !== null && descriptor !== void 0 ? descriptor : '');
                return ok(wallet);
            }
            const wallet = await this._bdk.loadWallet(mnemonic !== null && mnemonic !== void 0 ? mnemonic : '', passphrase !== null && passphrase !== void 0 ? passphrase : '', (_a = config.network) !== null && _a !== void 0 ? _a : '', (_b = config.blockchainConfigUrl) !== null && _b !== void 0 ? _b : '', (_c = config.blockchainSocket5) !== null && _c !== void 0 ? _c : '', (_d = config.retry) !== null && _d !== void 0 ? _d : '', (_e = config.timeOut) !== null && _e !== void 0 ? _e : '', (_f = config.blockchainName) !== null && _f !== void 0 ? _f : '', descriptor !== null && descriptor !== void 0 ? descriptor : '');
            return ok(wallet);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Delete current wallet
     * @returns {Promise<Result<string>>}
     */
    async unloadWallet() {
        try {
            const response = await this._bdk.unloadWallet();
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Sync wallet with configured block explorer
     * @returns {Promise<Result<string>>}
     */
    async syncWallet() {
        try {
            const response = await this._bdk.syncWallet();
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get next new address
     * @returns {Promise<Result<string>>}
     */
    async getNewAddress() {
        try {
            const address = await this._bdk.getNewAddress();
            return ok(address);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get last unused address
     * @returns {Promise<Result<string>>}
     */
    async getLastUnusedAddress() {
        try {
            const address = await this._bdk.getLastUnusedAddress();
            return ok(address);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get wallet balance
     * @returns {Promise<Result<string>>}
     */
    async getBalance() {
        try {
            const balance = await this._bdk.getBalance();
            return ok(balance);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Set blockchain config (block explorer/wallet server)
     * @returns {Promise<Result<Ok<string>>>}
     */
    async setBlockchain() {
        try {
            const response = await this._bdk.setBlockchain();
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Construct psbt from tx parameters
     * @returns {Promise<Result<CreateTransactionResult>>}
     */
    async createTransaction(args) {
        try {
            const { address, amount, fee_rate } = args;
            if (!allPropertiesDefined(args))
                throw 'Missing required parameter';
            if (isNaN(amount))
                throw 'Invalid amount';
            const response = await this._bdk.createTransaction(address, amount, fee_rate);
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Sign and broadcast a transaction via the
     * corresponding psbt using the current wallet
     * @returns {Promise<Result<string>>}
     */
    async sendTransaction(args) {
        try {
            const { psbt_base64 } = args;
            if (!allPropertiesDefined(psbt_base64))
                throw 'Missing required parameter';
            const response = await this._bdk.sendTransaction(psbt_base64);
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get transactions associated with current wallet
     * @returns {Promise<Result<string>>}
     */
    async getTransactions() {
        try {
            const txs = await this._bdk.getTransactions();
            return ok(txs);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * List local UTXOs associated with current wallet
     * @returns {Promise<Result<string>>}
     */
    async listUnspent() {
        try {
            const utxos = await this._bdk.listUnspent();
            return ok(utxos);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Add recipient to txbuilder instance
     * @returns {Promise<Result<string>>}
     */
    async addTxRecipient(args) {
        try {
            const { recipient, amount } = args;
            const txbuilder = await this._bdk.addTxRecipient(recipient, amount);
            return ok(txbuilder);
        }
        catch (e) {
            return err(e);
        }
    }
}
const Bdk = new BdkInterface();
export default Bdk;
//# sourceMappingURL=bdk.js.map