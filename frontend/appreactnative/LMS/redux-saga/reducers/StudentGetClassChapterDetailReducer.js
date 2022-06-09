import * as types from '../actions/ActionTypes';

const initialState = {
  chapterDetail: [
    /*
      {
        "eduCourseMaterialId": "75b77de1-ed8b-4de7-b01d-8a08d0170093",
        "eduCourseMaterialName": "Sơ đồ chung tìm kiếm quay lui (Backtracking)",
        "eduCourseMaterialType": "EDU_COURSE_MATERIAL_TYPE_VIDEO",
        "eduCourseChapter": {
            "chapterId": "8afcb6c6-4a7d-4337-8b0a-1fcf0d89c416",
            "chapterName": "Chương 2. Các sơ đồ thuật toán cơ bản",
            "eduCourse": {
                "id": "IT3011",
                "name": "Cấu trúc dữ liệu và thuật toán",
                "credit": 2,
                "lastUpdatedStamp": null,
                "createdStamp": "2020-09-23T14:34:35.265+0000",
                "hibernateLazyInitializer": {}
            },
            "statusId": "STATUS_PUBLIC"
        },
        "sourceId": "abf17e46-ac03-402e-a093-d4aa0f88357e",
        "slideId": null
      },
      */
  ],
  isFetching: false,
};

const studentGetClassChapterDetailReducer = (state = initialState, action) => {
  // console.log('studentGetClassChapterDetailReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_CLASS_CHAPTER_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_GET_CLASS_CHAPTER_DETAIL_SUCCESS:
      return {
        ...state,
        chapterDetail: action.chapterDetail,
        isFetching: false,
      };
    case types.STUDENT_GET_CLASS_CHAPTER_DETAIL_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetClassChapterDetailReducer;
