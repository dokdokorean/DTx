import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackBeforeInfoInput from './navigation/StackBeforeInfoInput';
import StackAfterInfoInput from './navigation/StackAfterInfoInput';

// AuthContext 생성
export const AuthContext = createContext();

const App = () => {
  const [isInputIn, setIsInputIn] = useState(false); // 로그인 상태를 관리하는 로직

  return (
    <AuthContext.Provider value={{ isInputIn, setIsInputIn }}>
      <NavigationContainer>
        {isInputIn ? <StackAfterInfoInput /> : <StackBeforeInfoInput />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
