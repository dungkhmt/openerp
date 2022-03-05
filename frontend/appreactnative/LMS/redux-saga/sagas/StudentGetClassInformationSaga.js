import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassInformationSaga(action) {
  console.log('studentGetClassInformationSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('/edu/class/' + studentClassId);
    yield put({type: types.STUDENT_GET_CLASS_INFORMATION_SUCCESS, classInformation: response.data});
  } catch (err) {
    console.log('studentGetClassInformationSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_INFORMATION_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassInformation() {
  yield takeLatest(types.STUDENT_GET_CLASS_INFORMATION, studentGetClassInformationSaga);
}
