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
import {studentGetClassInformationAction} from '../../redux-saga/actions/StudentGetClassInformationAction';

const StudentClassInformation = ({studentClassId}) => {
  console.log('StudentClassInformation: enter');

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.studentGetClassInformationReducer.isFetching);
  const classInformation = useSelector(
    state => state.studentGetClassInformationReducer.classInformation,
  );

  useEffect(() => {
    console.log('StudentClassInformation.useEffect: enter');
    dispatch(studentGetClassInformationAction({studentClassId: studentClassId}));
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
          <Image style={{width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.controlBackground, opacity: 0.75}} />
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={styles.teacherName}>{classInformation.teacherName}</Text>
            <View style={{flex: 1, flexDirection: 'row', alignContent: 'center'}}>
              <Image style={{width: 16, height: 16, margin: 8}} source={require('../../images/mail.png')} />
              <Text style={styles.email}>{classInformation.email}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignContent: 'center'}}>
            <Image style={{width: 16, height: 16, margin: 8}} source={require('../../images/phone.png')} />
              <Text style={styles.phone}>{classInformation.phone}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudentClassInformation;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    elevation: 4,
    backgroundColor: '#f8bbd0',
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
    paddingBottom: 4,
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
  phone: {
    fontSize: 14,
    color: 'blue',
    padding: 8,
  },
});
