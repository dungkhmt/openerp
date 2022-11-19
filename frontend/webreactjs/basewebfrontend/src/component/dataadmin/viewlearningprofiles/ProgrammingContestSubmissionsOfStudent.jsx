import React, {useEffect, useState} from 'react';
import {errorNoti} from "../../../utils/notification";
import {request} from "../../../api";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {Card, CardContent} from "@material-ui/core";
import StandardTable from "../../table/StandardTable";

export default function ProgrammingContestSubmissionsOfStudent(props) {
  const studentLoginId = props.studentLoginId;
  const [contestSubmissionsOfStudent, setContestSubmissionsOfStudent] = useState([]);
  const [filterParams, setFilterParams] = useState({ search: '', page: 0, size: 20 });

  useEffect(getContestSubmissionsOfStudent, [filterParams]);

  function getContestSubmissionsOfStudent() {
    let successHandler = res => setContestSubmissionsOfStudent(res.data.content);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000)
    }
    request(
      "GET", `/admin/data/programming-contests/submissions/${studentLoginId}`,
      successHandler, errorHandlers, null, { params: filterParams }
    );
  }

  const columns = [
    { title: "Tên contest", field: "contestName" },
    { title: "Tên bài toán", field: "problemName" },
    { title: "Submission ID", field: "submissionId" },
    { title: "Trạng thái", field: "status" },
    { title: "Test case pass", field: "testCasePass" },
    { title: "Điểm số", field: "point" },
    { title: "Ngôn ngữ", field: "sourceCodeLanguage" },
    { title: "Ngày nộp", field: "submitAt" }
  ]

  return (
    <MuiThemeProvider>
      <Card>
        <CardContent>
          <StandardTable
            title="Lịch sử làm contest"
            columns={columns}
            data={contestSubmissionsOfStudent}
            hideCommandBar
            options={{
              selection: false,
              search: true,
              sorting: true,
              pageSize: filterParams.size,
              searchText: filterParams.search,
              debounceInterval: 1000
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