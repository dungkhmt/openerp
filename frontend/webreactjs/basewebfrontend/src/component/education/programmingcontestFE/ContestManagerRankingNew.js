import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import {
  Button,
  Grid,
  MenuItem,
  TableHead,
  TextField,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import TableBody from "@mui/material/TableBody";
import { StyledTableCell, StyledTableRow } from "./lib";
import { request } from "./Request";
import { Box } from "@mui/material";

export default function ContestManagerRankingNew(props) {
  const contestId = props.contestId;
  const [pageRanking, setPageRanking] = useState(1);
  const [ranking, setRanking] = useState();
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
      "/get-ranking-contest-new/" +
        contestId +
        "?size=" +
        s +
        "&page=" +
        (p - 1),
      (res) => {
        console.log("ranking ", res.data);
        setTotalPageRanking(res.data.totalPages);
        setRanking(res.data);
      }
    ).then();
  }

  useEffect(() => {
    getRanking(pageRankingSize, 1);
  }, []);

  return (
    <Box>
      <Typography variant="h5">Contest Ranking</Typography>
      <Box>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: window.innerWidth - 500 }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">Username</StyledTableCell>
                {ranking && console.log(ranking[0])}
                {ranking &&
                  ranking[0].mapProblemsToPoints.map((problem) => {
                    return (
                      <StyledTableCell
                        sx={{ color: "yellow !important" }}
                        align="center"
                      >
                        {problem.problemId}
                      </StyledTableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {ranking.map((element, index) => (
                <StyledTableRow>
                  <StyledTableCell>
                    <b>{index + 1 + (pageRanking - 1) * pageRankingSize}</b>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {element.userId}
                  </StyledTableCell>

                  {element.mapProblemsToPoints.map((problem) => {
                    return (
                      <StyledTableCell
                        align="center"
                      >
                        {problem.point}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
