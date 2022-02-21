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

const getStudentClassChaptersReducer = (state = initialState, action) => {
  // console.log('getStudentClassChaptersReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_CLASS_CHAPTERS:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_CLASS_CHAPTERS_SUCCESS:
      return {
        ...state,
        chapterList: action.chapterList,
        isFetching: false,
      };
    case types.GET_STUDENT_CLASS_CHAPTERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentClassChaptersReducer;
