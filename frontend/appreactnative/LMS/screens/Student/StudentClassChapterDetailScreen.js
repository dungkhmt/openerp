import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {Colors} from '../../styles/index';
import {studentGetClassChapterDetailAction} from '../../redux-saga/actions/StudentGetClassChapterDetailAction';

const CourseMaterial = ({data}) => {
  const navigation = useNavigation();

  const _onPress = () => {
    if (data.eduCourseMaterialType === 'EDU_COURSE_MATERIAL_TYPE_VIDEO') {
      navigation.push('StudentClassChapterDetailPlayVideoScreen', {
        sourceId: data.sourceId,
      });
    } else if (
      data.eduCourseMaterialType === 'EDU_COURSE_MATERIAL_TYPE_SLIDE'
    ) {
      navigation.push('StudentClassChapterDetailShowSlideScreen', {
        slideId: data.slideId,
      });
    } else {
      // No operation
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.5} onPress={_onPress}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Image
            source={
              data.eduCourseMaterialType === 'EDU_COURSE_MATERIAL_TYPE_VIDEO'
                ? require('../../images/play_video.png')
                : require('../../images/slide_show.png')
            }
            style={{width: 48, height: 48, margin: 8}}></Image>
          <Text style={styles.courseMaterialName}>
            {data.eduCourseMaterialName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const StudentClassChapterDetailScreen = ({route}) => {
  console.log('StudentClassChapterDetailScreen: enter');

  const {chapterId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.studentGetClassChapterDetailReducer.isFetching,
  );
  const courseMaterialList = useSelector(
    state => state.studentGetClassChapterDetailReducer.chapterDetail,
  );

  useEffect(() => {
    console.log('StudentClassChapterDetailScreen.useEffect: enter');
    dispatch(studentGetClassChapterDetailAction({chapterId: chapterId}));
  }, []);

  const renderItem = ({item}) => <CourseMaterial data={item} />;

  const refresh = () => {
    dispatch(studentGetClassChapterDetailAction({chapterId: chapterId}));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={courseMaterialList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.eduCourseMaterialId + index}
          onRefresh={refresh}
          refreshing={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassChapterDetailScreen;

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
    minHeight: 64,
    overflow: 'hidden',
  },
  courseMaterialName: {
    padding: 8,
    fontSize: 16,
    color: Colors.text,
    flexShrink: 1,
  },
});
