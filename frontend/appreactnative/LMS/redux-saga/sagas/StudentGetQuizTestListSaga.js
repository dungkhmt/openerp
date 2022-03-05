import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetQuizTestListSaga(action) {
  console.log('studentGetQuizTestListSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/get-all-quiz-test-user');
    yield put({type: types.STUDENT_GET_QUIZ_TEST_LIST_SUCCESS, quizTestList: response.data});
  } catch (err) {
    console.log('studentGetQuizTestListSaga: ' + err);
    yield put({type: types.STUDENT_GET_QUIZ_TEST_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetQuizTestList() {
  yield takeLatest(types.STUDENT_GET_QUIZ_TEST_LIST, studentGetQuizTestListSaga);
}
