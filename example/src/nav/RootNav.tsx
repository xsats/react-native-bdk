import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import TxBuilder from '../screens/txbuilder';
import Keys from '../screens/keys';
import Blockchain from '../screens/blockchain';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Tx" component={TxBuilder} />
      <Stack.Screen name="Keys" component={Keys} />
      <Stack.Screen name="Blockchain" component={Blockchain} />
    </Stack.Navigator>
  );
}

export default RootStack;
