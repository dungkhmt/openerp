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
import {studentGetClassSessionListAction} from '../../redux-saga/actions/StudentGetClassSessionListAction';

const Session = ({data}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.push('StudentClassSessionDetailScreen', {studentClassId: data.classId, classSessionId: data.sessionId});
        }}>
        <Text style={styles.sessionName}>Tên buổi học: {data.sessionName}</Text>
        <Text style={styles.description}>Mô tả: {data.description}</Text>
        <Text style={styles.createdByUserLoginId}>Người tạo: {data.createdByUserLoginId}</Text>
        <Text style={styles.statusId}>Trạng thái: {data.statusId}</Text>
      </TouchableOpacity>
    </View>
  );
};

const StudentClassSessionsTab = ({route}) => {
  console.log('StudentClassSessionsTab: enter');

  const {studentClassId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.studentGetClassSessionListReducer.isFetching);
  const sessionList = useSelector(
    state => state.studentGetClassSessionListReducer.sessionList,
  );

  useEffect(() => {
    console.log('StudentClassSessionsTab.useEffect: enter');
    dispatch(studentGetClassSessionListAction({studentClassId: studentClassId}));
  }, []);

  const renderItem = ({item}) => <Session data={item} />;

  const refresh = () => {
    dispatch(studentGetClassSessionListAction({studentClassId: studentClassId}));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={sessionList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.sessionId + index}
          onRefresh={refresh}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassSessionsTab;

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
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    padding: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
  },
  createdByUserLoginId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
  },
  statusId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 8,
  },
});
