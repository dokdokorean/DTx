import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChecklistMain = () => {
  const navigation = useNavigation();

  const handleLogChecklist = () => {
    // Navigate to the checklist log screen or handle the log action
    // Replace 'ChecklistLogScreen' with the actual name of your log screen
    navigation.navigate('Checklist');
  };

  const handleChecklistDetail = (item) => {
    // Navigate to the checklist detail screen with the item data
    // Replace 'ChecklistDetailScreen' with the actual name of your detail screen
    navigation.navigate('ChecklistDetailScreen', { date: item });
  };

  const checklistData = [
    '2024.05.01 (수)',
    '2024.05.08 (수)',
    '2024.05.21 (화)',
    '2024.05.28 (화)',
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => handleChecklistDetail(item)}>
      <Text style={styles.listItemText}>{item}</Text>
      <Text style={styles.listItemArrow}></Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✔ 음주 체크리스트</Text>
      <TouchableOpacity style={styles.logButton} onPress={handleLogChecklist}>
        <Text style={styles.logButtonText}>금일 체크리스트 기록하기</Text>
      </TouchableOpacity>
      <FlatList
        data={checklistData}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    marginTop:60,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logButton: {
    backgroundColor: '#FFC124',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 16,
  },
  listItemArrow: {
    fontSize: 18,
  },
});

export default ChecklistMain;
