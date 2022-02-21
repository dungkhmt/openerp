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
import StudentClassInformationTab from './StudentClassInformationTab';

const Menu = ({data}) => {
  const navigation = useNavigation();

  if (data.route === null || data.title === null) {
    return <View style={styles.emptyMenu} />;
  }

  return (
    <View style={styles.menu}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.push(data.route, {studentClassId: data.studentClassId});
        }}>
        <Text style={{flex: 1, fontSize: 15, fontWeight: 'bold', color: Colors.controlBackground, height: 32}}>{data.title}</Text>
        <View style={{height: 1, marginHorizontal: 4, backgroundColor: 'lightgray'}} />
        <Text style={{flex: 1, fontSize: 13, color: Colors.text, height: 64, padding: 4}}>{data.description}</Text>
      </TouchableOpacity>
    </View>
  );
};

const StudentClassDetailScreen = ({route}) => {
  console.log('StudentClassDetailScreen: enter');

  const {studentClassId} = route.params;

  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.getStudentClassListReducer.isFetching,
  );

  const menuList = [
    {route: 'StudentClassChaptersTab', title: 'Nội dung', description: '- Chương trình học', studentClassId: studentClassId},
    {route: 'StudentClassQuizzesTab', title: 'Quiz', description: '- Câu hỏi trắc nghiệm', studentClassId: studentClassId},
    {route: 'StudentClassMembersTab', title: 'Sinh viên', description: '- Danh sách thành viên', studentClassId: studentClassId},
    {route: 'StudentClassAssignmentsTab', title: 'Bài tập', description: '- Bài tập theo chương trình học', studentClassId: studentClassId},
    {route: 'StudentClassSessionsTab', title: 'Buổi học', description: '- Nội dung buổi học', studentClassId: studentClassId},
    {route: null, title: null, studentClassId: null}, // Dummy
  ];

  useEffect(() => {
    console.log('StudentClassDetailScreen.useEffect: enter');
    dispatch(getStudentClassListAction());
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          style={{backgroundColor: '#FFFFFF', padding: 8, margin: 8}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={menuList}
          numColumns={2}
          ListHeaderComponent={() => {
            return <StudentClassInformationTab studentClassId={studentClassId} />;
          }}
          ListFooterComponent={() => {
            return <View style={{height: 16}} />;
          }}
          renderItem={({item}) => <Menu data={item} />}
          keyExtractor={(item, index) => item.route + index}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassDetailScreen;

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
    padding: 8,
    overflow: 'hidden',
  },
  menu: {
    flex: 1,
    flexDirection: 'column',
    elevation: 8,
    backgroundColor: '#F5EEFB',
    shadowColor: '#000000',
    shadowOpacity: 0.33,
    shadowRadius: 8,
    borderRadius: 8,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    margin: 8,
    padding: 8,
    overflow: 'hidden',
  },
  emptyMenu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 8,
    overflow: 'hidden',
  },
});
