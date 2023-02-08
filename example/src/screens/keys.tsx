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

import { Bdk, DescriptorSecretKey, Network } from '../../../src';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const Keys = () => {
  // BDK-RN method calls and state variables will be added here
  const [mnemonic, setMnemonic] = useState(
    'border core pumpkin art almost hurry laptop yellow major opera salt muffin'
  );
  const [descriptor, setDescriptor] = useState('');
  const [password, setPassword] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);

  const hasDescriptor = descriptor !== '' ? true : false;

  const createDescriptor = async () => {
    const secret = await DescriptorSecretKey.create(Network.Testnet, mnemonic);
    console.log(secret.asString());

    if (secret.asString()) setDisplayText(secret.asString()!);
  };

  const descriptorSecretDerive = async () => {
    // NOTE path must start with 'm'
    const secret = await DescriptorSecretKey.derive('m/21');
    console.log(secret.asString());

    if (secret.asString()) setDisplayText(secret.asString()!);
  };

  const descriptorSecretExtend = async () => {
    const secret = await DescriptorSecretKey.extend('m/212121');
    console.log(secret.asString());

    if (secret.asString()) setDisplayText(secret.asString()!);
  };

  const descriptorSecretAsPublic = async () => {
    const secret = await DescriptorSecretKey.asPublic();
    console.log(secret);

    if (secret) setDisplayText(secret);
  };

  const descriptorSecretAsBytes = async () => {
    const secret = await DescriptorSecretKey.secretBytes();
    console.log(secret);

    if (secret) setDisplayText(JSON.stringify(secret));
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
            {/* <Text selectable>{outputAmount ? outputAmount : '0'} Sats</Text> */}
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
              title="Create Descriptor"
              style={styles.methodButton}
              onPress={createDescriptor}
            />
            <Button
              title="Derive"
              style={styles.methodButton}
              onPress={descriptorSecretDerive}
            />
            <Button
              title="Extend"
              style={styles.methodButton}
              onPress={descriptorSecretExtend}
            />
            <Button
              title="Secret --> Public"
              style={styles.methodButton}
              onPress={descriptorSecretAsPublic}
            />
            <Button
              title="Secret --> Bytes"
              style={styles.methodButton}
              onPress={descriptorSecretAsBytes}
            />
          </View>
        </View>
        {/* input boxes and send transaction button */}
        {hasDescriptor ? (
          <View style={styles.sectionContainer}>
            {/* <View style={styles.sendSection}>
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
            </View> */}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Keys;
