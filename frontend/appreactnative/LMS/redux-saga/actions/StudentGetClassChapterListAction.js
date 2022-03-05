import * as types from './ActionTypes.js';

export function studentGetClassChapterListAction(payload) {
  return {
    type: types.STUDENT_GET_CLASS_CHAPTER_LIST,
    payload: payload,
  };
}
