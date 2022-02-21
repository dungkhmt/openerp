import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassMembersSaga(action) {
  console.log('getStudentClassMembersSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('edu/class/' + studentClassId + '/students');
    yield put({type: types.GET_STUDENT_CLASS_MEMBERS_SUCCESS, memberList: response.data});
  } catch (err) {
    console.log('getStudentClassMembersSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_MEMBERS_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassMembers() {
  yield takeLatest(types.GET_STUDENT_CLASS_MEMBERS, getStudentClassMembersSaga);
}
