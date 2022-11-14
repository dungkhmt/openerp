import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { Box, Button } from "@mui/material";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
  components,
  localization,
  themeTable,
} from "../../../utils/MaterialTableUtils";
import { request } from "./Request";
import StandardTable from "component/table/StandardTable";
import TertiaryButton from "component/button/TertiaryButton";

const useStyles = makeStyles((theme) => ({}));
const commandBarStyles = {
  position: "sticky",
  top: 124,
  zIndex: 11,
  mt: -3,
  mb: 3,
};
const CommandBarButton = (props) => (
  <TertiaryButton
    sx={{
      fontWeight: (theme) => theme.typography.fontWeightLight,
      "&:hover": {
        color: "primary.main",
      },
    }}
    color="inherit"
    {...props}
  >
    {props.children}
  </TertiaryButton>
);
export default function StudentViewSubmission() {
  const { t } = useTranslation(
    "education/programmingcontest/studentviewcontestdetail"
  );
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const getSubmissions = async () => {
    request(
      "get",
      "/get-contest-submission-paging-of-a-user-and-contest/" + contestId,
      (res) => {
        setSubmissions(res.data.content);
      },
      {}
    );
  };

  useEffect(() => {
    getSubmissions().then((res) => {
      if (res && res.data) setSubmissions(res.data.content);
    });
  }, []);

  const columns = [
    {
      title: t("ID"),
      field: "contestSubmissionId",
      render: (rowData) => (
        <Link
          to={{
            pathname:
              "/programming-contest/contest-problem-submission-detail/" +
              rowData["contestSubmissionId"],
          }}
        >
          {rowData["contestSubmissionId"]}
        </Link>
      ),
    },
    { title: t("problem"), field: "problemId" },
    {
      title: t("submissionList.status"),
      field: "status",
      cellStyle: (status) => {
        switch (status) {
          case "Accept":
            return { color: "green" };
          case "In Progress":
            return { color: "gold" };
          default:
            return { color: "red" };
        }
      },
    },
    { title: "message", field: "message" },
    { title: t("submissionList.point"), field: "point" },
    { title: t("submissionList.language"), field: "sourceCodeLanguage" },
    {
      title: t("submissionList.numTestCases"),
      field: "testCasePass",
      align: "center",
    },
    { title: t("submissionList.at"), field: "createAt" },
  ];

  function handleRefresh() {
    getSubmissions();
  }
  return (
    <Box sx={{marginTop: "20px"}}>
      {/*
      <MuiThemeProvider theme={themeTable}>
        <Button
          onClick={() => {
            handleRefresh();
          }}
        >
          Refresh
        </Button>
        <MaterialTable
          title={<h1>{t("submissionList.title")}</h1>}
          columns={columns}
          data={submissions}
          localization={{
            ...localization,
          }}
          options={{
            pageSize: 20,
            headerStyle: {
              fontWeight: "700",
            },
          }}
          components={{
            ...components,
            Toolbar: (props) => (
              <MTableToolbar
                {...props}
                searchFieldVariant="outlined"
                searchFieldStyle={{
                  height: 40,
                }}
              />
            ),
          }}
        />
      </MuiThemeProvider>
        */}
      <div>
        <StandardTable
          title={"Submissions"}
          columns={columns}
          data={submissions}
          options={{
            selection: false,
            pageSize: 20,
            search: true,
            sorting: true,
          }}
          sx={{
            commandBar: commandBarStyles,
          }}
          commandBarComponents={
            <>
              <TertiaryButton
                onClick={() => {
                  handleRefresh();
                }}
              >
                {" "}
                REFRESH
              </TertiaryButton>
            </>
          }
        />
      </div>
    </Box>
  );
}
