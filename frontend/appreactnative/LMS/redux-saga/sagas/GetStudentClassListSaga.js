import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassListSaga(action) {
  console.log('getStudentClassListSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/edu/class/list/student');
    yield put({type: types.GET_STUDENT_CLASS_LIST_SUCCESS, studentClassList: response.data});
  } catch (err) {
    console.log('getStudentClassListSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_LIST_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassList() {
  yield takeLatest(types.GET_STUDENT_CLASS_LIST, getStudentClassListSaga);
}
