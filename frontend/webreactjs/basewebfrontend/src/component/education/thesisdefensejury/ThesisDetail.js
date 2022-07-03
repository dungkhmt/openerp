import * as React from "react";
import { Link, useParams, NavLink } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { request } from "../../../api";
import Typography from "@mui/material/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@mui/material/Table";
import { useHistory } from "react-router-dom";
import { Button, TableHead, CircularProgress } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { getColorLevel, StyledTableCell, StyledTableRow } from "../programmingcontestFE/lib";
import TableBody from "@mui/material/TableBody";

export default function ThesisDetail(props) {
    const params = useParams();
    const history = useHistory();
  const defensePlanId = props.defensePlanId;
  const [name, setName] = useState();
  const [thesisAbstract,setThesisAbstract] = useState();
  const [programName,setProgramName] =  useState();
  const [thesisPlanName,setThesisPlanName] = useState();
  const [studentName,setStudentName] = useState();
  const [supervisorName,setSupervisorName] =  useState();
  const [juryName,setJuryName] = useState();
  const [keyword,setKeyword] = useState();
  const [createdTime,setCreatedTime] = useState();
  const [thesis,setThesis] = useState([]);

  async function getAllThesis() {
    request(
      // token,
      // history,
      "GET",
      `/thesis/${params.id}`,
      (res) => {
          console.log(res.data)
        setThesis([res.data]);
        setName(res.data.name)
      }
    );
  }
  useEffect(() => {
    getAllThesis()
  }, []);

  const handleEdit = () => {
    history.push({
      pathname: `/thesis/edit/${thesis[0].id}`,
      state:{
        thesisID: params.id
      }
    });
    
  };

  return (
    <div>
      <Typography variant="h4" component="h2">
        Thesis: {name}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: window.innerWidth - 500 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Mô tả</StyledTableCell>
              <StyledTableCell>Tên người tạo</StyledTableCell>
              <StyledTableCell>Tên người hướng dẫn</StyledTableCell>
              <StyledTableCell>Tên HĐ</StyledTableCell>
              <StyledTableCell>Tên chương trình đào tạo</StyledTableCell>
              <StyledTableCell>Keyword</StyledTableCell>
              <StyledTableCell align="center">Ngày tạo</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {thesis.map((ele, index) => (
              <StyledTableRow>
                <StyledTableCell>
                  <b>{ele.thesis_abstract}</b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{ele.student_name} </b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{ele.supervisor_name} </b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{ele.defense_jury_name} </b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{ele.program_name} </b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{ele.keyword} </b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                    <b>{ele.createdTime} </b>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                <Button  color="primary" onClick={handleEdit}>
                  Edit
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
