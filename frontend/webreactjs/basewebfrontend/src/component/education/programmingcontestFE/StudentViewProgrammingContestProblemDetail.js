import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TableHead,
  TextField,
  Typography,
} from "@material-ui/core";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { authPostMultiPart } from "../../../api";
import { StyledTableCell, StyledTableRow } from "./lib";
import { request } from "./Request";
import XLSX from "xlsx";
import HustModal from "component/common/HustModal";
import HustCopyCodeBlock from "component/common/HustCopyCodeBlock";

const editorStyle = {
  toolbar: {
    background: "#FFFFFF",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

export default function StudentViewProgrammingContestProblemDetail() {
  const params = useParams();
  const problemId = params.problemId;
  const contestId = params.contestId;
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [filename, setFilename] = useState("");
  const [language, setLanguage] = useState("CPP");
  const [score, setScore] = React.useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [nbTestCasePassed, setNbTestCasePassed] = useState("");
  const [nbTotalTestCase, setNbTotalTestCase] = useState("");
  const [runTime, setRunTime] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTestcase, setSelectedTestcase] = useState();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [editorStateDescription, setEditorStateDescription] = useState(
    EditorState.createEmpty()
  );

  function onFileChange(event) {
    setFilename(event.target.files[0]);
    console.log(event.target.files[0].name);
  }
  const onInputChange = (event) => {
    let name = event.target.value;
    setFilename(name);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setIsProcessing(true);
    let body = {
      problemId: problemId,
      contestId: contestId,
      language: language,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", filename);

    authPostMultiPart(
      dispatch,
      token,
      "/contest-submit-problem-via-upload-file",
      formData
    )
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);
        if (res.status == "TIME_OUT") {
          alert("Time Out!!!");
          setScore("");
          setNbTestCasePassed("");
          setNbTotalTestCase("");
          setRunTime("");
          setStatus(res.status);
          setMessage(res.message);
        } else {
          setScore(res.score);
          setNbTestCasePassed(res.numberTestCasePassed);
          setNbTotalTestCase(res.totalNumberTestCase);
          setRunTime(runTime);
          setStatus(res.status);
          setMessage(res.message);
        }
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
        //alert("Time Out!!!");
      });
  };

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

  function getProblemDetail() {
    request(
      "GET",
      "/get-problem-detail-view-by-student/" + problemId,

      (res) => {
        console.log("getProblemDetail, res = ", res.data);
        setProblem(res.data);
        //setProblemStatement(res.data.problemStatement);
        let problemDescriptionHtml = htmlToDraft(res.data.problemStatement);
        let { contentBlocks, entityMap } = problemDescriptionHtml;
        let contentDescriptionState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        let statementDescription = EditorState.createWithContent(
          contentDescriptionState
        );
        setEditorStateDescription(statementDescription);
      },
      {}
    );
  }

  useEffect(() => {
    getProblemDetail();
    getTestCases();
  }, []);

  // const downloadHandler = (event) => {
  //   if (testCases.length === 0) {
  //     return;
  //   }
  //   var wbcols = [
  //     { wpx: 300 },
  //     { wpx: 300 },
  //     { wpx: 50 },
  //   ];

  //   var publicTestCases = testCases.filter(item => item.isPublic === "Y")

  //   var data = publicTestCases.map((item) => ({
  //     "Input": item.testCase,
  //     "Output": item.correctAns,
  //     "Point": item.point,
  //   }));

  //   var sheet = XLSX.utils.json_to_sheet(data);
  //   var wb = XLSX.utils.book_new();
  //   sheet["!cols"] = wbcols;

  //   const wb_opts = {bookType: 'xlsx', type: 'binary'};
  //   XLSX.utils.book_append_sheet(wb, sheet, "testCases");
  //   XLSX.writeFile(wb, "TestCasesProblem.xlsx", wb_opts);
  // };

  const copyAllHandler = () => {
    let allTestCases = "";
    allTestCases += "--TEST CASES-- \n"
    for (const testCase_ith of testCases) {
      allTestCases +=
        "------------- \nInput: \n" 
        + testCase_ith.testCase 
        + "\n\nOutput: \n" 
        + testCase_ith.correctAns 
        + "\n\n";
    }
    allTestCases += "--END TEST CASES-- \n"
    navigator.clipboard.writeText(allTestCases);
  };

  const ModalPreview = (chosenTestcase) => {
    return (
      <HustModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        isNotShowCloseButton
        showCloseBtnTitle={false}
      >
        <HustCopyCodeBlock
          title="Input"
          text={chosenTestcase?.chosenTestcase?.testCase}
        />
        <HustCopyCodeBlock
          title="Output"
          text={chosenTestcase?.chosenTestcase?.correctAns}
          mt={2}
        />
      </HustModal>
    );
  };

  return (
    <div>
      <div>
        <h3>Name: {problem ? problem.problemName : ""}</h3>
      </div>

      <div>
        <Typography>
          <h2>Description</h2>
        </Typography>
        <Editor
          editorState={editorStateDescription}
          handlePastedText={() => false}
          toolbarStyle={editorStyle.toolbar}
          editorStyle={editorStyle.editor}
        />
      </div>

      <TableContainer component={Paper}>
        {console.log(testCases)}
        <Table sx={{ minWidth: 750 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell align="left">Test case</StyledTableCell>
              <StyledTableCell align="left">Correct answer</StyledTableCell>
              <StyledTableCell align="left">Point</StyledTableCell>
              <StyledTableCell align="left">Submit Output</StyledTableCell>
              <StyledTableCell align="left">
                <Button variant="contained" onClick={copyAllHandler}>
                  Copy all Testcases
                </Button>
              </StyledTableCell>
              {/* <StyledTableCell align="center">
                <Button variant="contained" onClick={downloadHandler}>
                  Download all
                </Button>
              </StyledTableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {testCases.map((testCase, idx) => {
              return (
                testCase.isPublic === "Y" && (
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                      <h6>{idx + 1}</h6>
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
                      <Link
                        to={
                          "/programming-contest/submit-solution-output/" +
                          contestId +
                          "/" +
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
                        <Button variant="contained" color="light">
                          Submit Solution
                        </Button>
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedTestcase(testCase);
                          setOpenModal(true);
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                )
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalPreview chosenTestcase={selectedTestcase} />
      <div>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={3}>
              <input
                type="file"
                id="selected-upload-file"
                onChange={onFileChange}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                autoFocus
                // required
                select
                id="language"
                label="Language"
                placeholder="Language"
                onChange={(event) => {
                  setLanguage(event.target.value);
                }}
                value={language}
              >
                <MenuItem key={"CPP"} value="CPP">
                  {"CPP"}
                </MenuItem>
                <MenuItem key={"JAVA"} value="JAVA">
                  {"JAVA"}
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={2}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                onChange={onInputChange}
                width="100%"
              >
                SUBMIT
              </Button>
            </Grid>

            {isProcessing ? <CircularProgress /> : ""}
          </Grid>
        </form>

        <div>
          <h2>Status: {status}</h2>
        </div>
        <div>
          <h2>Message: </h2> {message}
        </div>
        <div>
          <h2>Score: {score}</h2>
        </div>
        <div>
          <h2>Number TestCases Passed: {nbTestCasePassed}</h2>
        </div>
        <div>
          <h2>Total TestCases : {nbTotalTestCase}</h2>
        </div>
        <div>
          <h2>RunTime : {runTime}(ms)</h2>
        </div>
      </div>
    </div>
  );
}
