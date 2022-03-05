import * as types from './ActionTypes.js';

export function studentPostActiveQuizOfSessionAction(payload) {
  return {
    type: types.STUDENT_POST_ACTIVE_QUIZ_OF_SESSION,
    payload: payload,
  };
}
