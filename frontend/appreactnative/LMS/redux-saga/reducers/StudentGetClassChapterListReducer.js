import * as types from '../actions/ActionTypes';

const initialState = {
  chapterList: [
    /*
      {
        "chapterId": "b090079d-ce14-41e2-b7e7-856efa5428fe",
        "chapterName": "Chương 1 Tổng quan mở đầu",
        "eduCourse": {
          "id": "IT3011",
          "name": "Cấu trúc dữ liệu và thuật toán",
          "credit": 2,
          "lastUpdatedStamp": null,
          "createdStamp": "2020-09-23T14:34:35.265+0000"
        },
        "statusId": "STATUS_PUBLIC"
      },
    */
  ],
  isFetching: false,
};

const studentGetClassChapterListReducer = (state = initialState, action) => {
  // console.log('studentGetClassChapterListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.STUDENT_GET_CLASS_CHAPTER_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.STUDENT_GET_CLASS_CHAPTER_LIST_SUCCESS:
      return {
        ...state,
        chapterList: action.chapterList,
        isFetching: false,
      };
    case types.STUDENT_GET_CLASS_CHAPTER_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default studentGetClassChapterListReducer;
