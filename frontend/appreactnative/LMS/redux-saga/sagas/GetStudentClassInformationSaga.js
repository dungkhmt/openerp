import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassInformationSaga(action) {
  console.log('getStudentClassInformationSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('/edu/class/' + studentClassId);
    yield put({type: types.GET_STUDENT_CLASS_INFORMATION_SUCCESS, classInformation: response.data});
  } catch (err) {
    console.log('getStudentClassInformationSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_INFORMATION_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassInformation() {
  yield takeLatest(types.GET_STUDENT_CLASS_INFORMATION, getStudentClassInformationSaga);
}
