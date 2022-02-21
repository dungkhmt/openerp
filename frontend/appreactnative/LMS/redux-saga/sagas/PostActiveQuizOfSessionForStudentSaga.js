import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* postActiveQuizOfSessionForStudentSaga(action) {
  console.log('postActiveQuizOfSessionForStudentSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/quiz-test-choose_answer-by-user', action.payload);
    yield put({type: types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT_SUCCESS, message: "Đã lưu thành công"});
  } catch (err) {
    console.log('postActiveQuizOfSessionForStudentSaga: ' + err);
    yield put({type: types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT_FAILURE, message: err.message});
  }
}

export default function* watchPostActiveQuizOfSessionForStudent() {
  yield takeLatest(types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT, postActiveQuizOfSessionForStudentSaga);
}
