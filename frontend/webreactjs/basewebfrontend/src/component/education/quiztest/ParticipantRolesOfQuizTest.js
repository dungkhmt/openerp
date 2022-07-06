import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { request } from "api";
import AddIcon from "@material-ui/icons/Add";
import { Link, useHistory } from "react-router-dom";

export default function ParticipantRolesOfQuizTest(props) {
  const testId = props.testId;
  const [participants, setParticipants] = useState([]);
  const history = useHistory();
  const columns = [
    { title: "UserID", field: "userId" },
    { title: "Role", field: "roleId" },
  ];

  function getUserRoles() {
    request("get", "get-users-role-of-quiz-test/" + testId, (res) => {
      setParticipants(res.data);
    });
  }

  useEffect(() => {
    getUserRoles();
  }, []);
  return (
    <div>
      <MaterialTable
        title={"User Role"}
        columns={columns}
        data={participants}
        onRowClick={(event, rowData) => {
          console.log(rowData);
        }}
        actions={[
          {
            icon: () => {
              return <AddIcon color="primary" fontSize="large" />;
            },
            tooltip: "Thêm mới",
            isFreeAction: true,
            onClick: () => {
              history.push("");
            },
          },
        ]}
      />
    </div>
  );
}
