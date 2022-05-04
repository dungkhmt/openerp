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
  const [score, setScore] = React.useState(0);
  const [status, setStatus] = useState("");
  const [nbTestCasePassed, setNbTestCasePassed] = useState(0);
  const [nbTotalTestCase, setNbTotalTestCase] = useState(0);
  const [runTime, setRunTime] = useState(0);
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
    let body = {
      problemId: problemId,
      contestId: contestId,
      language: "CPP",
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
        setScore(res.score);
        setNbTestCasePassed(res.numberTestCasePassed);
        setNbTotalTestCase(res.totalNumberTestCase);
        setRunTime(runTime);
        set(res.status);
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
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
    getTestCases();
    getProblemDetail();
  }, []);
  return (
    <div>
      <div>
        <h3>Problem Name: {problem ? problem.problemName : ""}</h3>
      </div>
      <div>
        <Typography>
          <h2>Problem Description</h2>
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
            <Grid item xs={2}>
              <Button
                color="primary"
                type="submit"
                onChange={onInputChange}
                width="100%"
              >
                UPLOAD
              </Button>
            </Grid>

            <input
              type="file"
              id="selected-upload-file"
              onChange={onFileChange}
            />
          </Grid>
        </form>
        <div>
          <h1>Status: {status}</h1>
        </div>
        <div>
          <h1>Score: {score}</h1>
        </div>
        <div>
          <h1>Number TestCases Passed: {nbTestCasePassed}</h1>
        </div>
        <div>
          <h1>Total TestCases : {nbTotalTestCase}</h1>
        </div>
        <div>
          <h1>RunTime : {runTime}(ms)</h1>
        </div>
      </div>
    </div>
  );
}
