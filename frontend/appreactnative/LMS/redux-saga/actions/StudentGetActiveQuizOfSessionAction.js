import * as types from './ActionTypes.js';

export function studentGetActiveQuizOfSessionAction(payload) {
  return {
    type: types.STUDENT_GET_ACTIVE_QUIZ_OF_SESSION,
    payload: payload,
  };
}
