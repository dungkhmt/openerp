import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getStudentClassAssignmentsAction} from '../../redux-saga/actions/GetStudentClassAssignmentsAction';

const Assignment = ({data}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{JSON.stringify(data)}</Text>
    </View>
  );
};

const StudentClassAssignmentsTab = ({route}) => {
  console.log('StudentClassAssignmentsTab: enter');

  const {studentClassId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.getStudentClassAssignmentsReducer.isFetching,
  );
  const assignmentList = useSelector(
    state => state.getStudentClassAssignmentsReducer.assignmentList,
  );

  useEffect(() => {
    console.log('StudentClassAssignmentsTab.useEffect: enter');
    dispatch(
      getStudentClassAssignmentsAction({studentClassId: studentClassId}),
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={assignmentList}
          renderItem={({item}) => <Assignment data={item} />}
          keyExtractor={(item, index) => item.id + index}
          onRefresh={() =>
            getStudentClassAssignmentsAction({studentClassId: studentClassId})
          }
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassAssignmentsTab;

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
});
