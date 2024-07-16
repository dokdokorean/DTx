import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Pressable, View,Platform } from 'react-native';

const PersonalInfoHeader = ({ onBack }) => {
  return (
    <View style={styles.view}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Image
          source={require('../assets/backlinearrow.png')}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 100,
    paddingTop: 1,
  },
  backButton: {
    position: 'absolute',
    marginLeft: '7%',
    marginTop: Platform.OS === 'ios' ? '16%' : '6%',
  },
  image: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
});

export default PersonalInfoHeader;
