import {TableHead, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import InfoIcon from "@mui/icons-material/Info";
import {Button, IconButton} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import HustCopyCodeBlock from "component/common/HustCopyCodeBlock";
import HustModal from "component/common/HustModal";
import {ContentState, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import React, {useEffect, useState} from "react";
import {Editor} from "react-draft-wysiwyg";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {useHistory} from "react-router-dom";
import {randomImageName,} from "utils/FileUpload/covert";
import {authGet} from "../../../api";
import ContestsUsingAProblem from "./ContestsUsingAProblem";
import {StyledTableCell, StyledTableRow} from "./lib";
import {request} from "./Request";
import {copyAllTestCases, downloadAllTestCases} from "./service/TestCaseService";
import FileUploadZone from "../../../utils/FileUpload/FileUploadZone";

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
  const history = useHistory();
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
  const [fetchedImageArray, setFetchedImageArray] = useState([]);

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
    authGet(
      dispatch,
      token,
      "/get-problem-detail-view-by-manager/" + problemId
    ).then((res) => {
      setProblem(res);
      console.log(res);
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
      //setProblemStatement(res.data.problemStatement);
      let problemDescriptionHtml = htmlToDraft(res.problemStatement);
      let {contentBlocks, entityMap} = problemDescriptionHtml;
      let contentDescriptionState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      let statementDescription = EditorState.createWithContent(
        contentDescriptionState
      );
      setEditorStateDescription(statementDescription);
    }, {});
  }

  useEffect(() => {
    getProblemDetail();
    getTestCases();
  }, []);

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

  function handleEdit() {
    history.push("/programming-contest/edit-problem/" + problemId);
  }

  function addTestCase() {
    history.push(
      "/programming-contest/problem-detail-create-test-case/" + problemId
    );
  }

  function userRoleManagement() {
    history.push(
      "/programming-contest/user-contest-problem-role-management/" + problemId
    );
  }

  return (
    <div>
      <Button
        onClick={() => {
          handleEdit();
        }}
      >
        Edit
      </Button>
      <Button
        onClick={() => {
          addTestCase();
        }}
      >
        Add TestCase
      </Button>
      <Button
        onClick={() => {
          userRoleManagement();
        }}
      >
        User Roles
      </Button>

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
        {fetchedImageArray.length !== 0 &&
          fetchedImageArray.map((file) => (
            <FileUploadZone file={file} removable={false}/>
          ))}
      </div>

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 750}} aria-label="customized table">
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
                <Button variant="contained" onClick={() => copyAllTestCases(testCases)}>
                  Copy Tests
                </Button>
              </StyledTableCell>
              <StyledTableCell align="left">
                <Button variant="contained" onClick={() => downloadAllTestCases(testCases)}>
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
                        <InfoIcon/>
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
      <ModalPreview chosenTestcase={selectedTestcase}/>

      <ContestsUsingAProblem problemId={problemId}/>
    </div>
  );
}
