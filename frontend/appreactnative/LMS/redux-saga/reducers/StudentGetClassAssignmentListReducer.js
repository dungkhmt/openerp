import * as types from '../actions/ActionTypes';

const initialState = {
  assignmentList: [
    /*
      {
        
      },
    */
  ],
  isFetching: false,
};

const studentGetClassAssignmentListReducer = (state = initialState, action) => {
  // console.log('studentGetClassAssignmentListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_CLASS_ASSIGNMENT_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_GET_CLASS_ASSIGNMENT_LIST_SUCCESS:
      return {
        ...state,
        assignmentList: action.assignmentList,
        isFetching: false,
      };
    case types.STUDENT_GET_CLASS_ASSIGNMENT_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetClassAssignmentListReducer;
