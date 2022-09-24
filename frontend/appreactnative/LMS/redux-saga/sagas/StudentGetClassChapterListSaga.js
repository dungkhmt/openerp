import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassChapterListSaga(action) {
  console.log('studentGetClassChapterListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('/edu/class/get-chapters-of-class/' + studentClassId);
    yield put({type: types.STUDENT_GET_CLASS_CHAPTER_LIST_SUCCESS, chapterList: response.data});
  } catch (err) {
    console.log('studentGetClassChapterListSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_CHAPTER_LIST_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassChapterList() {
  yield takeLatest(types.STUDENT_GET_CLASS_CHAPTER_LIST, studentGetClassChapterListSaga);
}
