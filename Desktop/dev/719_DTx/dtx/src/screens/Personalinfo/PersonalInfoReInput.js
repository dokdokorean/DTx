import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PersonalInfoHeader from '../../components/PersonalInfoHeader';
import { Picker } from '@react-native-picker/picker';

const PersonalInfoReInput = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('1993');
  const [weight, setWeight] = useState('62');
  const [drinkingGoal, setDrinkingGoal] = useState('6');
  const [height, setHeight] = useState('175');
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: step / (steps.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('TabNavigation');
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
      navigation.goBack();
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
      {Array.from({ length: 16 }, (_, i) => 0 + i).map(goal => (
        <Picker.Item key={goal} label={`${goal} 병`} value={String(goal)} />
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
    { title: "본인에 대해 알려주시겠어요?", component: renderGenderSelection },
    { title: "태어난 해는 언제입니까?", component: renderBirthYearSelection },
    { title: "체중이 어떻게 되십니까?", component: renderWeightSelection },
    { title: "한달 목표 음주량이 어떻게 되나요?", component: renderDrinkingGoalSelection },
    { title: "신장이 어떻게 되십니까?", component: renderHeightSelection }
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
        <Text style={styles.subtitle}>당신을 위한 금주 보조 컨텐츠를 커스텀해 드릴게요!</Text>
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
    backgroundColor: '#FFC124',
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
    backgroundColor: '#FFC124',
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
    backgroundColor: '#FFC124',
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
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PersonalInfoReInput;
