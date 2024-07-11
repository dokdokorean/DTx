import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import GoBackGeneralHeader from '../../components/GoBackGeneralHeader';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../service/api'; // Adjust the import path as needed
import { AuthContext } from '../../service/AuthContext'; // Adjust the import path as needed

const Checklist = () => {
  const navigation = useNavigation();
  const { jwtToken } = useContext(AuthContext); // Get JWT token from context
  const [selectedValues, setSelectedValues] = useState({});
  const [result, setResult] = useState(null);
  const [allAnswered, setAllAnswered] = useState(true);

  const questions = [
    {
      id: 'q1',
      text: '1. 얼마나 자주 술을 마십니까?',
      options: [
        { label: '전혀 안 마심', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 2~4회', value: 2 },
        { label: '주 2~3회', value: 3 },
        { label: '주 4회', value: 4 },
      ],
    },
    {
      id: 'q2',
      text: '2. 술을 마시는 날은 한번에 몇 잔 정도 마십니까?',
      subtext: '(소주, 맥주 등 술의 종류에 상관없이 각각의 잔수로 계산)',
      options: [
        { label: '1~2잔', value: 0 },
        { label: '3~4잔', value: 1 },
        { label: '5~6잔', value: 2 },
        { label: '7~9잔', value: 3 },
        { label: '10잔 이상', value: 4 },
      ],
    },
    {
      id: 'q3',
      text: '3. 한 번의 좌석에서 소주 한 병 또는 맥주 4병 이상 마시는 경우는 얼마나 자주 있습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 1회', value: 2 },
        { label: '주 1회', value: 3 },
        { label: '거의 매일', value: 4 },
      ],
    },
    {
      id: 'q4',
      text: '4. 지난 1년간 한 번 술을 마시기 시작하면 멈출 수 없었던 때가 얼마나 자주 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 1회', value: 2 },
        { label: '주 1회', value: 3 },
        { label: '거의 매일', value: 4 },
      ],
    },
    {
      id: 'q5',
      text: '5. 지난 1년간 평소 같았으면 할 수 있었던 일을 음주 때문에 실패한 적이 얼마나 자주 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 1회', value: 2 },
        { label: '주 1회', value: 3 },
        { label: '거의 매일', value: 4 },
      ],
    },
    {
      id: 'q6',
      text: '6. 지난 1년간 술을 마신 다음 날 일어나기 위해 해장술이 필요했던 적은 얼마나 자주 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 1회', value: 2 },
        { label: '주 1회', value: 3 },
        { label: '거의 매일', value: 4 },
      ],
    },
    {
      id: 'q7',
      text: '7. 지난 1년간 음주 후에 죄책감이 든 적이 얼마나 자주 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 1회', value: 2 },
        { label: '주 1회', value: 3 },
        { label: '거의 매일', value: 4 },
      ],
    },
    {
      id: 'q8',
      text: '8. 지난 1년간 음주 때문에 전날 밤에 있었던 일이 기억나지 않았던 적이 얼마나 자주 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '월 1회 미만', value: 1 },
        { label: '월 1회', value: 2 },
        { label: '주 1회', value: 3 },
        { label: '거의 매일', value: 4 },
      ],
    },
    {
      id: 'q9',
      text: '9. 음주로 인해 자신이나 다른 사람이 다친 적이 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '있지만 지난 1년간은 없었다.', value: 2 },
        { label: '지난 1년간 있었다.', value: 4 },
      ],
    },
    {
      id: 'q10',
      text: '10. 친척이나 친구, 의사가 당신이 술을 마시는 것을 걱정하거나 당신에게 술 끊기를 권유하는 적이 있었습니까?',
      options: [
        { label: '없음', value: 0 },
        { label: '있지만 지난 1년간은 없었다.', value: 2 },
        { label: '지난 1년간 있었다.', value: 4 },
      ],
    },
  ];

  const checkOnlyOne = (questionId, optionValue) => {
    setSelectedValues({ ...selectedValues, [questionId]: optionValue });
  };

  const calculateResult = () => {
    if (Object.keys(selectedValues).length < questions.length) {
      setAllAnswered(false);
      return;
    }
    setAllAnswered(true);
    const total = Object.values(selectedValues).reduce((acc, value) => acc + value, 0);
    setResult(total);
  };

  const handleRecord = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/survey/submit`,
        {
          question1: selectedValues.q1,
          question2: selectedValues.q2,
          question3: selectedValues.q3,
          question4: selectedValues.q4,
          question5: selectedValues.q5,
          question6: selectedValues.q6,
          question7: selectedValues.q7,
          question8: selectedValues.q8,
          question9: selectedValues.q9,
          question10: selectedValues.q10,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Attach JWT token
          },
        }
      );
      if (response.status === 200) {
        Alert.alert('Success', 'Data saved successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  return (
    <View style={styles.container}>
      <GoBackGeneralHeader />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>금일 체크리스트 기록하기</Text>
        {questions.map((question) => (
          <View key={question.id} style={styles.question}>
            <Text style={styles.questionText}>{question.text}</Text>
            {question.subtext && <Text style={styles.subtext}>{question.subtext}</Text>}
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => checkOnlyOne(question.id, option.value)}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedValues[question.id] === option.value && styles.checkboxSelected,
                    ]}
                  >
                    {selectedValues[question.id] === option.value && <View style={styles.checkmark} />}
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={calculateResult}>
          <Text style={styles.buttonText}>입력 완료</Text>
        </TouchableOpacity>
        {!allAnswered && (
          <Text style={styles.warningText}>체크리스트를 전부 체크해주세요!</Text>
        )}
        {result !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📖 해석결과</Text>
            <Text style={styles.resultText}>사용자님은</Text>
            <Text style={styles.resultHighlight}>
              {result < 10 ? '정상 음주군' : result < 20 ? '위험 음주군' : '알코올 사용 장애 추정군'}에 속해요!
            </Text>
            <Text style={styles.resultSubtext}>
              데이터 분석 결과, 알코올 중독이 의심되는 다른 사용자들보다{" "}
              {result >= 30 ? '높습니다' : '낮습니다'}.
            </Text>
          </View>
        )}
        {result !== null && (
          <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
            <Text style={styles.recordButtonText}>기록하기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  question: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 13,
    color: '#6E6E6E',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#84A2BB',
    borderColor: '#84A2BB',
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#84A2BB',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#84A2BB',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  resultHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84A2BB',
    marginBottom: 10,
  },
  resultSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 30,
    color: '#6E6E6E',
  },
  recordButton: {
    backgroundColor: '#FFf',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginVertical: 40,
    borderWidth: 1,
    borderColor: '#84A2BB',
  },
  recordButtonText: {
    color: '#84A2BB',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checklist;
