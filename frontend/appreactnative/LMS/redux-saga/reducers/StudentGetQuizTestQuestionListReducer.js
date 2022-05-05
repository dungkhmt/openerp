import * as types from '../actions/ActionTypes';

const initialState = {
  quizTestQuestionList: {
    /*
    {
      "testId": "TEST_DSA_20202",
      "testName": "Test quiz Cấu trúc dữ liệu & Thuật toán",
      "scheduleDatetime": "2022-05-03 01:30:00",
      "courseName": "Cấu trúc dữ liệu và thuật toán",
      "duration": 600000,
      "quizGroupId": "58459d6e-f678-45dd-b74d-c1f2a5249cd4",
      "groupCode": "000001",
      "viewTypeId": "VIEW_STEP",
      "listQuestion": [
        {
          "questionId": "f00a7515-9a93-46cc-8973-5f3851fe3b6e",
          "statement": "<p>Kết luận 10n<sup>2</sup> +3n - 1000 = O(nlogn) là đúng hay sai?</p>\n",
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
            "message": "",
            "hibernateLazyInitializer": {}
          },
          "levelId": "QUIZ_LEVEL_EASY",
          "statusId": "STATUS_PUBLIC",
          "createdStamp": "2021-06-02 05:30:47",
          "quizChoiceAnswerList": [
            {
              "choiceAnswerId": "716b2ced-5d7f-4823-a0dc-e73080e00882",
              "choiceAnswerContent": "<p>B.  SAI</p>\n"
            },
            {
              "choiceAnswerId": "a5db8708-047c-4628-a7be-41ca0581fff4",
              "choiceAnswerContent": "<p>A.  ĐÚNG</p>\n"
            }
          ],
          "attachment": [],
          "createdByUserLoginId": null,
          "questionContent": null
        },
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
            "message": "",
            "hibernateLazyInitializer": {}
          },
          "levelId": "QUIZ_LEVEL_EASY",
          "statusId": "STATUS_PUBLIC",
          "createdStamp": "2021-06-02 05:26:27",
          "quizChoiceAnswerList": [
            {
              "choiceAnswerId": "867855f9-4035-4e5f-9218-fc355b6fb770",
              "choiceAnswerContent": "<p>B.  SAI</p>\n"
            },
            {
              "choiceAnswerId": "6d78ab85-37e4-481e-b0dc-1b6fd5dd751b",
              "choiceAnswerContent": "<p>A. ĐÚNG</p>\n"
            }
          ],
          "attachment": [],
          "createdByUserLoginId": null,
          "questionContent": null
        }
      ],
      "participationExecutionChoice": {}
    }
    */
  },
  isFetching: false,
};

const studentGetQuizTestQuestionListReducer = (state = initialState, action) => {
  // console.log('studentGetQuizTestQuestionListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST:
      return {
        ...state,
        quizTestQuestionList: {},
        isFetching: true,
      };
    case types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST_SUCCESS:
      // TODO: Optimize performance

      var transformQuiz = action.quizTestQuestionList;
      transformQuiz.listQuestion.forEach(question => {
        question.quizChoiceAnswerList.forEach(answer => {
          answer.checked = false;
        });
        question.submitted = false;
      });

      // Transform object to reflect student choose answers for each question in a quiz.
      for (const [key, value] of Object.entries(
        transformQuiz.participationExecutionChoice,
      )) {
        transformQuiz.listQuestion.forEach(question => {
          if (question.questionId === key) {
            question.quizChoiceAnswerList.forEach(answer => {
              if (value.includes('' + answer.choiceAnswerId)) {
                answer.checked = true;
              } else {
                answer.checked = false;
              }
            });
            question.submitted = true;
          }
        });
      }

      return {
        ...state,
        quizTestQuestionList: transformQuiz,
        isFetching: false,
      };
    case types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST_FAILURE:
      return {
        ...state,
        quizTestQuestionList: {},
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetQuizTestQuestionListReducer;
