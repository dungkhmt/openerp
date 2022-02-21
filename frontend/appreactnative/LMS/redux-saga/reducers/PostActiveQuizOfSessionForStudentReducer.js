import * as types from '../actions/ActionTypes';

const initialState = {
  message: '',
  isFetching: false,
};

const postActiveQuizOfSessionForStudentReducer = (state = initialState, action) => {
  // console.log('postActiveQuizOfSessionForStudentReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT:
      return {
        ...state,
        isFetching: true,
      };
    case types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT_SUCCESS:
      return {
        ...state,
        message: action.message,
        isFetching: false,
      };
    case types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default postActiveQuizOfSessionForStudentReducer;
