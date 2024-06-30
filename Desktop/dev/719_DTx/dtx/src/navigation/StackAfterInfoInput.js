import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from '../navigation/TabNavigation';
import CalenderMain from '../screens/main/CalenderMain';
import ChatbotMain from '../screens/main/ChatbotMain';
import ChecklistMain from '../screens/main/ChecklistMain';
import MyinfoMain from '../screens/main/MyinfoMain';
import PersonalInfo from '../screens/Personalinfo/PersonalInfo';
import PersonalInfoInput from '../screens/Personalinfo/PersonalInfoInput';
import Checklist from '../screens/Checklist/Checklist';

const Stack = createStackNavigator();

const StackAfterInfoInput = () => {
  return (
    <Stack.Navigator initialRouteName="TabNavigation">
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CalenderMain"
        component={CalenderMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatbotMain"
        component={ChatbotMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChecklistMain"
        component={ChecklistMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyinfoMain"
        component={MyinfoMain}
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
      <Stack.Screen
        name="Checklist"
        component={Checklist}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackAfterInfoInput;
