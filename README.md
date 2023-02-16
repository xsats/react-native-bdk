# react-native-bdk

React-Native wrapper for BDK

## Installation

To install react-native-bdk, run the following command:

```ts
yarn add react-native-bdk
```

You will also need to link the library to your React Native project. On iOS, you will need to run pod install. On Android, you will need to add the following to your android/settings.gradle:

```ts
include ':react-native-bdk'
project(':react-native-bdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-bdk/android')
```

And the following to your android/app/build.gradle:

```ts
dependencies {
    implementation project(':react-native-bdk')
}
```

## Usage

### Importing the library

You will need to import the library to use it in your React Native project. You can do this by adding the following line to the top of your file:

```ts
import Bdk from 'react-native-bdk';
```

The `react-native-bdk` library exports a fresh instance of the Bdk class. Given the nature of RN Native modules, this is a singleton module class.
However, the library can be used to manage multiple wallets via the integrated `store` module which uses iOS/Android native keychain to store encrypted wallets (see below and the example app for more details and example usage).

### Loading a Wallet

The first step is to load a wallet into BDK. You can do this by calling the `loadWallet()` method of the Bdk class, passing in a mnemonic or descriptor and a configuration object.

```ts
const wallet = await bdk.loadWallet({
  mnemonic:
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  config: {
    network: 'testnet',
    password: 'mypassword',
  },
});
```

You can also use a descriptor instead of a mnemonic:

```ts
const wallet = await bdk.loadWallet({
  descriptor:
    'wpkh(tprv8ZgxMBicQKsPf9xL2M9Uh3TqmjtjBZwUvJ8xrWcJnQ5PjKzPvj8XnWzUJNpjZpMvEw1rW7JcQQfZLjUJvz9XW7UZpzFpAaRbvwJxWxhjf/0/*)',
  config: {
    network: 'testnet',
    password: 'mypassword',
  },
});
```

### Generating a Mnemonic

If you don't already have a mnemonic or descriptor and you want to generate one, you can call the generateMnemonic method of the BdkInterface class, passing in a wordCount(default 24):

```ts
const mnemonic = await bdk.generateMnemonic(12);
```

## Bdk API Reference

### `generateMnemonic(wordCount?: number): Promise<Result<string>>`

Generates a new mnemonic.

- `wordCount` (optional, default 24): Number of words in the generated mnemonic.
- Returns: a promise that resolves to a `Result` object, which contains the generated mnemonic as a string, or an error.

### `loadWallet(args: LoadWalletInput): Promise<Result<LoadWalletResponse>>`

Loads a wallet from a mnemonic or descriptor and config. Defaults to testnet.

- `args`: Object containing the following properties:
  - `mnemonic`: Mnemonic to load the wallet from.
  - `descriptor`: Descriptor to load the wallet from.
  - `config`: Object containing the following properties (optional):
    - `password`: Wallet password.
    - `network`: Network to connect to (default: "testnet").
    - `blockchainConfigUrl`: URL of the blockchain config.
    - `blockchainSocket5`: URL of the blockchain socket5.
    - `retry`: Number of retries to connect.
    - `timeout`: Timeout for connection.
    - `blockchainName`: Name of the blockchain.
- Returns: a promise that resolves to a `Result` object, which contains a `LoadWalletResponse` object, or an error.

The `LoadWalletResponse` object has the following structure:

```ts
{
  descriptor_external: string;
  descriptor_internal: string;
  address_external_zero: string;
}
```

### `unloadWallet(): Promise<Result<boolean>>`

Deletes the current wallet.

- Returns: a promise that resolves to a `Result` object, which contains a boolean indicating whether the operation was successful, or an error.

### `syncWallet(): Promise<Result<string>>`

Syncs the wallet with the configured block explorer.

- Returns: a promise that resolves to a `Result` object, which contains a string indicating the status of the sync, or an error.

### `getAddress(): Promise<Result<AddressInfo>>`

Gets the next new address for the wallet.

- `args`: GetAddressInput object containing the following properties:

  - `indexVariant`: Address retrieval policy - NEW, LAST_UNUSED, (PEEK, RESET coming).
  - `index`: Address index (PEEK, RESET only) (Optional).

- Returns: a promise that resolves to a `Result` object, which contains the new address as a string and its index `AddressInfo`, or an error.

### `getBalance(): Promise<Result<string>>`

Gets the balance of the wallet.

- Returns: a promise that resolves to a `Result` object, which contains the balance as a string, or an error.

### `setBlockchain(): Promise<Result<string>>`

Sets the blockchain config (block explorer/wallet server).

- Returns: a promise that resolves to a `Result` object, which contains the status of the operation as a string, or an error.

### `createTransaction(args: CreateTransactionInput): Promise<Result<CreateTransactionResult>>`

Constructs an unsigned transaction using provided tx parameters.

- `args`: CreateTransactionInput object containing the following properties:

  - `address`: Recipient address.
  - `amount`: Output amount (sats).
  - `fee_rate`: Fee rate (sat/vByte).

- Returns: a promise that resolves to a `Result` object, which contains the tx details and base64 encoded tx `CreateTransactionResult`, or an error.

### `sendTransaction(args: SignTransactionInput): Promise<Result<SignTransactionResult>>`

Sign and broadcast a transaction via the corresponding psbt using the current wallet.

- `args`: `SendTransactionInput` object containing the following properties:

  - `psbt_base64`: Base64 encoded signed transaction.

- Returns: a promise that resolves to a `Result` object, which contains the tx details and base64 encoded tx `SendTransactionResult`, or an error.

### `getTransactions(): Promise<Result<Array<TransactionDetails>>>`

Sign and broadcast a transaction via the corresponding psbt using the current wallet.

- Returns: a promise that resolves to a `Result` object, which contains an array of tx details objects `[TransactionDetails]`, or an error.

`TransactionDetails` object:

```ts
{
  txid: string;
  received: number;
  sent: number;
  fee?: number;
  confirmation_timestamp?: number;
  confirmation_blockheight?: number;
}
```

### `listUnspent(): Promise<Result<Array<LocalUtxoFlat>>>`

Sign and broadcast a transaction via the corresponding psbt using the current wallet.

- Returns: a promise that resolves to a `Result` object, which contains an array of flat utxo objects `[LocalUtxoFlat]`, or an error.

`LocalUtxoFlat` object:

```ts
{
  outpoint_txid: string;
  outpount_vout: string;
  txout_value: number;
  txout_address: string;
  keychain: KeychainKind;
  is_spent: boolean;
}
```

**Note**:
`Result<T>` is a union type that can either be `ok(T)` or `err(string)`. `ok(T)` represents a successful operation and `err(string)` represents an error message.

## Features/Roadmap

- [x] Generate a mnemonic with specified wordcount (12, 15, 18, 21, 24)
- [x] Load wallet into bdk from one of 1) decriptor or 2) mnemonic (default wpkh) with optional password and default config
- [ ] Load wallet from mnemonic with custom script type (taproot, legacy, etc)
- [ ] Load wallet with specific blockchain server/config
- [ ] Unload wallet from bdk (iOS not implemented)
- [x] Multiwallet support/wallet persistence via locally encrypted 'wallet store' in native keychain
- [ ] Configure blockchain server URL of loaded wallet
- [ ] Configure blockchain server config e.g. proxy, reconnect strategy (aggressive, passive, etc.) of loaded wallet
- [x] Sync wallet with a default block server
- [x] Get wallet network (mainnet, testnet, signet, regtest)
- [x] Retrieve basic wallet balance
- [ ] Retrieve detailed wallet balance (confirmed, unconfirmed, spendable etc.)
- [x] Retrieve new address
- [x] Retrieve last unused address
- [ ] Retrieve ext/internal address by index
- [x] Construct basic single output transaction (specified recipient address, amount and fee rate)
- [ ] Sign single-sig transaction and broadcast via default server
- [x] Sign arbitrary PSBT referencing local UTXOs using loaded wallet
- [ ] Construct transaction with manual UTXO selection
- [ ] Construct transaction with configurable coin selection algorithm
- [ ] Construct multi output transaction
- [ ] Construct multisig transaction
- [x] Get transactions associated with loaded wallet
- [x] List local unspent UTXOs (metadata needed for selection, not keys)

## Credit

- [Bitcoin Zavior](https://github.com/BitcoinZavior), creator of the [BDK-RN library](https://github.com/LtbLightning/bdk-rn), which this library builds upon. The starting point of the integrated example app for the lib was the [BdkRnQuickStart demo app](https://github.com/LtbLightning/BdkRnQuickStart) also created by Bitcoin Zavior. Initially, I aimed to fork and submit PRs to the BDK-RN lib but substantial RN lib boilerplate was missing/outdated, as were the underlying BDK Swift and Kotlin bindings, making doing so a much larger task than simply starting from a clean project.
- Developers and maintainers of the underlying Rust [BDK](https://github.com/bitcoindevkit/bdk) library
- Developers and maintainers of the [BDK-FFI](https://github.com/bitcoindevkit/bdk-ffi) bindings, specifically Kotlin and Swift.
- The contributors of sister project, [react-native-ldk](https://github.com/synonymdev/react-native-ldk) for native wrapper structure guidance and inspiration.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
