import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetActiveQuizOfSessionSaga(action) {
  console.log('studentGetActiveQuizOfSessionSaga: enter, action=' + JSON.stringify(action));
  try {
    const {classSessionId} = action.payload;
    const response = yield AxiosService.get('/get-active-quiz-of-session-for-participant/' + classSessionId);
    yield put({type: types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION_SUCCESS, quiz: response.data});
  } catch (err) {
    console.log('studentGetActiveQuizOfSessionSaga: ' + err);
    yield put({type: types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetActiveQuizOfSession() {
  yield takeLatest(types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION, studentGetActiveQuizOfSessionSaga);
}
