import { Grid, TableHead } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import XLSX from "xlsx";
import { StyledTableCell, StyledTableRow } from "./lib";
import { request } from "./Request";

export default function ContestManagerRankingNew(props) {
  const contestId = props.contestId;
  const [ranking, setRanking] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const downloadHandler = (event) => {
    if (ranking.length === 0) {
      return;
    }

    var wbcols = [];

    wbcols.push({ wpx: 50 });
    let numOfProblem = ranking[0].mapProblemsToPoints.length;
    for (let i = 0; i < numOfProblem; i++) {
      wbcols.push({ wpx: 20 });
    }
    wbcols.push({ wpx: 40 });

    let datas = [];

    for (let i = 0; i < ranking.length; i++) {
      let data = {};
      data["Username"] = ranking[i].userId;
      for (let j = 0; j < numOfProblem; j++) {
        const problem = ranking[i].mapProblemsToPoints[j].problemId;
        const problemPoint = ranking[i].mapProblemsToPoints[j].point;
        data[problem] = problemPoint;
      }
      data["TOTAL"] = ranking[i].totalPoint;

      datas[i] = data;
    }

    var sheet = XLSX.utils.json_to_sheet(datas);
    var wb = XLSX.utils.book_new();
    sheet["!cols"] = wbcols;

    XLSX.utils.book_append_sheet(wb, sheet, "ranking");
    XLSX.writeFile(wb, contestId + "-RANKING.xlsx");
  };

  const handlePageRankingSizeChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  function getRanking() {
    request("get", "/get-ranking-contest-new/" + contestId, (res) => {
      setRanking(res.data.sort((a, b) => b.totalPoint - a.totalPoint));
    }).then();
  }

  useEffect(() => {
    getRanking();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          width: "600px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Contest Ranking</Typography>
        <Button variant="contained" onClick={downloadHandler}>
          Export
        </Button>
      </Box>

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
                {ranking.length > 0 &&
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
                <StyledTableCell align="center">
                  <b>TOTAL</b>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ranking.length > 0 &&
                ranking.map(
                  (element, index) =>
                    index < rowsPerPage && (
                      <StyledTableRow>
                        <StyledTableCell>
                          <b>{index + 1 + page * rowsPerPage}</b>
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <b>{element.userId}</b>
                        </StyledTableCell>

                        {element.mapProblemsToPoints.map((problem) => {
                          return (
                            <StyledTableCell align="center">
                              {problem.point}
                            </StyledTableCell>
                          );
                        })}
                        <StyledTableCell align="center">
                          <b>{element.totalPoint}</b>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={12}>
          <Grid item>
            <TablePagination
              shape="rounded"
              count={ranking.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(event, value) => {
                setPage(value);
              }}
              onRowsPerPageChange={handlePageRankingSizeChange}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}