import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyinfoMain = () => {
  const navigation = useNavigation();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [nightPushNotifications, setNightPushNotifications] = useState(false);

  const handleReRecord = () => {
    // Navigate to the re-record screen
    // Replace 'ReRecordScreen' with the actual name of your re-record screen
    navigation.navigate('PersonalInfoRe');
  };

  const handleLogout = () => {
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>개인정보</Text>
      <TouchableOpacity style={styles.listItem} onPress={handleReRecord}>
        <Text style={styles.listItemText}>다시 기록하기</Text>
        <Text style={styles.listItemArrow}>-</Text>
      </TouchableOpacity>
      <Text style={styles.title2}>알림</Text>
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>푸시 알림</Text>
        <Switch
          value={pushNotifications}
          onValueChange={setPushNotifications}
          trackColor={{ false: '#767577', true: '#FFC124' }}
          thumbColor={pushNotifications ? '#FFC124' : '#f4f3f4'}
        />
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>야간 푸시 알림 (21~08시)</Text>
        <Switch
          value={nightPushNotifications}
          onValueChange={setNightPushNotifications}
          trackColor={{ false: '#767577', true: '#FFC124' }}
          thumbColor={nightPushNotifications ? '#FFC124' : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 80,
  },
    title2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
  },
  listItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
  },
  listItemArrow: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#888',
  },
});

export default MyinfoMain;
