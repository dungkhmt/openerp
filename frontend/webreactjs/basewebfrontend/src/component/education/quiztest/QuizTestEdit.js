import DateFnsUtils from "@date-io/date-fns";
import { Button, Card, Grid, TextField, MenuItem } from "@material-ui/core/";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";

const styles = {
  label: {
    fontSize: "20px",
    fontWeight: "lighter",
  },

  descStyle: {
    fontSize: "20px",
    fontWeight: "lighter",
  },

  ansStyle: {
    fontSize: "18px",
    fontWeight: "lighter",
    paddingTop: "15px",
    paddingBottom: "30px",
    paddingLeft: "30px",
  },

  subAnsStyle: {
    fontSize: "18px",
    fontWeight: "lighter",
    paddingBottom: "10px",
  },
};

function QuizTestEdit() {
  let param = useParams();
  let testId = param.id;
  const history = useHistory();
  //const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [quizTest, setQuizTest] = useState(null);
  const [duration, setDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [questionStatementViewTypeId, setQuestionStatementViewTypeId] =
    useState(null);
  const [listQuestionStatementViewTypeId, setListQuestionStatementViewTypeId] =
    useState([]);
  const [
    participantQuizGroupAssignmentMode,
    setParticipantQuizGroupAssignmentMode,
  ] = useState(null);
  const [
    listParticipantQuizGroupAssignmentMode,
    setListParticipantQuizGroupAssignmentMode,
  ] = useState([]);

  const handleChangeDuration = (e) => {
    setDuration(e.target.value);
  };
  const handleDateChange = (event) => {
    setSelectedDate(event);
  };

  function getListParticipantQuizGroupAssignmentMode() {
    request(
      // token,
      // history,
      "get",
      "get-list-participant-quizgroup-assignment-mode",
      (res) => {
        console.log(
          "get-list-participant-quizgroup-assignment-mode res = ",
          res
        );
        setListParticipantQuizGroupAssignmentMode(res.data);

        //alert('assign questions to groups OK');
      },
      { 401: () => {} }
    );
  }
  function getListQuestionStatementViewTypeId() {
    request(
      // token,
      // history,
      "get",
      "get-list-question-statement-view-type-id",
      (res) => {
        console.log("get-list-question-statement-view-type-id res = ", res);
        setListQuestionStatementViewTypeId(res.data);

        //alert('assign questions to groups OK');
      },
      { 401: () => {} }
    );
  }
  async function getQuizTestDetail() {
    request(
      // token,
      // history,
      "get",
      "get-quiz-test?testId=" + testId,
      (res) => {
        console.log(res);
        setQuizTest(res.data);
        setDuration(res.data.duration);
        setSelectedDate(res.data.scheduleDatetime);
        setQuestionStatementViewTypeId(res.data.questionStatementViewTypeId);
        setParticipantQuizGroupAssignmentMode(
          res.data.participantQuizGroupAssignmentMode
        );
        //alert('assign questions to groups OK');
      },
      { 401: () => {} }
    );
  }

  function handleOpenQuizTest() {
    request(
      // token,
      // history,
      "get",
      "open-quiz-test/" + testId,
      (res) => {
        console.log(res);
        //alert('assign questions to groups OK');
      },
      { 401: () => {} }
    );
    history.push("/edu/class/quiztest/detail/" + testId);
  }

  function handleHideQuizTest() {
    request(
      // token,
      // history,
      "get",
      "hide-quiz-test/" + testId,
      (res) => {
        console.log(res);
        //alert('assign questions to groups OK');
      },
      { 401: () => {} }
    );
    history.push("/edu/class/quiztest/detail/" + testId);
  }
  function handleSubmit() {
    let datasend = {
      testId: testId,
      scheduleDate: selectedDate,
      duration: duration,
      questionStatementViewTypeId: questionStatementViewTypeId,
      participantQuizGroupAssignmentMode: participantQuizGroupAssignmentMode,
    };
    request(
      // token,
      // history,
      "post",
      "update-quiz-test",
      (res) => {
        console.log(res);
        //alert('assign questions to groups OK');
      },
      { 401: () => {} },
      datasend
    );
    console.log(datasend);

    history.push("/edu/class/quiztest/detail/" + testId);
  }
  useEffect(() => {
    getListQuestionStatementViewTypeId();
    getListParticipantQuizGroupAssignmentMode();
    getQuizTestDetail();
  }, []);

  return (
    <Grid container spacing={1} justify="center">
      <Card
        style={{
          padding: "3% 10% 7% 10%",
          minWidth: "1024px",
        }}
      >
        Status: {quizTest ? quizTest.statusId : ""}
        <form noValidate autoComplete="off">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={10}>
              <Grid item xs={4}>
                <div style={styles.label}>Ngày thi </div>
              </Grid>
              <Grid item xs={4}>
                <div style={styles.label}>Giờ thi </div>
              </Grid>
              <Grid item xs={4}>
                <div style={styles.label}>Thời gian làm bài </div>
              </Grid>
            </Grid>
            <div style={{ marginTop: "-80px" }}>
              <Grid container spacing={10}>
                <Grid item xs={4}>
                  <KeyboardDatePicker
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="Chọn ngày thi"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <KeyboardTimePicker
                    margin="normal"
                    label="Chọn giờ thi"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Tính bằng phút"
                    placeholder="90"
                    style={{ marginTop: "15px" }}
                    fullWidth
                    onChange={handleChangeDuration}
                    value={duration}
                    type="number"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    autoFocus
                    // required
                    select
                    id="questionStatementViewTypeId"
                    label="QuestionStatementViewType"
                    placeholder="QuestionStatementViewType"
                    onChange={(event) => {
                      setQuestionStatementViewTypeId(event.target.value);
                    }}
                    value={questionStatementViewTypeId}
                  >
                    {listQuestionStatementViewTypeId.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    autoFocus
                    // required
                    select
                    id="participantQuizGroupAssignmentMode"
                    label="participantQuizGroupAssignmentMode"
                    placeholder="participantQuizGroupAssignmentMode"
                    onChange={(event) => {
                      setParticipantQuizGroupAssignmentMode(event.target.value);
                    }}
                    value={participantQuizGroupAssignmentMode}
                  >
                    {listParticipantQuizGroupAssignmentMode.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </div>

            {/* <div style={styles.label}>Ngày thi </div> */}
          </MuiPickersUtilsProvider>
        </form>
        <div style={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={(e) => {
              handleSubmit();
            }}
          >
            Lưu
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={(e) => {
              handleOpenQuizTest();
            }}
          >
            Mở
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={(e) => {
              handleHideQuizTest();
            }}
          >
            Ẩn
          </Button>
        </div>
      </Card>
    </Grid>
  );
}

export default QuizTestEdit;
