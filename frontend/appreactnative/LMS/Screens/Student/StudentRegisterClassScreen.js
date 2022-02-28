import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getStudentRegisterClassListAction} from '../../redux-saga/actions/GetStudentRegisterClassListAction';
import {studentAttendClassAction} from '../../redux-saga/actions/StudentAttendClassAction';

const StudentRegisterClass = ({data}) => {
  // Observer results
  const {classId} = useSelector(
    state => state.studentAttendClassReducer.status,
  );
  if (classId !== null && classId !== undefined && data.id === classId) {
    data.registered = true;
  }

  const dispatch = useDispatch();

  return (
    <View style={styles.card}>
      <Text style={styles.classCode}>Mã lớp: {data.classCode}</Text>
      <Text style={styles.courseId}>Mã học phần: {data.courseId}</Text>
      <Text style={styles.name}>Tên học phần: {data.name}</Text>
      <Text style={styles.classType}>Loại lớp: {data.classType}</Text>
      <Text style={styles.departmentId}>Khoa/Viện: {data.departmentId}</Text>
      {!data.registered ? (
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => {
            dispatch(studentAttendClassAction({classId: data.id}));
          }}>
          <Text style={styles.buttonTextStyle}>Tham gia</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

const StudentRegisterClassScreen = () => {
  console.log('StudentRegisterClassScreen: enter');

  // Observer results
  const dispatch = useDispatch();
  const [page] = useState(0);
  const loading = useSelector(
    state => state.getStudentRegisterClassListReducer.isFetching,
  );
  const studentRegisterClassList = useSelector(
    state => state.getStudentRegisterClassListReducer.studentRegisterClassList,
  );

  useEffect(() => {
    console.log('StudentRegisterClassScreen.useEffect: enter');
    dispatch(getStudentRegisterClassListAction({page: page, size: 100})); // TODO: Pagination
  }, []);

  if (
    studentRegisterClassList !== null &&
    studentRegisterClassList !== undefined &&
    studentRegisterClassList.page !== null &&
    studentRegisterClassList.page !== undefined &&
    studentRegisterClassList.page.content !== null &&
    studentRegisterClassList.page.content !== undefined
  ) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={studentRegisterClassList.page.content}
            renderItem={({item}) => <StudentRegisterClass data={item} />}
            keyExtractor={(item, index) => item.id + index}
            onRefresh={() => dispatch(getStudentRegisterClassListAction())}
            refreshing={loading}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
        </View>
      </SafeAreaView>
    );
  }
};

export default StudentRegisterClassScreen;

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
  departmentId: {
    fontWeight: 'bold',
    padding: 8,
    fontSize: 14,
    color: Colors.text,
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
  buttonStyle: {
    backgroundColor: Colors.controlBackground,
    borderWidth: 0,
    color: Colors.text,
    borderColor: Colors.border,
    width: 120,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 16,
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
