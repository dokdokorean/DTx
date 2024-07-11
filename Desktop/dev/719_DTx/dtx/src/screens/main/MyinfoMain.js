import React, { useState, useEffect, useContext } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Switch,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../service/api'; 
import { AuthContext } from '../../service/AuthContext';

const MyinfoMain = () => {
  const navigation = useNavigation();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [nightPushNotifications, setNightPushNotifications] = useState(false);
  const [gender, setGender] = useState('해당없음');
  const [birthYear, setBirthYear] = useState('해당없음');
  const [weight, setWeight] = useState('해당없음');
  const [height, setHeight] = useState('해당없음');
  const { jwtToken, userId } = useContext(AuthContext); // Get JWT token and userId from context

  useEffect(() => {
    const loadMyInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile/get`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        });
        const data = await response.json();
        setGender(data.gender === 'male' ? '남성' : data.gender === 'female' ? '여성' : '해당없음');
        setBirthYear(data.birthYear ? `${data.birthYear}년생` : '해당없음');
        setWeight(data.weight ? `${data.weight}kg` : '해당없음');
        setHeight(data.height ? `${data.height}cm` : '해당없음');
      } catch (error) {
        console.error('Failed to load profile information:', error);
      }
    };

    loadMyInfo();
  }, [jwtToken]);

  const handleReRecord = () => {
    navigation.navigate('PersonalInfoRe');
  };

  const handleLogout = () => {
    navigation.navigate('Login')
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{fontSize:27,marginTop:25,marginBottom:15, fontWeight:'700'}}>마이</Text>
        <Text style={{fontSize:13,color:'#707070',marginBottom:-13}}>{`${gender} · ${birthYear} · ${weight} · ${height}`}</Text>
      </View>
      <Image style={{resizeMode:'contain',width:'95%',left:-5}} source={require('../../assets/personalgoal.png')}></Image>
      <Text style={styles.title2}>알림</Text>
      <View style={styles.content}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>푸시 알림</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#767577', true: '#84A2BB' }}
            thumbColor={pushNotifications ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>야간 푸시 알림 (21~08시)</Text>
          <Switch
            value={nightPushNotifications}
            onValueChange={setNightPushNotifications}
            trackColor={{ false: '#767577', true: '#84A2BB' }}
            thumbColor={nightPushNotifications ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
      </View>

      <Text style={styles.title1}>개인정보 변경</Text>
      <View style={styles.content}>
        <TouchableOpacity style={styles.listItem} onPress={handleReRecord}>
          <Text style={styles.listItemText}>다시 기록하기</Text>
          <Image style={{ width: 10, resizeMode: 'contain', top: 1 }} source={require('../../assets/miniarrow.png')} />
        </TouchableOpacity>
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
  title: {
    marginTop: 30,
    marginLeft:10
  },
  content: {
    marginHorizontal: 10,
    borderTopColor: '#DADADA',
    borderTopWidth: 1
  },
  title1: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 50,
    marginLeft: 10
  },
  title2: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 0,
    marginLeft: 10
  },
  listItem: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listItemText: {
    top: 5,
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
