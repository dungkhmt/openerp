import {all} from 'redux-saga/effects';
import watchGetMenu from './GetMenuSaga';
import watchGetQuizTest from './GetQuizTestListSaga';
import watchGetQuizTestDetail from './GetQuizTestDetailSaga';
import watchAttendQuizTest from './AttendQuizTestSaga';

export default function* rootSaga() {
  yield all([
    watchGetMenu(),
    watchGetQuizTest(),
    watchGetQuizTestDetail(),
    watchAttendQuizTest(),
  ]);
}
