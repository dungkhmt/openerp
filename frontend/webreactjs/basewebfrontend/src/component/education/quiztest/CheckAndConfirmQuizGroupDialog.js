//import { makeStyles } from "@mui/styles"; //"@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

import { TextField, MenuItem } from "@mui/material";
import PrimaryButton from "component/button/PrimaryButton";
import TertiaryButton from "component/button/TertiaryButton";
import CustomizedDialogs from "component/dialog/CustomizedDialogs";
import React, { useState } from "react";
import StudentQuizDetailCheckQuizGroupForm from "./StudentQuizDetailCheckQuizGroupForm";
const useStyles = makeStyles((theme) => ({
  dialogContent: {
    minWidth: 480,
    minHeight: 64,
  },
  btn: { margin: "4px 8px" },
}));
export default function CheckAndConfirmQuizGroupDialog(props) {
  const {
    open,
    onClose,
    onUpdateInfo,
    questions,
    quizGroupTestDetail,
    checkState,
  } = props;
  const classes = useStyles();
  return (
    <CustomizedDialogs
      open={open}
      handleClose={onClose}
      title={`Update Permission`}
      // contentTopDivider
      content={
        <div>
          <StudentQuizDetailCheckQuizGroupForm
            questions={questions}
            quizGroupTestDetail={quizGroupTestDetail}
            checkState={checkState}
          />
        </div>
      }
      actions={
        <>
          <TertiaryButton className={classes.btn} onClick={onClose}>
            Huỷ
          </TertiaryButton>
          <PrimaryButton className={classes.btn} onClick={() => onUpdateInfo()}>
            Cập nhật
          </PrimaryButton>
        </>
      }
      classNames={{ content: classes.dialogContent }}
    />
  );
}
