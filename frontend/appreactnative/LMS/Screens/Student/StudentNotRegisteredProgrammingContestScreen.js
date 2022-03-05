import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';

import {Colors} from '../../styles/index';

const StudentNotRegisteredProgrammingContestScreen = () => {
  console.log('StudentNotRegisteredProgrammingContestScreen: enter');

  // Observer results
  const loading = false;

  useEffect(() => {
    console.log('StudentNotRegisteredProgrammingContestScreen.useEffect: enter');
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View />
    </SafeAreaView>
  );
};

export default StudentNotRegisteredProgrammingContestScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    elevation: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.33,
    shadowRadius: 8,
    borderRadius: 8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    margin: 8,
    overflow: 'hidden',
  },
  course: {
    fontSize: 16,
    color: 'blue',
    padding: 8,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
  },
  schedule: {
    padding: 8,
    fontSize: 11,
    color: 'blue',
  },
  approved: {
    textAlign: 'center',
    width: 120,
    height: 32,
    padding: 8,
    margin: 8,
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 11,
  },
  registered: {
    textAlign: 'center',
    width: 120,
    height: 32,
    padding: 8,
    margin: 8,
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 11,
  },
  viewType: {
    padding: 8,
    color: 'red',
  },
  buttonStyle: {
    backgroundColor: Colors.controlBackground,
    borderWidth: 0,
    color: Colors.text,
    borderColor: Colors.border,
    width: 120,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 8,
  },
  buttonTextStyle: {
    color: '#ffffff',
    paddingVertical: 2,
    paddingHorizontal: 16,
    fontSize: 11,
    alignContent: 'center',
  },
});
