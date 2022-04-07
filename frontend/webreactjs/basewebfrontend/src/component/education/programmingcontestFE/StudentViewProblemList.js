import { Link, useHistory } from "react-router-dom";
import React from "react";
import MaterialTable from "material-table";
export default function StudentViewProblemList(props) {
  const problems = props.problems;
  const columns = [
    {
      title: "ProblemID",
      field: "problemId",
      render: (rowData) => (
        <Link
          to={
            "/programming-contest/student-view-contest-problem-detail/" +
            rowData.problemId
          }
        >
          {rowData["problemId"]}
        </Link>
      ),
    },
    {
      title: "Problem Name",
      field: "problemName",
    },
  ];
  return (
    <div>
      <h1> StudentViewProblemList</h1>
      <MaterialTable columns={columns} data={problems} />
    </div>
  );
}
