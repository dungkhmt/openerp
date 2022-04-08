import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { request } from "./Request";
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
} from "@material-ui/core/";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@mui/material/TableBody";
import { sleep, StyledTableCell, StyledTableRow } from "./lib";
import { Button, TableHead } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
export default function StudentViewProgrammingContestProblemDetail() {
  const params = useParams();
  const problemId = params.problemId;
  const contestId = params.contestId;
  const [testCases, setTestCases] = useState([]);
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
  function getProblemDetail() {}

  useEffect(() => {
    getTestCases();
  }, []);
  return (
    <div>
      StudentViewProblemDetail {problemId}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="left">TestCase</StyledTableCell>
              <StyledTableCell align="left">Correct Answer</StyledTableCell>
              <StyledTableCell align="left">Point</StyledTableCell>
              <StyledTableCell align="left">Edit</StyledTableCell>
              <StyledTableCell align="left">Delete</StyledTableCell>
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
    </div>
  );
}
