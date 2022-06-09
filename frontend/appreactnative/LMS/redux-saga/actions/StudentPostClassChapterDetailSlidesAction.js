import * as types from './ActionTypes.js';

export function studentPostClassChapterDetailSlidesAction(payload) {
  return {
    type: types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES,
    payload: payload,
  };
}
