import * as React from "react";
import { Link, useParams, NavLink } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { request } from "./Request";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";

import { Button, TableHead, CircularProgress } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { getColorLevel, StyledTableCell, StyledTableRow } from "./lib";
import TableBody from "@mui/material/TableBody";

export function ContestManagerListProblem(props) {
  const contestId = props.contestId;
  const [contestName, setContestName] = useState();
  const [contestTime, setContestTime] = useState();
  const [problems, setProblems] = useState([]);
  const [timeLimit, setTimeLimit] = useState();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    request("get", "/get-contest-detail/" + contestId, (res) => {
      setContestTime(res.data.contestTime);
      setProblems(res.data.list);
      setContestName(res.data.contestName);
      setTimeLimit(res.data.contestTime);
    }).then();
  }, []);

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

  return (
    <div>
      <Typography variant="h4" component="h2">
        Contest: {contestName}
      </Typography>
      <Typography variant="h5" component="h2">
        Time Limit: {timeLimit} minutes
      </Typography>
      <Typography variant="h5" component="h2">
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

        {isProcessing ? <CircularProgress /> : ""}
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        List Problem
      </Typography>

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
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
