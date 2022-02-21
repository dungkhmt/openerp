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

const getStudentClassMembersReducer = (state = initialState, action) => {
  // console.log('getStudentClassMembersReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_CLASS_MEMBERS:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_CLASS_MEMBERS_SUCCESS:
      return {
        ...state,
        memberList: action.memberList,
        isFetching: false,
      };
    case types.GET_STUDENT_CLASS_MEMBERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentClassMembersReducer;
