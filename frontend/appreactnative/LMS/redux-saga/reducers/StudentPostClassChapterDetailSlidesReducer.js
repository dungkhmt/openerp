import * as types from '../actions/ActionTypes';

const initialState = {
  chapterDetailSlides: [
    /*
      "",
      "",
      "",
      ""
      */
  ],
  isFetching: false,
};

const studentPostClassChapterDetailSlidesReducer = (state = initialState, action) => {
  // console.log('studentPostClassChapterDetailSlidesReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES_SUCCESS:
      return {
        ...state,
        chapterDetailSlides: action.chapterDetailSlides,
        isFetching: false,
      };
    case types.STUDENT_POST_CLASS_CHAPTER_DETAIL_SLIDES_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentPostClassChapterDetailSlidesReducer;
