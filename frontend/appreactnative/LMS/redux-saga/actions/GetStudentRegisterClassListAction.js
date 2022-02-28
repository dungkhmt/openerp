import * as types from './ActionTypes.js';

export function getStudentRegisterClassListAction(payload) {
  return {
    type: types.GET_STUDENT_REGISTER_CLASS_LIST,
    payload: payload,
  };
}
