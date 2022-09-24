import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentGetClassChapterDetailSaga(action) {
  console.log('studentGetClassChapterDetailSaga: enter, action=' + JSON.stringify(action));
  try {
    const {chapterId} = action.payload;
    const response = yield AxiosService.get('/edu/class/get-chapter-materials-of-course/' + chapterId);
    yield put({type: types.STUDENT_GET_CLASS_CHAPTER_DETAIL_SUCCESS, chapterDetail: response.data});
  } catch (err) {
    console.log('studentGetClassChapterDetailSaga: ' + err);
    yield put({type: types.STUDENT_GET_CLASS_CHAPTER_DETAIL_FAILURE, message: err.message});
  }
}

export default function* watchStudentGetClassChapterDetail() {
  yield takeLatest(types.STUDENT_GET_CLASS_CHAPTER_DETAIL, studentGetClassChapterDetailSaga);
}
