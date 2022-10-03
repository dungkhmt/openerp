import { Stack } from "@mui/material";
import { request } from "api";
//import PrimaryButton from "component/button/PrimaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toFormattedDateTime } from "utils/dateutils";

export default function ContestStudentList() {
  const [contests, setContests] = useState([]);

  const columns = [
    { title: "Index", field: "index" },

    {
      title: "ContestName",
      field: "contestName",
      render: (rowData) => (
        <Link
          to={{
            pathname:
              "/programming-contest/student-view-contest-detail/" +
              rowData["contestId"],
          }}
        >
          {rowData["contestName"]}
        </Link>
      ),
    },
    { title: "Status", field: "status" },
    { title: "Created Date", field: "date" },
  ];
  function getContestList() {
    request("get", "/get-contest-registered-student", (res) => {
      console.log("contest list", res.data);
      const data = res.data.contents.map((e, index) => ({
        index: index,
        contestId: e.contestId,
        contestName: e.contestName,
        status: e.status,
        date: toFormattedDateTime(e.createdAt),
      }));
      setContests(data);
    }).then();
  }

  useEffect(() => {
    getContestList();
  }, []);
  return (
    <div>
      <StandardTable
        title={"DS contest"}
        columns={columns}
        data={contests}
        hideCommandBar
        options={{
          selection: false,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
}
