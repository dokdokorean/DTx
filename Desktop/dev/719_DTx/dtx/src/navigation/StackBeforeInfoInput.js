import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login'
import PersonalInfo from '../screens/Personalinfo/PersonalInfo';
import PersonalInfoInput from '../screens/Personalinfo/PersonalInfoInput';

const Stack = createStackNavigator();

const StackBeforeInfoInput = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInfoInput"
        component={PersonalInfoInput}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackBeforeInfoInput;
