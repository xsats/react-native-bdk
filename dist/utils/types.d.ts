export declare enum WordCount {
    WORDS12 = 12,
    WORDS15 = 15,
    WORDS18 = 18,
    WORDS21 = 21,
    WORDS24 = 24
}
export declare enum Network {
    Testnet = "testnet",
    Regtest = "regtest",
    Bitcoin = "bitcoin",
    Signet = "signet"
}
export declare enum EntropyLength {
    Length16 = 16,
    Length24 = 24,
    Length32 = 32
}
export interface WalletConfig {
    mnemonic?: string;
    descriptor?: string;
    network?: Network;
    blockchainConfigUrl?: string;
    blockchainSocket5?: string;
    retry?: string;
    timeOut?: string;
    blockchainName?: string;
}
interface BaseWalletInput {
    config?: WalletConfig;
}
interface LoadWalletFromDescriptorInput extends BaseWalletInput {
    descriptor: string;
    mnemonic?: never;
    passphrase?: string;
}
interface LoadWalletFromMnemonicInput extends BaseWalletInput {
    mnemonic: string;
    descriptor?: never;
    passphrase?: string;
}
export type LoadWalletInput = LoadWalletFromDescriptorInput | LoadWalletFromMnemonicInput;
export interface LoadWalletResponse {
    descriptor_external: string;
    descriptor_internal: string;
    address_external_zero: string;
}
export interface CreateTransactionInput {
    address: string;
    amount: number;
    fee_rate: number;
}
export interface SendTransactionInput {
    psbt_base64: string;
}
export interface ConfirmedTransaction {
    txid: string;
    block_timestamp: number;
    sent: number;
    block_height: number;
    received: number;
    fee: number;
}
export interface PendingTransaction {
    txid: string;
    sent: number;
    received: number;
    fee: number;
}
export interface TransactionsResponse {
    confirmed: Array<ConfirmedTransaction>;
    pending: Array<PendingTransaction>;
}
export interface BlockTime {
    timestamp?: number;
    height?: number;
}
export interface TransactionDetails {
    txid: string;
    received: number;
    sent: number;
    fee?: number;
    confirmationTime?: BlockTime;
}
export interface OutPoint {
    txid: string;
    vout: number;
}
export interface TxIn {
    previous_output: OutPoint;
    script_sig: string;
    sequence: number;
    witness: string;
}
export interface TxOut {
    value: number;
    script_pubkey: string;
}
export declare enum KeychainKind {
    External = "EXTERNAL",
    Internal = "INTERNAL,"
}
export interface LocalUtxo {
    outpoint: OutPoint;
    txout: TxOut;
    keychain: KeychainKind;
    is_spent: boolean;
}
export interface LocalUtxoFlat {
    outpoint_txid: string;
    outpount_vout: string;
    txout_value: number;
    txout_address: string;
    keychain: KeychainKind;
    is_spent: boolean;
}
export interface Transaction {
    version: number;
    lock_time: number;
    input: TxIn;
    output: TxOut;
}
export interface PsbtSerialised {
    txBase64: string;
    serialised: string;
}
export interface CreateTransactionResult {
    txdetails: TransactionDetails;
    psbt: PsbtSerialised;
}
export interface SignTransactionResult {
    signed_psbt_base64: string;
    signed_tx_hex: string;
}
export interface SendTransactionResult {
    txid: string;
    fee_amount: number;
}
export interface AddRecipientInput {
    recipient: string;
    amount: number;
}
export declare enum AddressIndexVariant {
    NEW = "NEW",
    LAST_UNUSED = "LAST_UNUSED"
}
interface New {
    type: AddressIndexVariant.NEW;
    index: undefined;
}
interface LastUnused {
    type: AddressIndexVariant.LAST_UNUSED;
    index: undefined;
}
export type AddressIndex = New | LastUnused;
export interface AddressInfo {
    address: string;
    index: number;
}
export interface GetAddressInput {
    indexVariant: AddressIndexVariant;
    index?: number;
}
export {};
