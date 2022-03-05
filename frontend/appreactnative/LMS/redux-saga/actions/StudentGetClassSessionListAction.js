import * as types from './ActionTypes.js';

export function studentGetClassSessionListAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_SESSION_LIST,
    payload: payload,
  };
}
