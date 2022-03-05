import * as types from '../actions/ActionTypes';

const initialState = {
  quiz: {
    /*
      {
        "testId": "ctdl_20202_quiz1",
        "testName": "Quiz thứ 1 - buổi thứ 2 - CTDL",
        "scheduleDatetime": "2022-02-20 10:10:35",
        "courseName": "Cấu trúc dữ liệu và thuật toán",
        "duration": 60000000,
        "quizGroupId": "5670043c-6117-425f-ba0b-69a3f2461b85",
        "groupCode": "000001",
        "viewTypeId": null,
        "listQuestion": [
            {
                "questionId": "a49979a6-effe-4474-b2db-4d696a9e6188",
                "statement": "<p>Cho đồ thị vô hướng G = (V,E) trong đó V = {1, 2,..., n} là tập gồm n đỉnh và E là tập gồm m cạnh của đồ thị. Ký hiệu A(v) là tập các đỉnh kề với đỉnh v. Cho đoạn mã giả sau:</p>\n<p>process(){</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;for u in V do d[u] = 0;</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;for u in V do{</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for v in A(u) do{</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d[v] = d[v] + 1;</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;</p>\n<p>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;&nbsp;</p>\n<p>}</p>\n<p>Hỏi đại lượng nào phản ảnh sát nhất độ phức tạp của hàm process trên?</p>\n",
                "quizCourseTopic": {
                    "quizCourseTopicId": "IT3011_ANALYZE_COMPLEXITY_GRAPH_ALGO",
                    "quizCourseTopicName": "Phân tích độ phức tạp 1 đoạn thuật toán trên đồ thị",
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
                "levelId": "QUIZ_LEVEL_INTERMEDIATE",
                "statusId": "STATUS_PRIVATE",
                "createdStamp": "2022-01-13 06:50:37",
                "quizChoiceAnswerList": [
                    {
                        "choiceAnswerId": "f70ee02f-5f46-4ffe-a021-9d968cd79308",
                        "choiceAnswerContent": "<p>O(nlogn)</p>\n"
                    },
                    {
                        "choiceAnswerId": "cd6f7736-edf1-4064-a020-a66cb6e941bb",
                        "choiceAnswerContent": "<p>O(mlogm)</p>\n"
                    },
                    {
                        "choiceAnswerId": "1f8bde0f-491c-4494-905c-b1dbd0553074",
                        "choiceAnswerContent": "<p>O(m)</p>\n"
                    },
                    {
                        "choiceAnswerId": "3fc020db-da61-45ff-a653-7d3b63489192",
                        "choiceAnswerContent": "<p>O(n+m)</p>\n"
                    },
                    {
                        "choiceAnswerId": "e45ef265-d264-4ba3-b8ce-4c6bcb5059ac",
                        "choiceAnswerContent": "<p>O(n)</p>\n"
                    },
                    {
                        "choiceAnswerId": "670aa2e8-4f87-4fe2-880c-e65bcb8a1b44",
                        "choiceAnswerContent": "<p>O(mn)</p>\n"
                    },
                    {
                        "choiceAnswerId": "30e9bbff-842d-4b3c-afe0-1fd57275013d",
                        "choiceAnswerContent": "<p>O(n<sup>2</sup>)</p>\n"
                    }
                ],
                "attachment": [],
                "createdByUserLoginId": null,
                "questionContent": null
            },
            {
                "questionId": "df2cc57a-73a3-4d23-a540-cda5c54d05a9",
                "statement": "<p>Cho hàm Try được định nghĩa như dưới. Hỏi giá trị in ra màn hình (giá trị biến count) là bao nhiêu khi gọi Try(1,0) với các biến tổng thể n = 4, m = 22, S và count được khởi tạo bằng 0.</p>\n",
                "quizCourseTopic": {
                    "quizCourseTopicId": "IT3011_RECURSIVE",
                    "quizCourseTopicName": "Đệ quy",
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
                "levelId": "QUIZ_LEVEL_HARD",
                "statusId": "STATUS_PRIVATE",
                "createdStamp": "2021-12-20 08:51:30",
                "quizChoiceAnswerList": [
                    {
                        "choiceAnswerId": "65a3b504-6a63-4dec-aa5f-4607f1d7ecab",
                        "choiceAnswerContent": "<p>19</p>\n"
                    },
                    {
                        "choiceAnswerId": "3dc39a85-7cee-4eba-b8d1-fe6ade8936e6",
                        "choiceAnswerContent": "<p>23</p>\n"
                    },
                    {
                        "choiceAnswerId": "d54f948d-d1ae-42d9-89b7-c914555abb7c",
                        "choiceAnswerContent": "<p>13</p>\n"
                    },
                    {
                        "choiceAnswerId": "07e1f1a6-73ec-4b4d-bd95-be17f118a8d1",
                        "choiceAnswerContent": "<p>Đáp án khác</p>\n"
                    },
                    {
                        "choiceAnswerId": "fe26f962-34c2-4b37-93e5-8dc2722eb294",
                        "choiceAnswerContent": "<p>54</p>\n"
                    },
                    {
                        "choiceAnswerId": "3fb66421-53ef-421f-bdcd-abb006a547ea",
                        "choiceAnswerContent": "<p>34</p>\n"
                    }
                ],
                "attachment": [
                    "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"
                ],
                "createdByUserLoginId": null,
                "questionContent": null
            }
        ],
        "participationExecutionChoice": {
            "a49979a6-effe-4474-b2db-4d696a9e6188": [
                "30e9bbff-842d-4b3c-afe0-1fd57275013d",
                "670aa2e8-4f87-4fe2-880c-e65bcb8a1b44"
            ],
            "df2cc57a-73a3-4d23-a540-cda5c54d05a9": [
                "07e1f1a6-73ec-4b4d-bd95-be17f118a8d1",
                "fe26f962-34c2-4b37-93e5-8dc2722eb294"
            ]
        }
      }
    */
  },
  isFetching: false,
};

const studentGetActiveQuizOfSessionReducer = (state = initialState, action) => {
  // console.log('studentGetActiveQuizOfSessionReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION_SUCCESS:
      // Transform object to reflect student choose answers for each question in a quiz.
      var transformQuiz = action.quiz;
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
          } else {
            question.quizChoiceAnswerList.forEach(answer => {
              answer.checked = false;
            });
          }
        });
      }

      return {
        ...state,
        quiz: transformQuiz,
        isFetching: false,
      };
    case types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetActiveQuizOfSessionReducer;
