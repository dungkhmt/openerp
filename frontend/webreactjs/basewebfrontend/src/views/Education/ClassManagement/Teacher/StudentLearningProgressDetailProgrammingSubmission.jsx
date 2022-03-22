import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { request } from "../../../../api";
import { toFormattedDateTime } from "../../../../utils/dateutils";
import withScreenSecurity from "../../../../component/withScreenSecurity";

export default function StudentLearningProgressDetailProgrammingSubmission(
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
  useEffect(() => {}, []);
  return (
    <div>
      {" "}
      <MaterialTable
        columns={columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url =
              "/get-contest-submission-paging-of-a-user/" +
              studentId +
              "?page=" +
              `${query.page}` +
              "&size=" +
              `${query.pageSize}`;

            request(
              "get",
              url,
              (res) => {
                console.log("get log user do practice, res = ", res);
                const data = res.data;
                const content = data.content.map((c) => ({
                  ...c,
                  date: toFormattedDateTime(c.createAt),
                }));

                resolve({
                  data: content, // your data array
                  page: data.number, // current page number
                  totalCount: data.totalElements, // total row number
                });
              },
              {
                onError: (e) => {
                  reject({
                    message:
                      "Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại ",
                    errorCause: "query",
                  });
                },
              }
            );
          })
        }
      ></MaterialTable>
    </div>
  );
}
