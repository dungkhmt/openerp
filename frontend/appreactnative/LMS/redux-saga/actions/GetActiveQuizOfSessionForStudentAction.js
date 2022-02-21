import * as types from './ActionTypes.js';

export function getActiveQuizOfSessionForStudentAction(payload) {
  return {
    type: types.GET_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT,
    payload: payload,
  };
}
