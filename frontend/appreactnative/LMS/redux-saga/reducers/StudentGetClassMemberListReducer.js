import * as types from '../actions/ActionTypes';

const initialState = {
  memberList: [
    /*
      {
        "email": "admin@gmail.com",
        "name": "Administrator",
        "id": "20205180"
      },
    */
  ],
  isFetching: false,
};

const studentGetClassMemberListReducer = (state = initialState, action) => {
  // console.log('studentGetClassMemberListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_CLASS_MEMBER_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_GET_CLASS_MEMBER_LIST_SUCCESS:
      return {
        ...state,
        memberList: action.memberList,
        isFetching: false,
      };
    case types.STUDENT_GET_CLASS_MEMBER_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetClassMemberListReducer;
