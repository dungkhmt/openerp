import * as types from '../actions/ActionTypes';

const initialState = {
  classInformation: {
    /*
    {
      "teacherName": "admin  ",
      "email": null,
      "classType": "LT+BT",
      "code": "0",
      "classCode": null,
      "courseId": "IT3020",
      "statusId": null,
      "semester": 20202,
      "name": "Toán rời rạc",
      "id": "7af4ea1e-7e3e-43b5-a7a3-4400d204bf69"
    }
    */
  },
  isFetching: false,
};

const getStudentClassInformationReducer = (state = initialState, action) => {
  // console.log('getStudentClassInformationReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_CLASS_INFORMATION:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_CLASS_INFORMATION_SUCCESS:
      return {
        ...state,
        classInformation: action.classInformation,
        isFetching: false,
      };
    case types.GET_STUDENT_CLASS_INFORMATION_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentClassInformationReducer;
