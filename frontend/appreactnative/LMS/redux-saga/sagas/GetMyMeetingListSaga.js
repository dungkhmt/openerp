import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getMyMeetingListSaga(action) {
  console.log('getMyMeetingListSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/room/all');
    yield put({type: types.GET_MY_MEETING_LIST_SUCCESS, myMeetingList: response.data});
  } catch (err) {
    console.log('getMyMeetingListSaga: ' + err);
    yield put({type: types.GET_MY_MEETING_LIST_FAILURE, message: err.message});
  }
}

export default function* watchGetMyMeetingList() {
  yield takeLatest(types.GET_MY_MEETING_LIST, getMyMeetingListSaga);
}
