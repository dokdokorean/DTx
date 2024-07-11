import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { BASE_URL } from '../../service/api'; // Import BASE_URL from your service/api file
import { AuthContext } from '../../service/AuthContext'; // Adjust the import path as needed

const VoiceChat = () => {
  const { jwtToken, userId } = useContext(AuthContext); // Get JWT token and userId from context

  const [recording, setRecording] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30);
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
        duration: 30000,
        useNativeDriver: false,
      }).start();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      progress.setValue(1);
      setRemainingTime(30);
    }
  }, [isRecording]);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
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
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startSizeAnimation();
  }, []);

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
    }
  };

  const uploadRecording = async (uri) => {
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
          Alert.alert('Success', 'File uploaded successfully.');
        } else {
          const text = await uploadResponse.text();
          console.log('Upload response text:', text);
          Alert.alert('Success', 'File uploaded successfully.');
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
          source={isPaused ? require('../../assets/resume.png') : require('../../assets/pause.png')} // Adjust the path to your pause/resume image
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
        <Image
          source={require('../../assets/cancel.png')} // Adjust the path to your cancel image
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );

  const renderMicButton = () => (
    <TouchableOpacity
      style={styles.micButton}
      onPress={handleRecordPress}
    >
      <Image
        source={require('../../assets/mic.png')} // Adjust the path to your microphone image
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
            source={require('../../assets/ai.png')} // Adjust the path to your AI image
            style={styles.aiImage}
          />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>지미에게 질문에 대답해보세요!</Text>
          <Text style={styles.subtitle}>지미는 당신의 음성을 통해 음주 정도를 확인할 수 있어요!</Text>
        </View>
        {isRecording ? renderControlButtons() : renderMicButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  aiImageContainer: {
    marginBottom: 20,
  },
  aiImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  pauseButton: {
    width: 60,
    height: 60,
    backgroundColor: '#E0E0E0',
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
    width: 60,
    height: 60,
    backgroundColor: '#FF6347',
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
    width: 60,
    height: 60,
    backgroundColor: '#FFC124',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default VoiceChat;
