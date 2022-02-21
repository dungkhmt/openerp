import * as types from '../actions/ActionTypes';

const initialState = {
  sessionList: [
    /*
      {
        "sessionId": "d63dc5e5-8d17-4465-900c-9cad3ea560c8",
        "sessionName": "Buổi học tuần 12",
        "classId": "7af4ea1e-7e3e-43b5-a7a3-4400d204bf69",
        "startDatetime": null,
        "createdByUserLoginId": "admin",
        "statusId": "CREATED",
        "description": "Đồ thị - Cây và cây khung nhỏ nhất của đồ thị"
      },
    */
  ],
  isFetching: false,
};

const getStudentClassSessionsReducer = (state = initialState, action) => {
  // console.log('getStudentClassSessionsReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_CLASS_SESSIONS:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_CLASS_SESSIONS_SUCCESS:
      return {
        ...state,
        sessionList: action.sessionList,
        isFetching: false,
      };
    case types.GET_STUDENT_CLASS_SESSIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentClassSessionsReducer;
