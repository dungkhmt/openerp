import * as types from '../actions/ActionTypes';

const initialState = {
  status: 0,
  message: '',
  isFetching: false,
};

const studentPostActiveQuizOfSessionReducer = (state = initialState, action) => {
  // console.log('studentPostActiveQuizOfSessionReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION_SUCCESS:
      return {
        ...state,
        message: action.message,
        isFetching: false,
      };
    case types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
        status: action.status,
      };
    default:
      return state;
  }
};

export default studentPostActiveQuizOfSessionReducer;
