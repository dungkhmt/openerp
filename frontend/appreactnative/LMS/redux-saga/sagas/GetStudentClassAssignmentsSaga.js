import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassAssignmentsSaga(action) {
  console.log('getStudentClassAssignmentsSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('edu/class/' + studentClassId + '/assignments/student');
    yield put({type: types.GET_STUDENT_CLASS_ASSIGNMENTS_SUCCESS, assignmentList: response.data});
  } catch (err) {
    console.log('getStudentClassAssignmentsSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_ASSIGNMENTS_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassAssignments() {
  yield takeLatest(types.GET_STUDENT_CLASS_ASSIGNMENTS, getStudentClassAssignmentsSaga);
}
