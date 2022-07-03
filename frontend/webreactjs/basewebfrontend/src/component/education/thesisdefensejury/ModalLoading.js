import {
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Fade,
    makeStyles,
    Modal,
    TextField,
  } from "@material-ui/core";
  import Alert from '@mui/material/Alert';
  import React, { useEffect, useState } from "react";
  import * as yup from "yup";
  import axios from "axios";
  import LoadingSpinner from "./load/LoadingSpinner";
  
  
  
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      minWidth: 400,
    },
    action: {
      display: "flex",
      justifyContent: "center",
    },
    error: {
      textAlign: "center",
      color: "red",
      marginTop: theme.spacing(2),
    },
  }));
  
  
  export default function ModalLoading({ openLoading }) {
    const classes = useStyles();

    return (
      <Modal
        className={classes.modal}
        open={openLoading}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openLoading}>
            <LoadingSpinner />
        </Fade>
      </Modal>
    );
  }