import * as types from './ActionTypes.js';

export function getStudentClassSessionsAction(payload) {
  return {
    type: types.GET_STUDENT_CLASS_SESSIONS,
    payload: payload,
  };
}
