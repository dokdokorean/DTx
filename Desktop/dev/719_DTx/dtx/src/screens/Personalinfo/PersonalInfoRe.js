import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoBackGeneralHeader from '../../components/GoBackGeneralHeader'; // Make sure to adjust the path as needed

const PersonalInfoRe = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('PersonalInfoReInput');
  };

  return (
    <View style={styles.container}>
      <GoBackGeneralHeader />
      <View style={styles.content}>
        <Image
          source={require('../../assets/Mainlogo.png')} // Ensure this path is correct
          style={styles.logo}
        />
        <Text style={styles.title}>
          <Text style={styles.highlight}>금주</Text>, {'\n'}우리가 도와줄게요!
        </Text>
        <Text style={styles.subtitle}>본인에 대해 다시 기록하러 오셨군요!</Text>
        <Text style={styles.description}>
          음주 정도를 본인에게 더 잘 맞추기 위해 몇 가지 질문을 드리겠습니다.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 250,
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
  highlight: {
    color: '#FFC107',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    textAlign: 'left',
    width: '100%',
    color: '#7D7D7D',
    marginBottom: 80,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PersonalInfoRe;
