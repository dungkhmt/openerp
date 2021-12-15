import React, { useState, useEffect } from "react";
import { request } from "../../../../api";
import { Button, Tooltip, Link } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";

import { Link as RouterLink } from "react-router-dom";
export default function StudentViewLearningSessionList(props) {
  const classId = props.classId;
  const [sessions, setSessions] = useState([]);

  const columns = [
    {
      title: "Tên buổi học",
      field: "sessionId",
      render: (rowData) => (
        <Link
          component={RouterLink}
          to={`/edu/student/class/session/detail/${rowData["sessionId"]}`}
        >
          {rowData["sessionName"]}
        </Link>
      ),
    },
    { title: "Mô tả", field: "description" },
    { title: "Người tạo", field: "createdByUserLoginId" },
    { title: "Trạng thái", field: "statusId" },
  ];
  function getSessionsOfClass() {
    request(
      "get",
      "/edu/class/get-sessions-of-class/" + classId,
      (res) => {
        console.log(res);
        setSessions(res.data);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getSessionsOfClass();
  }, []);
  return (
    <div>
      <MaterialTable
        title="Danh sách buổi học"
        columns={columns}
        data={sessions}
        //icons={tableIcons}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
            filterRow: {
              filterTooltip: "Lọc",
            },
          },
        }}
        options={{
          search: true,
          sorting: false,
          actionsColumnIndex: -1,
          pageSize: 8,
          tableLayout: "fixed",
        }}
        style={{
          fontSize: 14,
        }}
      />
    </div>
  );
}
