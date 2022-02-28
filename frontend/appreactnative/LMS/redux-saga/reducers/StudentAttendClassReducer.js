import * as types from '../actions/ActionTypes';

const initialState = {
  status: {},
  isFetching: false,
};

const studentAttendClassReducer = (state = initialState, action) => {
  // console.log('studentAttendClassReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_ATTEND_CLASS:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_ATTEND_CLASS_SUCCESS:
      return {
        ...state,
        status: action.status,
        isFetching: false,
      };
    case types.STUDENT_ATTEND_CLASS_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentAttendClassReducer;
