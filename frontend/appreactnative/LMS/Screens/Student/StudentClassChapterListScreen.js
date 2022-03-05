import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors} from '../../styles/index';
import {studentGetClassChapterListAction} from '../../redux-saga/actions/StudentGetClassChapterListAction';

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
    state => state.studentGetClassChapterListReducer.isFetching,
  );
  const chapterList = useSelector(
    state => state.studentGetClassChapterListReducer.chapterList,
  );

  useEffect(() => {
    console.log('StudentClassChaptersTab.useEffect: enter');
    dispatch(studentGetClassChapterListAction({studentClassId: studentClassId}));
  }, []);

  const renderItem = ({item}) => <Chapter data={item} />;

  const refresh = () => {
    dispatch(studentGetClassChapterListAction({studentClassId: studentClassId}));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={chapterList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.chapterId + index}
          onRefresh={refresh}
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
