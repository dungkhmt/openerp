import * as types from './ActionTypes.js';

export function getStudentClassAssignmentsAction(payload) {
  return {
    type: types.GET_STUDENT_CLASS_ASSIGNMENTS,
    payload: payload,
  };
}
