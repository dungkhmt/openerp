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
import {studentGetRegisterClassListAction} from '../../redux-saga/actions/StudentGetRegisterClassListAction';
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
      <Text style={styles.courseName}>Tên học phần: {data.courseName}</Text>
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
  const [currentPage, setCurrentPage] = useState(0);
  const loading = useSelector(
    state => state.studentGetRegisterClassListReducer.isFetching,
  );
  const studentRegisterClasses = useSelector(
    state => state.studentGetRegisterClassListReducer.studentRegisterClasses,
  );

  // console.log('currentPage=' + currentPage + ', ' + JSON.stringify(studentRegisterClasses));

  useEffect(() => {
    console.log('StudentRegisterClassScreen.useEffect: enter, currentPage=' + currentPage);
    dispatch(studentGetRegisterClassListAction({page: currentPage, size: 20}));
  }, [currentPage]);

  const renderItem = ({item}) => <StudentRegisterClass data={item} />;

  const refresh = () => {
    // Reset state
    studentRegisterClasses.semesterId = '';
    studentRegisterClasses.list = [];
    studentRegisterClasses.registeredClasses = [];
    setCurrentPage(0);
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1); // TODO: Control sao cho currentPage khong bi tang vo han.
  };

  if (studentRegisterClasses !== null && studentRegisterClasses !== undefined) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={studentRegisterClasses.list}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id + index}
            onRefresh={refresh}
            onEndReached={loadMore}
            onEndReachedThreshold={0}
            refreshing={loading}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View />
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
  courseName: {
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
  departmentId: {
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
