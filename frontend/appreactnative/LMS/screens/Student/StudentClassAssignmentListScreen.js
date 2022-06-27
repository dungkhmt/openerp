import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import {studentGetClassAssignmentListAction} from '../../redux-saga/actions/StudentGetClassAssignmentListAction';

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
    state => state.studentGetClassAssignmentListReducer.isFetching,
  );
  const assignmentList = useSelector(
    state => state.studentGetClassAssignmentListReducer.assignmentList,
  );

  useEffect(() => {
    console.log('StudentClassAssignmentsTab.useEffect: enter');
    dispatch(
      studentGetClassAssignmentListAction({studentClassId: studentClassId}),
    );
  }, []);

  const renderItem = ({item}) => <Assignment data={item} />;

  const refresh = () => {
    dispatch(
      studentGetClassAssignmentListAction({studentClassId: studentClassId}),
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={assignmentList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id + index}
          onRefresh={refresh}
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
