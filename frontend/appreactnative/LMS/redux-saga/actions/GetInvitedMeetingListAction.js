import * as types from './ActionTypes.js';

export function getInvitedMeetingListAction(payload) {
  return {
    type: types.GET_INVITED_MEETING_LIST,
    payload: payload,
  };
}
