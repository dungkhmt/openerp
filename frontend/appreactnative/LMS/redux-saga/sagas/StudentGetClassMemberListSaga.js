import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassMemberListSaga(action) {
  console.log('studentGetClassMemberListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('/edu/class/' + studentClassId + '/students');
    yield put({type: types.STUDENT_GET_CLASS_MEMBER_LIST_SUCCESS, memberList: response.data});
  } catch (err) {
    console.log('studentGetClassMemberListSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_MEMBER_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassMemberList() {
  yield takeLatest(types.STUDENT_GET_CLASS_MEMBER_LIST, studentGetClassMemberListSaga);
}
