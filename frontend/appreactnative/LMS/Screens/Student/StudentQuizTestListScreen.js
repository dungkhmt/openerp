import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {studentGetQuizTestListAction} from '../../redux-saga/actions/StudentGetQuizTestListAction';
import {studentAttendQuizTestAction} from '../../redux-saga/actions/StudentAttendQuizTestAction';

const Status = ({testId, statusId}) => {
  const dispatch = useDispatch();

  if (statusId === null) {
    return (
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => {
          dispatch(studentAttendQuizTestAction({testQuizId: testId}));
        }}>
        <Text style={styles.buttonTextStyle}>Tham gia</Text>
      </TouchableOpacity>
    );
  }

  if (statusId === 'STATUS_APPROVED') {
    return <Text style={styles.approved}>Đã phê duyệt</Text>;
  } else if (statusId === 'STATUS_REGISTERED') {
    return <Text style={styles.registered}>Chờ phê duyệt</Text>;
  }

  return null;
};

const Quiz = ({quiz}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (quiz.statusId === 'STATUS_APPROVED') {
            navigation.push('StudentQuizTestDetailScreen', {testId: quiz.testId});
          }
        }}>
        <Text style={styles.testName}>{quiz.testName}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../images/schedule.png')}
            style={{width: 24, height: 24, margin: 8}}></Image>
          <Text style={styles.schedule}>{quiz.scheduleDatetime}</Text>
          <Status testId={quiz.testId} statusId={quiz.statusId}></Status>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const StudentQuizTestListScreen = () => {
  console.log('StudentQuizTestListScreen: enter');

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.studentGetQuizTestListReducer.isFetching);
  const quizTestList = useSelector(
    state => state.studentGetQuizTestListReducer.quizTestList,
  );

  // Update test status
  const {testId, statusId} = useSelector(
    state => state.studentAttendQuizTestReducer.status,
  );
  quizTestList.forEach(element => {
    if (element.testId === testId && statusId !== null && statusId.length > 0) {
      element.statusId = statusId;
    }
  });

  useEffect(() => {
    console.log('StudentQuizTestListScreen.useEffect: enter');
    dispatch(studentGetQuizTestListAction());
  }, []);

  const renderItem = ({item}) => <Quiz quiz={item} />;

  const refresh = () => {
    dispatch(studentGetQuizTestListAction());
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={quizTestList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.testId + index}
          onRefresh={refresh}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentQuizTestListScreen;

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
