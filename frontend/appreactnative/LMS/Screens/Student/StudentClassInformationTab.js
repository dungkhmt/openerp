import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getStudentClassInformationAction} from '../../redux-saga/actions/GetStudentClassInformationAction';

const StudentClassInformationTab = ({studentClassId}) => {
  console.log('StudentClassInformationTab: enter');

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.getStudentClassInformationReducer.isFetching);
  const classInformation = useSelector(
    state => state.getStudentClassInformationReducer.classInformation,
  );

  useEffect(() => {
    console.log('StudentClassInformationTab.useEffect: enter');
    dispatch(getStudentClassInformationAction({studentClassId: studentClassId}));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, paddingBottom: 8}}>
        <Loader loading={loading} />
        <Text style={styles.header}>Mã lớp</Text>
        <Text style={styles.card}>{classInformation.code}</Text>
        <Text style={styles.header}>Mã học phần</Text>
        <Text style={styles.card}>{classInformation.courseId}</Text>
        <Text style={styles.header}>Tên học phần</Text>
        <Text style={styles.card}>{classInformation.name}</Text>
        <Text style={styles.header}>Loại lớp</Text>
        <Text style={styles.card}>{classInformation.classType}</Text>
        <Text style={styles.header}>Giảng viên</Text>
        <View style={{...styles.card, flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={styles.teacherName}>{classInformation.teacherName}</Text>
            <Text style={styles.email}>{classInformation.email}</Text>
          </View>
          <Image style={{width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.controlBackground}}></Image>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentClassInformationTab;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    elevation: 4,
    backgroundColor: '#e8eaf6',
    shadowColor: '#000000',
    shadowOpacity: 0.33,
    shadowRadius: 4,
    borderRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    color: Colors.text,
    marginHorizontal: 8,
    padding: 8,
    minHeight: 48,
    overflow: 'hidden',
  },
  header: {
    fontSize: 12,
    color: 'gray',
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
  },
  email: {
    fontSize: 14,
    color: 'blue',
    padding: 8,
  },
});
