import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Platform, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, startOfWeek, addDays } from 'date-fns';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../service/api';
import { AuthContext } from '../../service/AuthContext';
import axios from 'axios';


const CalendarMain = () => {
  const { jwtToken } = useContext(AuthContext);
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setshowDetails] = useState(false);
  const [alcoholType, setAlcoholType] = useState('soju');
  const [records, setRecords] = useState({
    soju: 0,
    beer: 0,
    makgeolli: 0,
    wine: 0,
    liquor: 0,
    cocktail: 0,
  });
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    updateWeekDays(selectedDate);
    fetchRecords(format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);

  const updateWeekDays = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDays(days);
  };

  const handleDayPress = (day) => {
    const date = new Date(day.dateString);
    setSelectedDate(date);
    setShowCalendar(false);
    fetchRecords(format(selectedDate, 'yyyy-MM-dd'));
  };

  const handleTodayPress = () => {
    const today = new Date();
    setSelectedDate(today);
    fetchRecords(format(selectedDate, 'yyyy-MM-dd'));
  };

  const gostatistics = () => {
    navigation.navigate('IfRecord');
  };

  const alcoholIcons = {
    soju: require('../../assets/alchohol1.png'),
    beer: require('../../assets/alchohol2.png'),
    makgeolli: require('../../assets/alchohol3.png'),
    wine: require('../../assets/alchohol4.png'),
    liquor: require('../../assets/alchohol5.png'),
    cocktail: require('../../assets/alchohol6.png'),
  };

  const handleQuantityChange = (type, amount) => {
    setRecords((prevRecords) => ({
      ...prevRecords,
      [type]: Math.max(0, prevRecords[type] + amount),
    }));
  };

  const resetRecords = () => {
    setRecords({
      soju: 0,
      beer: 0,
      makgeolli: 0,
      wine: 0,
      liquor: 0,
      cocktail: 0,
    });
  };

  const saveRecords = async () => {
    const drinkDate = format(selectedDate, 'yyyy-MM-dd');
    const data = {
      drinkDate,
      soju: records.soju,
      beer: records.beer,
      makgeolli: records.makgeolli,
      wine: records.wine,
      whiskey: records.liquor, // Assuming 'liquor' in your state corresponds to 'whiskey' in the API
      cocktail: records.cocktail,
    };

    try {
      const response = await fetch(`${BASE_URL}/drink-records/record`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Records saved successfully');
        Alert.alert('저장되었습니다!');
      } else {
        console.error('Failed to save records');
      }
    } catch (error) {
      console.error('Error saving records:', error);
    }
  };

const fetchRecords = async (date) => {
    const fetchRecordsPath = '/drink-records/by-date';
    try {
        const response = await axios.get(`${BASE_URL}${fetchRecordsPath}`, {
            params: { date: date },
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            const data = response.data;
            if (Array.isArray(data) && data.length > 0) {
                const record = data[0]; // 첫 번째 요소를 가져옴
                setRecords({
                    soju: record.soju || 0,
                    beer: record.beer || 0,
                    makgeolli: record.makgeolli || 0,
                    wine: record.wine || 0,
                    liquor: record.whiskey || 0, // Assuming 'whiskey' in the API corresponds to 'liquor' in your state
                    cocktail: record.cocktail || 0,
                });
                console.log(record);
                console.log(date);
            } else {
                setRecords({
                    soju: 0,
                    beer:  0,
                    makgeolli:  0,
                    wine: 0,
                    liquor:  0, 
                    cocktail: 0,
                });}
        } else {
            console.error('Failed to fetch records');
        }
    } catch (error) {
        console.error('Error fetching records:', error);
    }
};



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleTodayPress} style={styles.todayButton}>
          <Text style={styles.todayText}>오늘</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.monthButton}>
          <Text style={styles.monthText}>{format(selectedDate, 'MMMM yyyy')}</Text>
          <Entypo name="chevron-down" size={20} color="#84A2BB" />
        </TouchableOpacity>
      </View>
      <View style={styles.weekContainer}>
        {weekDays.map((day, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedDate(day)}>
            <Text
              style={[
                styles.weekDayText,
                format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') &&
                  styles.selectedDayText,
              ]}
            >
              {format(day, 'd')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal transparent visible={showDetails} onRequestClose={() => setshowDetails(false)}>
        <TouchableOpacity style={styles.modalBackground} onPress={() => setshowDetails(false)}>
          <Image style={{ width: '100%', resizeMode: 'contain' }} source={require('../../assets/showdetails.png')} />
        </TouchableOpacity>
      </Modal>
      <Modal transparent visible={showCalendar} onRequestClose={() => setShowCalendar(false)}>
        <TouchableOpacity style={styles.modalBackground} onPress={() => setShowCalendar(false)}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={{ [format(selectedDate, 'yyyy-MM-dd')]: { selected: true, selectedColor: '#84A2BB' } }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <View style={styles.mainView}>
        <Text style={styles.dateText}>{format(selectedDate, 'M월 d일')}</Text>
        <View style={styles.recordsTextView}>
          <Text>
            {Object.keys(records).map((key) =>
              records[key] > 0 ? (
                <Text style={styles.recordTextmain} key={key}>
                  {key === 'soju' && '소주'}
                  {key === 'beer' && '맥주'}
                  {key === 'makgeolli' && '막걸리'}
                  {key === 'wine' && '와인'}
                  {key === 'liquor' && '양주'}
                  {key === 'cocktail' && '칵테일'}
                  {` ${records[key]}병 · `}
                </Text>
              ) : null
            )}
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetRecords}>
            <Text style={styles.resetText}>초기화</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.alcoholContainer}>
          <Text style={styles.recordText}>✏️ 기록하기</Text>
          <TouchableOpacity onPress={() => setshowDetails(!showDetails)}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ resizeMode: 'contain', width: 15, height: 15 }}
                source={require('../../assets/info.png')}
              />
              <Text style={styles.detailsText}> 상세정보</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.recordContainer}>
          {Object.keys(alcoholIcons).map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.alcoholButton}
              onPress={() => setAlcoholType(key)}
            >
              <View
                style={[
                  styles.alcoholIconContainer,
                  alcoholType === key && styles.selectedAlcoholButton,
                ]}
              >
                <Image source={alcoholIcons[key]} style={styles.alcoholIcon} />
              </View>
              <Text style={styles.alcoholText}>
                {key === 'soju' && '소주'}
                {key === 'beer' && '맥주'}
                {key === 'makgeolli' && '막걸리'}
                {key === 'wine' && '와인'}
                {key === 'liquor' && '양주'}
                {key === 'cocktail' && '칵테일'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(alcoholType, -0.5)}
            style={[styles.quantityButton, { left: -20 }]}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{records[alcoholType]}병</Text>
          <TouchableOpacity
            onPress={() => handleQuantityChange(alcoholType, 0.5)}
            style={[styles.quantityButton, { left: 20 }]}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={saveRecords}>
          <View style={styles.savebutton}>
            <Text style={{ fontSize: 17, color: '#84A2BB', width: '100%', textAlign: 'center' }}>
              기록 완료
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#DADADA', marginTop: 12.5 }}></View>
        <TouchableOpacity onPress={gostatistics}>
          <View style={styles.ifggbutton}>
            <Text style={{ fontSize: 15, color: '#fff', width: '100%', textAlign: 'center' }}>
              내가 술을 이렇게 많이 먹엇다고🫢?!
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32, // Add margin for the status bar
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  mainView: {
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    marginBottom: 16,
  },
  todayButton: {
    borderWidth: 1,
    borderColor: '#BBBBBB',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    height: Platform.OS === 'ios' ? 25 : 30,
  },
  recordTextmain: {
    color: '#707070',
    fontWeight: 600,
  },
  todayText: {
    fontSize: 14,
    color: '#BBBBBB',
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 30,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    height: 10,
  },
  weekDayText: {
    fontSize: 16,
    color: '#000',
    height: 30,
  },
  selectedDayText: {
    color: '#84A2BB',
    borderRadius: 10,
    paddingVertical: 10,
    top: -9.5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 25,
    borderRadius: 30,
    overflow: 'hidden',
  },
  dateText: {
    fontSize: 25,
    fontWeight: '700',
    marginVertical: 8,
  },
  recordsTextView: {
    fontSize: 16,
    marginBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  alcoholContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recordText: {
    fontSize: 16,
  },
  detailsText: {
    fontSize: 13,
    color: '#707070',
  },
  recordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 16,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  alcoholButton: {
    alignItems: 'center',
    marginVertical: 15,
    width: '30%',
  },
  selectedAlcoholButton: {
    borderColor: '#84A2BB',
    borderWidth: 2,
  },
  alcoholIconContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  alcoholIcon: {
    width: 40,
    height: 40,
  },
  alcoholText: {
    marginTop: 4,
    fontSize: 14,
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    fontSize: 24,
    color: '#84A2BB',
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#84A2BB',
    marginHorizontal: 20,
  },
  quantityButtonText: {
    fontSize: 30,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    position: 'absolute',
    right: 0,
    marginVertical: 0,
  },
  resetText: {
    color: '#707070',
  },
  savebutton: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#84A2BB',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  ifggbutton: {
    marginTop: 12.5,
    width: '100%',
    backgroundColor: '#84A2BB',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
});

export default CalendarMain;
