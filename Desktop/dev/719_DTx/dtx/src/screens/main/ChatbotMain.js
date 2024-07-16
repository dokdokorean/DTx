import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../service/api';
import { AuthContext } from '../../service/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const VoiceChat = ({ navigation }) => {
  const { jwtToken, userId } = useContext(AuthContext);
  const [sessionId, setSessionId] = useState(null);
  const [recording, setRecording] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30);
  const [question, setQuestion] = useState("어제 있었던 일 중에서 가장 기억에 남는 일이 무엇이었나요?");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);
  const progress = useRef(new Animated.Value(1)).current;
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const sizeAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      startRotation();
    } else {
      stopRotation();
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Animated.timing(progress, {
        toValue: 0,
        duration: 60000,
        useNativeDriver: false,
      }).start();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      progress.setValue(1);
      setRemainingTime(60);
    }
  }, [isRecording]);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotation.stopAnimation();
    rotation.setValue(0);
  };

  const startSizeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sizeAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sizeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      resetState();
      startSizeAnimation();
    }, [])
  );

  const resetState = () => {
    setRecording(null);
    setRemainingTime(30);
    setQuestion("어제 있었던 일 중에서 가장 기억에 남는 일이 무엇이었나요?");
    setQuestionIndex(0);
    setIsLoading(false);
    progress.setValue(1);
    setIsPaused(false);
    setIsRecording(false);
    rotation.setValue(0);
    sizeAnimation.setValue(1);
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
      uploadAiRecording(uri);
    }
  };

  const uploadAiRecording = async (uri) => {
  setIsLoading(true);
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
    const fileName = `${userId}_${timestamp}.m4a`;

    const formData = new FormData();
    formData.append('audio_file', {
      uri,
      type: 'audio/m4a',
      name: fileName
    });

    let uploadResponse;
    if (questionIndex === 0) {
      uploadResponse = await fetch('http://165.132.223.29/ai/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });
    } else {
      // 이전 요청의 session_id를 가져옵니다.
      const storedSessionId = await AsyncStorage.getItem('session_id');
      uploadResponse = await fetch('http://165.132.223.29/ai/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data',
          'Session-ID': storedSessionId
        },
        body: formData,
      });
    }

    if (uploadResponse.ok) {
      const contentType = uploadResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await uploadResponse.json();
        console.log('Session ID:', data.session_id); // Session ID 출력

        // 첫 번째 질문 이후에 sessionId 상태를 업데이트하고 AsyncStorage에 저장합니다.
        if (questionIndex === 0) {
          setSessionId(data.session_id);
          await AsyncStorage.setItem('session_id', data.session_id);
        }
      }
    } else {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${errorText}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('Error', `Upload failed: ${error.message}`);
    setIsLoading(false);
  }
};


  const uploadRecording = async (uri) => {
    setIsLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
      const fileName = `${userId}_${timestamp}.m4a`;

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/m4a',
        name: fileName
      });

      const uploadResponse = await fetch(`${BASE_URL}/chatbot/voice-upload`, {
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
          if (questionIndex === 9) {
            await storeResponseData(questionIndex, data.inputText,"성실히 답변해주셔서 감사합니다!");
          } else {
            await storeResponseData(questionIndex, data.inputText, data.gptResponse);
          }
          setQuestion(data.gptResponse);
          setQuestionIndex(prevIndex => prevIndex + 1);

          setIsLoading(false);

          if (questionIndex + 1 >= 10) {
            navigation.navigate('ChatbotResult');
          }
        } else {
          const text = await uploadResponse.text();
          console.log('Upload response text:', text);
        }
      } else {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Upload failed: ${error.message}`);
      setIsLoading(false);
    }
  };
  const storeResponseData = async (index, inputText, gptResponse) => {
    try {
      await AsyncStorage.setItem(`response_${index}`, JSON.stringify({ inputText, gptResponse }));
    } catch (error) {
      console.error('Error storing response data', error);
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePausePress = () => {
    if (isPaused) {
      recording.startAsync();
      setIsPaused(false);
      resumeTimer();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsPaused(true);
      recording.pauseAsync();
    }
  };

  const handleCancelPress = () => {
    stopRecording();
    setRemainingTime(30);
    progress.setValue(1);
    setIsRecording(false);
  };

  const resumeTimer = () => {
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const renderControlButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.pauseButton} onPress={handlePausePress}>
        <Image
          source={isPaused ? require('../../assets/resume.png') : require('../../assets/pause.png')}
          style={styles.icon}
        />
        <Text style={{position:'absolute',top:78,fontSize:13,color:'#707070'}}>일시정지</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
        <Image
          source={require('../../assets/finishmic.png')}
          style={styles.icon}
        />
        <Text style={{position:'absolute',top:78,fontSize:13,color:'#707070'}}>답변 완료</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMicButton = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.micButton}
        onPress={handleRecordPress}
      >
        <Image
          source={require('../../assets/mic.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );

  const renderDefaultMent = () => (
    <Text style={{width:260,height:120,textAlign:'center',marginTop:10}}>
      <Text style={{fontWeight:'700',fontSize:18,marginTop:60}}>어제 있었던 일 중에서 가장 기억에 남는 일이 무엇이었나요?{'\n'}</Text>
      <Text style={{width:220,height:100,textAlign:'center',fontSize:13,marginTop:60}}>{'\n'}지미의 질문에 대답해주세요</Text>      
    </Text>
  );

  const renderAiQuestionMent = () => (
    <Text>지미가 듣고 있어요...</Text>
  );

  const generateAiQestion = () => (
    <Text style={{width:280,height:120,textAlign:'center',marginTop:10}}>
      <Text style={{fontWeight:'700',fontSize:18,marginTop:60}}>{question}{'\n'}</Text>
      <Text style={{width:220,height:100,textAlign:'center',fontSize:10,marginTop:60}}>{'\n'}지미의 질문에 대답해주세요</Text>      
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.progressIndicator}>{`${questionIndex}/10`}</Text>
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.aiImageContainer,
            {
              transform: [
                { rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
                { scale: sizeAnimation },
              ],
            },
          ]}
        >
          <Image
            source={require('../../assets/ai.png')}
            style={styles.aiImage}
          />
        </Animated.View>
        <View style={styles.textContainer}>
          {questionIndex === 0 ? renderDefaultMent() : generateAiQestion()}
        </View>
        {isRecording ? renderControlButtons() : renderMicButton()}
      </View>
      <Modal transparent={true} visible={isLoading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={isLoading} size="large" color="#84A2BB" />
            <Text style={{marginTop:10}}>분석중...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressIndicator: {
    marginTop: 90,
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop:50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  aiImageContainer: {
    marginBottom: 20,
  },
  aiImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop:30,
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  aiment:{
    width: 290,
    height:160,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  pauseButton: {
    width: 70,
    height: 70,
    backgroundColor: '#F1F1F1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    width: 70,
    height: 70,
    backgroundColor: '#84A2BB',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  micButton: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderColor:'#84A2BB',
    borderWidth:1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceChat;
