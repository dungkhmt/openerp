import * as React from "react";
import { Link, useParams, NavLink } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { request } from "./Request";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";
import { useHistory } from "react-router-dom";
import StandardTable from "component/table/StandardTable";
import {
  Button,
  TableHead,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { getColorLevel, StyledTableCell, StyledTableRow } from "./lib";
import TableBody from "@mui/material/TableBody";
import { pdf } from "@react-pdf/renderer";
import FileSaver from "file-saver";
import SubmissionOfParticipantPDFDocument from "./template/SubmissionOfParticipantPDFDocument";

export function ContestManagerListProblem(props) {
  const contestId = props.contestId;
  const [contestName, setContestName] = useState();
  const [contestTime, setContestTime] = useState();
  const [problems, setProblems] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [timeLimit, setTimeLimit] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [threshold, setThreshold] = useState(50);
  const history = useHistory();

  const columns = [
    { title: "Index", field: "index" },
    { title: "Problem Name", field: "problemName" },
    { title: "Level", field: "levelId" },
    { title: "Created By", field: "createdByUserId" },
    { title: "Submission Mode", field: "submissionMode" },
    {
      title: "Submission Mode",
      render: (row) => (
        <Button onClick={() => handleChangeContestProblem(row.problemId)}>
          Update
        </Button>
      ),
    },
  ];

  const generatePdfDocument = async (documentData, fileName) => {
    const blob = await pdf(
      <SubmissionOfParticipantPDFDocument data={documentData} />
    ).toBlob();

    FileSaver.saveAs(blob, fileName);
  };

  function handleChangeContestProblem(problemId) {
    alert("change submission mode " + problemId);
  }
  useEffect(() => {
    request("get", "/get-contest-detail/" + contestId, (res) => {
      setContestTime(res.data.contestTime);
      setProblems(res.data.list);
      setContestName(res.data.contestName);
      setTimeLimit(res.data.contestTime);
    }).then();
  }, []);

  function handleEdit() {
    history.push("/programming-contest/contest-edit/" + contestId);
  }
  function handleRejudgeContest(event) {
    //alert("Rejudge");
    event.preventDefault();
    setIsProcessing(true);
    request(
      "get",
      "/evaluate-batch-submission-of-contest/" + contestId,
      (res) => {
        console.log("handleRejudgeContest", res.data);
        //alert("Rejudge DONE!!!");
        setIsProcessing(false);
        //setSuccessful(res.data.contents.content);
        //setTotalPageSuccessful(res.data.contents.totalPages);
      }
    ).then();
  }
  function handleJudgeContest(event) {
    //alert("Rejudge");
    event.preventDefault();
    setIsProcessing(true);
    request(
      "get",
      "/evaluate-batch-not-evaluated-submission-of-contest/" + contestId,
      (res) => {
        console.log("handleJudgeContest", res.data);
        //alert("Rejudge DONE!!!");
        setIsProcessing(false);
        //setSuccessful(res.data.contents.content);
        //setTotalPageSuccessful(res.data.contents.totalPages);
      }
    ).then();
  }
  function handleExportParticipantSubmission() {
    // TODO
    request(
      "get",
      "/get-user-judged-problem-submission/" + contestId,
      (res) => {
        console.log("handleJudgeContest", res.data);
        //alert("Rejudge DONE!!!");
        setIsProcessing(false);
        setUserSubmissions(res.data);
        generatePdfDocument(
          res.data,
          `USER_JUDGED_SUBMISSION-${contestId}.pdf`
        );
        //setSuccessful(res.data.contents.content);
        //setTotalPageSuccessful(res.data.contents.totalPages);
      }
    ).then();

    // build and download PDF from data userSubmissions
  }
  function handleCheckPlagiarism(event) {
    event.preventDefault();
    setIsProcessing(true);
    let body = {
      threshold: threshold,
    };
    request(
      "post",
      "/check-code-similarity/" + contestId,

      (res) => {
        console.log("handleCheckPlagiarism, res = ", res.data);
      },
      {},
      body
    );
  }
  return (
    <div>
      <Typography variant="h4" component="h2">
        Contest: {contestName}
      </Typography>
      <Typography variant="h5" component="h2">
        Time Limit: {timeLimit} minutes
      </Typography>
      <Typography variant="h5" component="h2">
        <Button variant="contained" color="primary" onClick={handleEdit}>
          {" "}
          EDIT
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRejudgeContest}
        >
          {" "}
          Rejudge
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleJudgeContest}
        >
          {" "}
          Judge
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportParticipantSubmission}
        >
          {" "}
          Export participant submissions
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckPlagiarism}
        >
          {" "}
          Check Plagiarism
        </Button>
        <TextField
          autoFocus
          required
          id="Threshold"
          label="Threshold"
          placeholder="Threshold"
          value={threshold}
          onChange={(event) => {
            setThreshold(event.target.value);
          }}
        ></TextField>
        (%)
        {isProcessing ? <CircularProgress /> : ""}
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        List Problem
      </Typography>

      <StandardTable
        title={"Problems"}
        columns={columns}
        data={problems}
        hideCommandBar
        options={{
          selection: false,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
      />

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: window.innerWidth - 500 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Question</StyledTableCell>
              <StyledTableCell align="center">Level</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.map((problem, index) => (
              <StyledTableRow>
                <StyledTableCell>
                  <b>{index + 1}</b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <b>{problem.problemName}</b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  <span style={{ color: getColorLevel(`${problem.levelId}`) }}>
                    {" "}
                    <b>{`${problem.levelId}`} </b>{" "}
                  </span>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <b>{problem.createdByUserId}</b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <b>{problem.submissionMode}</b>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
