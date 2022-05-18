import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { request } from "./Request";
import {
  Button,
  Grid,
  Modal,
  TextField,
  MenuItem,
  TableHead,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@mui/material/TableBody";
import { sleep, StyledTableCell, StyledTableRow } from "./lib";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart } from "../../../api";
import { set } from "date-fns";

import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";

const editorStyle = {
  toolbar: {
    background: "#FFFFFF",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

export default function StudentViewProgrammingContestProblemDetail() {
  const params = useParams();
  const problemId = params.problemId;
  const contestId = params.contestId;
  const [problem, setProblem] = useState(null);
  const [problemStatement, setProblemStatement] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("CPP");
  const [score, setScore] = React.useState("");
  const [status, setStatus] = useState("");
  const [nbTestCasePassed, setNbTestCasePassed] = useState("");
  const [nbTotalTestCase, setNbTotalTestCase] = useState("");
  const [runTime, setRunTime] = useState("");
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [editorStateDescription, setEditorStateDescription] = useState(
    EditorState.createEmpty()
  );

  function onFileChange(event) {
    setFilename(event.target.files[0]);
    console.log(event.target.files[0].name);
  }
  const onInputChange = (event) => {
    let name = event.target.value;
    setFilename(name);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsProcessing(true);
    let body = {
      problemId: problemId,
      contestId: contestId,
      language: language,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", filename);

    authPostMultiPart(
      dispatch,
      token,
      "/contest-submit-problem-via-upload-file",
      formData
    )
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);
        if (res.status == "TIME_OUT") {
          alert("Time Out!!!");
          setScore("");
          setNbTestCasePassed("");
          setNbTotalTestCase("");
          setRunTime("");
          setStatus(res.status);
        } else {
          setScore(res.score);
          setNbTestCasePassed(res.numberTestCasePassed);
          setNbTotalTestCase(res.totalNumberTestCase);
          setRunTime(runTime);
          setStatus(res.status);
        }
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
        //alert("Time Out!!!");
      });
  };

  function getTestCases() {
    request(
      "GET",
      "/get-test-case-list-by-problem/" + problemId,

      (res) => {
        console.log("res", res.data);
        setTestCases(res.data);
      },
      {}
    );
  }
  function getProblemDetail() {
    request(
      "GET",
      "/get-problem-detail-view-by-student/" + problemId,

      (res) => {
        console.log("getProblemDetail, res = ", res.data);
        setProblem(res.data);
        //setProblemStatement(res.data.problemStatement);
        let problemDescriptionHtml = htmlToDraft(res.data.problemStatement);
        let { contentBlocks, entityMap } = problemDescriptionHtml;
        let contentDescriptionState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        let statementDescription = EditorState.createWithContent(
          contentDescriptionState
        );
        setEditorStateDescription(statementDescription);
      },
      {}
    );
  }

  useEffect(() => {
    //getTestCases();
    getProblemDetail();
  }, []);
  return (
    <div>
      <div>
        <h3>Name: {problem ? problem.problemName : ""}</h3>
      </div>

      <div>
        <Typography>
          <h2>Description</h2>
        </Typography>
        <Editor
          editorState={editorStateDescription}
          handlePastedText={() => false}
          toolbarStyle={editorStyle.toolbar}
          editorStyle={editorStyle.editor}
        />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="left">TestCase</StyledTableCell>
              <StyledTableCell align="left">Correct Answer</StyledTableCell>
              <StyledTableCell align="left">Point</StyledTableCell>
              <StyledTableCell align="left">Submit Output</StyledTableCell>
              <StyledTableCell align="left">View</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {testCases.map((testCase, idx) => (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  {idx}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {testCase.testCase}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {testCase.correctAns}
                </StyledTableCell>
                <StyledTableCell align="left">{testCase.point}</StyledTableCell>
                <StyledTableCell align="left">
                  <Link
                    to={
                      "/programming-contest/submit-solution-output/" +
                      contestId +
                      "/" +
                      problemId +
                      "/" +
                      testCase.testCaseId
                    }
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "",
                    }}
                  >
                    <Button variant="contained" color="light">
                      Submit Solution
                    </Button>
                  </Link>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Button variant="contained" color="light" onClick={() => {}}>
                    View
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={3}>
              <input
                type="file"
                id="selected-upload-file"
                onChange={onFileChange}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                autoFocus
                // required
                select
                id="language"
                label="Language"
                placeholder="Language"
                onChange={(event) => {
                  setLanguage(event.target.value);
                }}
                value={language}
              >
                <MenuItem key={"CPP"} value="CPP">
                  {"CPP"}
                </MenuItem>
                <MenuItem key={"JAVA"} value="JAVA">
                  {"JAVA"}
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={2}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                onChange={onInputChange}
                width="100%"
              >
                SUBMIT
              </Button>
            </Grid>

            {isProcessing ? <CircularProgress /> : ""}
          </Grid>
        </form>

        <div>
          <h2>Status: {status}</h2>
        </div>
        <div>
          <h2>Score: {score}</h2>
        </div>
        <div>
          <h2>Number TestCases Passed: {nbTestCasePassed}</h2>
        </div>
        <div>
          <h2>Total TestCases : {nbTotalTestCase}</h2>
        </div>
        <div>
          <h2>RunTime : {runTime}(ms)</h2>
        </div>
      </div>
    </div>
  );
}
