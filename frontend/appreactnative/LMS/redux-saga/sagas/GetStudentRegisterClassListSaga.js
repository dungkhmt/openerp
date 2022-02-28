import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentRegisterClassListSaga(action) {
  console.log('getStudentRegisterClassListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {page, size} = action.payload;
    const response = yield AxiosService.post('/edu/class?page=' + page + '&size=' + size, {});
    yield put({type: types.GET_STUDENT_REGISTER_CLASS_LIST_SUCCESS, studentRegisterClassList: response.data});
  } catch (err) {
    console.log('getStudentRegisterClassListSaga: ' + err);
    yield put({type: types.GET_STUDENT_REGISTER_CLASS_LIST_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentRegisterClassList() {
  yield takeLatest(types.GET_STUDENT_REGISTER_CLASS_LIST, getStudentRegisterClassListSaga);
}
