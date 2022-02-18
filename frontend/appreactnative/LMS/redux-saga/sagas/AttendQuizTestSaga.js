import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* attendQuizTestSaga(action) {
  console.log('attendQuizTestSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/create-quiz-test-participation-register', action.payload);
    yield put({type: types.ATTEND_QUIZ_TEST_SUCCESS, status: {testId: action.payload.testQuizId, statusId: 'STATUS_REGISTERED'}});
  } catch (err) {
    console.log('attendQuizTestSaga: ' + err);
    yield put({type: types.ATTEND_QUIZ_TEST_FAILURE, message: err.message});
  }
}

export default function* watchAttendQuizTest() {
  yield takeLatest(types.ATTEND_QUIZ_TEST, attendQuizTestSaga);
}
