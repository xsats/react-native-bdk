import { Result } from '@synonymdev/result';
import { CreateTransactionArgs, ImportWalletArgs, InitWalletResponse, TransactionDetails, CreateTransactionResult, SignTransactionArgs, SendTransactionResult, LocalUtxoFlat } from './utils/types';
declare class BdkInterface {
    _bdk: any;
    constructor();
    /**
     * Get all transactions
     * @returns {Promise<Result<string>>}
     */
    listTransactions(): Promise<Result<Array<TransactionDetails>>>;
    /**
     * Create new wallet
     * @returns {Promise<Result<InitWalletResponse>>}
     */
    createWallet(): Promise<Result<InitWalletResponse>>;
    /**
     * Import an existing wallet from mnemonic
     * @returns {Promise<Result<Ok<InitWalletResponse>>>}
     */
    importWallet(args: ImportWalletArgs): Promise<Result<InitWalletResponse>>;
    /**
     * Delete current wallet
     * @returns {Promise<Result<string>>}
     */
    destroyWallet(): Promise<Result<boolean>>;
    /**
     * Sync wallet with configured block explorer
     * @returns {Promise<Result<string>>}
     */
    syncWallet(): Promise<Result<string>>;
    /**
     * Get next new address
     * @returns {Promise<Result<string>>}
     */
    getNewAddress(): Promise<Result<string>>;
    /**
     * Get last unused address
     * @returns {Promise<Result<string>>}
     */
    getLastUnusedAddress(): Promise<Result<string>>;
    /**
     * Get wallet balance
     * @returns {Promise<Result<string>>}
     */
    getBalance(): Promise<Result<string>>;
    /**
     * Set blockchain config (block explorer/wallet server)
     * @returns {Promise<Result<Ok<string>>>}
     */
    setBlockchain(): Promise<Result<string>>;
    /**
     * Check if wallet has been configured with block explorer/backend connection info
     * @returns {Promise<Result<boolean>>}
     */
    isBlockchainSet(): Promise<Result<boolean>>;
    /**
     * Construct psbt from tx parameters
     * @returns {Promise<Result<TxBuilderResult>>}
     */
    createTransaction(args: CreateTransactionArgs): Promise<Result<CreateTransactionResult>>;
    /**
     * Sign and broadcast a transaction via the
     * corresponding psbt using the current wallet
     * @returns {Promise<Result<string>>}
     */
    sendTransaction(args: SignTransactionArgs): Promise<Result<SendTransactionResult>>;
    /**
     * Get transactions associated with current wallet
     * @returns {Promise<Result<string>>}
     */
    getTransactions(): Promise<Result<Array<TransactionDetails>>>;
    /**
     * List local UTXOs associated with current wallet
     * @returns {Promise<Result<string>>}
     */
    listLocalUnspent(): Promise<Result<Array<LocalUtxoFlat>>>;
}
declare const Bdk: BdkInterface;
export default Bdk;
