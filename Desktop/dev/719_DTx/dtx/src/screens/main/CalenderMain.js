import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, startOfWeek, addDays } from 'date-fns';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const CalendarMain = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
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
  };

  const handleTodayPress = () => {
    const today = new Date();
    setSelectedDate(today);
  };
  const gostatistics = ()=>{
    navigation.navigate('IfRecord')
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
      </View>
      <View style={styles.alcoholContainer}>
        <Text style={styles.recordText}>✏️ 기록하기</Text>
        <TouchableOpacity onPress={() => console.log('Details')}>
          <Text style={styles.detailsText}>상세정보</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.recordContainer}>
        {Object.keys(alcoholIcons).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.alcoholButton}
            onPress={() => setAlcoholType(key)}
          >
            <View style={[styles.alcoholIconContainer, alcoholType === key && styles.selectedAlcoholButton]}>
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
        <TouchableOpacity onPress={() => handleQuantityChange(alcoholType, -0.5)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{records[alcoholType]}병</Text>
        <TouchableOpacity onPress={() => handleQuantityChange(alcoholType, 0.5)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetRecords}>
        <Text style={styles.resetText}>초기화</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={gostatistics}>
        <View style={styles.ifggbutton}>
          <Text style={{fontSize:15,color:'#fff'}}>내가 술을 이렇게 많이 먹엇다고🫢?!</Text>
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
  mainView:{
    margin:20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:40,
    marginBottom: 16,
  },
  todayButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  recordTextmain:{
    color:'#707070',
    fontWeight:600
  },
  todayText: {
    fontSize: 16,
    color: '#84A2BB',
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight:30
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
    height:10
  },
  weekDayText: {
    fontSize: 16,
    color: '#000',
    height:30
  },
  selectedDayText: {
    color: '#84A2BB',
    borderRadius: 10,
    paddingVertical:10,
    top:-9.5,
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
    marginBottom: 16,
  },
  recordText: {
    fontSize: 16,
  },
  detailsText: {
    fontSize: 16,
    color: '#84A2BB',
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  alcoholButton: {
    alignItems: 'center',
    marginVertical:15,
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
    marginVertical: 16,
  },
  quantityButton: {
    fontSize: 24,
    color: '#84A2BB',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#84A2BB',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  resetText: {
    color: '#84A2BB',
    textDecorationLine: 'underline',
  },
  ifggbutton:{
    marginTop:20,
    width:'100%',
    backgroundColor:'#84A2BB',
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center',
    height:45,
  }
});

export default CalendarMain;
