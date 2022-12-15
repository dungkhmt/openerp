import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { request } from "api";
import AddIcon from "@material-ui/icons/Add";
import { Link, useHistory } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchIconWrapper } from "../programmingcontestFE/lib";
import { InputBase } from "@mui/material";
import StandardTable from "component/table/StandardTable";
import { TextField, MenuItem, Button } from "@mui/material/";

export default function QuizTestsOfParticipantRole() {
  const [quizTests, setquizTests] = useState([]);
  const contestId = "GENERAL_CONTEST";
  const history = useHistory();
  const [searchUsers, setSearchUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [keyword, setKeyword] = useState("");

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
