import * as types from '../actions/ActionTypes';

const initialState = {
  quizTestList: [
    /*
    [
      {
        "testId": "TEST_TOAN_ROI_RAC_20202",
        "testName": "Trắc nghiệm Toán rời rạc",
        "scheduleDatetime": "08/12/2021 10:41:00",
        "courseId": "IT3020",
        "statusId": null,
        "viewTypeId": null
      },
    ]
    */
  ],
  isFetching: false,
};

const getQuizTestListReducer = (state = initialState, action) => {
  console.log('getQuizTestListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_QUIZ_TEST_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_QUIZ_TEST_LIST_SUCCESS:
      return {
        ...state,
        quizTestList: action.quizTestList,
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

export default getQuizTestListReducer;
