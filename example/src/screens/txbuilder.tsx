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
  Clipboard,
} from 'react-native';
import Button from '../elements/Button';
import { styles } from '../styles/styles';
import { confirm } from '../utils/Alert';

import Bdk from '../../../src';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const TxBuilder = () => {
  // BDK-RN method calls and state variables will be added here
  const [mnemonic, setMnemonic] = useState(
    'border core pumpkin art almost hurry laptop yellow major opera salt muffin'
  );
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [outputAmount, setOutputAmount] = useState('');
  const [unspent, setUnspent] = useState({});
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [transaction, setTransaction] = useState({});
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState('');
  const [psbt, setPsbt] = useState('');

  const hasRemainingBalance = remainingBalance !== 0 ? true : false;

  const getBalance = async () => {
    setLoading(true);
    const result = await Bdk.getBalance();
    handleResult(result);

    if (result.isOk()) setRemainingBalance(parseInt(result.value));
  };

  const getAddress = async () => {
    setLoading(true);
    const result = await Bdk.getNewAddress();
    handleResult(result);

    if (result.isOk()) {
      setAddress(result.value);
      Clipboard.setString(result.value);
    }
  };

  const wipeTxState = async () => {
    setOutputAmount('');

    getBalance();
  };

  const destroyTxPrompt = async () => {
    await confirm({
      title: 'Destroy tx?',
      message: '',
      onOk: async () => await destroyTx(),
    } as any);
  };

  const destroyTx = async () => {
    // setLoading(true);
    // const result = await Bdk.destroyTx();
    // if (result.isOk()) {
    //   setDisplayText(result.value.toString());
    //   wipeTxState();
    // }
  };

  const addRecipient = async () => {
    setLoading(true);
    const args = {
      recipient,
      amount,
    };
    const result = await Bdk.addTxRecipient(args);
    handleResult(result);

    if (result.isOk()) {
      setOutputAmount(outputAmount + amount);
      setAmount(0);
    }
  };

  const finaliseTx = async () => {
    setLoading(true);
  };

  const handleResult = (result: {
    isErr: () => any;
    error?: { message: string };
    value?: string;
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

        {/* Tx Output */}
        {!loading ? (
          <View style={styles.balanceSection}>
            <Text style={styles.balanceText} selectable>
              {'Output amount: '}
            </Text>
            <Text selectable>{outputAmount ? outputAmount : '0'} Sats</Text>
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
          <View style={styles.methodSection}>
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
            {/* <Button
                title="Add UTXO"
                style={styles.methodButton}
                disabled={loading}
                onPress={addTxUnspent}
              /> 
              <Button
                title="List inputs"
                style={styles.methodButton}
                onPress={listInputs}
              />
              <Button
                title="List outputs"
                style={styles.methodButton}
                onPress={listOutputs}
              /> */}
            <Button
              title="Finalise Transaction"
              style={styles.methodButton}
              onPress={finaliseTx}
            />
          </View>
        </View>
        {/* input boxes and send transaction button */}
        {hasRemainingBalance ? (
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
                  title="Add Recipient"
                  style={styles.methodButton}
                  onPress={addRecipient}
                />
              </Fragment>
            </View>
            <View style={[styles.sendSection, { marginTop: 100 }]}>
              <Fragment>
                <Button
                  title="Destroy Tx"
                  style={styles.methodButton}
                  onPress={destroyTxPrompt}
                />
              </Fragment>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TxBuilder;
