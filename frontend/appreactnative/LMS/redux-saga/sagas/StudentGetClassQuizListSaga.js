import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassQuizListSaga(action) {
  console.log('studentGetClassQuizListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('get-published-quiz-of-class/' + studentClassId);
    yield put({type: types.STUDENT_GET_CLASS_QUIZ_LIST_SUCCESS, quizList: response.data});
  } catch (err) {
    console.log('studentGetClassQuizListSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_QUIZ_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassQuizList() {
  yield takeLatest(types.STUDENT_GET_CLASS_QUIZ_LIST, studentGetClassQuizListSaga);
}
