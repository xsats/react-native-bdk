import { NativeModules, Platform } from 'react-native';
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

const LINKING_ERROR =
  "The package 'react-native-bdk' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const NativeBDK =
  NativeModules?.BdkModule ??
  new Proxy(
    {},
    {
      get(): void {
        throw new Error(LINKING_ERROR);
      },
    }
  );

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
    timeout: string,
    stopGap: string
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

  initWallet(
    mnemonic: string,
    password: string,
    descriptor: string,
    network: Network
  ): Promise<boolean>;
  loadWallet(
    mnemonic: string,
    passphrase: string,
    network: Network,
    blockchainConfigUrl: string,
    blockchainSocket5: string,
    retry: string,
    timeout: string,
    blockchainName: string,
    descriptor: string
  ): Promise<LoadWalletResponse>;
  unloadWallet(): Promise<boolean>;

  getNetwork(): Promise<string>;
  syncWallet(): Promise<boolean>;
  getAddress(
    indexVariant: AddressIndexVariant,
    index: number
  ): Promise<AddressInfo>;
  getBalance(): Promise<Balance>;
  createTransaction(
    address: string,
    amount: number,
    fee_rate: number
  ): Promise<{ txdetails: TransactionDetails; psbt: PsbtSerialised }>;
  sendTransaction(psbt_base64: string): Promise<SendTransactionResult>;

  listTransactions(): Promise<Array<TransactionDetails>>;
  listUnspent(): Promise<Array<LocalUtxo>>;

  addTxRecipient(recipient: string, amount: number): Promise<string>;
}

export class BdkClient {
  protected _bdk: NativeBdk = NativeBDK;

  constructor() {
    this._bdk = NativeBDK;
  }
}
