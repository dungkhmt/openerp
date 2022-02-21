import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassSessionsSaga(action) {
  console.log('getStudentClassSessionsSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('/edu/class/get-sessions-of-class/' + studentClassId);
    yield put({type: types.GET_STUDENT_CLASS_SESSIONS_SUCCESS, sessionList: response.data});
  } catch (err) {
    console.log('getStudentClassSessionsSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_SESSIONS_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassSessions() {
  yield takeLatest(types.GET_STUDENT_CLASS_SESSIONS, getStudentClassSessionsSaga);
}
