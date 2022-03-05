import * as types from './ActionTypes.js';

export function studentGetQuizTestDetailAction(testId) {
  return {
    type: types.STUDENT_GET_QUIZ_TEST_DETAIL,
    testId: testId,
  };
}
