import * as types from './ActionTypes.js';

export function studentGetRegisterClassListAction(payload) {
  return {
    type: types.STUDENT_GET_REGISTER_CLASS_LIST,
    payload: payload,
  };
}
