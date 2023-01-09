import { Result } from '@synonymdev/result';
import type { CreateWalletRequest, CreateWalletResponse } from './utils/types';
declare class BdkInterface {
    _bdk: any;
    constructor();
    /**
     * Init wallet
     * @return {Promise<Result<createWalletResponse>>}
     */
    createWallet(args: CreateWalletRequest): Promise<Result<CreateWalletResponse>>;
    /**
     * Sync wallet
     * @return {Promise<Result<string>>}
     */
    syncWallet(): Promise<Result<string>>;
    /**
     * Get new address
     * @return {Promise<Result<string>>}
     */
    getNewAddress(): Promise<Result<string>>;
    multiply(a: number, b: number): Promise<number>;
}
declare const Bdk: BdkInterface;
export default Bdk;
