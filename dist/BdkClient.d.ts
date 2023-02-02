import { Network, WordCount, LoadWalletResponse, SendTransactionResult, AddressIndexVariant, PsbtSerialised } from './utils/types';
import { AddressInfo, Balance, LocalUtxo, TransactionDetails } from './classes/Bindings';
interface NativeBdk {
    generateMnemonic(wordCount: WordCount): Promise<string>;
    loadWallet(mnemonic?: string, passphrase?: string, network?: Network, blockchainConfigUrl?: string, blockchainSocket5?: string, retry?: string, timeOut?: string, blockchainName?: string, descriptor?: string): Promise<LoadWalletResponse>;
    unloadWallet(): Promise<boolean>;
    syncWallet(): Promise<string>;
    getAddress(indexVariant: AddressIndexVariant, index: number): Promise<AddressInfo>;
    getBalance(): Promise<Balance>;
    setBlockchain(): Promise<string>;
    createTransaction(address: string, amount: number, fee_rate: number): Promise<{
        txdetails: TransactionDetails;
        psbt: PsbtSerialised;
    }>;
    sendTransaction(psbt_base64: string): Promise<SendTransactionResult>;
    getTransactions(): Promise<Array<TransactionDetails>>;
    listUnspent(): Promise<Array<LocalUtxo>>;
    addTxRecipient(recipient: string, amount: number): Promise<string>;
}
export declare class BdkClient {
    protected _bdk: NativeBdk;
    constructor();
}
export {};
