import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { BASE_URL } from '../../service/api'; // Import BASE_URL from your service/api file
import { AuthContext } from '../../service/AuthContext'; // Adjust the path as needed
import PersonalInfoHeader from '../../components/PersonalInfoHeader'; // Adjust the import path as needed

const PersonalInfoReInput = () => {
  const navigation = useNavigation();
  const { jwtToken, userId } = useContext(AuthContext); // Get JWT token and userId from context

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('1993');
  const [weight, setWeight] = useState('62');
  const [height, setHeight] = useState('175');
  const [drinkingGoal, setDrinkingGoal] = useState('0'); // 초기값을 '0'으로 설정
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: step / (steps.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await saveProfileData(); // Save profile data to backend
      navigation.navigate('TabNavigation'); // Navigate to TabNavigation on success
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      Animated.timing(progress, {
        toValue: (step - 1) / (steps.length - 1),
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      navigation.goBack(); // Go back to previous screen if on first step
    }
  };
  const saveProfileData = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/profile/update`,
        {
          gender,
          birthYear,
          weight,
          height,
          drinkingGoal, // Ensure drinkingGoal is included
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Attach JWT token
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile data saved successfully.');
      } else {
        Alert.alert('Error', 'Http 프로토콜 오류입니다');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'try 오류입니다');
    }
  };

  const renderGenderSelection = () => (
    <View style={styles.selectionContainer}>
      <TouchableOpacity
        style={[styles.selectionButton, gender === 'male' && styles.selectedButton]}
        onPress={() => setGender('male')}
      >
        <Text style={styles.selectionText}>👨 남성</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectionButton, gender === 'female' && styles.selectedButton]}
        onPress={() => setGender('female')}
      >
        <Text style={styles.selectionText}>👩 여성</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBirthYearSelection = () => (
    <Picker
      selectedValue={birthYear}
      style={styles.picker}
      onValueChange={(itemValue) => setBirthYear(itemValue)}
    >
      {Array.from({ length: 77 }, (_, i) => 1930 + i).map(year => (
        <Picker.Item key={year} label={`${year} 년`} value={String(year)} />
      ))}
    </Picker>
  );

  const renderWeightSelection = () => (
    <Picker
      selectedValue={weight}
      style={styles.picker}
      onValueChange={(itemValue) => setWeight(itemValue)}
    >
      {Array.from({ length: 96 }, (_, i) => 35 + i).map(weight => (
        <Picker.Item key={weight} label={`${weight} Kg`} value={String(weight)} />
      ))}
    </Picker>
  );

  const renderDrinkingGoalSelection = () => (
    <Picker
      selectedValue={drinkingGoal}
      style={styles.picker}
      onValueChange={(itemValue) => setDrinkingGoal(itemValue)}
    >
      {Array.from({ length: 16 }, (_, i) => 0 + i).map(drinkingGoal => (
        <Picker.Item key={drinkingGoal} label={`${drinkingGoal} 병`} value={String(drinkingGoal)} />
      ))}
    </Picker>
  );

  const renderHeightSelection = () => (
    <Picker
      selectedValue={height}
      style={styles.picker}
      onValueChange={(itemValue) => setHeight(itemValue)}
    >
      {Array.from({ length: 61 }, (_, i) => 140 + i).map(height => (
        <Picker.Item key={height} label={`${height} cm`} value={String(height)} />
      ))}
    </Picker>
  );

  const steps = [
    { title: "본인에 대해 알려주시겠어요?", ment: "😄 당신을 위한 컨텐츠를 커스텀해드릴게요!", component: renderGenderSelection },
    { title: "태어난 해는 언제입니까?", ment: "🥳 당신의 생년을 알고 싶어요!", component: renderBirthYearSelection },
    { title: "체중이 어떻게 되십니까?", ment: "👀 쉿! 저희만 알고 있을게요. 약속해요!", component: renderWeightSelection },
    { title: "신장이 어떻게 되십니까?", ment: "👀 쉿! 저희만 알고 있을게요. 약속해요!", component: renderHeightSelection },
    { title: "한달 목표 음주량이 어떻게 되나요?", ment: "🍾 아자아자! 우리 같이 노력하는거에요!", component: renderDrinkingGoalSelection }
  ];

  const isNextDisabled = step === 0 && gender === null;

  return (
    <View style={styles.container}>
      <PersonalInfoHeader onBack={handleBack} />
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%']
        }) }]} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.subtitle}>{steps[step].ment}</Text>
        {steps[step].component()}
      </View>
      <TouchableOpacity
        style={[styles.button, isNextDisabled && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={isNextDisabled}
      >
        <Text style={styles.buttonText}>{step < steps.length - 1 ? '다음' : '입력 완료'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    width: '100%',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#84A2BB',
  },
  contentContainer: {
    flex: 1,
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
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  selectionButton: {
    padding: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#84A2BB',
  },
  selectionText: {
    fontSize: 18,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  button: {
    height: 50,
    backgroundColor: '#84A2BB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 80,
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PersonalInfoReInput;
