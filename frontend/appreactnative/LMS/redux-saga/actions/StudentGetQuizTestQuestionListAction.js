import * as types from './ActionTypes.js';

export function studentGetQuizTestQuestionListAction(payload) {
  return {
    type: types.STUDENT_GET_QUIZ_TEST_QUESTION_LIST,
    payload: payload,
  };
}
