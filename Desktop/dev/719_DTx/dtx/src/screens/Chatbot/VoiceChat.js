import React, { useState, useEffect, useRef } from 'react';
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
import GoBackGeneralHeader from '../../components/GoBackGeneralHeader'; // Adjust the import path as needed

const VoiceChat = () => {
  const [recording, setRecording] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30);
  const intervalRef = useRef(null);
  const progress = useRef(new Animated.Value(1)).current;
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dotScales, setDotScales] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]);

  const startDotAnimation = () => {
    dotScales.forEach((scale, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 300,
            delay: index * 150,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const stopDotAnimation = () => {
    dotScales.forEach(scale => scale.stopAnimation());
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      startDotAnimation();
    } else {
      stopDotAnimation();
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
      // Upload the recording file to the server
      uploadRecording(uri);
    }
  };

  const uploadRecording = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = uri.split('/').pop();

    const formData = new FormData();
    formData.append('file', blob, fileName);

    try {
      const response = await fetch('http://127.0.0.1', { // Change to your local server address
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        Alert.alert('Success', 'File uploaded successfully.');
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `Error: ${error.message}`);
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
        source={require('../../assets/microphone.png')} // Adjust the path to your microphone image
        style={styles.icon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GoBackGeneralHeader />
      <View style={styles.contentContainer}>
        <View style={styles.dotsContainer}>
          {dotScales.map((scale, index) => (
            <Animated.View key={index} style={[styles.dot, { transform: [{ scaleY: scale }] }]} />
          ))}
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{remainingTime}</Text>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarForeground, { width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['100%', '0%']
            }) }]} />
          </View>
          <Text style={styles.progressLabel}>지미와 대화 이어나가보세요!</Text>
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
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: '#FFC124',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#FFC124',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 16,
    color: '#6E6E6E',
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
