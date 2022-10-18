import React, {useEffect, useState} from 'react';
import {request} from "../../../../api";
import {errorNoti, successNoti} from "../../../../utils/notification";
import StandardTable from "../../../table/StandardTable";
import PositiveButton from "../PositiveButton";

function ClassRegistrationTable(props) {
  const [semesterId, setSemesterId] = useState(0);
  const [openingClasses, setOpeningClasses] = useState([]);
  const [registeredClassesOfCurrentUser, setRegisteredClassesOfCurrentUser] = useState(new Set());
  const [filterParams, setFilterParams] = useState({ page: 0, pageSize: 20, searchText: '' });

  useEffect(() => getClassRegistrationData(filterParams, setClassRegistrationData), [filterParams]);

  function setClassRegistrationData(response) {
    let responseData = response.data;
    setSemesterId(responseData.semesterId);
    setOpeningClasses(responseData.page.content);
    setRegisteredClassesOfCurrentUser(new Set(responseData.registeredClasses));
  }

  const columns = [
    { title: "Class Code", field: "classCode" },
    { title: "Course Code", field: "courseId" },
    { title: "Course Name", field: "courseName" },
    { title: "Course Type", field: "classType" },
    { title: "Faculty", field: "departmentId" },
    { title: "", field: "",
      render: aClass => (registeredClassesOfCurrentUser.has(aClass.id) ? null :
        <PositiveButton
          label="Join"
          disableRipple
          onClick={() => registerClass(aClass.id, setRegisteredClassesOfCurrentUser)} />
      )
    }
  ];

  return (
    <StandardTable
      title={"Registration  - Semester " + semesterId}
      columns={columns}
      data={openingClasses}
      hideCommandBar
      options={{
        selection: false,
        search: true,
        sorting: true,
        pageSize: filterParams.pageSize,
        searchText: filterParams.searchText
      }}
      onPageChange={ page => setFilterParams({...filterParams, page})}
      onRowsPerPageChange={ pageSize => setFilterParams({...filterParams, pageSize}) }
      onSearchChange={ searchText => setFilterParams({page: 0, pageSize: filterParams.pageSize, searchText}) }
    />
  );
}

function getClassRegistrationData({ page, pageSize, searchText }, setClassRegistrationData) {
  let url = `/edu/class?page=${page}&size=${pageSize}`;
  let errorHandlers = {
    onError: (e) => {
      console.log(e);
      errorNoti("An error occurred while registering the class. Retry", 3000);
    }
  }
  request("post", url, setClassRegistrationData, errorHandlers, { courseName: searchText });
}

function registerClass(classId, setRegisteredClasses) {
  let successHandler = () => {
    successNoti("Register success. Please wait for the teacher's approval.", 3000);
    setRegisteredClasses(oldRegisteredClasses => new Set([...oldRegisteredClasses, classId]))
  }
  let errorHandlers = {
    400: (e) => {
      console.log(e);
      errorNoti(e.response.body, 3000)
    }
  }
  request("post", "/edu/class/register", successHandler, errorHandlers, { classId });
}

export default ClassRegistrationTable;