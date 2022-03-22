import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { request } from "../../../../api";
import { toFormattedDateTime } from "../../../../utils/dateutils";
import withScreenSecurity from "../../../../component/withScreenSecurity";

export default function StudentLearningProgressDetailProgrammingSubmissionResultOnProblem(
  props
) {
  const studentId = props.studentId;
  const [contestSubmissions, setContestSubmissions] = useState([]);
  const columns = [
    { title: "contestSubmissionId", field: "contestSubmissionId" },
    { title: "problemId", field: "problemId" },
    { title: "contestId", field: "contestId" },
    { title: "userId", field: "userId" },
    { title: "testCasePass", field: "testCasePass" },
    { title: "sourceCodeLanguage", field: "sourceCodeLanguage" },
    { title: "point", field: "point" },
    { title: "status", field: "status" },
    { title: "createAt", field: "createAt" },
  ];
  function getContestSubmissionProgrammingResult() {
    request(
      // token, history,
      "get",
      "/get-contest-result-on-problem-of-a-user/" + studentId,
      (res) => {
        //let lst = [];
        //res.data.map((e) => {
        //  lst.push(e);s
        //});
        console.log("getClassesOfUser, res.data = ", res.data);
        //console.log("getClassesOfUser, lst = ", lst);
        setContestSubmissions(res.data);
      }
    );
  }
  useEffect(() => {
    getContestSubmissionProgrammingResult();
  }, []);
  return (
    <div>
      <MaterialTable title="" columns={columns} data={contestSubmissions} />
    </div>
  );
}
