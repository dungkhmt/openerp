import * as types from './ActionTypes.js';

export function getMyMeetingListAction(payload) {
  return {
    type: types.GET_MY_MEETING_LIST,
    payload: payload,
  };
}
