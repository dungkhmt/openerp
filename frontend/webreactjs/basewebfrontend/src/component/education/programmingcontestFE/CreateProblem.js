import { cppLanguage } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { pythonLanguage } from "@codemirror/lang-python";
import { go } from "@codemirror/legacy-modes/mode/go";
import { StreamLanguage } from "@codemirror/stream-parser";
import DateFnsUtils from "@date-io/date-fns";
import { Button } from "@material-ui/core";
import {
  Card,
  CardActions,
  CardContent, MenuItem, TextField,
  Typography
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useHistory } from "react-router-dom";
import { CompileStatus } from "./CompileStatus";
import { sleep } from "./lib";
import { request } from "./Request";
import { SubmitSuccess } from "./SubmitSuccess";
import { SubmitWarming } from "./SubmitWarming";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "40%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));
const descriptionStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

const editorStyle = {
  toolbar: {
    background: "#FFFFFF",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

function CreateProblem() {
  const history = useHistory();
  const [problemId, setProblemID] = useState();
  const [problemName, setProblemName] = useState();
  const [problemDescriptions, setProblemDescription] = useState();
  const [timeLimit, setTimeLimit] = useState();
  const [memoryLimit, setMemoryLimit] = useState();
  const [levelId, setLevelId] = useState();
  const [categoryId, setCategoryId] = useState();
  const defaultLevel = ["easy", "medium", "hard"];
  const listCategory = [];
  const classes = useStyles();
  const descriptionClass = descriptionStyles();
  const [editorStateDescription, setEditorStateDescription] = useState(
    EditorState.createEmpty()
  );
  const [editorStateSolution, setEditorStateSolution] = useState(
    EditorState.createEmpty()
  );
  const [codeSolution, setCodeSolution] = useState("");
  const [languageSolution, setLanguageSolution] = useState("CPP");
  const [solutionChecker, setSolutionChecker] = useState("");
  const [solutionCheckerLanguage, setSolutionCheckerLanguage] = useState("CPP");
  const computerLanguageList = ["CPP", "GOLANG", "JAVA", "PYTHON3"];
  const [showSubmitWarming, setShowSubmitWarming] = useState(false);
  const [showCompile, setShowCompile] = useState(false);
  const [statusSuccessful, setStatusSuccessful] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [compileMessage, setCompileMessage] = useState("");
  const onChangeEditorStateDescription = (editorState) => {
    console.log(problemDescriptions);
    setEditorStateDescription(editorState);
  };

  const onChangeEditorStateSolution = (editorState) => {
    setEditorStateSolution(editorState);
  };

  const getExtension = () => {
    switch (languageSolution) {
      case "CPP":
        return [cppLanguage];
      case "GoLang":
        return StreamLanguage.define(go);
      case "Java":
        return java();
      case "Python3":
        return StreamLanguage.define(pythonLanguage);
      default:
        return javascript();
    }
  };

  function checkCompile() {
    console.log("check compile");
    let body = {
      source: codeSolution,
      computerLanguage: languageSolution,
    };

    request(
      "post",
      "/check-compile",
      (res) => {
        console.log("res check compile", res);
        if (res.data.status == "Successful") {
          setShowCompile(true);
          setShowSubmitWarming(false);
          setStatusSuccessful(true);
        } else {
          setShowCompile(true);
          setStatusSuccessful(false);
        }
        setCompileMessage(res.data.message);
      },
      {},
      body
    ).then();
  }

  function handleSubmit() {
    if (!statusSuccessful) {
      setShowSubmitWarming(true);
      return;
    }
    let description = draftToHtml(
      convertToRaw(editorStateDescription.getCurrentContent())
    );
    let solution = draftToHtml(
      convertToRaw(editorStateSolution.getCurrentContent())
    );
    let body = {
      problemId: problemId,
      problemName: problemName,
      problemDescription: description,
      timeLimit: timeLimit,
      levelId: levelId,
      categoryId: categoryId,
      memoryLimit: memoryLimit,
      correctSolutionLanguage: languageSolution,
      solution: solution,
      correctSolutionSourceCode: codeSolution,
      solutionChecker: solutionChecker,
      solutionCheckerLanguage: solutionCheckerLanguage,
      isPublic: isPublic,
    };
    request(
      "post",
      "/create-problem",
      (res) => {
        console.log("res ", res);
        setShowSubmitSuccess(true);
        sleep(1000).then((r) => {
          history.push("/programming-contest/list-problems");
        });
      },
      {},
      body
    ).then();
  }

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Create Problem
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
              <div>
                <TextField
                  autoFocus
                  required
                  id="problemId"
                  label="Problem ID"
                  placeholder="Problem ID"
                  onChange={(event) => {
                    setProblemID(event.target.value);
                  }}
                ></TextField>
                <TextField
                  autoFocus
                  required
                  id="problemName"
                  label="Problem Name"
                  placeholder="Problem Name"
                  onChange={(event) => {
                    setProblemName(event.target.value);
                  }}
                ></TextField>

                <TextField
                  autoFocus
                  required
                  id="timeLimit"
                  label="Time Limit"
                  placeholder="Time Limit"
                  onChange={(event) => {
                    setTimeLimit(event.target.value);
                  }}
                ></TextField>

                <TextField
                  autoFocus
                  required
                  id="memoryLimit"
                  label="Memory Limit"
                  placeholder="Memory Limit"
                  onChange={(event) => {
                    setMemoryLimit(event.target.value);
                  }}
                ></TextField>

                <TextField
                  autoFocus
                  required
                  select
                  id="levelId"
                  label="Level ID"
                  placeholder="Level ID"
                  onChange={(event) => {
                    setLevelId(event.target.value);
                  }}
                >
                  {defaultLevel.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  autoFocus
                  // required
                  select
                  id="categoryId"
                  label="Category ID"
                  placeholder="Category ID"
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                  }}
                >
                  {listCategory.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  autoFocus
                  // required
                  select
                  id="Public Problem"
                  label="Public Problem"
                  placeholder="Public Problem"
                  onChange={(event) => {
                    setIsPublic(event.target.value);
                  }}
                  value={isPublic}
                >
                  <MenuItem key={"true"} value={true}>
                    {"true"}
                  </MenuItem>
                  <MenuItem key={"false"} value={false}>
                    {"false"}
                  </MenuItem>
                </TextField>
              </div>
            </form>
            <form
              className={descriptionClass.root}
              noValidate
              autoComplete="off"
            >
              <div>
                <Typography>
                  <h2>Problem Description</h2>
                </Typography>
                <Editor
                  editorState={editorStateDescription}
                  handlePastedText={() => false}
                  onEditorStateChange={onChangeEditorStateDescription}
                  toolbarStyle={editorStyle.toolbar}
                  editorStyle={editorStyle.editor}
                />
              </div>
              <div>
                <Typography>
                  <h2>Problem Solution</h2>
                </Typography>
                <Editor
                  editorState={editorStateSolution}
                  handlePastedText={() => false}
                  onEditorStateChange={onChangeEditorStateSolution}
                  toolbarStyle={editorStyle.toolbar}
                  editorStyle={editorStyle.editor}
                />
              </div>
            </form>
            <Typography>
              <h2>Correct Solution Source Code</h2>
            </Typography>
            <TextField
              style={{ width: 0.075 * window.innerWidth, margin: 20 }}
              variant={"outlined"}
              size={"small"}
              autoFocus
              value={languageSolution}
              select
              id="computerLanguage"
              onChange={(event) => {
                setLanguageSolution(event.target.value);
              }}
            >
              {computerLanguageList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              style={{
                width: 1.0 * window.innerWidth,
                margin: 20,
              }}
              multiline
              maxRows={4}
              value={codeSolution}
              onChange={(event) => {
                setCodeSolution(event.target.value);
              }}
            ></TextField>
            {/*
            <CodeMirror
              value={codeSolution}
              height={"500px"}
              width="100%"
              extensions={getExtension()}
              onChange={(value, viewUpdate) => {
                setCodeSolution(value);
              }}
              autoFocus={false}
            />
            */}
            <br />
            <Typography>
              <h2>Checker source code</h2>
            </Typography>
            <TextField
              style={{ width: 0.075 * window.innerWidth, margin: 20 }}
              variant={"outlined"}
              size={"small"}
              autoFocus
              value={solutionCheckerLanguage}
              select
              id="computerLanguage"
              onChange={(event) => {
                setSolutionCheckerLanguage(event.target.value);
              }}
            >
              {computerLanguageList.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            {/*
              <CodeMirror
                value={solutionChecker}
                height={"500px"}
                width="100%"
                extensions={getExtension()}
                onChange={(value, viewUpdate) => {
                  setSolutionChecker(value);
                }}
                autoFocus={false}
              />
              */}
            <br />

            <CompileStatus
              showCompile={showCompile}
              statusSuccessful={statusSuccessful}
              message={compileMessage}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="light"
              style={{ marginLeft: "45px" }}
              onClick={checkCompile}
            >
              Check Solution Compile
            </Button>
            <Button
              variant="contained"
              color="light"
              style={{ marginLeft: "45px" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <SubmitWarming
              showSubmitWarming={showSubmitWarming}
              content={"Your source must be pass compile process"}
            />
            <SubmitSuccess
              showSubmitSuccess={showSubmitSuccess}
              content={"You have saved problem"}
            />
          </CardActions>
        </Card>
      </MuiPickersUtilsProvider>
    </div>
  );
}
export default CreateProblem;
