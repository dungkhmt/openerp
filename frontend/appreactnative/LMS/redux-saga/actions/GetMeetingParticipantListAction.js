import * as types from './ActionTypes.js';

export function getMeetingParticipantListAction(payload) {
  return {
    type: types.GET_MEETING_PARTICIPANT_LIST,
    payload: payload,
  };
}
