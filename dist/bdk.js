import { ok, err } from '@synonymdev/result';
import { BdkClient } from './BdkClient';
import { BlockTime, LocalUtxo, OutPoint, TransactionDetails, TxOut, } from './classes/Bindings';
import { allPropertiesDefined, _exists } from './utils/helpers';
import { Network, } from './utils/types';
class BdkInterface extends BdkClient {
    handleResult(fn) {
        try {
            const result = fn();
            if (!result)
                throw new Error('Failed to retrieve result');
            return result.then(ok);
        }
        catch (e) {
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
            if (useDescriptor && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.includes(' ')))
                throw 'Descriptor is not valid.';
            if (!useDescriptor && !_exists(mnemonic))
                throw 'One or more required parameters are missing (Mnemonic, Network).';
            return this._bdk.loadWallet(mnemonic !== null && mnemonic !== void 0 ? mnemonic : '', passphrase !== null && passphrase !== void 0 ? passphrase : '', (_a = config === null || config === void 0 ? void 0 : config.network) !== null && _a !== void 0 ? _a : Network.Testnet, (_b = config === null || config === void 0 ? void 0 : config.blockchainConfigUrl) !== null && _b !== void 0 ? _b : 'ssl://electrum.blockstream.info:60002', (_c = config === null || config === void 0 ? void 0 : config.blockchainSocket5) !== null && _c !== void 0 ? _c : '', (_d = config === null || config === void 0 ? void 0 : config.retry) !== null && _d !== void 0 ? _d : '', (_e = config === null || config === void 0 ? void 0 : config.timeOut) !== null && _e !== void 0 ? _e : '', (_f = config === null || config === void 0 ? void 0 : config.blockchainName) !== null && _f !== void 0 ? _f : '', descriptor !== null && descriptor !== void 0 ? descriptor : '');
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
    async getAddress(args) {
        return this.handleResult(() => {
            const { indexVariant, index } = args;
            return this._bdk.getAddress(indexVariant, index !== null && index !== void 0 ? index : 0);
        });
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
        return this.handleResult(async () => {
            var _a, _b;
            const { address, amount, fee_rate } = args;
            if (!allPropertiesDefined(args))
                throw 'Missing required parameter';
            if (isNaN(amount))
                throw 'Invalid amount';
            const txbr = await this._bdk.createTransaction(address, amount, fee_rate);
            let localObj = {
                txdetails: new TransactionDetails(txbr.txdetails.txid, txbr.txdetails.received, txbr.txdetails.sent, txbr.txdetails.fee, new BlockTime((_a = txbr.txdetails.confirmationTime) === null || _a === void 0 ? void 0 : _a.height, (_b = txbr.txdetails.confirmationTime) === null || _b === void 0 ? void 0 : _b.timestamp)),
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
        return this.handleResult(async () => {
            const unspents = await this._bdk.listUnspent();
            let localUtxos = [];
            unspents.map((u) => {
                let localObj = new LocalUtxo(new OutPoint(u.outpoint.txid, u.outpoint.vout), new TxOut(u.txout.value, u.txout.address), u.isSpent, u.keychain);
                localUtxos.push(localObj);
            });
            return localUtxos;
        });
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