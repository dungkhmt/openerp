import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getQuizTestListSaga(action) {
  console.log('getQuizTestListSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/get-all-quiz-test-user');
    yield put({type: types.GET_QUIZ_TEST_LIST_SUCCESS, quizTestList: response.data});
  } catch (err) {
    console.log('getQuizTestListSaga: ' + err);
    yield put({type: types.GET_QUIZ_TEST_LIST_FAILURE, message: err.message});
  }
}

export default function* watchGetQuizTestList() {
  yield takeLatest(types.GET_QUIZ_TEST_LIST, getQuizTestListSaga);
}
