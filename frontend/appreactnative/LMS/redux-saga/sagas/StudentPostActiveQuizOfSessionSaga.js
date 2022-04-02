import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentPostActiveQuizOfSessionSaga(action) {
  console.log('studentPostActiveQuizOfSessionSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/quiz-test-choose_answer-by-user', action.payload);
    yield put({type: types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION_SUCCESS, message: "Đã lưu thành công"});
  } catch (err) {
    console.log('studentPostActiveQuizOfSessionSaga: ' + err);
    yield put({type: types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION_FAILURE, message: err.message, status: err.response.status});
  }
}

export default function* watchStudentPostActiveQuizOfSession() {
  yield takeLatest(types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION, studentPostActiveQuizOfSessionSaga);
}
