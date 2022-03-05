import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassAssignmentListSaga(action) {
  console.log('studentGetClassAssignmentListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('edu/class/' + studentClassId + '/assignments/student');
    yield put({type: types.STUDENT_GET_CLASS_ASSIGNMENT_LIST_SUCCESS, assignmentList: response.data});
  } catch (err) {
    console.log('studentGetClassAssignmentListSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_ASSIGNMENT_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassAssignmentList() {
  yield takeLatest(types.STUDENT_GET_CLASS_ASSIGNMENT_LIST, studentGetClassAssignmentListSaga);
}
