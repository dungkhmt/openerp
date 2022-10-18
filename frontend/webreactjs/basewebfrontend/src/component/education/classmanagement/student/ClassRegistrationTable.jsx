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
    { title: "Mã lớp", field: "classCode" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên học phần", field: "courseName" },
    { title: "Loại lớp", field: "classType" },
    { title: "Khoa/Viện", field: "departmentId" },
    { title: "", field: "",
      render: aClass => (registeredClassesOfCurrentUser.has(aClass.id) ? null :
        <PositiveButton
          label="Tham gia"
          disableRipple
          onClick={() => registerClass(aClass.id, setRegisteredClassesOfCurrentUser)} />
      )
    }
  ];

  return (
    <StandardTable
      title={"Đăng ký lớp học - Học kỳ " + semesterId}
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
      errorNoti("Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại", 3000);
    }
  }
  request("post", url, setClassRegistrationData, errorHandlers, { courseName: searchText });
}

function registerClass(classId, setRegisteredClasses) {
  let successHandler = () => {
    successNoti("Đăng ký thành công. Vui lòng chờ giảng viên phê duyệt.", 3000);
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