import * as types from './ActionTypes.js';

export function studentGetClassAssignmentListAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_ASSIGNMENT_LIST,
    payload: payload,
  };
}
