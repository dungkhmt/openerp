import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Box, Grid, IconButton } from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Typography
} from "@mui/material";
import {
  boxComponentStyle,
  boxChildComponent,
  centerBox
} from "../ultis/constant";
import { request } from "../../../api";
import ProjectItem from "./ProjectItem";
export default function ListProject() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    request('get', '/projects', res => {
      console.log(res.data);
      setLoading(false);
      setProjects(res.data);
    }, err => {
      console.log(err);
    });
  }, []);
  console.log('render');
  return (
    <>
      <Box sx={boxComponentStyle}>
        <Grid container >
          <Grid item={true} xs={7}>
            <Typography variant="h4" mb={4} component={'h4'}>
              Danh sách dự án mới
            </Typography>
          </Grid>
          <Grid item={true} xs={5}>
            <Link to="/taskmanagement/project/type/create" style={{ textDecoration: "none" }} ><Button variant="contained" color="primary" sx={{ mr: 3 }}>Thêm mới dự án</Button></Link>
            <Link to="/taskmanagement/project/members/add" style={{ textDecoration: "none" }} ><Button variant="contained" color="primary">Thêm thành viên dự án</Button></Link>
          </Grid>
        </Grid>
        {loading && <p>Loading...</p>}
        {projects && projects.map((item) => (
          <ProjectItem key={item.id} id={item.id} name={item.name} />
        ))}
      </Box>
    </>
  );
}
