import React, {useEffect, useState} from "react";
import {request} from "./Request";
import {Box} from "@mui/material";
import {components, localization, theme} from "../../../utils/MaterialTableUtils";
import MaterialTable, {MTableToolbar} from "material-table";
import {makeStyles, MuiThemeProvider} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  commandButton: {
    marginLeft: theme.spacing(2),
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  tableToolbarHighlight: {backgroundColor: "transparent"},
}));

export default function StudentViewSubmission() {
  const classes = useStyles();
  const [submissions, setSubmissions] = useState([]);
  const getSubmissions = async () => {
    request(
      "get",
      "/get-contest-submission-paging-of-a-user/" + "admin",
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
  }, [submissions]);

  const columns = [
    {title: "Problem", field: "problemId"},
    {title: "Status", field: "status"},
    {title: "Language", field: "sourceCodeLanguage"},
    {title: "At", field: "createAt"}
  ];

  return (
    <Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          title={"Danh sách nộp bài"}
          columns={columns}
          data={submissions}
          localization={{
            ...localization,
            toolbar: {...localization.toolbar, nRowsSelected: ""},
          }}
          options={{
            pageSize: 20,
            headerStyle: {
              // backgroundColor: "transparent",
              fontWeight: "700",
            },
          }}
          components={{
            ...components,
            Toolbar: (props) => (
              <MTableToolbar
                {...props}
                classes={{
                  highlight: classes.tableToolbarHighlight,
                }}
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
