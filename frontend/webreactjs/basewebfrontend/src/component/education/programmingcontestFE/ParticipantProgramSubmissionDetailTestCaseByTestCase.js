import { React, useEffect, useState } from "react";
import { request } from "../../../api";
import MaterialTable, { MTableToolbar } from "material-table";
import { toFormattedDateTime } from "../../../utils/dateutils";
const columns = [
  { title: "contestId", field: "contestId" },
  { title: "problemId", field: "problemId" },
  { title: "testCaseId", field: "testCaseId" },
  { title: "message", field: "message" },
  { title: "point", field: "point" },
  { title: "testCaseAnswer", field: "testCaseAnswer" },
  { title: "participantAnswer", field: "participantAnswer" },
  { title: "createdAt", field: "createdAt" },
];

export default function ParticipantProgramSubmissionDetailTestCaseByTestCase(
  props
) {
  const { submissionId } = props;
  const [submissionTestCase, setSubmissionTestCase] = useState([]);

  function getSubmissionDetailTestCaseByTestCase() {
    request(
      "get",
      "/get-contest-problem-submission-detail-by-testcase-of-a-submission/" +
        submissionId,
      (res) => {
        console.log(
          "get-contest-problem-submission-detail-by-testcase-of-a-submission, res.data  = " +
            res.data
        );
        //alert("Cập nhật " + "  OK");
        //setSubmissionTestCase(res.data);
        let L = res.data.map((c) => ({
          ...c,
          createdAt: toFormattedDateTime(c.createdAt),
        }));
        setSubmissionTestCase(L);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getSubmissionDetailTestCaseByTestCase();
  }, []);
  return (
    <div>
      SubmissionId: {submissionId}
      <MaterialTable
        title={"Chi tiet"}
        columns={columns}
        data={submissionTestCase}
      />
    </div>
  );
}
