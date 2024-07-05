import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatbotMain = () => {
  const navigation = useNavigation();

  const handleChat = () => {
    // Navigate to the chat screen
    // Replace 'ChatScreen' with the actual name of your chat screen
    navigation.navigate('VoiceChat');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>지미와 대화를 통해{"\n"}음주정도를{"\n"}확인해보세요!</Text>
        <Image
          //source={require('../assets/thoughtbubble.png')}
          style={styles.thoughtBubble}
        />
        <View style={styles.chatBubble}>
          {/* Placeholder for the chat bubble */}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleChat}>
        <Text style={styles.buttonText}>대화하기!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  thoughtBubble: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  chatBubble: {
    width: 150,
    height: 150,
    backgroundColor: '#D3D3D3',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#FFC124',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 40,
    width:'90%',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatbotMain;
