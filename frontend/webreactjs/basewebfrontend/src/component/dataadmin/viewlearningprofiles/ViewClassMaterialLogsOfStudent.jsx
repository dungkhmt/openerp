import React, {useState, useEffect} from 'react';
import {request} from "../../../api";
import {errorNoti} from "../../../utils/notification";
import {Card, CardContent} from "@material-ui/core";
import StandardTable from "../../table/StandardTable";
import {MuiThemeProvider} from "@material-ui/core/styles";

export default function ViewClassMaterialLogsOfStudent(props) {
  const studentLoginId = props.studentLoginId;
  const [viewMaterialLogsOfStudent, setViewMaterialLogsOfStudent] = useState([]);
  const [filterParams, setFilterParams] = useState({ search: '', page: 0, size: 20 });

  useEffect(getViewMaterialLogsOfStudent, [filterParams]);

  function getViewMaterialLogsOfStudent() {
    let successHandler = res => setViewMaterialLogsOfStudent(res.data.content);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000)
    }
    request(
      "GET", `/admin/data/education/view-class-material-logs/${studentLoginId}`,
      successHandler, errorHandlers, null, { params: filterParams }
    );
  }

  const columns = [
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên học phần", field: "courseName" },
    { title: "Mã lớp", field: "classCode" },
    { title: "Học kỳ", field: "semester" },
    { title: "Chương", field: "chapterName" },
    { title: "Tài liệu", field: "materialName" },
    { title: "Ngày xem", field: "viewAt" }
  ]

  return (
    <MuiThemeProvider>
      <Card>
        <CardContent>
          <StandardTable
            title="Lịch sử xem học liệu"
            columns={columns}
            data={viewMaterialLogsOfStudent}
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