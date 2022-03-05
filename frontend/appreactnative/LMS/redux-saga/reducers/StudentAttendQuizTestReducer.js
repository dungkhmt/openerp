import * as types from '../actions/ActionTypes';

const initialState = {
  status: {},
  isFetching: false,
};

const studentAttendQuizTestReducer = (state = initialState, action) => {
  // console.log('studentAttendQuizTestReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_ATTEND_QUIZ_TEST:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_ATTEND_QUIZ_TEST_SUCCESS:
      return {
        ...state,
        status: action.status,
        isFetching: false,
      };
    case types.STUDENT_ATTEND_QUIZ_TEST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentAttendQuizTestReducer;
