import {Alert, Typography} from "@mui/material";
import React from "react";

export const AlertSuccessProp = {
  variant: "success", anchorOrigin: {
    vertical: "top", horizontal: "center",
  }, content: (key, message) => {
    <Alert
      variant="filled"
      severity={"success"}
      style={{width: 800, justifyContent: "center"}}
    >
      <Typography>{message}</Typography>
    </Alert>;
  },
};

export const AlertErrorProp = {
  variant: "error", anchorOrigin: {
    vertical: "top", horizontal: "right",
  }, content: (key, message) => {
    <Alert
      variant="filled"
      severity={"error"}
      style={{width: 800, justifyContent: "center"}}
    >
      <Typography>{message}</Typography>
    </Alert>;
  },
};

export const AlertWarningProp = {
  variant: "warning", anchorOrigin: {
    vertical: "top", horizontal: "right",
  }, content: (key, message) => {
    <Alert
      variant="filled"
      severity={"warning"}
      style={{width: 800, justifyContent: "center"}}
    >
      <Typography>{message}</Typography>
    </Alert>;
  },
};

export const AlertInfoProp = {
  variant: "info", anchorOrigin: {
    vertical: "top", horizontal: "left",
  }, content: (key, message) => {
    <Alert
      variant="filled"
      severity={"info"}
      style={{width: 800, justifyContent: "center"}}
    >
      <Typography>{message}</Typography>
    </Alert>;
  },
};

