// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootNav from './src/nav/RootNav';

const App = () => {
  return (
    <NavigationContainer>
      <RootNav />
    </NavigationContainer>
  );
};

export default App;
