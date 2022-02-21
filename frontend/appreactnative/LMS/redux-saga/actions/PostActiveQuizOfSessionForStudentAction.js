import * as types from './ActionTypes.js';

export function postActiveQuizOfSessionForStudentAction(payload) {
  return {
    type: types.POST_ACTIVE_QUIZ_OF_SESSION_FOR_STUDENT,
    payload: payload,
  };
}
