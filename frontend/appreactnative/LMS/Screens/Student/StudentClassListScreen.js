import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getStudentClassListAction} from '../../redux-saga/actions/GetStudentClassListAction';

const StudentClass = ({data}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          if (data.status === 'APPROVED') {
            navigation.push('StudentClassDetailScreen', {studentClassId: data.id});
          }
        }}>
        <Text style={styles.classCode}>Mã lớp: {data.classCode}</Text>
        <Text style={styles.courseId}>Mã học phần: {data.courseId}</Text>
        <Text style={styles.name}>Tên học phần: {data.name}</Text>
        <Text style={styles.classType}>Loại lớp: {data.classType}</Text>
        <Text style={styles.semester}>Học kỳ: {data.semester}</Text>
        <Text style={styles.status}>Trạng thái: {data.status}</Text>
      </TouchableOpacity>
    </View>
  );
};

const StudentClassListScreen = () => {
  console.log('StudentClassListScreen: enter');

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.getStudentClassListReducer.isFetching);
  const studentClassList = useSelector(
    state => state.getStudentClassListReducer.studentClassList,
  );

  useEffect(() => {
    console.log('StudentClassListScreen.useEffect: enter');
    dispatch(getStudentClassListAction());
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={studentClassList}
          renderItem={({item}) => <StudentClass data={item} />}
          keyExtractor={(item, index) => item.id + index}
          onRefresh={() => dispatch(getStudentClassListAction())}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassListScreen;

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
  classCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    padding: 8,
  },
  courseId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
  },
  name: {
    fontWeight: 'bold',
    padding: 8,
    fontSize: 14,
    color: Colors.text,
  },
  classType: {
    fontWeight: 'bold',
    padding: 8,
    fontSize: 14,
    color: Colors.text,
  },
  semester: {
    fontWeight: 'bold',
    padding: 8,
    fontSize: 14,
    color: Colors.text,
  },
  status: {
    fontWeight: 'bold',
    padding: 8,
    fontSize: 14,
    color: Colors.text,
  },
});
