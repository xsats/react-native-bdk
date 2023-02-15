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

import { Blockchain as BdkBlockchain, ElectrumConfig } from '../../../src';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const Blockchain = () => {
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);
  const [blockcount, setBlockcount] = useState(0);
  const [bestBlockhash, setBestBlockhash] = useState('');
  const [blockchainReady, setBlockchainReady] = useState(false);

  const initBlockchain = async () => {
    const config: ElectrumConfig = {
      url: 'ssl://electrum.blockstream.info:60002',
      retry: '',
      timeout: '',
      stopGap: '',
    };
    const blockchain = await BdkBlockchain.create(config);
    if (blockchain) {
      const height = await blockchain.getHeight();
      setDisplayText('Blockchain synced');
      setBlockcount(height);

      const bbh = await blockchain.getBlockHash();
      setBestBlockhash(bbh);
      setBlockchainReady(true);
    }
  };

  const getBlockheight = async () => {
    const bestBlockheight = await BdkBlockchain.getHeight();
    console.log(bestBlockheight);

    if (bestBlockheight) {
      setDisplayText(JSON.stringify(bestBlockheight));
    }
  };

  const getBlockhash = async () => {
    const hash = await BdkBlockchain.getBlockHash(287897);
    console.log(hash);

    if (hash) {
      setDisplayText(hash);
    }
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

        {/* Block Height */}
        {blockcount !== 0 ? (
          <View style={styles.balanceSection}>
            <Text style={styles.balanceText} selectable>
              {'Blockcount: '}
            </Text>
            <Text selectable>{blockcount ? blockcount.toString() : '0'}</Text>
          </View>
        ) : null}

        {/* Best Block Hash */}
        {bestBlockhash !== '' ? (
          <View style={[styles.balanceSection, { flexDirection: 'column' }]}>
            <Text style={styles.balanceText} selectable>
              {'Best block hash:'}
            </Text>
            <Text selectable>{bestBlockhash}</Text>
          </View>
        ) : null}

        {/* method call result */}
        {displayText && (
          <View style={styles.responseSection}>
            <Text style={styles.responseText} selectable>
              Response:
            </Text>
            <Text selectable>{displayText}</Text>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <View style={styles.methodSection}>
            <Button
              title="Init Electrum"
              style={styles.methodButton}
              onPress={initBlockchain}
            />
          </View>
        </View>

        {/* buttons for method calls */}
        {blockchainReady ? (
          <View style={styles.sectionContainer}>
            <View style={styles.methodSection}>
              <Button
                title="Get best blockheight"
                style={styles.methodButton}
                onPress={getBlockheight}
              />
              <Button
                title="Get blockhash"
                style={styles.methodButton}
                onPress={getBlockhash}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Blockchain;
