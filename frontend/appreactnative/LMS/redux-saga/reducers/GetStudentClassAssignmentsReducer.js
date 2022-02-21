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

const getStudentClassAssignmentsReducer = (state = initialState, action) => {
  // console.log('getStudentClassAssignmentsReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_CLASS_ASSIGNMENTS:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_CLASS_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        assignmentList: action.assignmentList,
        isFetching: false,
      };
    case types.GET_STUDENT_CLASS_ASSIGNMENTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentClassAssignmentsReducer;
