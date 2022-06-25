import * as types from '../actions/ActionTypes';

const initialState = {
  status: 0,
  chooseAnswerIds: [],
  message: '',
  isFetching: false,
};

const studentPostQuizTestQuestionReducer = (state = initialState, action) => {
  // console.log('studentPostQuizTestQuestionReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_POST_QUIZ_TEST_QUESTION:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_POST_QUIZ_TEST_QUESTION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        chooseAnswerIds: action.chooseAnswerIds,
        status: action.status,
      };
    case types.STUDENT_POST_QUIZ_TEST_QUESTION_FAILURE:
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

export default studentPostQuizTestQuestionReducer;
