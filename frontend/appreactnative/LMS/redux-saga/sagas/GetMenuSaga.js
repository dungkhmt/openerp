import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getMenuSaga(action) {
  console.log('getMenuSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/menu');
    yield put({type: types.GET_MENU_SUCCESS, menuItemList: response.data});
  } catch (err) {
    console.log('getMenuSaga: ' + err);
    yield put({type: types.GET_MENU_FAILURE, message: err.message});
  }
}

export default function* watchGetMenu() {
  yield takeLatest(types.GET_MENU, getMenuSaga);
}
