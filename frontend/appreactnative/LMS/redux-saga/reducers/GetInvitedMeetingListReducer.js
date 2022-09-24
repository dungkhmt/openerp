import * as types from '../actions/ActionTypes';

const initialState = {
  invitedMeetingList: {
    /*
    "content": [
        [
            "f970ad1f-37a2-418d-b42d-14b3189d4e5e",
            "Nhập môn Công nghệ phần mềm",
            "2022-07-28T04:00:00.000+0000",
            "2022-07-28T05:00:00.000+0000"
        ],
        [
            "21995ff3-5510-45ba-b685-82e6aaaf7d2b",
            "Kĩ thuật máy tính",
            "2022-07-27T04:00:00.000+0000",
            "2022-07-27T05:00:00.000+0000"
        ],
        [
            "984f5f33-8502-4bd5-8651-a7b64360d326",
            "Đồ án tốt nghiệp",
            "2022-08-17T10:40:00.000+0000",
            "2022-08-17T11:00:00.000+0000"
        ]
    ],
    "pageable": {
        "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
        },
        "pageNumber": 0,
        "pageSize": 20,
        "offset": 0,
        "unpaged": false,
        "paged": true
    },
    "last": true,
    "totalElements": 3,
    "totalPages": 1,
    "sort": {
        "sorted": false,
        "unsorted": true,
        "empty": true
    },
    "numberOfElements": 3,
    "first": true,
    "size": 20,
    "number": 0,
    "empty": false
     */
  },
  isFetching: false,
};

const getInvitedMeetingListReducer = (state = initialState, action) => {
  // console.log('getInvitedMeetingListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_INVITED_MEETING_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_INVITED_MEETING_LIST_SUCCESS:
      return {
        ...state,
        invitedMeetingList: action.invitedMeetingList,
        isFetching: false,
      };
    case types.GET_INVITED_MEETING_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getInvitedMeetingListReducer;
