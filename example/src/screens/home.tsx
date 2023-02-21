import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
} from 'react-native';
import Button from '../elements/Button';
import { styles } from '../styles/styles';

const bitcoinLogo = require('../assets/bitcoin_logo.png');
const bdkLogo = require('../assets/bdk_logo.png');

const Home = ({ navigation }) => {
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

        {/* keys class */}
        <View style={styles.sectionContainer}>
          <View style={styles.methodSection}>
            <Button
              title="Keys Methods"
              onPress={() => navigation.navigate('Keys')}
              style={styles.methodButton}
            />
          </View>
        </View>

        {/* blockchain class */}
        <View style={styles.sectionContainer}>
          <View style={styles.methodSection}>
            <Button
              title="Blockchain Methods"
              onPress={() => navigation.navigate('Blockchain')}
              style={styles.methodButton}
            />
          </View>
        </View>

        {/* wallet class */}
        <View style={styles.sectionContainer}>
          <View style={styles.methodSection}>
            <Button
              title="Wallet Methods"
              onPress={() => navigation.navigate('Wallet')}
              style={styles.methodButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
