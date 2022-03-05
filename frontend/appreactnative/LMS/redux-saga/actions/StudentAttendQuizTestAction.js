import * as types from './ActionTypes.js';

export function studentAttendQuizTestAction(payload) {
  return {
    type: types.STUDENT_ATTEND_QUIZ_TEST,
    payload: payload,
  };
}
