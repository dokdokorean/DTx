import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoBackGeneralHeader from '../../components/GoBackGeneralHeader';

const ChatbotResult = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const storedResponses = [];
        for (let i = 0; i < 10; i++) {
          const response = await AsyncStorage.getItem(`response_${i}`);
          if (response) {
            storedResponses.push(JSON.parse(response));
          }
        }
        setResponses(storedResponses);
      } catch (error) {
        console.error('Failed to load responses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();

    const getCurrentDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    };

    const getSessionId = async () => {
      try {
        const sessionId = await AsyncStorage.getItem('session_id');
        if (sessionId !== null) {
          console.log('Retrieved session_id:', sessionId);
          return sessionId;
        }
      } catch (error) {
        console.error('Error retrieving session_id', error);
      }
      return null;
    };

    const postSessionId = async () => {
      const sessionId = await getSessionId();
      if (sessionId) {
        try {
          const response = await fetch('http://165.132.223.29/ai/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Session-ID': sessionId,
            },
            body: JSON.stringify({ session_id: sessionId }),
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Prediction response:', data);
          } else {
            console.error('Failed to get prediction:', response.statusText);
          }
        } catch (error) {
          console.error('Error posting session_id:', error);
        }
      }
    };

    postSessionId();
    setCurrentDate(getCurrentDate());
  }, []);

  const extractText = (inputText) => {
    try {
      const parsed = JSON.parse(inputText);
      return parsed.text || inputText;
    } catch (error) {
      return inputText;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <GoBackGeneralHeader />  
      <View style={{margin:0,padding:15}}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.analysisCompleteText}>🔍 지미가 분석을 끝마쳤어요!</Text>
        </View>
        <View style={{ margin:20,borderBottomWidth: 1, borderBottomColor: '#DADADA', marginBottom: 20 }}>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image style={{ width: 35, height: 35, top: 4, resizeMode: 'contain' }} source={require('../../assets/question_icon.png')} />
          <View style={[styles.answerContainer,{marginBottom:15}]}>
            <Text style={styles.answerText}>어제 있었던 일 중에서 가장 기억에 남는 일이 무엇이었나요?</Text>
          </View>
        </View>
        {responses.map((response, index) => (
          <View key={index} style={styles.responseContainer}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{extractText(response.inputText)}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Image style={{ width: 35, height: 35, top: 4, resizeMode: 'contain' }} source={require('../../assets/question_icon.png')} />
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{response.gptResponse}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  analysisCompleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 15,
  },
  date: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: 15,
  },
  responseContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 15,
    maxWidth: '80%',
  },
  answerContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    maxWidth: '80%',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ChatbotResult;
