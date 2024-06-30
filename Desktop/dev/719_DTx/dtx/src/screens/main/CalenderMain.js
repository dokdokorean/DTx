import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const CalenderMain = () => {
  const navigation = useNavigation();

  const handleLogToday = () => {
    // Navigate to the log screen or handle the log action
    // Replace 'LogScreen' with the actual name of your log screen
    navigation.navigate('LogScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이번 달 음주 현황</Text>
      <Image
        //source={require('../assets/bottle.png')}
        style={styles.bottleImage}
      />
      <Text style={styles.consumptionText}>5.5병 / 10병</Text>
      <Text style={styles.subtitle}>음주 캘린더</Text>
      <Calendar
        style={styles.calendar}
        current={'2023-06-30'}
        markedDates={{
          '2023-06-04': { marked: true },
          '2023-06-18': { marked: true },
          '2023-06-30': { marked: true, dotColor: 'green', activeOpacity: 0 },
        }}
        theme={{
          selectedDayBackgroundColor: '#FFC124',
          todayTextColor: '#FFC124',
          arrowColor: '#FFC124',
          dotColor: '#FFC124',
        }}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogToday}>
        <Text style={styles.buttonText}>오늘 음주 기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  bottleImage: {
    width: 50,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  consumptionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  calendar: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CalenderMain;
