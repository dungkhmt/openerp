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
import {studentGetClassListAction} from '../../redux-saga/actions/StudentGetClassListAction';

const StudentClass = ({data}) => {
  const navigation = useNavigation();

  if (data.status === 'APPROVED') {
    return (
      <View style={{...styles.card, backgroundColor: '#ffffff'}}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.push('StudentClassDetailScreen', {studentClassId: data.id});
          }}>
          <Text style={styles.classCode}>Mã lớp: {data.classCode}</Text>
          <Text style={styles.courseId}>Mã học phần: {data.courseId}</Text>
          <Text style={styles.name}>Tên học phần: {data.name}</Text>
          <Text style={styles.classType}>Loại lớp: {data.classType}</Text>
          <Text style={styles.semester}>Học kỳ: {data.semester}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={{...styles.card, backgroundColor: '#cfd8dc'}}>
        <Text style={styles.classCode}>Mã lớp: {data.classCode}</Text>
        <Text style={styles.courseId}>Mã học phần: {data.courseId}</Text>
        <Text style={styles.name}>Tên học phần: {data.name}</Text>
        <Text style={styles.classType}>Loại lớp: {data.classType}</Text>
        <Text style={styles.semester}>Học kỳ: {data.semester}</Text>
      </View>
    );
  }
};

const StudentClassListScreen = () => {
  console.log('StudentClassListScreen: enter');

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.studentGetClassListReducer.isFetching);
  const studentClassList = useSelector(
    state => state.studentGetClassListReducer.studentClassList,
  );

  useEffect(() => {
    console.log('StudentClassListScreen.useEffect: enter');
    dispatch(studentGetClassListAction());
  }, []);

  const renderItem = ({item}) => <StudentClass data={item} />;

  const refresh = () => {
    dispatch(studentGetClassListAction());
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={studentClassList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id + index}
          onRefresh={refresh}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.controlBackground,
    padding: 8,
  },
  courseId: {
    fontSize: 14,
    color: Colors.text,
    padding: 8,
  },
  name: {
    fontWeight: 'bold',
    padding: 8,
    fontSize: 16,
    color: Colors.text,
  },
  classType: {
    padding: 8,
    fontSize: 14,
    color: Colors.text,
  },
  semester: {
    padding: 8,
    fontSize: 14,
    color: Colors.text,
  },
});
