import React, { useEffect, useState } from "react";
import { request } from "./Request";
import { API_URL } from "../../../config/config";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TextField,
} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import { StyledTableCell, StyledTableRow } from "./lib";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import MaterialTable from "material-table";

export function ListContestManagerByRegistration() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPage] = useState(0);
  const pageSizes = [20, 50, 100];
  const [contests, setContests] = useState([]);

  const columns = [
    {
      title: "Name",
      field: "contestName",
      render: (rowData) => (
        <Link
          to={{
            pathname:
              "/programming-contest/contest-manager/" + rowData["contestId"],
          }}
        >
          {rowData["contestId"]}
        </Link>
      ),
    },
    { title: "Created By", field: "userId" },
    { title: "Created Date", field: "createdAt" },
    { title: "Contest Status", field: "statusId" },
    { title: "Role", field: "roleId" },
    { title: "Reg. Status", field: "registrationStatusId" },
  ];
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    // getProblemContestList();
  };

  function getContestListByUserRole() {
    request("get", "/get-contest-by-user-role", (res) => {
      setContests(res.data);
    }).then();
  }
  async function getContestList() {
    request(
      "get",
      "/get-contest-paging-by-user-manager?size=" +
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

  /*
  useEffect(() => {
    console.log("use effect");
    getContestList().then();
  }, [page, pageSize]);
  */
  useEffect(() => {
    getContestListByUserRole();
  }, []);

  return (
    <div>
      <MaterialTable
        title="DS Contests được phân quyền"
        columns={columns}
        data={contests}
      ></MaterialTable>
    </div>
  );
}
