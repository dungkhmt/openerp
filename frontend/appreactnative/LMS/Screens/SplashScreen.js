import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../styles/index';

const SplashScreen = ({navigation}) => {
  console.log('SplashScreen: enter');

  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    console.log('SplashScreen.useEffect: enter');

    setTimeout(() => {
      console.log('SplashScreen.useEffect.setTimeout: enter');

      setAnimating(false);

      AsyncStorage.getItem('show_tutorial').then(showTutorial => {
        if (showTutorial === null) {
          navigation.replace('Tutorial');
        } else {
          AsyncStorage.getItem('user_id').then(userId =>
            navigation.replace(
              userId === null ? 'Auth' : 'DrawerNavigationRoutes',
            ),
          );
        }
      });
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/lms.png')}
        style={{width: 96, height: 96}}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.containerBackground,
    opacity: 0.8,
  },
});