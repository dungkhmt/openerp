import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassQuizzesSaga(action) {
  console.log('getStudentClassQuizzesSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('get-published-quiz-of-class/' + studentClassId);
    yield put({type: types.GET_STUDENT_CLASS_QUIZZES_SUCCESS, quizList: response.data});
  } catch (err) {
    console.log('getStudentClassQuizzesSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_QUIZZES_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassQuizzes() {
  yield takeLatest(types.GET_STUDENT_CLASS_QUIZZES, getStudentClassQuizzesSaga);
}
