interface Wallet {
    external_descriptor: string;
    internal_descriptor: string;
}
declare class WalletStore {
    wallets: Wallet[];
    tx_metadata: {};
    constructor();
    /**
     * Wrapper for storage call.
     *
     * @param key
     * @param value
     * @returns {Promise<any>|Promise<any> | Promise<void> | * | Promise | void}
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * Wrapper for storage call.
     *
     * @param key
     * @returns {Promise<any>|*}
     */
    getItem(key: string): Promise<string | null>;
    /**
     * Load all wallets from disk and
     * maps them to `this.wallets`
     *
     * @returns {Promise.<boolean>}
     */
    loadFromDisk(): Promise<boolean>;
    /**
     * Retrieve wallet from store via external_descriptor and
     * remove from `this.wallets`
     *
     * @param wallet {Wallet}
     */
    deleteWallet(wallet: Wallet): void;
    /**
     * Saves wallet store to disk.
     *
     * @returns {Promise} Result of storage save
     */
    saveToDisk(): Promise<void>;
    /**
     * Fetch all wallets in `this.wallets`
     * @returns {Array.<AbstractWallet>}
     */
    getWallets(): Wallet[];
}
export default WalletStore;
