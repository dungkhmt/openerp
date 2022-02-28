import * as types from '../actions/ActionTypes';

const initialState = {
  studentRegisterClassList: {
    /*
    {
      "semesterId": 20202,
      "page": {
          "content": [
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Cấu trúc dữ liệu và thuật toán",
                  "code": 0,
                  "classCode": "CTDL_20202",
                  "courseId": "IT3011",
                  "id": "1bbf27c8-6d80-4730-9221-cb690a5fb7a5"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Cấu trúc dữ liệu và thuật toán",
                  "code": 0,
                  "classCode": "TSDV_B70_2022_01_17",
                  "courseId": "IT3011",
                  "id": "0d8f6b93-d253-4a18-a9ce-e547ae11267a"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Cấu trúc dữ liệu và thuật toán",
                  "code": 0,
                  "classCode": "DSA",
                  "courseId": "IT3011",
                  "id": "036082cb-01b9-4364-8f92-33b3376e27e3"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Cấu trúc dữ liệu và thuật toán",
                  "code": 0,
                  "classCode": "TSDV_B71",
                  "courseId": "IT3011",
                  "id": "5c9a9dab-acf4-4bd2-ab75-d63b5c19843d"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Cấu trúc dữ liệu và thuật toán",
                  "code": 0,
                  "classCode": "128678",
                  "courseId": "IT3011",
                  "id": "3bf07b0c-50db-4dce-b8d3-fec103900673"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Toán rời rạc",
                  "code": 121716,
                  "classCode": "121716",
                  "courseId": "IT3020",
                  "id": "63ddf1f3-cdff-44fc-82dd-a6537bc922a2"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Toán rời rạc",
                  "code": 0,
                  "classCode": "128670",
                  "courseId": "IT3020",
                  "id": "67f765cf-6f78-4914-8028-422e60e61972"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Toán rời rạc",
                  "code": 0,
                  "classCode": "TOAN_RR_20202",
                  "courseId": "IT3020",
                  "id": "6d07ec81-0ad9-4875-b911-8338c65cda09"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Toán rời rạc",
                  "code": 0,
                  "classCode": "127029",
                  "courseId": "IT3020",
                  "id": "7af4ea1e-7e3e-43b5-a7a3-4400d204bf69"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Toán rời rạc",
                  "code": 0,
                  "classCode": "128672",
                  "courseId": "IT3020",
                  "id": "63811a3f-3d03-47a7-ad64-54fb9b9e94b3"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Fundamentals of optimization",
                  "code": 0,
                  "classCode": "FUNDAMENTALS_OPTIMIZATION",
                  "courseId": "IT3052E",
                  "id": "ff0359cf-3da6-4453-8f6e-95be74699809"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Fundamentals of optimization",
                  "code": 0,
                  "classCode": "128517",
                  "courseId": "IT3052E",
                  "id": "fa710df0-3f3b-47cd-97d0-5cfb0d5060e1"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Thuật toán ứng dụng",
                  "code": 0,
                  "classCode": "TTUD_20202",
                  "courseId": "IT3170",
                  "id": "ca747b31-114c-44d8-8620-2fc489b65ee3"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Tối ưu lập kế hoạch",
                  "code": 0,
                  "classCode": "128153",
                  "courseId": "IT4663",
                  "id": "0bbaeb2d-90fb-48b5-be7c-aa9078ddd388"
              },
              {
                  "departmentId": "THCS",
                  "classType": "LT+BT",
                  "courseName": "Toán lớp 7",
                  "code": 0,
                  "classCode": "MATH_LOP_7",
                  "courseId": "PM7000",
                  "id": "beac3609-849c-4f80-8da3-b2a4989724cc"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "React - Frontend Web Development",
                  "code": 0,
                  "classCode": "REACT",
                  "courseId": "REACT",
                  "id": "b43a8b45-033d-45b6-b28d-b10741849b3b"
              },
              {
                  "departmentId": "KCNTT",
                  "classType": "LT+BT",
                  "courseName": "Java with Spring Boot framework",
                  "code": 0,
                  "classCode": "SPRING_BOOT",
                  "courseId": "SPRING_BOOT",
                  "id": "75fd9722-ce3f-42b5-912e-ffa2aac64279"
              }
          ],
          "pageable": {
              "sort": {
                  "sorted": false,
                  "unsorted": true,
                  "empty": true
              },
              "pageNumber": 0,
              "pageSize": 20,
              "offset": 0,
              "unpaged": false,
              "paged": true
          },
          "totalElements": 17,
          "totalPages": 1,
          "last": true,
          "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
          },
          "numberOfElements": 17,
          "first": true,
          "size": 20,
          "number": 0,
          "empty": false
      },
      "registeredClasses": [
          "63811a3f-3d03-47a7-ad64-54fb9b9e94b3",
          "7af4ea1e-7e3e-43b5-a7a3-4400d204bf69",
          "1bbf27c8-6d80-4730-9221-cb690a5fb7a5"
      ]
    }
    */
  },
  isFetching: false,
};

const getStudentRegisterClassListReducer = (state = initialState, action) => {
  // console.log('getStudentRegisterClassListReducer: enter, action=' + JSON.stringify(action));
  switch (action.type) {
    case types.GET_STUDENT_REGISTER_CLASS_LIST:
      return {
        ...state,
        isFetching: true,
      };
    case types.GET_STUDENT_REGISTER_CLASS_LIST_SUCCESS:
      var studentRegisterClassList = action.studentRegisterClassList;
      studentRegisterClassList.page.content.forEach(element => {
        if (studentRegisterClassList.registeredClasses.includes('' + element.id)) {
          element.registered = true;
        } else {
          element.registered = false;
        }
      });
      return {
        ...state,
        studentRegisterClassList: studentRegisterClassList,
        isFetching: false,
      };
    case types.GET_STUDENT_REGISTER_CLASS_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.message,
      };
    default:
      return state;
  }
};

export default getStudentRegisterClassListReducer;
