import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassListSaga(action) {
  console.log('studentGetClassListSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/edu/class/list/student');
    yield put({type: types.STUDENT_GET_CLASS_LIST_SUCCESS, studentClassList: response.data});
  } catch (err) {
    console.log('studentGetClassListSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassList() {
  yield takeLatest(types.STUDENT_GET_CLASS_LIST, studentGetClassListSaga);
}
