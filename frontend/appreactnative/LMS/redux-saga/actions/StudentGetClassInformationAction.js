import * as types from './ActionTypes.js';

export function studentGetClassInformationAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_INFORMATION,
    payload: payload,
  };
}
