import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { request } from "./Request";
import { useTranslation } from "react-i18next";
export default function StudentViewProblemList() {
  const { t } = useTranslation("education/programmingcontest/studentviewcontestdetail");

  const { contestId } = useParams();
  const [problems, setProblems] = useState([]);

  function getContestDetail() {
    request(
      "get",
      "/get-contest-detail-solving/" + contestId,
      (res) => {
        setProblems(res.data.list);
        for (let i = 0; i < res.data.list.length; i++) {
          let idSource =
            contestId + "-" + res.data.list[i].problemId + "-source";
          let tmpSource = localStorage.getItem(idSource);
          let idLanguage =
            contestId + "-" + res.data.list[i].problemId + "-language";
          let tmpLanguage = localStorage.getItem(idLanguage);
          if (tmpSource == null) {
            localStorage.setItem(idSource, "");
          }
          if (tmpLanguage == null) {
            localStorage.setItem(idLanguage, "CPP");
          }
        }
      },
      {}
    );
  }

  useEffect(() => {
    getContestDetail();
  }, []);

  const columns = [
    {
      title: t("problemID"),
      field: "problemId",
      render: (rowData) => (
        <Link
          to={
            "/programming-contest/student-view-contest-problem-detail/" +
            contestId +
            "/" +
            rowData.problemId
          }
        >
          {rowData["problemId"]}
        </Link>
      ),
    },
    {
      title: t("problem"),
      field: "problemName",
    },
  ];
  return (
    <div>
      <h1>Problems List</h1>
      <MaterialTable columns={columns} data={problems} />
    </div>
  );
}
