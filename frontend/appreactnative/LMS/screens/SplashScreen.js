import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../styles/index';

const SplashScreen = ({navigation}) => {
  console.log('SplashScreen: enter');

  useEffect(() => {
    console.log('SplashScreen.useEffect: enter');

    setTimeout(() => {
      console.log('SplashScreen.useEffect.setTimeout: enter');

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
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash.png')}
        style={styles.backgroundImage}
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
    backgroundColor: Colors.controlBackground,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
});
