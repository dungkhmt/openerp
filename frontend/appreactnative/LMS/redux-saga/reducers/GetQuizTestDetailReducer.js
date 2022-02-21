import * as types from '../actions/ActionTypes';

const initialState = {
  quizTestDetail: [
    /*
      {
        "testId": "TEST_DSA_20202",
        "testName": "Test quiz Cấu trúc dữ liệu & Thuật toán",
        "scheduleDatetime": "2021-12-09 01:30:00",
        "courseName": "Cấu trúc dữ liệu và thuật toán",
        "duration": 600000,
        "quizGroupId": null,
        "groupCode": null,
        "viewTypeId": "VIEW_STEP",
        "listQuestion": null,
        "participationExecutionChoice": null
      }
    */
  ],
  isFetching: false,
};

const getQuizTestDetailReducer = (state = initialState, action) => {
  // console.log('getQuizTestDetailReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_QUIZ_TEST_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_QUIZ_TEST_DETAIL_SUCCESS:
      return {
        ...state,
        quizTestDetail: action.quizTestDetail,
        isFetching: false,
      };
    case types.GET_QUIZ_TEST_DETAIL_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getQuizTestDetailReducer;
