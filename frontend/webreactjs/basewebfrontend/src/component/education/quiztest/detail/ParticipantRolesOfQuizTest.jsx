import React, { useState, useEffect } from "react";
import { request } from "api";
import {errorNoti} from "../../../../utils/notification";
import {Card, CardContent} from "@mui/material";
import StandardTable from "../../../table/StandardTable";

export default function ParticipantRolesOfQuizTest(props) {
  const testId = props.testId;
  const [participants, setParticipants] = useState([]);

  useEffect(getParticipantRoles, []);

  function getParticipantRoles() {
    let successHandler = res => setParticipants(res.data);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", true)
    }
    request("get", `get-users-role-of-quiz-test/${testId}`, successHandler, errorHandlers);
  }

  const columns = [
    { title: "User ID", field: "userId" },
    { title: "Vai trò", field: "roleId" },
  ];

  return (
    <Card>
      <CardContent>
        <StandardTable
          title="User roles"
          columns={columns}
          data={participants}
          hideCommandBar
          options={{
            selection: false,
            search: true,
            sorting: true,
          }}
        />
      </CardContent>
    </Card>
  );
}
