import React, {useState, useEffect} from 'react';
import {request} from "../../../api";
import {errorNoti} from "../../../utils/notification";
import StandardTable from "../../../component/table/StandardTable";
import {Card, CardContent} from "@material-ui/core";
import {MuiThemeProvider} from "@material-ui/core/styles";

export default function StudentList(props) {
  const [studentsOfCurrentPage, setStudentsOfCurrentPage] = useState([]);
  const [filterParams, setFilterParams] = useState({ search: '', page: 0, size: 20 });

  useEffect(getStudentsOfCurrentPage, [filterParams]);

  function getStudentsOfCurrentPage() {
    const params = {
      securityGroups: "ROLE_STUDENT,ROLE_EDUCATION_LEARNING_MANAGEMENT_STUDENT",
      ...filterParams
    }
    let successHandler = res => setStudentsOfCurrentPage(res.data.content);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000)
    }
    request("GET", "/users", successHandler, errorHandlers,  null, { params })
  }

  const columns = [
    { title: "User Login ID", field: "userLoginId" },
    { title: "Họ tên", field: "fullName" },
    { title: "Đơn vị", field: "affiliations" },
    { title: "Email", field: "email" }
  ]

  return (
    <MuiThemeProvider>
      <Card>
        <CardContent>
          <StandardTable
            title="Danh sách sinh viên"
            columns={columns}
            data={studentsOfCurrentPage}
            hideCommandBar
            options={{
              selection: false,
              search: true,
              sorting: true,
              pageSize: filterParams.size,
              searchText: filterParams.search,
              debounceInterval: 300
            }}
            onPageChange={ page => setFilterParams({...filterParams, page})}
            onRowsPerPageChange={ size => setFilterParams({...filterParams, size }) }
            onSearchChange={ search => setFilterParams({page: 0, size: filterParams.size, search}) }
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}