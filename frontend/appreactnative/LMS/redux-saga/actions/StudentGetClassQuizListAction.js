import * as types from './ActionTypes.js';

export function studentGetClassQuizListAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_QUIZ_LIST,
    payload: payload,
  };
}
