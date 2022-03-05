import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassSessionListSaga(action) {
  console.log('studentGetClassSessionListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('/edu/class/get-sessions-of-class/' + studentClassId);
    yield put({type: types.STUDENT_GET_CLASS_SESSION_LIST_SUCCESS, sessionList: response.data});
  } catch (err) {
    console.log('studentGetClassSessionListSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_SESSION_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassSessionList() {
  yield takeLatest(types.STUDENT_GET_CLASS_SESSION_LIST, studentGetClassSessionListSaga);
}
