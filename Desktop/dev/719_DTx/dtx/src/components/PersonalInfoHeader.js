import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Pressable, View } from 'react-native';

const PersonalInfoHeader = ({ onBack }) => {
  return (
    <View style={styles.view}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Image
          source={require('../assets/backlinearrow.png')} // Make sure the path is correct
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
    marginTop: '16%',
  },
  image: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
});

export default PersonalInfoHeader;
