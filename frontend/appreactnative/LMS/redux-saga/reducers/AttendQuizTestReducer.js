import * as types from '../actions/ActionTypes';

const initialState = {
  status: {},
  isFetching: false,
};

const attendQuizTestReducer = (state = initialState, action) => {
  // console.log('attendQuizTestReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.ATTEND_QUIZ_TEST:
      return {
        ...state,
        isFetching: true,
      };
    case types.ATTEND_QUIZ_TEST_SUCCESS:
      return {
        ...state,
        status: action.status,
        isFetching: false,
      };
    case types.GET_QUIZ_TEST_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default attendQuizTestReducer;
