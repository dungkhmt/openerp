import {put, takeLatest} from 'redux-saga/effects';

import AxiosService from '../../services/AxiosService';
import * as types from '../actions/ActionTypes';

export function* getMeetingParticipantListSaga(action) {
  console.log('getMeetingParticipantListSaga: enter, action=' + JSON.stringify(action));
  try {
    const {roomId} = action.payload;
    const response = yield AxiosService.get('/roomParticipant/getParticipants?roomId=' + roomId);
    yield put({type: types.GET_MEETING_PARTICIPANT_LIST_SUCCESS, meetingParticipantList: response.data});
  } catch (err) {
    console.log('getMeetingParticipantListSaga: ' + err);
    yield put({type: types.GET_MEETING_PARTICIPANT_LIST_FAILURE, message: err.message});
  }
}

export default function* watchgetMeetingParticipantList() {
  yield takeLatest(types.GET_MEETING_PARTICIPANT_LIST, getMeetingParticipantListSaga);
}
