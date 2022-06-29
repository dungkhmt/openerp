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
import HustModal from "component/common/HustModal";
import HustCopyCodeBlock from "component/common/HustCopyCodeBlock";
import FileSaver from "file-saver";

const editorStyle = {
  toolbar: {
    background: "#FFFFFF",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

export default function ManagerViewProblemDetail() {
  const params = useParams();
  const problemId = params.problemId;
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
  }
  const onInputChange = (event) => {
    let name = event.target.value;
    setFilename(name);
  };

  function getTestCases() {
    request(
      "GET",
      "/get-test-case-list-by-problem/" + problemId,

      (res) => {
        setTestCases(res.data.filter((item) => item.isPublic === "Y"));
      },
      {}
    );
  }

  function getProblemDetail() {
    request(
      "GET",
      //"/get-problem-detail-view-by-student/" + problemId,
      "/get-problem-detail-view-by-manager/" + problemId,
      (res) => {
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

  const copyAllHandler = () => {
    let allTestCases = "";
    for (const testCase_ith of testCases) {
      allTestCases +=
        "------------- \nINPUT: \n" +
        testCase_ith.testCase +
        "\n\nOUTPUT: \n" +
        testCase_ith.correctAns +
        "\n\n";
    }
    navigator.clipboard.writeText(allTestCases);
  };
  const downloadAllHandler = () => {
    for (let i = 0; i < testCases.length; i++) {
      var testCase_ith = testCases[i];
      var blob = new Blob(
        [
          "INPUT: \n" +
            testCase_ith.testCase +
            "\n\nOUTPUT: \n" +
            testCase_ith.correctAns,
        ],
        { type: "text/plain;charset=utf-8" }
      );
      FileSaver.saveAs(blob, "Testcase_" + (i + 1) + ".txt");
    }
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
              {/*
              <StyledTableCell align="left">Submit Output</StyledTableCell>
              */}
              <StyledTableCell align="left">
                <Button variant="contained" onClick={copyAllHandler}>
                  Copy Tests
                </Button>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Button variant="contained" onClick={downloadAllHandler}>
                  Download Tests
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

                    {/*
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
                      */}
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
                    <StyledTableCell align="left"></StyledTableCell>
                  </StyledTableRow>
                )
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalPreview chosenTestcase={selectedTestcase} />
    </div>
  );
}
