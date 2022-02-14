import {call, put, takeLatest} from 'redux-saga/effects';
import * as types from '../actions/ActionTypes';

export function* getMenuSaga(action) {
  console.log('getMenu: Enter, action=' + JSON.stringify(action));
  try {
    yield put({type: types.GET_MENU_SUCCESS, menuItemList: []});
  } catch (err) {
    console.log('getMenuSaga, ' + err);
    yield put({type: types.GET_MENU_FAILURE, message: err.message});
  }
}

export default function* watchGetMenu() {
  yield takeLatest(types.GET_MENU, getMenuSaga);
}
