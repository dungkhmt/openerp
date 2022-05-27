import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";

import {
  Button,
  Grid,
  MenuItem,
  Tab,
  TableHead,
  Tabs,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { StyledTableCell, StyledTableRow } from "./lib";
import TableBody from "@mui/material/TableBody";
import { request } from "./Request";
import Pagination from "@material-ui/lab/Pagination";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";

export default function ContestManagerRanking(props) {
  const contestId = props.contestId;
  const [load, setLoad] = useState(true);
  const [pageRanking, setPageRanking] = useState(1);
  const [ranking, setRanking] = useState([]);
  const [totalPageRanking, setTotalPageRanking] = useState(0);
  const [pageRankingSize, setPageRankingSize] = useState(10);
  const pageSizes = [10, 20, 50, 100, 150];

  const handlePageRankingSizeChange = (event) => {
    setPageRankingSize(event.target.value);
    setPageRanking(1);
    getRanking(event.target.value, 1);
  };
  function getRanking(s, p) {
    request(
      "get",
      "/get-ranking-contest/" + contestId + "?size=" + s + "&page=" + (p - 1),
      (res) => {
        console.log("ranking ", res.data);
        setTotalPageRanking(res.data.totalPages);
        setRanking(res.data.content);
      }
    ).then();
  }
  function recalculatedRanking() {
    request("post", "/recalculate-ranking/" + contestId).then(() => {
      getRanking(pageRankingSize, pageRanking);
    });
  }

  useEffect(() => {
    getRanking(pageRankingSize, 1);
  }, []);
  return (
    <div>
      <div>
        <section id={"#ranking"}>
          <Typography
            variant="h5"
            component="h2"
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            Contest Ranking
          </Typography>
        </section>

        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: window.innerWidth - 500 }}
            aria-label="customized table"
          >
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
              {ranking.map((s, index) => (
                <StyledTableRow>
                  <StyledTableCell>
                    <b>{index + 1 + (pageRanking - 1) * pageRankingSize}</b>
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
              ))}
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

          <Grid item>
            <Pagination
              className="my-3"
              count={totalPageRanking}
              page={pageRanking}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={(event, value) => {
                setPageRanking(value);
                getRanking(pageRankingSize, value);
              }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="light"
          style={{ marginLeft: "45px" }}
          onClick={recalculatedRanking}
        >
          Recalculate Ranking
        </Button>
      </div>
    </div>
  );
}
