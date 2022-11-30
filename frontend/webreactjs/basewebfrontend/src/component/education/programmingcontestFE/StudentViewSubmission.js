import {Box, Button, CircularProgress, Typography} from "@mui/material";
import StandardTable from "component/table/StandardTable";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { request } from "./Request";

const commandBarStyles = {
  position: "sticky",
  top: 60,
  zIndex: 11,
  mt: -3,
  mb: 3,
};
const StudentViewSubmission = forwardRef((props, ref) => {
  const { t } = useTranslation(
    "education/programmingcontest/studentviewcontestdetail"
  );
  const { contestId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const getSubmissions = async () => {
    request(
      "get",
      "/get-contest-submission-paging-of-a-user-and-contest/" + contestId,
      (res) => {
        setSubmissions(res.data.content);
        setLoading(false);
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
    { title: "Message", field: "message" },
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
    setLoading(true);
    getSubmissions();
  }

  useImperativeHandle(ref, () => ({
    refreshSubmission() {
      handleRefresh()
    }
  }));

  return (
    <Box sx={{ marginTop: "20px" }}>
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
              <Button
                variant="contained"
                disabled={loading}
                onClick={() => {
                  handleRefresh();
                }}
              >
                {" "}
                REFRESH
              </Button>
              {loading && <CircularProgress />}
            </>
          }
        />
      </div>
    </Box>
  );
})

export default StudentViewSubmission;