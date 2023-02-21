import React, { Fragment, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import Button from '../elements/Button';
import { styles } from '../styles/styles';
import { confirm } from '../utils/Alert';

import {
  Mnemonic,
  AddressIndexVariant,
  ElectrumConfig,
  Blockchain,
  Wallet as BdkWallet,
} from '../../../src';
import { saveToDisk, loadFromDisk, walletStore } from '../action/store';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const DUMMY_PIN = '000000';

const Wallet = ({ navigation }) => {
  // BDK-RN method calls and state variables will be added here
  const [mnemonic, setMnemonic] = useState(
    'border core pumpkin art almost hurry laptop yellow major opera salt muffin'
  );
  const [descriptor, setDescriptor] = useState(
    "wpkh(tprv8ZgxMBicQKsPe3XJnFzqohS1JteG4w6TnzLVqnPYwH2ZjjZGrQkXTPQY5UJFFEqKQgwnRdoPXLGQ5YtMD6exJidFHxocPBe5tXYBCZT84QN/84'/1'/0'/0/*)"
  );
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('');
  const [wallet, setWallet] = useState(BdkWallet);
  const [blockchain, setBlockchain] = useState(Blockchain);
  const [address, setAddress] = useState('');
  const [transaction, setTransaction] = useState({});
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [psbt, setPsbt] = useState('');

  useMemo(async () => await BdkWallet.init({ mnemonic: mnemonic }), [mnemonic]);
  useMemo(
    async () =>
      await Blockchain.create({
        url: 'ssl://electrum.blockstream.info:60002',
        retry: '',
        timeout: '',
        stopGap: '',
      }),
    []
  );

  const walletReady = wallet && wallet.isInit === true;
  const blockchainReady = blockchain && blockchain.isInit === true;

  // wallet management
  const wipeState = async () => {
    setDisplayText('');
    setBalance('');
    setWallet(BdkWallet);
    setAddress('');
    setLoading(false);
    setTransaction({});
    setRecipient('');
    setAmount(0);
    setPsbt('');
  };

  const backupWalletPrompt = async () => {
    confirm({
      title: 'Backup wallet?',
      message:
        'Would you like to backup an encrypted copy of the wallet on your device?',
      onOk: async () => {
        await backupWallet();
        await wipeState();
      },
    } as any);
  };

  const backupWallet = async () => {
    setLoading(true);
    await saveToDisk(wallet, DUMMY_PIN);
    setLoading(false);
  };

  const fetchStoredWallets = async () => {
    setLoading(true);
    await loadFromDisk();
    setDisplayText(JSON.stringify(walletStore.getWallets()));
    setLoading(false);
  };

  // wallet initialisation

  const genMnemonicClass = async () => {
    const mnemonic = await Mnemonic.create(24);
    console.log(mnemonic.asString());
    setMnemonic(mnemonic.asString());
  };

  const initWallet = async (withNew?: boolean) => {
    setLoading(true);
    if (withNew) {
      setMnemonic((await Mnemonic.fromEntropy(24)).asString());
    }
    await BdkWallet.init({ mnemonic: mnemonic });

    if (wallet.isInit) {
      setWallet(wallet);
      setLoading(false);
      return wallet;
    }
  };

  const syncWallet = async () => {
    setLoading(true);
    const synced = await wallet.sync();

    if (synced) setDisplayText('Wallet synced');
    setLoading(false);
  };

  const getBalance = async () => {
    const balances = await wallet.getBalance();

    if (balances) {
      setDisplayText(JSON.stringify(balances, null, 2));
      setBalance(balances.total.toString());
    }
  };

  const getNetwork = async () => {
    setLoading(true);
    const network = await wallet.network();
    setDisplayText(network);
    setLoading(false);
  };

  const getAddress = async (indexVariant: AddressIndexVariant) => {
    setLoading(true);
    const result = await wallet.getAddress(indexVariant, 0);

    setLoading(false);
    if (result) {
      setDisplayText(JSON.stringify(result));
      return result;
    }
  };

  const getLastUnusedAddress = async () => {
    const result = await getAddress(AddressIndexVariant.LAST_UNUSED);
    if (result) setAddress(result.address);
  };

  const getNewAddress = async () => {
    const result = await getAddress(AddressIndexVariant.NEW);
    if (result) setAddress(result.address);
  };

  const initBlockchain = async () => {
    setLoading(true);
    const config: ElectrumConfig = {
      url: 'ssl://electrum.blockstream.info:60002',
      retry: '',
      timeout: '',
      stopGap: '',
    };
    const blockchain = await Blockchain.create(config);
    setBlockchain(blockchain);
    setDisplayText(await blockchain.getBlockHash());
    setLoading(false);
  };

  const getTxs = async () => {
    setLoading(true);
    const result = await wallet.listTransactions();

    if (result && result.length > 0) {
      setDisplayText(JSON.stringify(result));
    }
  };

  const listUnspent = async () => {
    setLoading(true);
    const result = await wallet.listUnspent();

    if (result && result.length > 0) setDisplayText(JSON.stringify(result));
  };

  if (loading) {
    return (
      <SafeAreaView>
        <StatusBar />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.container}
        >
          <ActivityIndicator />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!blockchainReady) {
    return (
      <SafeAreaView>
        <StatusBar />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.container}
        >
          {!loading ? null : <ActivityIndicator />}
          <View style={styles.methodSection}>
            <Button
              title="Init Blockchain"
              style={styles.methodButton}
              onPress={initBlockchain}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Image
            style={{ resizeMode: 'stretch', height: 36, width: 36 }}
            source={bitcoinLogo}
          />
          <Text style={styles.headerText}>BDK-RN Example</Text>
          <Image
            style={{ resizeMode: 'center', height: 40, width: 25 }}
            source={bdkLogo}
          />
        </View>

        {/* Balance */}
        {!loading ? (
          <View style={styles.balanceSection}>
            <Text style={styles.balanceText} selectable>
              {'Balance: '}
            </Text>
            <Text selectable>{balance ? balance : '0'} Sats</Text>
          </View>
        ) : (
          <ActivityIndicator />
        )}

        {/* method call result */}
        {displayText && (
          <View style={styles.responseSection}>
            <Text style={styles.responseText} selectable>
              Response:
            </Text>
            <Text selectable>{displayText}</Text>
          </View>
        )}

        {/* buttons for method calls */}
        {walletReady ? (
          <View style={styles.sectionContainer}>
            <View style={styles.methodSection}>
              <Button
                title="Sync Wallet"
                style={styles.methodButton}
                onPress={syncWallet}
              />
              <Button
                title="Set Blockchain"
                style={styles.methodButton}
                onPress={initBlockchain}
              />
              <Button
                title="Get Balance"
                style={styles.methodButton}
                onPress={getBalance}
              />
              <Button
                title="Get Network"
                style={styles.methodButton}
                onPress={getNetwork}
              />
              <Button
                title="Get New Address"
                style={styles.methodButton}
                onPress={getNewAddress}
              />
              <Button
                title="Get Last Unused Address"
                style={styles.methodButton}
                onPress={getLastUnusedAddress}
              />
              <Button
                title="Get Transactions"
                style={styles.methodButton}
                onPress={getTxs}
              />
              <Button
                title="List UTXOs"
                style={styles.methodButton}
                onPress={listUnspent}
              />
            </View>
          </View>
        ) : (
          <View style={styles.sectionContainer}>
            <View style={styles.methodSection}>
              <Button
                title="Create New Wallet"
                style={styles.methodButton}
                disabled={loading}
                onPress={initWallet(true)}
              />
              <Button
                title="Generate Mnemonic"
                style={styles.methodButton}
                disabled={loading}
                onPress={genMnemonicClass}
              />
              <Button
                title="Generate Mnemonic"
                style={styles.methodButton}
                disabled={loading}
                onPress={genMnemonicClass}
              />
              <TextInput
                style={styles.input}
                multiline
                editable={!loading}
                value={mnemonic}
                onChangeText={setMnemonic}
                textAlignVertical="top"
              />
              <Button
                title="Import Wallet"
                disabled={loading}
                style={styles.methodButton}
                onPress={initWallet}
              />
              <Button
                title="Display Stored Wallets"
                disabled={loading}
                style={styles.methodButton}
                onPress={fetchStoredWallets}
              />
            </View>
          </View>
        )}
      </ScrollView>
      {displayText === 'already_init' ? (
        <View
          style={[
            styles.sendSection,
            { marginTop: 100, justifyContent: 'center', marginHorizontal: 20 },
          ]}
        >
          <Fragment>
            <Button
              title="Destroy Wallet"
              style={styles.methodButton}
              onPress={backupWalletPrompt}
            />
          </Fragment>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Wallet;
