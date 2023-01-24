import React, { Fragment, useState } from 'react';
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

import Bdk, {
  SendTransactionResult,
  CreateTransactionResult,
  InitWalletResponse,
  LocalUtxoFlat,
  TransactionDetails,
} from '../../../src';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const Home = () => {
  // BDK-RN method calls and state variables will be added here
  const [mnemonic, setMnemonic] = useState(
    'border core pumpkin art almost hurry laptop yellow major opera salt muffin'
  );
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('');
  const [wallet, setWallet] = useState({});
  const [syncResponse, setSyncResponse] = useState({});
  const [address, setAddress] = useState('');
  const [transaction, setTransaction] = useState({});
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [psbt, setPsbt] = useState('');

  const hasWallet = Object.keys(wallet).length !== 0;

  const generateMnemonic = async () => {
    setLoading(true);
    const result = await Bdk.generateMnemonic();
    console.log(result);
    handleResult(result);

    if (result.isOk()) setMnemonic(result.value);
  };

  const importWallet = async () => {
    setLoading(true);
    try {
      await Bdk.setBlockchain();
    } catch (error) {
      console.log(error);
    }

    const result = await Bdk.initWallet({ mnemonic, network: 'testnet' });

    if (result.isOk()) {
      await Bdk.syncWallet();
      await Bdk.getBalance();
      setWallet(result.value);
    }
    handleResult(result);
  };

  const wipeState = async () => {
    setDisplayText('');
    setBalance('');
    setWallet({});
    setSyncResponse({});
    setAddress('');
    setLoading(false);
    setTransaction({});
    setRecipient('');
    setAmount(0);
    setPsbt('');
  };

  const destroyWalletPrompt = async () => {
    await confirm({
      title: 'Destroy wallet?',
      message:
        'Are you sure you want to delete all traces of your wallet from this device?\n\nIf in doubt, back up the seed!',
      onOk: async () => await destroyWallet(),
    } as any);
  };

  const destroyWallet = async () => {
    setLoading(true);
    const result = await Bdk.destroyWallet();

    if (result.isOk()) {
      setDisplayText(result.value.toString());
      wipeState();
    }
  };

  const syncWallet = async () => {
    setLoading(true);
    const result = await Bdk.syncWallet();
    handleResult(result);

    if (result.isOk()) setSyncResponse(result.value);
  };

  const getBalance = async () => {
    setLoading(true);
    const result = await Bdk.getBalance();
    handleResult(result);

    if (result.isOk()) setBalance(result.value);
  };

  const getAddress = async () => {
    setLoading(true);
    const result = await Bdk.getNewAddress();
    handleResult(result);

    if (result.isOk()) setAddress(result.value);
  };

  const getLastUnusedAddress = async () => {
    setLoading(true);
    const result = await Bdk.getLastUnusedAddress();
    handleResult(result);

    if (result.isOk()) setAddress(result.value);
  };

  const initWallet = async () => {
    setLoading(true);

    const result = await Bdk.setBlockchain();
    handleResult(result);

    // TODO - check for existing wallet
    if (!hasWallet) {
      await generateMnemonic();
      await importWallet();
    } else {
      setDisplayText('Prevented wallet overwrite');
    }
  };

  const setBlockchain = async () => {
    setLoading(true);
    const result = await Bdk.setBlockchain();
    handleResult(result);

    if (result.isOk()) setAddress(result.value);
  };

  const createTx = async () => {
    setLoading(true);
    const result = await Bdk.createTransaction({
      address: recipient,
      amount,
      fee_rate: 1, // default 1 sats/byte
    });
    handleResult(result);

    if (result.isOk()) setTransaction(result.value);
  };

  const sendTx = async () => {
    setLoading(true);
    const result = await Bdk.sendTransaction({ psbt_base64: psbt });
    handleResult(result);

    if (result.isOk()) setTransaction(result.value);
  };

  const getTxs = async () => {
    setLoading(true);
    const result = await Bdk.getTransactions();
    handleResult(result);

    if (result.isOk()) setTransaction(result.value);
  };

  const listUnspent = async () => {
    setLoading(true);
    const result = await Bdk.listUnspent();
    handleResult(result);

    if (result.isOk()) setTransaction(result.value);
  };

  const testTxToSelf = async () => {
    setLoading(true);
    const result = await Bdk.getNewAddress();

    if (result.isErr()) throw new Error(result.error.message);

    const createResult = await Bdk.createTransaction({
      address: result.value,
      amount: 2000,
      fee_rate: 1, // default 1 sats/byte
    });
    // console.log(createResult);
    handleResult(createResult);

    if (createResult.isErr()) throw new Error(createResult.error.message);

    const unsigned_psbt = createResult.value.psbt_serialised_base64;
    const sendResult = await Bdk.sendTransaction({
      psbt_base64: unsigned_psbt,
    });

    if (sendResult.isOk()) setTransaction(sendResult.value);
  };

  const handleResult = (result: {
    isErr: () => any;
    error?: { message: string };
    value?:
      | string
      | InitWalletResponse
      | CreateTransactionResult
      | SendTransactionResult
      | TransactionDetails[]
      | LocalUtxoFlat[];
  }) => {
    if (!result) {
      setDisplayText('Result undefined');
      return;
    }
    if (result.isErr()) {
      setDisplayText(result.error!.message);
      return;
    }
    setDisplayText(JSON.stringify(result.value, null, 2));
    setLoading(false);
    console.log(result.value);
  };

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
        <View style={styles.sectionContainer}>
          {!hasWallet ? (
            <View style={styles.methodSection}>
              <Button
                title="Create New Wallet"
                style={styles.methodButton}
                disabled={loading}
                onPress={initWallet}
              />
              <Button
                title="Generate Mnemonic"
                style={styles.methodButton}
                disabled={loading}
                onPress={generateMnemonic}
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
                onPress={importWallet}
              />
              <Button
                title="Set Blockchain"
                style={styles.methodButton}
                onPress={setBlockchain}
              />
            </View>
          ) : (
            <View style={styles.methodSection}>
              <Button
                title="Sync Wallet"
                style={styles.methodButton}
                onPress={syncWallet}
              />
              <Button
                title="Set Blockchain"
                style={styles.methodButton}
                onPress={setBlockchain}
              />
              <Button
                title="Get Balance"
                style={styles.methodButton}
                onPress={getBalance}
              />
              <Button
                title="Get New Address"
                style={styles.methodButton}
                onPress={getAddress}
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
          )}
        </View>
        {/* input boxes and send transaction button */}
        {hasWallet ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sendSection}>
              <Fragment>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient Address"
                  onChangeText={setRecipient}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount (in sats)"
                  onChangeText={(e) => setAmount(parseInt(e))}
                />
                <Button
                  title="Create Transaction"
                  style={styles.methodButton}
                  onPress={createTx}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Psbt base64"
                  onChangeText={(e) => setPsbt(e)}
                />
                <Button
                  title="Send Transaction"
                  style={styles.methodButton}
                  onPress={sendTx}
                />
              </Fragment>
            </View>
            <View style={styles.sendSection}>
              <Fragment>
                <Button
                  title="Send Test Tx (To Self)"
                  style={styles.methodButton}
                  onPress={testTxToSelf}
                />
              </Fragment>
            </View>
            <View style={[styles.sendSection, { marginTop: 100 }]}>
              <Fragment>
                <Button
                  title="Destroy Wallet"
                  style={styles.methodButton}
                  onPress={destroyWalletPrompt}
                />
              </Fragment>
            </View>
          </View>
        ) : null}
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
              onPress={destroyWalletPrompt}
            />
          </Fragment>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Home;
