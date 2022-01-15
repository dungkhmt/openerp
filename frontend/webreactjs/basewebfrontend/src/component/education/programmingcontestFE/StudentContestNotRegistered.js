import React, {useEffect, useState} from "react";
import {request} from "./Request";
import {API_URL} from "../../../config/config";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {Button, Grid, MenuItem, Table, TableBody, TableHead, TextField} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import {StyledTableCell, StyledTableRow} from "./lib";
import {Link} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {successNoti} from "../../../utils/notification";


export function StudentContestNotRegistered(){
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPage] = useState(0);
  const pageSizes = [20,50, 100];
  const [contests, setContests] = useState([])

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
      API_URL+"/get-contest-paging-not-registered?size="+pageSize+"&page="+(page-1),
      (res)=>{
        console.log("contest list", res.data);
        setTotalPage(res.data.totalPages);
        setContests(res.data.contents);
      }
    ).then();
  }

  useEffect(() => {
    console.log("use effect");
    getContestList().then();
  }, [page, pageSize])

  function handleRegister(contestId){

  }

  return(
    <div>
      <div>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="left">Title</StyledTableCell>
                  <StyledTableCell align="center">Register Contest</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contests.map((contest, index) => (
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                      {pageSize*(page-1) + index +1}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      <b>{contest.contestName}</b>

                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="light"
                        onClick={() => {
                          request(
                            "post",
                            API_URL+"/student-register-contest/"+contest.contestId,
                            (res)=>{
                              console.log("res ", res.data);
                              successNoti(res.data.message, true);
                            }
                          ).then();
                        }}
                      >
                        Register
                      </Button>
                    </StyledTableCell>
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

          <Grid item >
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


    </div>
  );
}