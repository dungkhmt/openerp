import Pagination from "@material-ui/lab/Pagination";
import React, { useState, useEffect } from "react";
import {Button, Grid, MenuItem, Table, TableBody, TableHead, TextField} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import {Link} from "react-router-dom";
import {request} from "./Request";
import {API_URL} from "../../../config/config";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {getColorLevel, StyledTableCell, StyledTableRow} from "./lib";

function ListProblem(){
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPage] = useState(0);
  const pageSizes = [20,50, 100];
  const [contestProblems, setContestProblems] = useState([])



  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    // getProblemContestList();
  };

  async function getProblemContestList() {
    console.log("p ", page);
    request(
      "get",
      "/get-contest-problem-paging?size="+pageSize+"&page="+(page-1),
      (res)=>{
        console.log("problem list", res.data);
        setTotalPage(res.data.totalPages);
        setContestProblems(res.data.content);
      }
    ).then();
  }

  useEffect(() => {
    console.log("use effect");
    getProblemContestList().then();
  }, [page, pageSize])

  return (
    <div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell align="left">Title</StyledTableCell>
                <StyledTableCell align="left">Solution</StyledTableCell>
                <StyledTableCell align="left">Difficulty</StyledTableCell>
                <StyledTableCell align="left">Add Testcase</StyledTableCell>
                <StyledTableCell align="left">Edit</StyledTableCell>
                {/*<StyledTableCell align="left">Delete</StyledTableCell>*/}
              </TableRow>
            </TableHead>
            <TableBody>
              {contestProblems.map((problem) => (
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">

                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Link to={"/programming-contest/problem-detail/"+problem.problemId}  style={{ textDecoration: 'none', color:"#000000", hover:{color:"#00D8FF", textPrimary:"#00D8FF"}}} >
                      {problem.problemName}
                    </Link>
                  </StyledTableCell>

                  <StyledTableCell align="left">

                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <span style={{color:getColorLevel(`${problem.levelId}`)}}>{`${problem.levelId}`}</span>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Link to={"/programming-contest/problem-detail-create-test-case/"+problem.problemId}  style={{ textDecoration: 'none', color:"black"}} >
                      <Button
                        variant="contained"
                        color="light"
                      >
                        ADD
                      </Button>
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Link to={"/programming-contest/edit-problem/"+problem.problemId}  style={{ textDecoration: 'none', color:"black", cursor:""}} >
                      <Button
                        variant="contained"
                        color="light"
                      >
                        Edit
                      </Button>
                    </Link>
                  </StyledTableCell>
                  {/*<StyledTableCell align="left">*/}
                  {/*    <Button*/}
                  {/*      variant="contained"*/}
                  {/*      color="light"*/}
                  {/*      onClick={*/}
                  {/*        ()=>{*/}
                  {/*          request(*/}
                  {/*            "delete",*/}
                  {/*            "/delete-problem/"+problem.problemId,*/}
                  {/*            (res)=>{*/}
                  {/*              // window.location.reload();*/}
                  {/*              getProblemContestList().then();*/}
                  {/*            }*/}
                  {/*          ).then();*/}
                  {/*        }*/}
                  {/*      }*/}
                  {/*    >*/}
                  {/*      Delete*/}
                  {/*    </Button>*/}
                  {/*</StyledTableCell>*/}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <br/>
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
  )
}
export default ListProblem;