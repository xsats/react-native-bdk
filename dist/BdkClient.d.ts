import {
  Network,
  WordCount,
  LoadWalletResponse,
  SendTransactionResult,
  AddressIndexVariant,
  PsbtSerialised,
} from './utils/types';
import {
  AddressInfo,
  Balance,
  LocalUtxo,
  TransactionDetails,
} from './classes/Bindings';
interface NativeBdk {
  generateMnemonic(wordCount: WordCount): Promise<string>;
  createDescriptorSecret(
    network: string,
    mnemonic: string,
    password: string
  ): Promise<string>;
  descriptorSecretDerive(path: string): Promise<string>;
  descriptorSecretExtend(path: string): Promise<string>;
  descriptorSecretAsPublic(): Promise<string>;
  descriptorSecretAsSecretBytes(): Promise<Array<number>>;
  createDescriptorPublic(publicKey: string): Promise<string>;
  descriptorPublicDerive(path: string): Promise<string>;
  descriptorPublicExtend(path: string): Promise<string>;
  initElectrumBlockchain(
    url: string,
    retry: string,
    stopGap: string,
    timeout: string
  ): Promise<number>;
  initEsploraBlockchain(
    url: string,
    proxy: string,
    concurrency: string,
    stopGap: string,
    timeout: string
  ): Promise<number>;
  getBlockHash(height: number): Promise<string>;
  getBlockchainHeight(): Promise<number>;
  loadWallet(
    mnemonic?: string,
    passphrase?: string,
    network?: Network,
    blockchainConfigUrl?: string,
    blockchainSocket5?: string,
    retry?: string,
    timeout?: string,
    blockchainName?: string,
    descriptor?: string
  ): Promise<LoadWalletResponse>;
  unloadWallet(): Promise<boolean>;
  syncWallet(): Promise<string>;
  getAddress(
    indexVariant: AddressIndexVariant,
    index: number
  ): Promise<AddressInfo>;
  getBalance(): Promise<Balance>;
  createTransaction(
    address: string,
    amount: number,
    fee_rate: number
  ): Promise<{
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
