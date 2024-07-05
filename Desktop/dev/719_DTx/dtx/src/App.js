import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './service/AuthContext'; // Adjust the path as needed
import StackNavigation from './navigation/StackNavigation';
import { StatusBar } from 'react-native';


const App = () => {
  return (
    <AuthProvider>
      <StatusBar
        barStyle="dark-content" // 아이콘과 글자 색상을 밝게 설정 (어두운 배경에 적합)
      />
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
