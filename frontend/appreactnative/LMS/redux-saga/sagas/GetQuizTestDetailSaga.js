import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getQuizTestDetailSaga(action) {
  console.log('getQuizTestDetailSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/get-quiz-test-participation-group-question/' + action.testId);
    yield put({type: types.GET_QUIZ_TEST_DETAIL_SUCCESS, quizTestDetail: response.data});
  } catch (err) {
    console.log('getQuizTestDetailSaga: ' + err);
    yield put({type: types.GET_QUIZ_TEST_DETAIL_FAILURE, message: err.message});
  }
}

export default function* watchGetQuizTestDetail() {
  yield takeLatest(types.GET_QUIZ_TEST_DETAIL, getQuizTestDetailSaga);
}
