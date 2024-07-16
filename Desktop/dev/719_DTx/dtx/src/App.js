import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './service/AuthContext'; // Adjust the path as needed
import StackNavigation from './navigation/StackNavigation';
import { StatusBar, Platform } from 'react-native';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
