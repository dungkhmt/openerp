import * as types from './ActionTypes.js';

export function getStudentClassMembersAction(payload) {
  return {
    type: types.GET_STUDENT_CLASS_MEMBERS,
    payload: payload,
  };
}
