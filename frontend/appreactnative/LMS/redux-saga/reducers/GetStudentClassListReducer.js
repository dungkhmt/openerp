import * as types from '../actions/ActionTypes';

const initialState = {
  studentClassList: [
    /*
    [
      {
        "status": "APPROVED",
        "classType": "LT+BT",
        "code": "0",
        "classCode": "127029",
        "courseId": "IT3020",
        "statusId": null,
        "semester": 20202,
        "name": "Toán rời rạc",
        "id": "7af4ea1e-7e3e-43b5-a7a3-4400d204bf69"
      }
    ]
    */
  ],
  isFetching: false,
};

const getStudentClassListReducer = (state = initialState, action) => {
  // console.log('getStudentClassListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_CLASS_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_CLASS_LIST_SUCCESS:
      return {
        ...state,
        studentClassList: action.studentClassList,
        isFetching: false,
      };
    case types.GET_STUDENT_CLASS_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentClassListReducer;
