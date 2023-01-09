import { err, ok } from '@synonymdev/result';
import { NativeModules } from 'react-native';
import { _exists } from './utils/helpers';
class BdkInterface {
    constructor() {
        this._bdk = NativeModules.Bdk;
    }
    /**
     * Init wallet
     * @return {Promise<Result<createWalletResponse>>}
     */
    async createWallet(args) {
        try {
            const { mnemonic, descriptor, password, network, blockChainConfigUrl, blockChainSocket5, retry, timeOut, blockChainName, } = args;
            if (!_exists(descriptor) && !_exists(mnemonic))
                throw 'Required param mnemonic or descriptor is missing.';
            if (_exists(descriptor) && _exists(mnemonic))
                throw 'Only one parameter is required either mnemonic or descriptor.';
            const useDescriptor = _exists(descriptor);
            if (useDescriptor && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.includes(' ')))
                throw 'Descriptor is not valid.';
            if (!useDescriptor && (!_exists(mnemonic) || !_exists(network)))
                throw 'One or more required parameters are emtpy(Mnemonic, Network).';
            const wallet = await this._bdk.createWallet(mnemonic !== null && mnemonic !== void 0 ? mnemonic : '', password !== null && password !== void 0 ? password : '', network !== null && network !== void 0 ? network : '', blockChainConfigUrl !== null && blockChainConfigUrl !== void 0 ? blockChainConfigUrl : '', blockChainSocket5 !== null && blockChainSocket5 !== void 0 ? blockChainSocket5 : '', retry !== null && retry !== void 0 ? retry : '', timeOut !== null && timeOut !== void 0 ? timeOut : '', blockChainName !== null && blockChainName !== void 0 ? blockChainName : '', descriptor !== null && descriptor !== void 0 ? descriptor : '');
            return ok(wallet);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Sync wallet
     * @return {Promise<Result<string>>}
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
     * Get new address
     * @return {Promise<Result<string>>}
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
    async multiply(a, b) {
        return this._bdk.multiply(a, b);
    }
}
const Bdk = new BdkInterface();
export default Bdk;
//# sourceMappingURL=index.js.map