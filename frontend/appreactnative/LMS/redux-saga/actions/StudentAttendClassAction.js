import * as types from './ActionTypes.js';

export function studentAttendClassAction(payload) {
  return {
    type: types.STUDENT_ATTEND_CLASS,
    payload: payload,
  };
}
