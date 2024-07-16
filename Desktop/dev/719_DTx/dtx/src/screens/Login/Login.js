import React, { useState, useContext } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import { BASE_URL } from '../../service/api';
import { AuthContext } from '../../service/AuthContext'; // Adjust the path as needed

const Login = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { setJwtToken } = useContext(AuthContext); // Use the context

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username: id,
        password: password,
      });
      if (response.status === 200) {
        setJwtToken(response.data.jwt);
        navigation.navigate('PersonalInfo');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials, please try again.');
      }
    } catch (error) {
      Alert.alert('Login Error', 'An error occurred during login. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Mainlogo.png')} // Ensure this path is correct
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="아이디 입력"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 입력"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.row}>
        <View style={styles.autoLoginContainer}>
          <Text style={styles.autoLoginText}>자동 로그인</Text>
          <Text style={styles.linkText}>아이디 찾기</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.linkText}>비밀번호 찾기</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인하기</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>회원가입하기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 180,
    resizeMode:'contain',
    marginTop: 110,
    marginBottom: 120,
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  autoLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoLoginText: {
    marginLeft: 10,
    marginRight: 90,
  },
  linkText: {
    color: '#000',
    marginHorizontal: 10,
  },
  separator: {
    color: '#C0C0C0',
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#84A2BB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#000',
  },
});

export default Login;
