import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* studentPostClassChapterDetailSlidesSaga(action) {
  console.log('studentPostClassChapterDetailSlidesSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.post('/file', action.payload);
    yield put({type: types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES_SUCCESS, chapterDetailSlides: response.data});
  } catch (err) {
    console.log('studentPostClassChapterDetailSlidesSaga: ' + err);
    yield put({type: types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES_FAILURE, message: err.message});
  }
}

export default function* watchStudentPostClassChapterDetailSlides() {
  yield takeLatest(types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES, studentPostClassChapterDetailSlidesSaga);
}
