import React from "react";
import { Link } from "react-router-dom";
import AndroidIcon from '@mui/icons-material/Android';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Grid } from "@material-ui/core";
import {
  Button,
  Typography
} from "@mui/material";
import {
  boxComponentStyle,
  boxChildComponent,
  centerBox
} from "./ultis/constant";
import { request } from "../../api";

export default function ListProject() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const domain = "http://localhost:8080";
  useEffect(() => {
    request('get', '/projects', res => {
      console.log(res.data);
      setLoading(false);
      setProjects(res.data);
    }, err => {
      console.log(err);
    });
  }, []);
  return (
    <>
      <Box sx={boxComponentStyle}>
        <Grid container >
          <Grid item={true} xs={8}>
            <Typography variant="h4" mb={4} component={'h4'}>
              Danh sách dự án mới
            </Typography>
          </Grid>
          <Grid item={true} xs={4}>
            <Link to="/taskmanagement/project/create" style={{ textDecoration: "none" }} ><Button variant="contained" color="primary" sx={{ mr: 3 }}>Thêm mới dự án</Button></Link>
            <Link to="/taskmanagement/project/members/add" style={{ textDecoration: "none" }} ><Button variant="contained" color="primary">Thêm thành viên dự án</Button></Link>
          </Grid>
        </Grid>
        {loading && <p>Loading...</p>}
        {projects && projects.map((item) => (
          <Box sx={boxChildComponent} key={item.id} mb={3}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={centerBox}>
                <AccountTreeIcon />
              </Box>
              <Box px={3}>
                <Link to={`/taskmanagement/project/${item.id}/tasks`} style={{ textDecoration: 'none', color: "#000" }}>
                  <Typography variant="h6" component={'h6'}>
                    {item.name}
                  </Typography>
                </Link>
                <Box>
                  <Link to="/taskmanagement/project/tasks/create" style={{ textDecoration: 'none', marginRight: "15px" }}>Add issues</Link>
                  <Link to="#" style={{ textDecoration: 'none', marginRight: "15px" }}>List Issues</Link>
                  <Link to="#" style={{ textDecoration: 'none', marginRight: "15px" }}>Boards</Link>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
