import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {studentGetQuizTestDetailAction} from '../../redux-saga/actions/StudentGetQuizTestDetailAction';

const StudentQuizTestDetailScreen = ({route}) => {
  console.log('StudentQuizTestDetailScreen: enter');

  const {testId} = route.params;
  const dispatch = useDispatch();
  const loading = useSelector(state => state.studentGetQuizTestDetailReducer.isFetching);
  const quizTestDetail = useSelector(
    state => state.studentGetQuizTestDetailReducer.quizTestDetail,
  );

  useEffect(() => {
    console.log('StudentQuizTestDetailScreen.useEffect: enter' + testId);
    dispatch(studentGetQuizTestDetailAction(testId));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.card}>
        <Loader loading={loading} />
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Image source={require('../../images/course.png')}
            style={{width: 24, height: 24, margin: 8}}></Image>
          <Text style={styles.course}>{quizTestDetail.courseName}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Image source={require('../../images/quiz.png')}
            style={{width: 24, height: 24, margin: 8}}></Image>
          <Text style={styles.testName}>{quizTestDetail.testName}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Image source={require('../../images/schedule.png')}
            style={{width: 24, height: 24, margin: 8}}></Image>
          <Text style={styles.schedule}>{quizTestDetail.scheduleDatetime}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Image source={require('../../images/duration.png')}
            style={{width: 24, height: 24, margin: 8}}></Image>
          <Text style={styles.duration}>{quizTestDetail.duration}</Text>
        </View>
        <View style={styles.buttonStyle}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // navigation.push('');
            }}>
            <Text style={styles.buttonTextStyle}>View Questions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentQuizTestDetailScreen;

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
    flexShrink: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
    flexShrink: 1,
  },
  schedule: {
    padding: 8,
    fontWeight: 'bold',
    color: Colors.text,
    flexShrink: 1,
  },
  duration: {
    padding: 8,
    fontWeight: 'bold',
    color: 'red',
    flexShrink: 1,
  },
  approved: {
    padding: 8,
    color: 'green',
    fontWeight: 'bold',
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
  },
});
