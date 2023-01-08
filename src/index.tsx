import { NativeModules } from 'react-native';
import { failure, success, _exists } from './utils/helpers';
import type {
  CreateWalletRequest,
  CreateWalletResponse,
  Response,
} from './utils/types';

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeModules.Bdk;
  }

  /**
   * Init wallet
   * @return {Promise<Response>}
   */
  async createWallet(args: CreateWalletRequest): Promise<Response> {
    try {
      const {
        mnemonic,
        descriptor,
        password,
        network,
        blockChainConfigUrl,
        blockChainSocket5,
        retry,
        timeOut,
        blockChainName,
      } = args;

      if (!_exists(descriptor) && !_exists(mnemonic))
        throw 'Required param mnemonic or descriptor is missing.';
      if (_exists(descriptor) && _exists(mnemonic))
        throw 'Only one parameter is required either mnemonic or descriptor.';

      const useDescriptor = _exists(descriptor);
      if (useDescriptor && descriptor?.includes(' '))
        throw 'Descriptor is not valid.';
      if (!useDescriptor && (!_exists(mnemonic) || !_exists(network)))
        throw 'One or more required parameters are emtpy(Mnemonic, Network).';

      const wallet: CreateWalletResponse = await this._bdk.createWallet(
        mnemonic ?? '',
        password ?? '',
        network ?? '',
        blockChainConfigUrl ?? '',
        blockChainSocket5 ?? '',
        retry ?? '',
        timeOut ?? '',
        blockChainName ?? '',
        descriptor ?? ''
      );
      return success(wallet);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Sync wallet
   * @return {Promise<Response>}
   */
  async syncWallet(): Promise<Response> {
    try {
      const response: string = await this._bdk.syncWallet();
      return success(response);
    } catch (e: any) {
      return failure(e);
    }
  }

  /**
   * Get new address
   * @return {Promise<Response>}
   */
  async getNewAddress(): Promise<Response> {
    try {
      const address: string = await this._bdk.getNewAddress();
      return success(address);
    } catch (e: any) {
      return failure(e);
    }
  }
}

const Bdk = new BdkInterface();
export default Bdk;
