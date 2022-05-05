import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentPostQuizTestQuestionSaga(action) {
  console.log('studentPostQuizTestQuestionSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/quiz-test-choose_answer-by-user', action.payload);
    yield put({type: types.STUDENT_POST_QUIZ_TEST_QUESTION_SUCCESS, message: "Đã lưu thành công"});
  } catch (err) {
    console.log('studentPostQuizTestQuestionSaga: ' + err);
    yield put({type: types.STUDENT_POST_QUIZ_TEST_QUESTION_FAILURE, message: err.message, status: err.response.status});
  }
}

export default function* watchStudentPostQuizTestQuestion() {
  yield takeLatest(types.STUDENT_POST_QUIZ_TEST_QUESTION, studentPostQuizTestQuestionSaga);
}
