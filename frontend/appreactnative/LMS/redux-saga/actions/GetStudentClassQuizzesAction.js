import * as types from './ActionTypes.js';

export function getStudentClassQuizzesAction(payload) {
  return {
    type: types.GET_STUDENT_CLASS_QUIZZES,
    payload: payload,
  };
}
