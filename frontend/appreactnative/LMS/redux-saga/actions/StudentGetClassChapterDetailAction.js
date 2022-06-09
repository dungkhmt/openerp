import * as types from './ActionTypes.js';

export function studentGetClassChapterDetailAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_CHAPTER_DETAIL,
    payload: payload,
  };
}
