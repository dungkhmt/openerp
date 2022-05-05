import * as types from './ActionTypes.js';

export function studentPostQuizTestQuestionAction(payload) {
  return {
    type: types.STUDENT_POST_QUIZ_TEST_QUESTION,
    payload: payload,
  };
}
