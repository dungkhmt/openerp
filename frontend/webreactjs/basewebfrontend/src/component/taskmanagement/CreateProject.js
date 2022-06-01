import React, { useEffect } from "react";
import { useState, forwardRef } from "react";
import { useHistory } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Button
} from '@mui/material';

import {
  TextField
} from '@material-ui/core';
import {
  boxComponentStyle,
  boxChildComponent
} from './ultis/constant';
import { request } from "../../api";
import BasicAlert from "./alert/BasicAlert";
import { useForm } from "react-hook-form";

export default function CreateProject() {
  const [openModal, setOpenModal] = useState(false);
  const [typeAlert, setTypeAlert] = useState("success");
  const [message, setMessage] = useState("Đã thêm mới thành công");

  const {
    register,
    handleSubmit,
    errors,
    setValue
  } = useForm();

  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenModal(false);
  };

  const onSubmit = (data) => {
    console.log(data);
    request(
      "post",
      "/projects",
      (res) => {
        setOpenModal(true);
        setTypeAlert("success");
        setMessage("Đã thêm mới thành công");
        setTimeout(() => {
          history.push('/taskmanagement/project/list');
        }, 1000);
      },
      {},
      data
    );
  }

  return (
    <>
      <Box sx={boxComponentStyle}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" mb={4} component={'h4'}> 
            Thêm dự án mới
          </Typography>
        </Box>
        <Box sx={boxChildComponent}>
          <Box>
            <Box mb={3}>
              <Typography variant="h6" component={"h6"}>
                Tên dự án *
              </Typography>
              <TextField
                fullWidth={true}
                autoFocus
                placeholder="Điền tên dự án ..."
                variant="standard"
                name="name"
                inputRef={register({ required: "Thiếu tên dự án!" })}
                helperText={errors.name?.message}
              />
            </Box>
            <Box mb={3}>
              <Typography variant="h6" component={"h6"}>
                Mã dự án *
              </Typography>
              <TextField
                fullWidth={true}
                placeholder="Điền mã dự án ..."
                variant="standard"
                name="code"
                inputRef={register({
                  required: "Thiếu mã dự án!"
                })}
                helperText={errors.code?.message}
              />
            </Box>
            <Box mb={3} backgroundColor={"#EEE"}>
              <Typography paragraph={true} px={2}>
                The project key is a unique identifier for a project. A short, concise key is recommended.
                (e.g. Project name Backlog has project key BLG_2) Uppercase letters (A-Z), numbers (0-9) and underscore (_) can be used.
              </Typography>
            </Box>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleSubmit(onSubmit)}>Submit</Button>
          </Box>
        </Box>
      </Box>
      <BasicAlert
        openModal={openModal}
        handleClose={handleClose}
        typeAlert={typeAlert}
        message={message}
      />
    </>
  );
}
