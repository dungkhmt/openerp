import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentAttendClassSaga(action) {
  console.log('studentAttendClassSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/edu/class/register', action.payload);
    yield put({type: types.STUDENT_ATTEND_CLASS_SUCCESS, status: action.payload});
  } catch (err) {
    console.log('studentAttendClassSaga: ' + err);
    yield put({type: types.STUDENT_ATTEND_CLASS_FAILURE, message: err.message});
  }
}

export default function* watchStudentAttendClass() {
  yield takeLatest(types.STUDENT_ATTEND_CLASS, studentAttendClassSaga);
}
