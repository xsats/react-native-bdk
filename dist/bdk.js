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
     * Init a BDK wallet from mnemonic + config
     * @returns {Promise<Result<Ok<InitWalletResponse>>>}
     */
    async initWallet(args) {
        try {
            const { mnemonic, descriptor, password, network, blockchainConfigUrl, blockchainSocket5, retry, timeOut, blockchainName, } = args;
            if (!_exists(descriptor) && !_exists(mnemonic))
                throw 'Required param mnemonic or descriptor is missing.';
            if (_exists(descriptor) && _exists(mnemonic))
                throw 'Only one parameter is required either mnemonic or descriptor.';
            const useDescriptor = _exists(descriptor);
            if (useDescriptor && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.includes(' ')))
                throw 'Descriptor is not valid.';
            if (!useDescriptor && (!_exists(mnemonic) || !_exists(network)))
                throw 'One or more required parameters are missing (Mnemonic, Network).';
            const wallet = await this._bdk.initWallet(mnemonic !== null && mnemonic !== void 0 ? mnemonic : '', password !== null && password !== void 0 ? password : '', network !== null && network !== void 0 ? network : '', blockchainConfigUrl !== null && blockchainConfigUrl !== void 0 ? blockchainConfigUrl : '', blockchainSocket5 !== null && blockchainSocket5 !== void 0 ? blockchainSocket5 : '', retry !== null && retry !== void 0 ? retry : '', timeOut !== null && timeOut !== void 0 ? timeOut : '', blockchainName !== null && blockchainName !== void 0 ? blockchainName : '', descriptor !== null && descriptor !== void 0 ? descriptor : '');
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
    async destroyWallet() {
        try {
            const response = await this._bdk.destroyWallet();
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
     * @returns {Promise<Result<TxBuilderResult>>}
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
}
const Bdk = new BdkInterface();
export default Bdk;
//# sourceMappingURL=bdk.js.map