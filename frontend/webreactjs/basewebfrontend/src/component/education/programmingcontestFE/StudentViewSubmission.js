import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { components, localization, theme } from "../../../utils/MaterialTableUtils";
import { request } from "./Request";

const useStyles = makeStyles((theme) => ({}));

export default function StudentViewSubmission() {
  const { t } = useTranslation("education/programmingcontest/studentviewcontestdetail");
  const [submissions, setSubmissions] = useState([]);
  const getSubmissions = async () => {
    request(
      "get",
      "/get-contest-submission-paging-of-a-user/",
      (res) => {
        setSubmissions(res.data.content);
      },
      {}
    );
  }

  useEffect(() => {
    getSubmissions().then((res) => {
      if (res && res.data)
        setSubmissions(res.data.content);
    });
  }, []);

  const columns = [
    {title: t("problem"), field: "problemId"},
    {
      title: t("submissionList.status"), field: "status", cellStyle:
        (status) => {
          switch (status) {
            case "Accept":
              return {color: "green"};
            case "Wrong Answer":
              return {color: "gold"};
            default:
              return {color: "red"}
          }
        }
    },
    {title: t("submissionList.language"), field: "sourceCodeLanguage"},
    {title: t("submissionList.testCases"), field: "testCasePass", align: "center"},
    {title: t("submissionList.at"), field: "createAt"}
  ];

  return (
    <Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          title={<h1>Submission list</h1>}
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
    </Box>
  );
}
