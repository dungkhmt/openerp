import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import RenderHtml from 'react-native-render-html';
import CheckBox from '@react-native-community/checkbox';
import PagerView from 'react-native-pager-view';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {studentGetActiveQuizOfSessionAction} from '../../redux-saga/actions/StudentGetActiveQuizOfSessionAction';
import {studentPostActiveQuizOfSessionAction} from '../../redux-saga/actions/StudentPostActiveQuizOfSessionAction';

const Answer = ({data}) => {
  const {width} = useWindowDimensions();
  const source = {
    html: data.choiceAnswerContent,
  };

  return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      <CheckBox
        style={{width: 24, height: 24, margin: 8}}
        value={data.checked}
        onValueChange={value => (data.checked = value)}
      />
      <RenderHtml contentWidth={width - 96} source={source}></RenderHtml>
    </View>
  );
};

const Question = ({total, index, data}) => {
  const {width} = useWindowDimensions();
  const source = {
    html: data.statement,
  };
  const dispatch = useDispatch();
  const quiz = useSelector(
    state => state.studentGetActiveQuizOfSessionReducer.quiz,
  );

  const renderItem = ({item}) => <Answer data={item} />;

  return (
    <FlatList
      style={styles.card}
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
                return <Image resizeMode='contain' style={{borderWidth: 1, width: width - 16, height: width, borderColor: 'purple', alignContent: 'center'}} source={{uri: 'data:image/png;base64,' + attachment}}/>;
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
      ListFooterComponent={() => {
        return (
          <View style={styles.buttonStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                var payload = {testId: quiz.testId, questionId: data.questionId, quizGroupId: quiz.quizGroupId};
                var chooseAnsIds = [];
                quiz.listQuestion.forEach(question => {
                  if (question.questionId === data.questionId) {
                    data.quizChoiceAnswerList.forEach(answer => {
                      if (answer.checked) {
                        chooseAnsIds.push(answer.choiceAnswerId);
                      }
                    });
                  }
                });
                payload.chooseAnsIds = chooseAnsIds;
                // console.log(JSON.stringify(payload));
                dispatch(studentPostActiveQuizOfSessionAction(payload));
              }}>
              <Text style={styles.buttonTextStyle}>Chọn</Text>
            </TouchableOpacity>
          </View>
        );
      }}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.choiceAnswerId + index}
    />
  );
};

const StudentClassSessionDetailScreen = ({route}) => {
  console.log('StudentClassSessionDetailScreen: enter');

  const {studentClassId, classSessionId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.studentGetActiveQuizOfSessionReducer.isFetching,
  );
  const questionList = useSelector(
    state => state.studentGetActiveQuizOfSessionReducer.quiz.listQuestion,
  );

  useEffect(() => {
    console.log('StudentClassSessionDetailScreen.useEffect: enter');
    dispatch(
      studentGetActiveQuizOfSessionAction({classSessionId: classSessionId}),
    );
  }, []);

  if (questionList !== undefined && questionList !== null && questionList.length > 0) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
          <PagerView style={styles.pagerView} initialPage={0}>
            {questionList.map((question, index) => {
              return (<View key={question.questionId}><Question total={questionList.length} index={index} data={question}></Question></View>);
            })}
          </PagerView>
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

export default StudentClassSessionDetailScreen;

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
  buttonStyle: {
    backgroundColor: Colors.controlBackground,
    borderWidth: 0,
    color: Colors.text,
    borderColor: Colors.border,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    margin: 24,
  },
  buttonTextStyle: {
    alignContent: 'center',
    color: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 48,
    fontSize: 16,
  },
});
