import { Card, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";
import Quiz from "./Quiz";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    //color: theme.palette.text.secondary,
    color: "black",
    borderRadius: "20px",
    //background: "beige",
    background: "#EBEDEF",
  },
}));

export default function StudentQuizDetailStep() {
  const history = useHistory();
  const testQuizId = history.location.state?.testId;
  const classes = useStyles();

  //
  const [questions, setQuestions] = useState([]);
  const [requestSuccessfully, setRequestSuccessfully] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [messageRequest, setMessageRequest] = useState(false);
  const [quizGroupTestDetail, setQuizGroupTestDetail] = useState({});

  // Keep track of checking state of all choices of all quiz
  const checkState = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  function handleNextQuestionClick() {
    let i = currentIndex;
    setCurrentIndex(i + 1);
    setQuestion(questions[i + 1]);
  }
  function handlePrevQuestionClick() {
    let i = currentIndex;
    setCurrentIndex(i - 1);
    setQuestion(questions[i]);
  }
  function getQuestionList() {
    request(
      "get",
      "/get-quiz-test-participation-group-question/" + testQuizId,
      (res) => {
        const {
          listQuestion,
          participationExecutionChoice,
          ...quizGroupTestDetail
        } = res.data;

        setQuestions(listQuestion);
        setQuestion(listQuestion[currentIndex]);
        setQuizGroupTestDetail(quizGroupTestDetail);

        // Restore test result
        // TODO: optimize code
        const chkState = [];

        listQuestion.forEach((question) => {
          const choices = {};
          const choseAnswers =
            participationExecutionChoice[question.questionId];

          question.quizChoiceAnswerList.forEach((ans) => {
            choices[ans.choiceAnswerId] = false;
          });

          choices.submitted = false;
          if (choseAnswers) {
            choseAnswers.forEach((choseAnsId) => {
              choices[choseAnsId] = true;
            });

            choices.submitted = true;
          }

          chkState.push(choices);
        });

        checkState.set(chkState);
      },
      {
        401: () => {},
        406: () => {
          setMessageRequest("Quá thời gian làm bài!");
          setRequestFailed(true);
        },
      }
    );
  }

  const onSave = (order, questionId, choseAnswers) => {
    request(
      "post",
      "/quiz-test-choose_answer-by-user",
      (res) => {
        checkState[order].submitted.set(true);
        setMessageRequest("Đã lưu vào hệ thống!");
        setRequestSuccessfully(true);
      },
      {
        400: () => {
          setMessageRequest("Không được để trống!");
          setRequestFailed(true);
        },
        406: () => {
          setMessageRequest("Quá thời gian làm bài!");
          setRequestFailed(true);
        },
      },
      {
        testId: testQuizId,
        questionId: questionId,
        quizGroupId: quizGroupTestDetail.quizGroupId,
        chooseAnsIds: choseAnswers,
      }
    );
  };

  useEffect(() => {
    getQuestionList();
  }, []);

  return (
    <div>
      {currentIndex > 0 ? (
        <Button onClick={handleNextQuestionClick}>Next</Button>
      ) : (
        ""
      )}
      {currentIndex < questions.length ? (
        <Button onClick={handlePrevQuestionClick}>Prev</Button>
      ) : (
        ""
      )}
      {question && checkState[currentIndex] ? (
        <Quiz
          key={question.questionId}
          question={question}
          choseAnswers={checkState[currentIndex]}
          order={currentIndex}
          onSave={onSave}
        />
      ) : (
        ""
      )}
    </div>
  );
}
