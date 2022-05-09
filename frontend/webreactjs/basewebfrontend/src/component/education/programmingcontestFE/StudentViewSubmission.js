import React, {useEffect, useState} from "react";
import {request} from "./Request";
import {Box, Typography} from "@mui/material";
import {components, localization, theme} from "../../../utils/MaterialTableUtils";
import MaterialTable, {MTableToolbar} from "material-table";
import {makeStyles, MuiThemeProvider} from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({}));

export default function StudentViewSubmission() {
  const { t } = useTranslation("education/programmingcontest/studentViewSubmission");
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
      title: "Status", field: "status", cellStyle:
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
    {title: "Language", field: "sourceCodeLanguage"},
    {title: "Test cases", field: "testCasePass", align: "center"},
    {title: "At", field: "createAt"}
  ];

  return (
    <Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          title={<Typography variant="h4">Submission list</Typography>}
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
