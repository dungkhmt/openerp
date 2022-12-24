import {
  Box,
  Button,
  CardActions,
  CardContent,
  InputAdornment,
  MenuItem,
  Paper,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Editor} from "react-draft-wysiwyg";
import {ContentState, EditorState} from "draft-js";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {authGet, authPostMultiPart} from "../../../api";
import {CompileStatus} from "./CompileStatus";
import {SubmitSuccess} from "./SubmitSuccess";
import {useParams} from "react-router";
import {request} from "./Request";
import {sleep, StyledTableCell, StyledTableRow} from "./lib";
import htmlToDraft from "html-to-draftjs";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {getFileType, randomImageName, saveByteArray,} from "../../../utils/FileUpload/covert";
import {useTranslation} from "react-i18next";
import HustContainerCard from "../../common/HustContainerCard";
import HustDropzoneArea from "../../common/HustDropzoneArea";
import RichTextEditor from "../../common/editor/RichTextEditor";
import HustCodeEditor from "../../common/HustCodeEditor";
import {LoadingButton} from "@mui/lab";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(2),
      minWidth: 80,
    },
  },
  fileContainer: {
    marginTop: "12px",
  },
  fileWrapper: {
    position: "relative",
  },
  fileDownload: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "16px",
    alignItems: "center",
  },
  fileName: {
    fontStyle: "italic",
    paddingRight: "12px",
  },
  downloadButton: {
    marginLeft: "12px",
  },
  imageQuiz: {
    maxWidth: "70%",
  },
  buttonClearImage: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 3,
    color: "red",
    width: 32,
    height: 32,
    cursor: "pointer",
  },
}));

function EditProblem() {
  const {t} = useTranslation(
    ["education/programmingcontest/problem", "common", "validation"]
  );

  const classes = useStyles();

  const {problemId} = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();

  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [solution, setSolution] = useState("");
  const [timeLimit, setTimeLimit] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(1);
  const [levelId, setLevelId] = useState("");
  const [codeSolution, setCodeSolution] = useState("");
  const [solutionCheckerLanguage, setSolutionCheckerLanguage] = useState("CPP");
  const [solutionChecker, setSolutionChecker] = useState("");
  const [languageSolution, setLanguageSolution] = useState("CPP");
  const [showSubmitWarming, setShowSubmitWarming] = useState(false);
  const [showCompile, setShowCompile] = useState(false);
  const [statusSuccessful, setStatusSuccessful] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [compileMessage, setCompileMessage] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [fetchedImageArray, setFetchedImageArray] = useState([]);
  const [removedFilesId, setRemovedFileIds] = useState([]);

  const defaultLevel = ["easy", "medium", "hard"];

  const [loading, setLoading] = useState(false);

  const handleAttachmentFiles = (files) => {
    setAttachmentFiles(files);
  };

  const handleDeleteImageAttachment = async (fileId) => {
    setFetchedImageArray(
      fetchedImageArray.filter((file) => file.fileName !== fileId)
    );
    setRemovedFileIds([...removedFilesId, fileId]);
  };

  useEffect(() => {
    authGet(dispatch, token, "/problem-details/" + problemId)
      .then((res) => {
        if (res.attachment && res.attachment.length !== 0) {
          const newFileURLArray = res.attachment.map((url) => ({
            id: randomImageName(),
            content: url,
          }));
          newFileURLArray.forEach((file, idx) => {
            file.fileName = res.attachmentNames[idx];
          });
          setFetchedImageArray(newFileURLArray);
        }

        setProblemName(res.problemName);
        setLevelId(res.levelId);
        setTimeLimit(res.timeLimit);
        setMemoryLimit(res.memoryLimit);
        setIsPublic(res.publicProblem);
        setLanguageSolution(res.correctSolutionLanguage);
        setCodeSolution(res.correctSolutionSourceCode);
        setSolutionCheckerLanguage(res.solutionCheckerLanguage);
        setSolutionChecker(res.solutionCheckerSourceCode || "");
        setDescription(res.problemDescription);
      }, {})
      .then();

    getTestCases();
  }, [problemId]);

  function getTestCases() {
    request(
      "GET",
      "/get-test-case-list-by-problem/" + problemId,

      (res) => {
        console.log("res", res.data);
        setTestCases(res.data);
      },
      {}
    );
  }

  function rerunTestCase(problemId, testCaseId) {
    request(
      "GET",
      "/rerun-create-testcase-solution/" + problemId + "/" + testCaseId,

      (res) => {
        getTestCases();
      },
      {}
    );
  }

  function checkCompile() {
    let body = {
      source: codeSolution,
      computerLanguage: languageSolution,
    };
    request(
      "post",
      "/check-compile",
      (res) => {
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

    let fileId = [];
    if (attachmentFiles.length > 0) {
      fileId = attachmentFiles.map((file) => {
        if (typeof file.name !== "undefined") {
          return file.name;
        }
        if (typeof file.fileName !== "undefined") {
          return file.fileName;
        }
        return file.id;
      });
    }

    let body = {
      problemName: problemName,
      problemDescription: description,
      timeLimit: timeLimit,
      levelId: levelId,
      memoryLimit: memoryLimit,
      correctSolutionLanguage: languageSolution,
      solution: solution,
      correctSolutionSourceCode: codeSolution,
      solutionChecker: solutionChecker,
      isPublic: isPublic,
      fileId: fileId,
      removedFilesId: removedFilesId,
    };

    let formData = new FormData();
    formData.append("ModelUpdateContestProblem", JSON.stringify(body));
    for (const file of attachmentFiles) {
      formData.append("files", file);
    }

    try {
      authPostMultiPart(
        dispatch,
        token,
        "/update-problem-detail/" + problemId,
        formData
      ).then(
        (res) => {
          setShowSubmitSuccess(true);
          sleep(1000).then((r) => {
            history.push("/programming-contest/list-problems");
          });
        },
        {},
        () => {
          alert("Cập nhật thất bại");
        }
      );
    } catch (error) {
      alert(error);
    }
  }

  return (
    <HustContainerCard title={t("editProblem")}>
      <Box className={classes.main}>
        <TextField
          required
          id="problemName"
          label={t("problemName")}
          placeholder="Problem Name"
          value={problemName}
          onChange={(event) => {
            setProblemName(event.target.value);
          }}
          sx={{width: "30%"}}
        />
        <TextField
          select
          id="isPublicProblem"
          label={t("public", {ns: "common"})}
          onChange={(event) => {
            setIsPublic(event.target.value);
          }}
          value={isPublic}
          sx={{width: "15%"}}
        >
          <MenuItem key={"true"} value={true}>
            {t("yes", {ns: "common"})}
          </MenuItem>
          <MenuItem key={"false"} value={false}>
            {t("no", {ns: "common"})}
          </MenuItem>
        </TextField>

        <TextField
          required
          select
          id="levelId"
          label={t("level")}
          value={levelId}
          onChange={(event) => {
            setLevelId(event.target.value);
          }}
          sx={{width: "15%"}}
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
          sx={{width: "15%"}}
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
          sx={{width: "15%"}}
        />
      </Box>

      <Box className={classes.description}>
        <Typography variant="h5" component="div" sx={{marginTop: "12px", marginBottom: "8px"}}>
          {t("problemDescription")}
        </Typography>
        <RichTextEditor content={description} onContentChange={text => setDescription(text)}/>
        <HustDropzoneArea onChangeAttachment={(files) => handleAttachmentFiles(files)}/>
      </Box>

      {fetchedImageArray.length !== 0 &&
        fetchedImageArray.map((file) => (
          <div key={file.id} className={classes.fileContainer}>
            <div className={classes.fileWrapper}>
              {getFileType(file.fileName) === "img" && (
                <img
                  src={`data:image/jpeg;base64,${file.content}`}
                  alt={file.fileName}
                  className={classes.imageQuiz}
                />
              )}
              {getFileType(file.fileName) === "pdf" && (
                <Box className={classes.fileDownload}>
                  <Typography
                    variant="subtitle2"
                    className={classes.fileName}
                  >
                    {file.fileName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    className={classes.downloadButton}
                    onClick={() =>
                      saveByteArray(
                        file.fileName,
                        file.content,
                        "pdf"
                      )
                    }
                  >
                    Download
                  </Button>
                </Box>
              )}
              {getFileType(file.fileName) === "word" && (
                <Box className={classes.fileDownload}>
                  <Typography
                    variant="subtitle2"
                    className={classes.fileName}
                  >
                    {file.fileName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    className={classes.downloadButton}
                    onClick={() =>
                      saveByteArray(
                        file.fileName,
                        file.content,
                        "word"
                      )
                    }
                  >
                    Download
                  </Button>
                </Box>
              )}
              {getFileType(file.fileName) === "txt" && (
                <Box className={classes.fileDownload}>
                  <Typography
                    variant="subtitle2"
                    className={classes.fileName}
                  >
                    {file.fileName}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    className={classes.downloadButton}
                    onClick={() =>
                      saveByteArray(
                        file.fileName,
                        file.content,
                        "txt"
                      )
                    }
                  >
                    Download
                  </Button>
                </Box>
              )}
              <HighlightOffIcon
                className={classes.buttonClearImage}
                onClick={() =>
                  handleDeleteImageAttachment(file.fileName)
                }
              />
            </div>
          </div>
        ))}
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
        {t("checkSolutionCompile")}
      </LoadingButton>

      <CompileStatus
        showCompile={showCompile}
        statusSuccessful={statusSuccessful}
        message={compileMessage}
      />

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

      <Typography>
        <h2>Test case</h2>
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 750}} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="left">TestCase</StyledTableCell>
              <StyledTableCell align="left">Correct Answer</StyledTableCell>
              <StyledTableCell align="left">Point</StyledTableCell>
              <StyledTableCell align="left">Public</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="left">Edit</StyledTableCell>
              <StyledTableCell align="left">Rerun</StyledTableCell>
              <StyledTableCell align="left">Delete</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {testCases.map((testCase, idx) => (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  {idx}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={{
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {testCase.testCase}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={{
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {testCase.correctAns}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {testCase.point}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {testCase.isPublic}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {testCase.description}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {testCase.status}
                </StyledTableCell>

                <StyledTableCell align="left">
                  <Link
                    to={
                      "/programming-contest/edit-testcase/" +
                      problemId +
                      "/" +
                      testCase.testCaseId
                    }
                    style={{
                      textDecoration: "none",
                      color: "black",
                      cursor: "",
                    }}
                  >
                    <Button variant="contained">
                      Edit
                    </Button>
                  </Link>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Button
                    variant="contained"
                    onClick={() => {
                      rerunTestCase(problemId, testCase.testCaseId);
                    }}
                  >
                    Rerun
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Button
                    variant="contained"
                    onClick={() => {
                      request(
                        "delete",
                        "/delete-test-case/" + testCase.testCaseId,

                        (res) => {
                          request(
                            "GET",
                            "/get-test-case-list-by-problem/" + problemId,

                            (res) => {
                              console.log("res", res.data);
                              setTestCases(res.data);
                            },
                            {}
                          ).then();
                        },
                        {}
                      ).then();
                    }}
                  >
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CardActions>
        <Button
          variant="contained"
          style={{marginLeft: "45px"}}
          onClick={handleSubmit}
        >
          Save
        </Button>

        <SubmitSuccess
          showSubmitSuccess={showSubmitSuccess}
          content={"You have saved problem"}
        />
      </CardActions>
    </HustContainerCard>
  );
}

export default EditProblem;
