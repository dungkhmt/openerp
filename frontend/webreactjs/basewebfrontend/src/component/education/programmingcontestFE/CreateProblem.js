import {makeStyles} from "@material-ui/core";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import React, {useState} from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {CompileStatus} from "./CompileStatus";
import {sleep} from "./lib";
import {request} from "./Request";
import {authPostMultiPart} from "../../../api";
import {useTranslation} from "react-i18next";
import HustDropzoneArea from "../../common/HustDropzoneArea";
import {errorNoti, successNoti, warningNoti} from "../../../utils/notification";
import HustCodeEditor from "../../common/HustCodeEditor";
import {LoadingButton} from "@mui/lab";
import RichTextEditor from "../../common/editor/RichTextEditor";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& .MuiTextField-root": {
      marginRight: theme.spacing(4),
      marginBottom: theme.spacing(2),
      width: "28%",
      minWidth: 120,
    },
  },
  description: {
    marginBottom: theme.spacing(2),
  }
}));

function CreateProblem() {
  const {t} = useTranslation(
    "education/programmingcontest/problem"
  );
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [problemId, setProblemID] = useState("");
  const [problemName, setProblemName] = useState("");
  const [timeLimit, setTimeLimit] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [levelId, setLevelId] = useState("medium");
  const defaultLevel = ["easy", "medium", "hard"];
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState("");
  const [codeSolution, setCodeSolution] = useState("");
  const [languageSolution, setLanguageSolution] = useState("CPP");
  const [solutionChecker, setSolutionChecker] = useState("");
  const [solutionCheckerLanguage, setSolutionCheckerLanguage] = useState("CPP");
  const [isPublic, setIsPublic] = useState(false);

  const [allowSubmittingOutput, setAllowSubmittingOutput] = useState(false);
  const [compileMessage, setCompileMessage] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [showCompile, setShowCompile] = useState(false);
  const [statusSuccessful, setStatusSuccessful] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleAttachmentFiles = (files) => {
    setAttachmentFiles(files);
  };

  function checkCompile() {
    let body = {
      source: codeSolution,
      computerLanguage: languageSolution,
    };

    setLoading(true);
    request(
      "post",
      "/check-compile",
      (res) => {
        if (res.data.status === "Successful") {
          setShowCompile(true);
          setStatusSuccessful(true);
        } else {
          setShowCompile(true);
          setStatusSuccessful(false);
        }
        setCompileMessage(res.data.message);
      },
      {},
      body
    ).then(() => setLoading(false));
  }

  const validateSubmit = () => {
    if (problemId === "") {
      errorNoti(t("validateSubmit.missingField", {fieldName: "Problem ID"}), 3000);
      return false;
    }
    if (problemName === "") {
      errorNoti(t("validateSubmit.missingField", {fieldName: "Problem Name"}), 3000);
      return false;
    }
    if (!statusSuccessful) {
      warningNoti(t("validateSubmit.warningCheckSolutionCompile"), 5000);
      return false;
    }
    return true;
  }

  function handleSubmit() {
    if (!validateSubmit()) return;

    const fileId = attachmentFiles.map((file) => file.name);

    let body = {
      problemId: problemId,
      problemName: problemName,
      problemDescription: description,
      timeLimit: timeLimit,
      levelId: levelId,
      memoryLimit: memoryLimit,
      correctSolutionLanguage: languageSolution,
      solution: solution,
      correctSolutionSourceCode: codeSolution,
      solutionChecker: solutionChecker,
      solutionCheckerLanguage: solutionCheckerLanguage,
      isPublic: isPublic,
      fileId: fileId,
    };

    let formData = new FormData();
    formData.append("ModelCreateContestProblem", JSON.stringify(body));

    for (const file of attachmentFiles) {
      formData.append("files", file);
    }
    /*
    try {
      authPostMultiPart(dispatch, token, "/create-problem", formData).then(
        (res) => {
          sleep(1000).then(() => {
            history.push("/programming-contest/list-problems");
          });
        }
      );
    } catch (error) {
      alert(error);
    }
    */
    setLoading(true);
    authPostMultiPart(dispatch, token, "/create-problem", formData)
      .then(
        (res) => {
          successNoti("Problem saved successfully", 1000);
          sleep(1000).then((r) => {
            history.push("/programming-contest/list-problems");
          });
        },
      )
      .catch(() => errorNoti("An error happened", 3000))
      .finally(() => setLoading(false));

    // request(
    //   "post",
    //   "/create-problem",
    //   (res) => {
    //     console.log("res ", res);
    //     setShowSubmitSuccess(true);
    //     sleep(1000).then((r) => {
    //       history.push("/programming-contest/list-problems");
    //     });
    //   },
    //   {},
    //   body
    // ).then();
  }

  return (
    <Box>
      <Card>
        <Typography
          fontWeight="600"
          variant="h5"
          component="div"
          sx={{margin: "12px 0 10px 18px"}}
          color="#2972bb"
        >
          {t("createProblem")}
        </Typography>
        <Divider/>
        <CardContent sx={{padding: "24px"}}>
          <Box className={classes.main}>
            <TextField
              autoFocus={true}
              required
              id={t("problemId")}
              label="Problem ID"
              placeholder="Problem ID"
              onChange={(event) => {
                setProblemID(event.target.value);
              }}
            />
            <TextField
              required
              id="problemName"
              label={t("problemName")}
              placeholder="Problem Name"
              onChange={(event) => {
                setProblemName(event.target.value);
              }}
            />

            <TextField
              required
              select
              id="levelId"
              label={t("level")}
              value={levelId}
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
              required
              id="timeLimit"
              label={t("timeLimit")}
              placeholder="Time Limit"
              type="number"
              value={timeLimit}
              onChange={(event) => {
                setTimeLimit(event.target.value);
              }}
              InputProps={{endAdornment: <InputAdornment position="end">s</InputAdornment>,}}
            />

            <TextField
              required
              id="memoryLimit"
              label={t("memoryLimit")}
              type="number"
              value={memoryLimit}
              onChange={(event) => {
                setMemoryLimit(event.target.value);
              }}
              InputProps={{endAdornment: <InputAdornment position="end">MB</InputAdornment>,}}
            />

            <TextField
              select
              id="isPublicProblem"
              label="Public Problem"
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
          </Box>

          <Box className={classes.description}>
            <Typography variant="h5" component="div" sx={{marginTop: "12px", marginBottom: "8px"}}>
              {t("problemDescription")}
            </Typography>
            <RichTextEditor content={description} onContentChange={text => setDescription(text)}/>
            <HustDropzoneArea onChangeAttachment={(files) => handleAttachmentFiles(files)}/>
          </Box>
          {/* this function is not implemented yet
              <Box>
                <Typography>
                  <h2>{t("problemSuggestion")}</h2>
                </Typography>
                <RichTextEditor
                  content={solution}
                  onContentChange={text => setSolution(text)}
                />
              </Box>
              */}

          <HustCodeEditor
            title={t("correctSourceCode")}
            language={languageSolution}
            onChangeLanguage={(event) => {
              setLanguageSolution(event.target.value);
            }}
            sourceCode={codeSolution}
            onChangeSourceCode={(code) => {
              setCodeSolution(code);
            }}
          />
          <LoadingButton
            variant="contained"
            loading={loading}
            onClick={checkCompile}
            sx={{marginTop: "12px", marginBottom: "6px"}}
          >
            Check Solution Compile
          </LoadingButton>

          <CompileStatus
            showCompile={showCompile}
            statusSuccessful={statusSuccessful}
            message={compileMessage}
          />
          <FormControlLabel
            label={t("allowSubmittingOutput")}
            control={
              <Checkbox
                checked={allowSubmittingOutput}
                onChange={() => setAllowSubmittingOutput(!allowSubmittingOutput)}
              />}
          />

          {allowSubmittingOutput &&
            <HustCodeEditor
              title={t("checkerSourceCode")}
              language={solutionCheckerLanguage}
              onChangeLanguage={(event) => {
                setSolutionCheckerLanguage(event.target.value);
              }}
              sourceCode={solutionChecker}
              onChangeSourceCode={(code) => {
                setSolutionChecker(code);
              }}
              placeholder={t("checkerSourceCodePlaceholder")}
            />
          }

          <Box width="100%" sx={{marginTop: "16px"}}>
            <LoadingButton
              variant="contained"
              color="success"
              loading={loading}
              onClick={handleSubmit}
            >
              Save
            </LoadingButton>
          </Box>
        </CardContent>

      </Card>
    </Box>
  );
}

export default CreateProblem;
