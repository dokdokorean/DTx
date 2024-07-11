import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import PersonalInfo from '../screens/Personalinfo/PersonalInfo';
import PersonalInfoInput from '../screens/Personalinfo/PersonalInfoInput';
import PersonalInfoRe from '../screens/Personalinfo/PersonalInfoRe';
import PersonalInfoReInput from '../screens/Personalinfo/PersonalInfoReInput';
import TabNavigation from '../navigation/TabNavigation';
import CalenderMain from '../screens/main/CalenderMain';
import ChatbotMain from '../screens/main/ChatbotMain';
import ChecklistMain from '../screens/main/ChecklistMain';
import MyinfoMain from '../screens/main/MyinfoMain';
import Checklist from '../screens/Checklist/Checklist';
import VoiceChat from '../screens/Chatbot/VoiceChat';
import IfRecord from '../screens/CalenderRecord/IfRecord';
import ChatbotResult from '../screens/Chatbot/ChatbotResult';


const Stack = createStackNavigator();

const StackNavigation = () => {
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
      <Stack.Screen
        name="PersonalInfoRe"
        component={PersonalInfoRe}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInfoReInput"
        component={PersonalInfoReInput}
        options={{ headerShown: false }}
      />
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
        name="Checklist"
        component={Checklist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VoiceChat"
        component={VoiceChat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IfRecord"
        component={IfRecord}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatbotResult"
        component={ChatbotResult}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
