import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { themeTable } from "../../../utils/MaterialTableUtils";
import { request } from "./Request";

const useStyles = makeStyles((theme) => ({}));

export default function StudentViewProblemList() {
  const { t } = useTranslation(
    "education/programmingcontest/studentviewcontestdetail"
  );

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
      title: t("problemId"),
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
    <Box>
      <MuiThemeProvider theme={themeTable}>
        <MaterialTable
          title={<h1>{t("problemList.title")}</h1>}
          columns={columns}
          data={problems}
          options={{
            pageSize: 20,
            headerStyle: {
              fontWeight: "700",
            },
          }}
        />
      </MuiThemeProvider>
    </Box>
  );
}
