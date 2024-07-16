import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Animated,
  Alert,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import axios from 'axios';
import { BASE_URL } from '../../service/api'; // Import BASE_URL from your service/api file
import { AuthContext } from '../../service/AuthContext'; // Adjust the path as needed
import PersonalInfoHeader from '../../components/PersonalInfoHeader'; // Adjust the import path as needed

const PersonalInfoInput = () => {
  const navigation = useNavigation();
  const { jwtToken, userId } = useContext(AuthContext); // Get JWT token and userId from context

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [birthYear, setBirthYear] = useState('1993');
  const [weight, setWeight] = useState('62');
  const [height, setHeight] = useState('175');
  const [drinkingGoal, setDrinkingGoal] = useState('0'); // 초기값을 '0'으로 설정
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0); // New state for recording duration
  const [dotScales, setDotScales] = useState([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]);
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
      if (!recording) {
        Alert.alert('Error', '음성 녹음을 완료해주세요!');
        return;
      }
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
        `${BASE_URL}/profile/create`,
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
        Alert.alert('완료!', '사용자님의 정보가 안전하게 저장되었습니다😀');
      } else {
        Alert.alert('Error', 'Http 프로토콜 오류입니다');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'try 오류입니다');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
        setIsRecording(true);
        startDotAnimation();
      } else {
        console.error('Permission to access microphone is required.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording finished and stored at', uri);
      uploadRecording(uri);
      stopDotAnimation();
    }
  };

  const uploadRecording = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `${userId}${step}.m4a`;
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/m4a',
        name: fileName
      });
      console.log(fileName)
      const uploadResponse = await fetch(`${BASE_URL}/chatbot/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });

      if (uploadResponse.ok) {
        const contentType = uploadResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await uploadResponse.json();
          console.log(data);
          Alert.alert('성공!', '음성 파일이 성공적으로 업로드 되었습니다');
        } else {
          const text = await uploadResponse.text();
          console.log('Upload response text:', text);
          Alert.alert('성공!', '음성 파일이 성공적으로 업로드 되었습니다');
        }
      } else {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Upload failed: ${error.message}`);
    }
  };

  const startDotAnimation = () => {
    dotScales.forEach((scale, index) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.5,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, index * 250); // 150ms 간격으로 각 애니메이션 시작
    });
  };

  const stopDotAnimation = () => {
    dotScales.forEach(scale => scale.stopAnimation());
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

  const renderVoiceRecording = () => (
    <View style={styles.voiceContainer}>
      <Text style={styles.voiceQuestion}>
        Q: 최근에 먹었던 음식 중에 가장 기억에 남는 음식은 무엇이고 가장 기억에 남는 이유는 뭔가요?
      </Text>
      <View style={styles.micContainer}>
        <TouchableOpacity onPress={startRecording} style={styles.micButton}>
          <Image style={styles.micIcon} source={require('../../assets/mic.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.dotsContainer}>
        {dotScales.map((scale, index) => (
          <Animated.View key={index} style={[styles.dot, { transform: [{ scale }] }]} />
        ))}
      </View>
      <View style={{flexDirection:'row', marginBottom: Platform.OS === 'ios' ? -55 : 0,}}>
        <TouchableOpacity onPress={stopRecording} style={styles.completeButton}>
          <Text style={styles.completeText}>완료!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={startRecording} style={styles.reRecordButton}>
          <Text style={styles.reRecordText}>재녹음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const steps = [
    { title: "본인에 대해 알려주시겠어요?", ment: "😄 당신을 위한 컨텐츠를 커스텀해드릴게요!", component: renderGenderSelection },
    { title: "태어난 해는 언제입니까?", ment: "🥳 당신의 생년을 알고 싶어요!", component: renderBirthYearSelection },
    { title: "체중이 어떻게 되십니까?", ment: "👀 쉿! 저희만 알고 있을게요. 약속해요!", component: renderWeightSelection },
    { title: "신장이 어떻게 되십니까?", ment: "👀 쉿! 저희만 알고 있을게요. 약속해요!", component: renderHeightSelection },
    { title: "한달 목표 음주량이 어떻게 되나요?", ment: "🍾 아자아자! 우리 같이 노력하는거에요!", component: renderDrinkingGoalSelection },
    { title: "질문에 맞춰서 음성을 녹음해주세요!", ment: "🎙️ 음주 전 당신의 목소리를 알고 싶어요!", component: renderVoiceRecording }
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
    top: Platform.OS === 'ios' ? 0 : -35,
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
  voiceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  voiceQuestion: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  micContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 35 : 0
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#84A2BB',
    borderWidth: 2,
  },
  micIcon: {
    width: 30,
    height: 30,
    resizeMode:'contain'
  },
  completeButton: {
    width: 120,
    height: 50,
    backgroundColor: '#84A2BB',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50,
    marginRight:20
  },
  completeText: {
    color: '#fff',
    fontSize: Platform.OS === 'ios' ? 18 : 16
  },
  reRecordButton: {
    width: 120,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth:1,
    borderColor:'#84A2BB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50,
    marginLeft:20
  },
  reRecordText: {
    color: '#84A2BB',
    fontSize: Platform.OS === 'ios' ? 18 : 16
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: '#84A2BB',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default PersonalInfoInput;
