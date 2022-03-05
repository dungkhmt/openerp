import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetRegisterClassListSaga(action) {
  console.log('studentGetRegisterClassListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {page, size} = action.payload;
    const response = yield AxiosService.post('/edu/class?page=' + page + '&size=' + size, {});
    yield put({type: types.STUDENT_GET_REGISTER_CLASS_LIST_SUCCESS, studentRegisterClasses: response.data});
  } catch (err) {
    console.log('studentGetRegisterClassListSaga: ' + err);
    yield put({type: types.STUDENT_GET_REGISTER_CLASS_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetRegisterClassList() {
  yield takeLatest(types.STUDENT_GET_REGISTER_CLASS_LIST, studentGetRegisterClassListSaga);
}
