import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getStudentClassMembersAction} from '../../redux-saga/actions/GetStudentClassMembersAction';

const Member = ({data}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.email}>{data.email}</Text>
    </View>
  );
};

const StudentClassMembersTab = ({route}) => {
  console.log('StudentClassMembersTab: enter');

  const {studentClassId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.getStudentClassMembersReducer.isFetching,
  );
  const memberList = useSelector(
    state => state.getStudentClassMembersReducer.memberList,
  );

  useEffect(() => {
    console.log('StudentClassMembersTab.useEffect: enter');
    dispatch(getStudentClassMembersAction({studentClassId: studentClassId}));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={memberList}
          renderItem={({item}) => <Member data={item} />}
          keyExtractor={(item, index) => item.id + index}
          onRefresh={() =>
            getStudentClassMembersAction({studentClassId: studentClassId})
          }
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassMembersTab;

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
  name: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
    padding: 8,
  },
  email: {
    fontSize: 14,
    color: 'blue',
    padding: 8,
  },
});
