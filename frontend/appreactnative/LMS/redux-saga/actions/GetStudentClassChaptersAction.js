import * as types from './ActionTypes.js';

export function getStudentClassChaptersAction(payload) {
  return {
    type: types.GET_STUDENT_CLASS_CHAPTERS,
    payload: payload,
  };
}
