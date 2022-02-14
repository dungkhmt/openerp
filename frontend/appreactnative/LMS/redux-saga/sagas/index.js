import {all} from 'redux-saga/effects';
import watchGetMenu from './GetMenuSaga.js';

export default function* rootSaga() {
  yield all([watchGetMenu()]);
}
