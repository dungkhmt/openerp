import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Colors} from '../../styles/index';

const TutorialScreen = ({navigation}) => {
  console.log('TutorialScreen: enter');

  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View
        key="1"
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: Colors.controlBackground,
          justifyContent: 'flex-end',
        }}>
        <View style={styles.card}>
          <View style={styles.buttonStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                AsyncStorage.setItem('show_tutorial', JSON.stringify(true));
                AsyncStorage.getItem('user_id').then(userId =>
                  navigation.replace(
                    userId === null ? 'Auth' : 'DrawerNavigationRoutes',
                  ),
                );
              }}>
              <Text style={styles.buttonTextStyle}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        key="2"
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: Colors.controlBackground,
          justifyContent: 'flex-end',
        }}>
        <View style={styles.card}>
          <View style={styles.buttonStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                AsyncStorage.setItem('show_tutorial', JSON.stringify(true));
                AsyncStorage.getItem('user_id').then(userId =>
                  navigation.replace(
                    userId === null ? 'Auth' : 'DrawerNavigationRoutes',
                  ),
                );
              }}>
              <Text style={styles.buttonTextStyle}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        key="3"
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: Colors.controlBackground,
          justifyContent: 'flex-end',
        }}>
        <View style={styles.card}>
          <View style={styles.buttonStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                AsyncStorage.setItem('show_tutorial', JSON.stringify(true));
                AsyncStorage.getItem('user_id').then(userId =>
                  navigation.replace(
                    userId === null ? 'Auth' : 'DrawerNavigationRoutes',
                  ),
                );
              }}>
              <Text style={styles.buttonTextStyle}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PagerView>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: Colors.controlBackground,
  },
  card: {
    flexDirection: 'column',
    elevation: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    height: 375,
    shadowOpacity: 0.33,
    shadowRadius: 8,
    borderRadius: 24,
    shadowOffset: {
      width: 8,
      height: 8,
    },
    margin: 24,
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    backgroundColor: Colors.controlBackground,
    borderWidth: 0,
    color: Colors.text,
    borderColor: Colors.border,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    margin: 24,
  },
  buttonTextStyle: {
    alignContent: 'center',
    color: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 48,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
