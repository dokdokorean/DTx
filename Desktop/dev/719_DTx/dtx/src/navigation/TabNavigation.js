import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalenderMain from '../screens/main/CalenderMain';
import ChatbotMain from '../screens/main/ChatbotMain';
import ChecklistMain from '../screens/main/ChecklistMain';
import MyinfoMain from '../screens/main/MyinfoMain';

const Tab = createBottomTabNavigator();

const CustomTabIcon = ({ source, focused }) => {
  return (
    <View style={styles.iconContainer}>
      <Image
        source={source}
        style={[
          styles.icon,
          { tintColor: focused ? '#84A2BB' : '#BDBDBD' },
        ]}
        resizeMode="contain"
      />
      {focused && <View style={styles.dot} />}
    </View>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="CalenderMain"
      screenOptions={{
        tabBarActiveTintColor: '#84A2BB',
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarStyle: [{ display: 'flex' }, null],
      }}
    >
      <Tab.Screen
        name="ChatbotMain"
        component={ChatbotMain}
        options={{
          tabBarLabel: '챗봇',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              source={require('../assets/tab1.png')}
              focused={focused}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CalenderMain"
        component={CalenderMain}
        options={{
          tabBarLabel: '캘린더',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              source={require('../assets/tab2.png')}
              focused={focused}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ChecklistMain"
        component={ChecklistMain}
        options={{
          tabBarLabel: '체크리스트',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              source={require('../assets/tab3.png')}
              focused={focused}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyinfoMain"
        component={MyinfoMain}
        options={{
          tabBarLabel: '내 정보',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              source={require('../assets/tab4.png')}
              focused={focused}
            />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  dot: {
    width:25,
    height: 3,
    backgroundColor: '#84A2BB',
    borderRadius: 3,
    position: 'absolute',
    top: -10,
  },
});

export default TabNavigation;
