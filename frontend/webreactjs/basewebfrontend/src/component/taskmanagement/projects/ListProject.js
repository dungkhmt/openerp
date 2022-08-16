import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Grid, IconButton } from "@material-ui/core";
import ApartmentIcon from '@mui/icons-material/Apartment';
import {
  Button,
  Typography,
  CircularProgress,
  Stack,
  Pagination
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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  const url = `/projects/page=${page - 1}/size=5`;

  useEffect(() => {
    request('get', url, res => {
      setLoading(false);
      setProjects(res.data.data);
      setTotal(res.data.totalPage);
    }, err => {
      console.log(err);
    });
  }, [url]);
  
  return (
    <>
      <Box sx={boxComponentStyle}>
        <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
          <Typography variant="h4" mb={4} component={'h4'}>
            Danh sách dự án
          </Typography>
          <Link to="/taskmanagement/project/type/create" style={{ textDecoration: "none" }} ><Button variant="contained" color="primary" sx={{ mr: 3 }}>Thêm mới dự án</Button></Link>
        </Box>
        {loading &&
          // <Box sx={{ display: 'flex' }}>
          //   <CircularProgress />
          // </Box>
          <p>Loading...</p>
        }
        {projects && projects.map((item) => (
          <ProjectItem key={item.id} id={item.id} name={item.name} />
        ))}
      </Box>
      <Box display={'flex'} justifyContent="center">
        <Stack spacing={2}>
          <Pagination
            count={total}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      </Box>
    </>
  );
}
