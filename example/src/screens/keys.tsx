import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
} from 'react-native';
import Button from '../elements/Button';
import { styles } from '../styles/styles';

import {
  DescriptorSecretKey,
  Network,
  DescriptorPublicKey,
} from '../../../src';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const Keys = () => {
  // BDK-RN method calls and state variables will be added here
  const [mnemonic, setMnemonic] = useState(
    'border core pumpkin art almost hurry laptop yellow major opera salt muffin'
  );
  const [descriptorSec, setDescriptorSec] = useState('');
  const [descriptorPub, setDescriptorPub] = useState('');
  const [password, setPassword] = useState('h*^5&^7OniOhuk89T^&98)fvJHGVGjh');
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);

  const hasPubDescriptor = descriptorPub !== '' ? true : false;

  const createDescriptor = async () => {
    const secret = await DescriptorSecretKey.create(
      Network.Testnet,
      mnemonic,
      password
    );
    console.log(secret.asString());

    if (secret.asString()) {
      const sec = secret.asString();
      setDescriptorSec(sec!);
      setDisplayText(sec!);
    }
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
    const pub = await DescriptorSecretKey.asPublic();
    console.log(pub);

    if (pub) {
      setDisplayText(pub);
      setDescriptorPub(pub);
    }
  };

  const descriptorSecretAsBytes = async () => {
    const secret = await DescriptorSecretKey.secretBytes();
    console.log(secret);

    if (secret) setDisplayText(JSON.stringify(secret));
  };

  const createPubDescriptor = async () => {
    const secret = await DescriptorPublicKey.create();
    console.log(secret.asString());

    if (secret.asString()) setDisplayText(secret.asString()!);
  };

  const descriptorPubDerive = async () => {
    // NOTE path must start with 'm'
    const secret = await DescriptorPublicKey.derive('m/1729');
    console.log(secret.asString());

    if (secret.asString()) setDisplayText(secret.asString()!);
  };

  const descriptorPubExtend = async () => {
    const secret = await DescriptorPublicKey.extend('m/0/87539319');
    console.log(secret.asString());

    if (secret.asString()) setDisplayText(secret.asString()!);
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
        {/* pub descriptor methods */}
        {hasPubDescriptor ? (
          <View style={styles.sectionContainer}>
            <View style={styles.methodSection}>
              <Button
                title="Create Public Descriptor"
                style={styles.methodButton}
                onPress={createPubDescriptor}
              />
              <Button
                title="Derive"
                style={styles.methodButton}
                onPress={descriptorPubDerive}
              />
              <Button
                title="Extend"
                style={styles.methodButton}
                onPress={descriptorPubExtend}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Keys;
