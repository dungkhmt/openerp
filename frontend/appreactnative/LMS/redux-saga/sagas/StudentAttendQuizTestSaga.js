import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentAttendQuizTestSaga(action) {
  console.log('studentAttendQuizTestSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/create-quiz-test-participation-register', action.payload);
    yield put({type: types.STUDENT_ATTEND_QUIZ_TEST_SUCCESS, status: {testId: action.payload.testQuizId, statusId: 'STATUS_REGISTERED'}});
  } catch (err) {
    console.log('studentAttendQuizTestSaga: ' + err);
    yield put({type: types.STUDENT_ATTEND_QUIZ_TEST_FAILURE, message: err.message});
  }
}

export default function* watchStudentAttendQuizTest() {
  yield takeLatest(types.STUDENT_ATTEND_QUIZ_TEST, studentAttendQuizTestSaga);
}
