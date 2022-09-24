import * as types from '../actions/ActionTypes';

const initialState = {
  meetingParticipantList: [
    /*
    {
        "peerId": "2e146149-3fd3-48cd-a527-6f36f8b9a78e",
        "participantId": "sv00001"
    },
    {
        "peerId": "eeca374b-e517-472d-bb63-e22325e55f2d",
        "participantId": "ninhpham"
    }
    */
  ],
  isFetching: false,
};

const getMeetingParticipantListReducer = (state = initialState, action) => {
  // console.log('getMeetingParticipantListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_MEETING_PARTICIPANT_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_MEETING_PARTICIPANT_LIST_SUCCESS:
      return {
        ...state,
        meetingParticipantList: action.meetingParticipantList,
        isFetching: false,
      };
    case types.GET_MEETING_PARTICIPANT_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getMeetingParticipantListReducer;
