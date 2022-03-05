import * as types from './ActionTypes.js';

export function studentGetClassMemberListAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_MEMBER_LIST,
    payload: payload,
  };
}
