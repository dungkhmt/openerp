import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { request } from "./Request";
import { API_URL } from "../../../config/config";
import * as React from "react";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Grid, TextField, Button } from "@material-ui/core";
import CodeMirror from "@uiw/react-codemirror";
import { cppLanguage } from "@codemirror/lang-cpp";
import { StreamLanguage } from "@codemirror/stream-parser";
import { go } from "@codemirror/legacy-modes/mode/go";
import { java } from "@codemirror/lang-java";
import { pythonLanguage } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { getStatusColor } from "./lib";
import ParticipantProgramSubmissionDetailTestCaseByTestCase from "./ParticipantProgramSubmissionDetailTestCaseByTestCase";
export default function ContestProblemSubmissionDetail() {
  const { problemSubmissionId } = useParams();
  const [memoryUsage, setMemoryUsage] = useState();
  const [problemId, setProblemId] = useState();
  const [runTime, setRunTime] = useState();
  const [score, setScore] = useState();
  const [submissionLanguage, setSubmissionLanguage] = useState();
  const [submissionSource, setSubmissionSource] = useState("");
  const [submittedAt, setSubmittedAt] = useState();
  const [testCasePass, setTestCasePass] = useState();
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const getExtension = () => {
    switch (submissionLanguage) {
      case "CPP":
        return [cppLanguage];
      case "GoLang":
        return StreamLanguage.define(go);
      case "Java":
        return java();
      case "Python3":
        return StreamLanguage.define(pythonLanguage);
      default:
        return javascript();
    }
  };

  function updateCode() {
    let body = {
      contestSubmissionId: problemSubmissionId,
      modifiedSourceCodeSubmitted: submissionSource,
    };

    request(
      "post",
      "/update-contest-submission-source-code",
      (res) => {
        console.log("update submission source code", res.data);
      },
      {},
      body
    ).then();
  }
  useEffect(() => {
    console.log("problemSubmissionId ", problemSubmissionId);
    request(
      "get",
      "/get-contest-problem-submission-detail-viewed-by-participant/" +
        problemSubmissionId,
      (res) => {
        setMemoryUsage(res.data.memoryUsage);
        setProblemId(res.data.problemId);
        setRunTime(res.data.runTime);
        setScore(res.data.point);
        setSubmissionLanguage(res.data.sourceCodeLanguage);
        setSubmissionSource(res.data.sourceCode);
        setSubmittedAt(res.data.createdAt);
        setTestCasePass(res.data.testCasePass);
        setStatus(res.data.status);
        setMessage(res.data.message);
      },
      {}
    ).then();
  }, []);
  return (
    <div>
      {/*<Typography variant={"h5"}>*/}
      {/*  <Link to={"/programming-contest/problem-detail/"+problemId}  style={{ textDecoration: 'none', color:"black", cursor:""}} >*/}
      {/*    <span style={{color:"#00D8FF"}}>{problemName}</span>*/}
      {/*  </Link>*/}
      {/*</Typography>*/}
      <Typography variant={"h4"}>Submission Detail</Typography>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          height: "120px",
          border: "1px solid black",
          padding: "10px",
          justifyItems: "center",
          justifySelf: "center",
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h6">
              <b>{testCasePass}</b> test cases passed.
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" align="right">
              status:{" "}
              <span
                style={{ color: getStatusColor(`${status}`) }}
              >{`${status}`}</span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h6">
              Run Time: <i>{runTime}</i>
              <br />
              Memory Usage: <i>{memoryUsage} kb</i>
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" align="right">
              Submitted: {submittedAt}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <br />
      <Typography variant={"h5"}>Submitted Code: {submittedAt}</Typography>
      <Typography variant={"h5"}>Language: {submissionLanguage}</Typography>
      <TextField
        style={{
          width: 1.0 * window.innerWidth,
          margin: 20,
        }}
        multiline
        maxRows={100}
        value={submissionSource}
        onChange={(event) => {
          setSubmissionSource(event.target.value);
          console.log(submissionSource);
        }}
      ></TextField>
      <h3>Compile Message: {message}</h3>
      {/*
      <Button onClick={updateCode}>Update Code</Button>
      */}
      {/*
      <CodeMirror
        height={"400px"}
        width="100%"
        extensions={getExtension()}
        editable={false}
        autoFocus={false}
        value={submissionSource}
      />
      */}
      <ParticipantProgramSubmissionDetailTestCaseByTestCase
        submissionId={problemSubmissionId}
      />
    </div>
  );
}
