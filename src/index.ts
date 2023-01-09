import { err, ok, Result } from '@synonymdev/result';
import { NativeModules } from 'react-native';
import { _exists } from './utils/helpers';
import type { CreateWalletRequest, CreateWalletResponse } from './utils/types';

class BdkInterface {
  public _bdk: any;

  constructor() {
    this._bdk = NativeModules.Bdk;
  }

  /**
   * Init wallet
   * @return {Promise<Result<createWalletResponse>>}
   */
  async createWallet(
    args: CreateWalletRequest
  ): Promise<Result<CreateWalletResponse>> {
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
      return ok(wallet);
    } catch (e: any) {
      return err(e);
    }
  }

  /**
   * Sync wallet
   * @return {Promise<Result<string>>}
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
   * Get new address
   * @return {Promise<Result<string>>}
   */
  async getNewAddress(): Promise<Result<string>> {
    try {
      const address: string = await this._bdk.getNewAddress();
      return ok(address);
    } catch (e: any) {
      return err(e);
    }
  }

  async multiply(a: number, b: number): Promise<number> {
    return this._bdk.multiply(a, b);
  }
}

const Bdk = new BdkInterface();
export default Bdk;
