import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('PersonalInfoInput');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.highlight}>금주</Text>, {'\n'}우리가 도와줄게요!
        </Text>
        <Text style={styles.subtitle}>본인에 대해서 알려주시겠어요?</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  content: {
    width: '100%',
    marginTop:250
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 20,
  },
  highlight: {
    color: '#000',
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
    marginBottom: 50,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop:170
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PersonalInfoScreen;
