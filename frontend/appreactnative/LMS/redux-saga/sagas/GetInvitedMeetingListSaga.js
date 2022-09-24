import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getInvitedMeetingListSaga(action) {
  console.log('getInvitedMeetingListSaga: enter, action=' + JSON.stringify(action));
  try {
    const response = yield AxiosService.get('/roomParticipant/getListInvitedRoom');
    yield put({type: types.GET_INVITED_MEETING_LIST_SUCCESS, invitedMeetingList: response.data});
  } catch (err) {
    console.log('getInvitedMeetingListSaga: ' + err);
    yield put({type: types.GET_INVITED_MEETING_LIST_FAILURE, message: err.message});
  }
}

export default function* watchGetInvitedMeetingList() {
  yield takeLatest(types.GET_INVITED_MEETING_LIST, getInvitedMeetingListSaga);
}
