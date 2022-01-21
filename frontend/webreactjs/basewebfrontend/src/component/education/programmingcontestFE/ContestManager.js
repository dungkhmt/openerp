import * as React from "react";
import {Link, useParams, NavLink} from "react-router-dom";
import {Fragment, useEffect, useState} from "react";
import {request} from "./Request";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";
import {Button, Grid, MenuItem, Tab, TableHead, Tabs, TextField} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import {
  getColorLevel,
  getColorRegisterStatus,
  getStatusColor,
  Search,
  SearchIconWrapper,
  StyledTableCell,
  StyledTableRow
} from "./lib";
import TableBody from "@mui/material/TableBody";
import Pagination from "@material-ui/lab/Pagination";
import {API_URL} from "../../../config/config";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import {InputBase} from "@mui/material";
import {a11yProps, TabPanelVertical} from "./TabPanel";
import {ScrollBox} from "react-scroll-box";
import {Markup} from "interweave";



export function ContestManager(){
  const {contestId} = useParams();
  const [contestName, setContestName] = useState();
  const [contestTime, setContestTime] = useState();
  const [problems, setProblems] = useState([]);
  const [timeLimit, setTimeLimit] = useState();
  const [pendings, setPendings] = useState([]);
  const [pagePendingSize, setPagePendingSize] = useState(10);
  const [pageSuccessfulSize, setPageSuccessfulSize] = useState(10);
  const pageSizes = [10, 20, 50,100, 150];
  const [totalPagePending, setTotalPagePending] = useState(0);
  const [totalPageSuccessful, setTotalPageSuccessful] = useState(0);
  const [pagePending, setPagePending] = useState(1);
  const [pageSuccessful, setPageSuccessful] = useState(1);
  const [successful, setSuccessful] = useState([]);
  const [load, setLoad] = useState(true);
  const [pageRanking, setPageRanking] = useState(1);
  const [ranking, setRanking] = useState([]);
  const [totalPageRanking, setTotalPageRanking] = useState(0);
  const [pageRankingSize, setPageRankingSize] = useState(10);

  const [searchUsers, setSearchUsers] = useState([]);
  const [pageSearchSize, setPageSearchSize] = useState(10);
  const [totalPageSearch, setTotalPageSearch] = useState(0);
  const [pageSearch, setPageSearch] = useState(1);
  const [keyword, setKeyword]= useState("");

  const [contestSubmissions, setContestSubmissions] = useState([]);
  const [pageSubmissionSize, setPageSubmissionSize] = useState(10 );
  const [totalPageSubmission, setTotalPageSubmission] = useState(0);
  const [pageSubmission, setPageSubmission] = useState(1);


  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePageSubmissionSizeChange = (event) => {
    setPageSubmissionSize(event.target.value);
    setPageSubmission(1);
    getSubmission(event.target.value, 1);
  }

  const handlePageSearchSizeChange = (event) => {
    setPageSearchSize(event.target.value);
    setPageSearch(1);
    searchUser(keyword, event.target.value,  1)
  }

  const handlePagePendingSizeChange = (event) => {
    setPagePendingSize(event.target.value);
    setPagePending(1);
    getUserPending(event.target.value, 1)
    // getProblemContestList();
  };

  const handlePageRankingSizeChange = (event) =>{
    setPageRankingSize(event.target.value);
    setPageRanking(1);
    getRanking(event.target.value, 1)
  }

  const handlePageSuccessfulSizeChange = (event) => {
    setPageSuccessfulSize(event.target.value);
    setPageSuccessful(1);
    getUserSuccessful(event.target.value, 1)
  }


  function getSubmission(s, p){
    request(
      "get",
      "/get-contest-submission-paging/"+contestId+"?size="+s+"&page="+(p-1),
      (res)=>{
        console.log("res submission", res.data);
        setContestSubmissions(res.data.content);
        console.log("contest submission", contestSubmissions);
        setTotalPageSubmission(res.data.totalPages);
      }
    ).then();
  }

  function getUserPending(s, p){
    request(
      "get",
      "/get-user-register-pending-contest/"+contestId+"?size="+s+"&page="+(p-1),
      (res) => {
        console.log("res pending", res.data);
        setPendings(res.data.contents.content);
        setTotalPagePending(res.data.contents.totalPages);
      }
    ).then();
  }

  function getUserSuccessful(s, p){
    request(
      "get",
      "/get-user-register-successful-contest/"+contestId+"?size="+s+"&page="+(p-1),
      (res) => {
        console.log("res pending", res.data);
        setSuccessful(res.data.contents.content);
        setTotalPagePending(res.data.contents.totalPages);
      }
    ).then();
  }

  function getRanking(s, p){
    request(
      "get",
      "/get-ranking-contest/"+contestId+"?size="+s+"&page="+(p-1),
      (res) =>{
        console.log("ranking ", res.data);
        setTotalPageRanking(res.data.totalPages);
        setRanking(res.data.content);
      }
    ).then();
  }

  function recalculatedRanking(){
    request(
      "post",
      "/recalculate-ranking/"+contestId
    ).then(() =>{
      getRanking(pageRankingSize, pageRanking);
    })
  }

  function searchUser(keyword, s, p){
    request(
      "get",
      "/search-user/"+contestId+"?size="+s+"&page="+(p-1)+"&keyword="+keyword,
      (res) => {
        console.log("res search", res);
        setSearchUsers(res.data.contents.content);
        setTotalPageSearch(res.data.contents.totalPages);
      }
    ).then();
  }

  useEffect(() =>{
    request(
      "get",
      "/get-contest-detail/"+contestId,
      (res)=>{
        setContestTime(res.data.contestTime);
        setProblems(res.data.list);
        setContestName(res.data.contestName);
        setTimeLimit(res.data.contestTime);
      }
    ).then();

    getUserPending(pagePendingSize, 1);
    getUserSuccessful(pageSuccessfulSize, 1)
    getRanking(pageRankingSize, 1);
    searchUser(keyword, pageSearchSize, 1);
    getSubmission(pageSubmissionSize, 1);
  },[])



  return(
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor={"primary"}
        autoFocus
        style={{
          width:"100%",
          display:"inline-table",
          border: "1px solid transparent ",
          position: "relative",
          borderBottom:"none",

        }}
        // variant={"fullWidth"}
        aria-label="basic tabs example"
      >
        <Tab label="Contest Detail" {...a11yProps(0)} style={{width:"25%"}} />
        <Tab label="List User" {...a11yProps(1)} style={{width:"25%"}}/>
        <Tab label="Register User" {...a11yProps(2)} style={{width:"25%"}}/>
        <Tab label="Add User" {...a11yProps(3)} style={{width:"25%"}}/>
        <Tab label="Ranking" {...a11yProps(4)} style={{width:"25%"}}/>
        <Tab label="User Submission" {...a11yProps(5)} style={{width:"25%"}}/>
      </Tabs>

      <TabPanelVertical value={value} index={0}>
        <Typography variant="h4" component="h2">
          Contest: {contestName}
        </Typography>
        <Typography variant="h5" component="h2">
          Time Limit: {timeLimit} minutes
        </Typography>
        <Typography variant="h5" component="h2" style={{marginTop:10, marginBottom:10}}>
          List Problem
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{minWidth:window.innerWidth-500}}  aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell >Question</StyledTableCell>
                <StyledTableCell align="center">Level</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem, index) =>(
                <StyledTableRow>
                  <StyledTableCell>
                    <b>{index+1}</b>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <b>{problem.problemName}</b>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="center">
                    <span style={{color:getColorLevel(`${problem.levelId}`)}}> <b>{`${problem.levelId}`} </b> </span>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanelVertical>


      <TabPanelVertical value={value} index={1}>
        <section id={"#registered"}>
          <Typography variant="h5" component="h2" style={{marginTop:10, marginBottom:10}}>
            List Student Registered Contest
          </Typography>
        </section>
        <RegisteredTable
          successful={successful}
          pageSuccessful={pageSuccessful}
          pageSuccessfulSize={pageSuccessfulSize}
          load={load}
        />


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
              value={pageSuccessfulSize}
              onChange={handlePageSuccessfulSizeChange}
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
              count={totalPageSuccessful}
              page={pageSuccessful}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={(event, value) =>{
                setPageSuccessful(value);
                getUserSuccessful(pageSuccessfulSize, value);
              }}
            />
          </Grid>
        </Grid>
      </TabPanelVertical>

      <TabPanelVertical value={value} index={2}>
        <div>
          <section id={"#pending"}>
            <Typography variant="h5" component="h2" style={{marginTop:10, marginBottom:10}}>
              List Student Request
            </Typography>
          </section>
          <TableContainer component={Paper}>
            <Table sx={{minWidth:window.innerWidth-500}}  aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell></StyledTableCell>
                  <StyledTableCell align="center">User Name</StyledTableCell>
                  <StyledTableCell align="center">Full Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Approve</StyledTableCell>
                  <StyledTableCell align="center">Reject</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  pendings.map((s, index) =>(
                    <StyledTableRow>
                      <StyledTableCell>
                        <b>{index+1+(pagePending-1)*pageSuccessfulSize}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.userName}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.firstName}{" "}{s.middleName}{" "}{s.lastName}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.email}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="light"
                          onClick={() => {
                            let body = {
                              contestId: contestId,
                              userId: s.userName,
                              status: "SUCCESSES"
                            }
                            request(
                              "post",
                              "/techer-manager-student-register-contest",
                              ()=>{
                                successful.push(s);
                                // setSuccessful(successful)
                                // setSuccessful(successful)
                                pendings.splice(index,1);
                                // setPendings(pendings);
                                console.log("successful ", successful);
                                console.log("pendings ", pendings);
                                setLoad(false);
                                setLoad(true);
                              },
                              {}
                              ,
                              body

                            ).then()
                          }}
                        >
                          Approve
                        </Button>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="light"
                          onClick={() => {
                            let body = {
                              contestId: contestId,
                              userId: s.userName,
                              status: "FAILED"
                            }
                            request(
                              "post",
                              "/techer-manager-student-register-contest",
                              ()=>{
                                pendings.splice(index,1);
                                setLoad(false);
                                setLoad(true)
                              },
                              {}
                              ,
                              body

                            ).then()
                          }}
                        >
                          Reject
                        </Button>
                      </StyledTableCell>

                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

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
                value={pagePendingSize}
                onChange={handlePagePendingSizeChange}
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
                count={totalPagePending}
                page={pagePending}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={(event, value) =>{
                  setPagePending(value);
                  getUserPending(pagePendingSize, value);
                }}
              />
            </Grid>
          </Grid>
        </div>
      </TabPanelVertical>



      <TabPanelVertical value={value} index={3}>
        <div>
          <section id={"#search"}>
            <Typography variant="h5" component="h2" style={{marginTop:10, marginBottom:10}}>
              Add Member
            </Typography>
          </section>

          <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
            <AppBar position="static" color={"transparent"}>
              <Toolbar>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <InputBase
                    style={{paddingLeft:50}}
                    placeholder={"search..."}
                    onChange={(event) =>{
                      setKeyword(event.target.value);
                      searchUser(event.target.value, pageSearchSize, pageSearch);
                    }}
                  />
                </Search>
              </Toolbar>
            </AppBar>
          </Box>


          <TableContainer component={Paper}>
            <Table sx={{minWidth:window.innerWidth-500}}  aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">User Name</StyledTableCell>
                  <StyledTableCell align="center">Full Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Add</StyledTableCell>
                  <StyledTableCell align="center">Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  searchUsers.map((s, index) =>(
                    <StyledTableRow>
                      <StyledTableCell>
                        <b>{index+1+(pageSuccessful-1)*pageSuccessfulSize}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.userName}</b>

                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.firstName}{" "}{s.middleName}{" "}{s.lastName}</b>

                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.email}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {
                          s.status != null ?
                            <b><span style={{color:getColorRegisterStatus(`${s.status}`)}}>{`${s.status}`}</span></b>:
                            <b><span style={{color:getColorRegisterStatus('NOT REGISTER')}}>NOT REGISTER</span></b>
                        }

                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {
                          s.status === "PENDING"?
                            <Button
                              variant="contained"
                              color="light"
                              onClick={() => {
                                let body = {
                                  contestId: contestId,
                                  userId: s.userName,
                                  status: "SUCCESSES"
                                }
                                request(
                                  "post",
                                  "/techer-manager-student-register-contest",
                                  ()=>{
                                    successful.push(s);
                                    // setSuccessful(successful)
                                    // setSuccessful(successful)
                                    pendings.splice(index,1);
                                    // setPendings(pendings);
                                    console.log("successful ", successful);
                                    console.log("pendings ", pendings);
                                    setLoad(false);
                                    setLoad(true);
                                  },
                                  {}
                                  ,
                                  body

                                ).then()
                              }}
                            >
                              Approve
                            </Button> :
                            s.status !== "SUCCESSFUL" ?
                              <Button
                                variant="contained"
                                color="light"
                                style={{marginLeft:"45px"}}
                                onClick={() => {
                                  let body={
                                    contestId:contestId,
                                    userId:s.userName,
                                  }
                                  successful.push(s);
                                  request(
                                    "POST",
                                    "/add-user-to-contest",
                                    {},
                                    {},
                                    body
                                  ).then(
                                    () =>{
                                      setLoad(false);
                                      setLoad(true);
                                      searchUser(keyword, pageSearchSize, pageSearch);
                                    }
                                  )
                                }}
                              >
                                ADD
                              </Button>
                              :
                              <div></div>

                        }
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {
                          s.status === "SUCCESSFUL" ?
                            <Button
                              variant="contained"
                              color="light"
                              style={{marginLeft:"45px"}}
                              onClick={() => {
                                let body={
                                  contestId:contestId,
                                  userId:s.userName,
                                }

                                request(
                                  "POST",
                                  "/delete-user-contest",
                                  {},
                                  {},
                                  body
                                ).then(
                                  () =>{
                                    setLoad(false);
                                    setLoad(true);
                                    searchUser(keyword, pageSearchSize, pageSearch);
                                  }
                                )
                              }}
                            >
                              DELETE
                            </Button>
                            :
                            <div></div>
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <br/><br/>
          <Grid container spacing={12}>
            <Grid item xs={6}>

              <TextField
                variant={"outlined"}
                autoFocus
                size={"small"}
                required
                select
                id="pageSize"
                value={pageSearchSize}
                onChange={handlePageSearchSizeChange}
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
                count={totalPageSearch}
                page={pageSearch}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={(event, value) =>{
                  setPageSearch(value);
                  searchUser(keyword, pageSearchSize, pageSearch);
                }}
              />
            </Grid>
          </Grid>

          <br/><br/>
        </div>
      </TabPanelVertical>



      <TabPanelVertical value={value} index={4}>
        <div>
          <section id={"#ranking"}>
            <Typography variant="h5" component="h2" style={{marginTop:10, marginBottom:10}}>
              Contest Ranking
            </Typography>
          </section>


          <TableContainer component={Paper}>
            <Table sx={{minWidth:window.innerWidth-500}}  aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center">User Name</StyledTableCell>
                  <StyledTableCell align="center">Full Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Point</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  ranking.map((s, index) =>(
                    <StyledTableRow>
                      <StyledTableCell>
                        <b>{index+1+(pageSuccessful-1)*pageSuccessfulSize}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.userId}</b>

                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.fullName}</b>

                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.email}</b>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <b>{s.point}</b>
                      </StyledTableCell>

                    </StyledTableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>


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
                value={pageRankingSize}
                onChange={handlePageRankingSizeChange}
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
                count={totalPageRanking}
                page={pageRanking}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={(event, value) =>{
                  setPageRanking(value);
                  getRanking(pageRankingSize, value);
                }}
              />
            </Grid>
          </Grid>


          <Button
            variant="contained"
            color="light"
            style={{marginLeft:"45px"}}
            onClick={recalculatedRanking}
          >
            Recalculate Ranking
          </Button>
        </div>

      </TabPanelVertical>

      <TabPanelVertical value={value} index={5}>
        <section id={"#submission"}>
          <Typography variant="h5" component="h2" style={{marginTop:10, marginBottom:10}}>
            User Submission
          </Typography>
        </section>

        <TableContainer component={Paper}>
          <Table sx={{minWidth:window.innerWidth-500}}  aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Submission Id</StyledTableCell>
                <StyledTableCell align="center">User</StyledTableCell>
                <StyledTableCell align="center">Problem Id</StyledTableCell>
                <StyledTableCell align="center">Test Case Pass</StyledTableCell>
                <StyledTableCell align="center">Lang</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Point</StyledTableCell>
                <StyledTableCell align="center">Submitted At</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {
                contestSubmissions.map((s) => (
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      <Link to={"/programming-contest/contest-problem-submission-detail/"+s.contestSubmissionId}  style={{ textDecoration: 'none', color:"blue", cursor:""}} >
                        <b style={{color: "blue"}}>{s.contestSubmissionId}</b>
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>{s.userId}</b>
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
                      <b><span  style={{color:getStatusColor(`${s.status}`)}}>{`${s.status}`}</span></b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>{s.point}</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>{s.createAt}</b>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              }
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

          <Grid item >
            <Pagination
              className="my-3"
              count={totalPageSubmission}
              page={pageSubmission}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={(event, value) =>{
                setPageSubmission(value);
                getSubmission(pageSubmissionSize, value);
              }}
            />
          </Grid>
        </Grid>
      </TabPanelVertical>



    </div>
  );
}

function RegisteredTable(props){
  const {successful, pageSuccessful, pageSuccessfulSize, load} = props;
  if(load){
    return(
      <div>
        <TableContainer component={Paper}>
          <Table sx={{minWidth:window.innerWidth-500}}  aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">User Name</StyledTableCell>
                <StyledTableCell align="center">Full Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                successful.map((s, index) =>(
                  <StyledTableRow>
                    <StyledTableCell>
                      <b>{index+1+(pageSuccessful-1)*pageSuccessfulSize}</b>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <b>{s.userName}</b>

                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <b>{s.firstName}{" "}{s.middleName}{" "}{s.lastName}</b>

                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <b>{s.email}</b>
                    </StyledTableCell>

                  </StyledTableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }else{
    return (
      <div></div>
    );
  }

}