import * as types from '../actions/ActionTypes';

const initialState = {
  quizList: [
    /*
      {
        "questionId": "ea0c9851-2292-46b9-95e8-346b0f6cd2da",
        "statement": "<p>Kết luận 1000n<sup>2</sup> - 6n + 7 = O(n<sup>2</sup>) là đúng hay sai?</p>\n",
        "quizCourseTopic": {
            "quizCourseTopicId": "IT3011_IT3011_COMPLEXITY",
            "quizCourseTopicName": "Độ phức tạp tính toán",
            "eduCourse": {
                "id": "IT3011",
                "name": "Cấu trúc dữ liệu và thuật toán",
                "credit": 2,
                "lastUpdatedStamp": null,
                "createdStamp": "2020-09-23T14:34:35.265+0000"
            },
            "message": ""
        },
        "levelId": "QUIZ_LEVEL_EASY",
        "statusId": "STATUS_PUBLIC",
        "createdStamp": "2021-06-02 05:26:27",
        "quizChoiceAnswerList": [
            {
                "choiceAnswerId": "6d78ab85-37e4-481e-b0dc-1b6fd5dd751b",
                "choiceAnswerContent": "<p>A. ĐÚNG</p>\n"
            },
            {
                "choiceAnswerId": "867855f9-4035-4e5f-9218-fc355b6fb770",
                "choiceAnswerContent": "<p>B.  SAI</p>\n"
            }
        ],
        "attachment": [],
        "createdByUserLoginId": null,
        "questionContent": null
      },
    */
  ],
  isFetching: false,
};

const studentGetClassQuizListReducer = (state = initialState, action) => {
  // console.log('studentGetClassQuizListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_CLASS_QUIZ_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_GET_CLASS_QUIZ_LIST_SUCCESS:
      return {
        ...state,
        quizList: action.quizList,
        isFetching: false,
      };
    case types.STUDENT_GET_CLASS_QUIZ_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetClassQuizListReducer;
