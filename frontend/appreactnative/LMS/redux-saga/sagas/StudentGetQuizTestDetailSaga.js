import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetQuizTestDetailSaga(action) {
  console.log('studentGetQuizTestDetailSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/get-quiz-test-participation-group-question/' + action.testId);
    yield put({type: types.STUDENT_GET_QUIZ_TEST_DETAIL_SUCCESS, quizTestDetail: response.data});
  } catch (err) {
    console.log('studentGetQuizTestDetailSaga: ' + err);
    yield put({type: types.STUDENT_GET_QUIZ_TEST_DETAIL_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetQuizTestDetail() {
  yield takeLatest(types.STUDENT_GET_QUIZ_TEST_DETAIL, studentGetQuizTestDetailSaga);
}
