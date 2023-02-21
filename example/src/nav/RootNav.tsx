import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Keys from '../screens/keys';
import Blockchain from '../screens/blockchain';
import Wallet from '../screens/wallet';
import TxBuilder from '../screens/txbuilder';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Keys" component={Keys} />
      <Stack.Screen name="Blockchain" component={Blockchain} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Tx" component={TxBuilder} />
    </Stack.Navigator>
  );
}

export default RootStack;
