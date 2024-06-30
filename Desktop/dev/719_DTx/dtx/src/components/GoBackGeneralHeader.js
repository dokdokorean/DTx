import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GoBackGeneralHeader = ({}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.view}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
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
  infoButton: {
    position: 'absolute',
    top: 60,
    right: 10,
  },
  infoIcon: {
    width: 20,
    height: 20,
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
  headment1: {
    position: 'absolute',
    fontWeight: '700',
    marginTop: '0%',
    width: 200,
    left: 40,
    fontSize: 20,
  },
});

export default GoBackGeneralHeader;

