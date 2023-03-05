import React, { useState } from "react";
import { request } from "../../../../api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import {makeStyles} from "@material-ui/core/styles";
import {errorNoti, successNoti} from "../../../../utils/notification";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  formInput: {
    width: '100%',
    marginTop: '10px !important'
  }
}))

export default function CreateSessionQuizTestDlg(props) {
  const classes = useStyles();
  const { sessionId, open, setOpen, onCreateSuccess } = props;
  const [testId, setTestId] = useState(null);
  const [testName, setTestName] = useState(null);


  function validateForm() {
    if (!testId || !testId.trim()) {
      errorNoti("Vui lòng nhập mã quiz test!", true);
      return false;
    }
    if (!testName || !testName.trim()) {
      errorNoti("Vui lòng nhập tên quiz test!", true);
      return false;
    }
    return true;
  }

  function createQuizTestForClassSession() {
    if (!validateForm()) { return; }

    let sessionQuizTest = { sessionId, testId, testName, duration: 60 };
    let successHandler = res => {
      successNoti("Tạo mới quiz test thành công. Xem kết quả trên giao diện!", true);
      onCreateSuccess(res)
      setOpen(false);
    }
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi. Vui lòng kiểm tra lại!", true)
    }
    request("POST", "edu/class/add-a-quiz-test-of-class-session", successHandler, errorHandlers, sessionQuizTest);
  }

  return (
    <Dialog {...props} open={open} onClose={() => setOpen(false)} >
      <DialogTitle>Thêm quiz test cho buổi học</DialogTitle>

      <DialogContent>
        <TextField
          label="Mã quiz test" required
          className={classes.formInput}
          onChange={e => setTestId(e.target.value)}/>
        <TextField
          label="Tên quiz test" required
          className={classes.formInput}
          onChange={e => setTestName(e.target.value)} />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={createQuizTestForClassSession}>Lưu</Button>
        <Button variant="outlined" onClick={() => setOpen(false)}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

const noOp = (...args) => {};

CreateSessionQuizTestDlg.propTypes = {
  sessionId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onCreateSuccess: PropTypes.func
}

CreateSessionQuizTestDlg.defaultProps = {
  onCreateSuccess: noOp
}


