import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";
import { Link } from "react-router-dom";
import {
  Grid,
  MenuItem,
  TableHead,
  TextField,
  Button,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@mui/material/TableBody";
import { request } from "./Request";
import Pagination from "@material-ui/lab/Pagination";
import { getStatusColor, StyledTableCell, StyledTableRow } from "./lib";
import ContestManagerViewSubmissionOfAUserDialog from "./ContestManagerViewSubmissionOfAUserDialog";

export default function ContestManagerUserSubmissionNotEvaluated(props) {
  const contestId = props.contestId;

  const [contestSubmissions, setContestSubmissions] = useState([]);
  const [pageSubmissionSize, setPageSubmissionSize] = useState(10);
  const [totalPageSubmission, setTotalPageSubmission] = useState(0);
  const [pageSubmission, setPageSubmission] = useState(1);
  const pageSizes = [10, 20, 50, 100, 150];
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleCloseDialog() {
    setIsOpen(false);
  }
  const handlePageSubmissionSizeChange = (event) => {
    setPageSubmissionSize(event.target.value);
    setPageSubmission(1);
    getSubmission(event.target.value, 1);
  };
  function getSubmission(s, p) {
    request(
      "get",
      "/get-contest-not-evaluated-submission-paging/" +
        contestId +
        "?size=" +
        s +
        "&page=" +
        (p - 1),
      (res) => {
        console.log("res submission", res.data);
        setContestSubmissions(res.data.content);
        console.log("contest submission", contestSubmissions);
        setTotalPageSubmission(res.data.totalPages);
      }
    ).then();
  }

  function handleRejudge(submissionId) {
    //alert("rejudge submission " + submissionId);
    request("post", "/evaluate-submission/" + submissionId, (res) => {
      console.log("evaluate submission", res.data);
    }).then();
  }
  useEffect(() => {
    getSubmission(pageSubmissionSize, 1);
  }, []);
  return (
    <div>
      <section id={"#submission"}>
        <Typography
          variant="h5"
          component="h2"
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          User Submission
        </Typography>
      </section>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: window.innerWidth - 500 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Submission Id</StyledTableCell>
              <StyledTableCell align="center">UserID</StyledTableCell>
              <StyledTableCell align="center">FullName</StyledTableCell>
              <StyledTableCell align="center">Problem Id</StyledTableCell>
              <StyledTableCell align="center">Test Case Pass</StyledTableCell>
              <StyledTableCell align="center">Lang</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Message</StyledTableCell>
              <StyledTableCell align="center">Point</StyledTableCell>
              <StyledTableCell align="center">Submitted At</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {contestSubmissions.map((s) => (
              <StyledTableRow>
                <StyledTableCell align="center">
                  <Link
                    to={
                      "/programming-contest/manager-view-contest-problem-submission-detail/" +
                      s.contestSubmissionId
                    }
                    style={{
                      textDecoration: "none",
                      color: "blue",
                      cursor: "",
                    }}
                  >
                    <b style={{ color: "blue" }}>{s.contestSubmissionId}</b>
                  </Link>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>{s.userId}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>{s.fullname}</b>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <b>{s.problemId}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>{s.testCasePass}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>{s.sourceCodeLanguage}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>
                    <span
                      style={{ color: getStatusColor(`${s.status}`) }}
                    >{`${s.status}`}</span>
                  </b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>{s.message}</b>
                </StyledTableCell>

                <StyledTableCell align="center">
                  <b>{s.point}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>{s.createAt}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>
                    <Button
                      onClick={() => {
                        handleRejudge(s.contestSubmissionId);
                      }}
                    >
                      {" "}
                      REJUDGE{" "}
                    </Button>
                  </b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <b>
                    <Button
                      onClick={() => {
                        setSelectedUserId(s.userId);
                        setIsOpen(true);
                      }}
                    >
                      {" "}
                      ViewByUser{" "}
                    </Button>
                  </b>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={12}>
        <Grid item xs={6}>
          <TextField
            variant={"outlined"}
            autoFocus
            size={"small"}
            required
            select
            id="pageSize"
            value={pageSubmissionSize}
            onChange={handlePageSubmissionSizeChange}
          >
            {pageSizes.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item>
          <Pagination
            className="my-3"
            count={totalPageSubmission}
            page={pageSubmission}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={(event, value) => {
              setPageSubmission(value);
              getSubmission(pageSubmissionSize, value);
            }}
          />
        </Grid>
      </Grid>
      <ContestManagerViewSubmissionOfAUserDialog
        open={isOpen}
        onClose={handleCloseDialog}
        contestId={contestId}
        userId={selectedUserId}
      />
    </div>
  );
}
