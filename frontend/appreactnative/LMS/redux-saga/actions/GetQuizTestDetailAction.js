import * as types from './ActionTypes.js';

export function getQuizTestDetailAction(testId) {
  return {
    type: types.GET_QUIZ_TEST_DETAIL,
    testId: testId,
  };
}
