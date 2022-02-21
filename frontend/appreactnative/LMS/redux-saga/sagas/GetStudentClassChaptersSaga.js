import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getStudentClassChaptersSaga(action) {
  console.log('getStudentClassChaptersSaga: enter, action=' + JSON.stringify(action));
  try {
    const {studentClassId} = action.payload;
    const response = yield AxiosService.get('edu/class/get-chapters-of-class/' + studentClassId);
    yield put({type: types.GET_STUDENT_CLASS_CHAPTERS_SUCCESS, chapterList: response.data});
  } catch (err) {
    console.log('getStudentClassChaptersSaga: ' + err);
    yield put({type: types.GET_STUDENT_CLASS_CHAPTERS_FAILURE, message: err.message});
  }
}

export default function* watchGetStudentClassChapters() {
  yield takeLatest(types.GET_STUDENT_CLASS_CHAPTERS, getStudentClassChaptersSaga);
}
