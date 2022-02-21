import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getActiveQuizOfSessionForStudentSaga(action) {
  console.log('getActiveQuizOfSessionForStudentSaga: enter, action=' + JSON.stringify(action));
  try {
    const {classSessionId} = action.payload;
    const response = yield AxiosService.get('/get-active-quiz-of-session-for-participant/' + classSessionId);
    yield put({type: types.GET_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT_SUCCESS, quiz: response.data});
  } catch (err) {
    console.log('getActiveQuizOfSessionForStudentSaga: ' + err);
    yield put({type: types.GET_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT_FAILURE, message: err.message});
  }
}

export default function* watchGetActiveQuizOfSessionForStudent() {
  yield takeLatest(types.GET_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT, getActiveQuizOfSessionForStudentSaga);
}
