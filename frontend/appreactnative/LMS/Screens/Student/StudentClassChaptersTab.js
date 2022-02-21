import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {getStudentClassChaptersAction} from '../../redux-saga/actions/GetStudentClassChaptersAction';

const Chapter = ({data}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.chapterName}>{data.chapterName}</Text>
    </View>
  );
};

const StudentClassChaptersTab = ({route}) => {
  console.log('StudentClassChaptersTab: enter');

  const {studentClassId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.getStudentClassChaptersReducer.isFetching,
  );
  const chapterList = useSelector(
    state => state.getStudentClassChaptersReducer.chapterList,
  );

  useEffect(() => {
    console.log('StudentClassChaptersTab.useEffect: enter');
    dispatch(getStudentClassChaptersAction({studentClassId: studentClassId}));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Loader loading={loading} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={chapterList}
          renderItem={({item}) => <Chapter data={item} />}
          keyExtractor={(item, index) => item.chapterId + index}
          onRefresh={() =>
            dispatch(
              getStudentClassChaptersAction({studentClassId: studentClassId}),
            )
          }
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassChaptersTab;

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
    minHeight: 64,
  },
  chapterName: {
    fontSize: 16,
    color: Colors.text,
    padding: 8,
  },
});
