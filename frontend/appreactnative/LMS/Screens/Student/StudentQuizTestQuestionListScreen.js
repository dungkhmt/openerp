import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import CheckBox from '@react-native-community/checkbox';
import PagerView from 'react-native-pager-view';

import {Colors} from '../../styles/index';
import Loader from '../Components/Loader';
import {studentGetQuizTestQuestionListAction} from '../../redux-saga/actions/StudentGetQuizTestQuestionListAction';
import {studentPostQuizTestQuestionAction} from '../../redux-saga/actions/StudentPostQuizTestQuestionAction';

const Answer = ({data}) => {
  // console.log('Answer: enter, choiceAnswerId = ' + data.choiceAnswerId + ', checked = ' + data.checked);

  const {width} = useWindowDimensions();
  const source = {
    html: data.choiceAnswerContent,
  };

  const [toggleCheckBox, setToggleCheckBox] = useState(data.checked);
  const onValueChange = newValue => {
    data.checked = newValue;
    setToggleCheckBox(newValue);
  };

  return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      <CheckBox
        style={{margin: 8, width: 48}}
        value={toggleCheckBox}
        onValueChange={onValueChange}
      />
      <RenderHtml contentWidth={width - 96} source={source}></RenderHtml>
    </View>
  );
};

const Question = ({total, index, data}) => {
  console.log('Question: enter, questionId = ' + data.questionId);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode
    ? Colors.containerBackgroundDarkMode
    : Colors.containerBackground;
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const source = {
    html: data.statement,
  };
  const dispatch = useDispatch();
  const quizTestQuestionList = useSelector(
    state => state.studentGetQuizTestQuestionListReducer.quizTestQuestionList,
  );
  const submitResult = useSelector(
    state => state.studentPostQuizTestQuestionReducer,
  );

  const renderItem = ({item}) => {
    return <Answer data={item} />;
  };

  var html = `<p style="font-size: 15px; color:#720d5d;"><b>Phương án hệ thống đã lưu lần gần nhất:</b></p>`;
  if (submitResult.status === 406) {
    Alert.alert('Thông báo', 'Bài test đã hết hạn!', [
      {
        text: 'OK',
        onPress: () => {
          submitResult.status = 0; // Reset status
          navigation.goBack(); // Go back previous screen
        },
      },
    ]);
  } else if (submitResult.status === 200) {
    // Merge submitResult.chooseAnswerIds into participationExecutionChoice
    var participationExecutionChoice =
      quizTestQuestionList.participationExecutionChoice;

    var quizChoiceAnswerIdList = [];
    data.quizChoiceAnswerList.forEach(e => {
      quizChoiceAnswerIdList.push(e.choiceAnswerId);
    });
    const submittedThisQuestion = submitResult.chooseAnswerIds.every(e => {
      return quizChoiceAnswerIdList.includes('' + e);
    });
    if (submittedThisQuestion) {
      participationExecutionChoice[data.questionId] =
        submitResult.chooseAnswerIds;
    }

    quizTestQuestionList.participationExecutionChoice =
      participationExecutionChoice;
  }

  for (const [key, value] of Object.entries(
    quizTestQuestionList.participationExecutionChoice,
  )) {
    if (data.questionId === key) {
      data.quizChoiceAnswerList.forEach(answer => {
        if (value.includes('' + answer.choiceAnswerId)) {
          html = html + answer.choiceAnswerContent;
        }
      });
    }
  }

  const recentAnswers = {
    html: html,
  };

  const ListFooterComponent = () => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={styles.buttonStyle}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              var payload = {
                testId: quizTestQuestionList.testId,
                questionId: data.questionId,
                quizGroupId: quizTestQuestionList.quizGroupId,
              };
              var chooseAnsIds = [];
              quizTestQuestionList.listQuestion.forEach(question => {
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
              dispatch(studentPostQuizTestQuestionAction(payload));
            }}>
            <Text style={styles.buttonTextStyle}>Lưu</Text>
          </TouchableOpacity>
        </View>
        <RenderHtml contentWidth={width - 96} source={recentAnswers}></RenderHtml>
      </View>
    );
  };

  return (
    <FlatList
      style={{...styles.card, backgroundColor: backgroundColor}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={data.quizChoiceAnswerList}
      ListHeaderComponent={() => {
        if (
          data.attachment !== undefined &&
          data.attachment !== null &&
          data.attachment.length > 0
        ) {
          return (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: 'purple',
                  textAlign: 'center',
                }}>
                Câu {index + 1}/{total}
              </Text>
              <RenderHtml
                contentWidth={width - 32}
                source={source}></RenderHtml>
              {data.attachment.map(attachment => {
                return (
                  <Image
                    resizeMode="contain"
                    style={{
                      borderWidth: 1,
                      width: width - 32,
                      height: width - 32,
                      borderColor: 'purple',
                      alignContent: 'center',
                    }}
                    source={{uri: 'data:image/png;base64,' + attachment}}
                  />
                );
              })}
            </View>
          );
        } else {
          return (
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: 'purple',
                  textAlign: 'center',
                }}>
                Câu {index + 1}/{total}
              </Text>
              <RenderHtml
                contentWidth={width - 32}
                source={source}></RenderHtml>
            </View>
          );
        }
      }}
      ListFooterComponent={ListFooterComponent}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.choiceAnswerId + index}
    />
  );
};

const StudentQuizTestQuestionListScreen = ({route}) => {
  console.log('StudentQuizTestQuestionListScreen: enter');

  const {testId} = route.params;
  // Observer results
  const dispatch = useDispatch();
  const loading = useSelector(
    state => state.studentGetQuizTestQuestionListReducer.isFetching,
  );
  const questionList = useSelector(
    state =>
      state.studentGetQuizTestQuestionListReducer.quizTestQuestionList
        .listQuestion,
  );

  useEffect(() => {
    console.log(
      'StudentQuizTestQuestionListScreen.useEffect: enter, testId=' + testId,
    );
    dispatch(studentGetQuizTestQuestionListAction({testId: testId}));
  }, []);

  if (
    questionList !== undefined &&
    questionList !== null &&
    questionList.length > 0
  ) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Loader loading={loading} />
          <PagerView style={styles.pagerView} initialPage={0}>
            {questionList.map((question, index) => {
              return (
                <View key={question.questionId}>
                  <Question
                    total={questionList.length}
                    index={index}
                    data={question}
                  />
                </View>
              );
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

export default StudentQuizTestQuestionListScreen;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: Colors.containerBackground,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    elevation: 8,
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
  submittedStyle: {
    alignContent: 'center',
    color: Colors.controlBackground,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 48,
    fontSize: 15,
  },
});
