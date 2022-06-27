import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
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
import {studentGetActiveQuizOfSessionAction} from '../../redux-saga/actions/StudentGetActiveQuizOfSessionAction';
import {studentPostActiveQuizOfSessionAction} from '../../redux-saga/actions/StudentPostActiveQuizOfSessionAction';

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
  console.log(
    'Question: enter, questionId = ' +
      data.questionId +
      ', submitted = ' +
      data.submitted,
  );
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? Colors.containerBackgroundDarkMode : Colors.containerBackground;
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const source = {
    html: data.statement,
  };
  const dispatch = useDispatch();
  const quiz = useSelector(
    state => state.studentGetActiveQuizOfSessionReducer.quiz,
  );
  const submitResult = useSelector(
    state => state.studentPostActiveQuizOfSessionReducer,
  );
  const [submitted, setSubmitted] = useState(data.submitted);

  const renderItem = ({item}) => {
    if (submitted) {
      return <></>;
    } else {
      return <Answer data={item} />;
    }
  };

  if (submitResult !== undefined && submitResult.status === 406) {
    Alert.alert('Thông báo', 'Bài test đã hết hạn!', [
      {
        text: 'OK',
        onPress: () => {
          submitResult.status = 0; // Reset status
          navigation.goBack(); // Go back previous screen
        },
      },
    ]);
  }

  const ListFooterComponent = () => {
    if (submitted) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.submittedStyle}>Bạn đã submit câu trả lời</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonStyle}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              var payload = {
                testId: quiz.testId,
                questionId: data.questionId,
                quizGroupId: quiz.quizGroupId,
              };
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
              data.submitted = true;
              setSubmitted(data.submitted);
            }}>
            <Text style={styles.buttonTextStyle}>Chọn</Text>
          </TouchableOpacity>
        </View>
      );
    }
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
