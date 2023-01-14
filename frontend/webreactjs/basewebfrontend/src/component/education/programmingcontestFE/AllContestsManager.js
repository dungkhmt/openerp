import React, {useEffect, useState} from "react";
import {request} from "./Request";
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {StyledTableCell, StyledTableRow} from "./lib";
import {Link} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {ListContestManagerByRegistration} from "./ListContestManagerByRegistration";
import {successNoti} from "../../../utils/notification";

export default function AllContestsManager() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPage] = useState(0);
  const pageSizes = [20, 50, 100];
  const [contests, setContests] = useState([]);

  const switchJudgeMode = (mode) => {
    request(
      "post",
      "/switch-judge-mode?mode=" + mode,
      () => successNoti("Saved", 5000)
    ).then();
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    // getProblemContestList();
  };

  async function getContestList() {
    request(
      "get",
      "/get-all-contests-paging-by-admin?size=" +
      pageSize +
      "&page=" +
      (page - 1),
      (res) => {
        console.log("contest list", res.data);
        setTotalPage(res.data.totalPages);
        setContests(res.data.contents);
      }
    ).then();
  }

  useEffect(() => {
    console.log("use effect");
    getContestList().then();
  }, [page, pageSize]);

  return (
    <div>
      <div>
        <Button
          variant="contained"
          sx={{marginBottom: "12px", marginRight: "16px"}}
          onClick={() => switchJudgeMode("ASYNCHRONOUS_JUDGE_MODE_QUEUE")}
        >
          Switch all to judge mode QUEUE
        </Button>
        <Button
          variant="contained"
          sx={{marginBottom: "12px"}}
          onClick={() => switchJudgeMode("SYNCHRONOUS_JUDGE_MODE")}
        >
          Switch all to judge mode non-QUEUE
        </Button>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 100}} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="left"><b>Title</b></StyledTableCell>
                  <StyledTableCell align="left"><b>Status</b></StyledTableCell>
                  <StyledTableCell align="left"><b>Created By</b></StyledTableCell>
                  <StyledTableCell align="left"><b>Created At</b></StyledTableCell>
                  {/*<StyledTableCell align="center">Delete</StyledTableCell>*/}
                </TableRow>
              </TableHead>
              <TableBody>
                {contests.map((contest, index) => (
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                      {pageSize * (page - 1) + index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Link
                        to={
                          "/programming-contest/contest-manager/" +
                          contest.contestId
                        }
                        style={{
                          textDecoration: "none",
                          color: "#000000",
                          hover: {color: "#00D8FF", textPrimary: "#00D8FF"},
                        }}
                      >
                        {contest.contestName}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {contest.statusId}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {contest.userId}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {contest.createdAt}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      <Link
                        to={
                          "/programming-contest/contest-manager/" +
                          contest.contestId
                        }
                        style={{
                          textDecoration: "none",
                          color: "#000000",
                          hover: {color: "#00D8FF", textPrimary: "#00D8FF"},
                        }}
                      >
                        <Button variant="contained" disableElevation>
                          Detail
                        </Button>
                      </Link>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Link
                        to={
                          "/programming-contest/contest-edit/" +
                          contest.contestId
                        }
                        style={{
                          textDecoration: "none",
                          color: "black",
                          cursor: "",
                        }}
                      >
                        <Button variant="contained" disableElevation>
                          Edit
                        </Button>
                      </Link>
                    </StyledTableCell>
                    {/*<StyledTableCell align="center">*/}
                    {/*  <Button*/}
                    {/*    variant="contained"*/}
                    {/*    color="light"*/}
                    {/*    onClick={*/}
                    {/*      ()=>{*/}
                    {/*        request(*/}
                    {/*          "delete",*/}
                    {/*          "/delete-contest/"+contest.contestId,*/}
                    {/*          (res)=>{*/}
                    {/*            // window.location.reload();*/}
                    {/*            getContestList().then();*/}
                    {/*          }*/}
                    {/*        ).then();*/}
                    {/*      }*/}
                    {/*    }*/}
                    {/*  >*/}
                    {/*    Delete*/}
                    {/*  </Button>*/}
                    {/*</StyledTableCell>*/}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <br></br>
        <Grid container spacing={12}>
          <Grid item xs={6}>
            <TextField
              variant={"outlined"}
              autoFocus
              size={"small"}
              required
              select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
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
              count={totalPages}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
          </Grid>
        </Grid>
      </div>
      <ListContestManagerByRegistration/>
      {/*
      <ListContestByRole />
      */}
    </div>
  );
}
