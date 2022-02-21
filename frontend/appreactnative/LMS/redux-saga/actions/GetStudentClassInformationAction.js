import * as types from './ActionTypes.js';

export function getStudentClassInformationAction(payload) {
  return {
    type: types.GET_STUDENT_CLASS_INFORMATION,
    payload: payload,
  };
}
