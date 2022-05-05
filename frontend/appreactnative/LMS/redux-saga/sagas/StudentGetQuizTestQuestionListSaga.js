import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetQuizTestQuestionListSaga(action) {
  console.log('studentGetQuizTestQuestionListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {testId} = action.payload;
    const response = yield AxiosService.get('/get-quiz-test-participation-group-question/' + testId);
    yield put({type: types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST_SUCCESS, quizTestQuestionList: response.data});
  } catch (err) {
    console.log('studentGetQuizTestQuestionListSaga: ' + err);
    yield put({type: types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetQuizTestQuestionList() {
  yield takeLatest(types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST, studentGetQuizTestQuestionListSaga);
}
