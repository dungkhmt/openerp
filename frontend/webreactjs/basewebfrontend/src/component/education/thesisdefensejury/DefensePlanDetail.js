import * as React from "react";
import { Link, useParams, NavLink } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { request } from "../../../api";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";

import { Button, TableHead, CircularProgress } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { getColorLevel, StyledTableCell, StyledTableRow } from "../programmingcontestFE/lib";
import TableBody from "@mui/material/TableBody";

export default function DefensePlanDetail(props) {
  const defensePlanId = props.defensePlanId;
  const [planName, setPlanName] = useState();
  const [contestTime, setContestTime] = useState();
  const [defensePlan, setDefensePlan] = useState([]);

  async function getDefensePlanDetail() {
    console.log("defensePlanId",defensePlanId)
    request(
      // token,
      // history,
      "GET",
      `/thesis_defense_plan/${defensePlanId}`,
      (res) => {
          console.log(res.data)
          setDefensePlan([res.data.result])
      }
    );
  }
  useEffect(() => {
    getDefensePlanDetail()
  }, []);

 

  return (
    <div>
      <Typography variant="h4" component="h2">
        Tên đợt bảo vệ: {planName}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: window.innerWidth - 500 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Tên</StyledTableCell>
              <StyledTableCell align="center">Thời gian tạo</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {defensePlan.map((plan, index) => (
              <StyledTableRow>
                <StyledTableCell>
                  <b>{plan.id}</b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <b>{plan.name}</b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{plan.createdTime} </b>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
