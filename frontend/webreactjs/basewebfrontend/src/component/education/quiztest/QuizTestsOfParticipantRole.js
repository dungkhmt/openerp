import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { request } from "api";
import AddIcon from "@material-ui/icons/Add";
import { Link, useHistory } from "react-router-dom";

export default function QuizTestsOfParticipantRole() {
  const [quizTests, setquizTests] = useState([]);
  const history = useHistory();
  const columns = [
    {
      title: "TestID",
      field: "testId",
      render: (rowData) => (
        <Link
          to={{
            pathname: "/edu/class/quiztest/detail/" + rowData["testId"],
          }}
        >
          {rowData["testId"]}
        </Link>
      ),
    },
    { title: "Role", field: "roleId" },
    { title: "Status", field: "statusId" },
  ];

  function getMyQuizTests() {
    request("get", "get-quiz-tests-of-user-login", (res) => {
      setquizTests(res.data);
    });
  }

  useEffect(() => {
    getMyQuizTests();
  }, []);
  return (
    <div>
      <MaterialTable
        title={"User Role"}
        columns={columns}
        data={quizTests}
        onRowClick={(event, rowData) => {
          console.log(rowData);
        }}
      />
    </div>
  );
}
