import * as types from './ActionTypes.js';

export function attendQuizTestAction(payload) {
  return {
    type: types.ATTEND_QUIZ_TEST,
    payload: payload,
  };
}
