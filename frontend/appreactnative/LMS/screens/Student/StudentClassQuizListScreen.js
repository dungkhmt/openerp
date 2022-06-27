import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  useWindowDimensions,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import RenderHtml from 'react-native-render-html';
import CheckBox from '@react-native-community/checkbox';
import PagerView from 'react-native-pager-view';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {studentGetClassQuizListAction} from '../../redux-saga/actions/StudentGetClassQuizListAction';

const Answer = ({data}) => {
  const {width} = useWindowDimensions();
  const source = {
    html: data.choiceAnswerContent,
  };

  return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      <CheckBox style={{width: 48, margin: 8}}></CheckBox>
      <RenderHtml contentWidth={width - 96} source={source}></RenderHtml>
    </View>
  );
};

const Question = ({total, index, data}) => {
  const {width} = useWindowDimensions();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? Colors.containerBackgroundDarkMode : Colors.containerBackground;
  const source = {
    html: data.statement,
  };

  const renderItem = ({item}) => <Answer data={item} />;

  return (
    <FlatList
      style={{...styles.card, backgroundColor: backgroundColor}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={data.quizChoiceAnswerList}
      ListHeaderComponent={() => {
        if (data.attachment !== undefined && data.attachment !== null && data.attachment.length > 0) {
          return (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontWeight: 'bold', fontSize: 15, color: 'purple', textAlign: 'center'}}>Câu {index + 1}/{total}</Text>
              <RenderHtml contentWidth={width - 32} source={source}></RenderHtml>
              {data.attachment.map(attachment => {
                return <Image resizeMode='contain' style={{borderWidth: 1, width: width - 32, height: width - 32, borderColor: 'purple', alignContent: 'center'}} source={{uri: 'data:image/png;base64,' + attachment}}/>;
              })}
            </View>
          );
        } else {
          return (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontWeight: 'bold', fontSize: 15, color: 'purple', textAlign: 'center'}}>Câu {index + 1}/{total}</Text>
              <RenderHtml contentWidth={width - 32} source={source}></RenderHtml>
            </View>
          );
        }
      }}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.choiceAnswerId + index}
    />
  );
};

const StudentClassQuizzesTab = ({route}) => {
  console.log('StudentClassQuizzesTab: enter');

  const {studentClassId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(state => state.studentGetClassQuizListReducer.isFetching);
  const quizList = useSelector(
    state => state.studentGetClassQuizListReducer.quizList,
  );

  useEffect(() => {
    console.log('StudentClassQuizzesTab.useEffect: enter');
    dispatch(studentGetClassQuizListAction({studentClassId: studentClassId}));
  }, []);

  if (quizList !== undefined && quizList !== null && quizList.length > 0) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
          <PagerView style={styles.pagerView} initialPage={0}>
            {quizList.map((quiz, index) => {
              return (<View key={quiz.questionId}><Question total={quizList.length} index={index} data={quiz}></Question></View>);
            })}
          </PagerView>
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

export default StudentClassQuizzesTab;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: Colors.containerBackground,
  },
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
  },
});
