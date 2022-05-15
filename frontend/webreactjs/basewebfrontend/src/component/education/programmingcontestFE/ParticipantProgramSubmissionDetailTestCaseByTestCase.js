import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import MaterialTable from "material-table";
import { React, useEffect, useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { request } from "../../../api";
import { toFormattedDateTime } from "../../../utils/dateutils";

export default function ParticipantProgramSubmissionDetailTestCaseByTestCase(
  props
) {
  const { submissionId } = props;
  const [submissionTestCase, setSubmissionTestCase] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [testcaseDetailList, setTestcaseDetailList] = useState([]);
  const [selectedTestcase, setSelectedTestcase] = useState();

  const columns = [
    { title: "Contest", field: "contestId" },
    { title: "Problem", field: "problemId" },
    { title: "Message", field: "message" },
    { title: "Point", field: "point" },
    { title: "Correct result", field: "testCaseAnswer" },
    { title: "Participant's result", field: "participantAnswer" },
    { title: "Submit at", field: "createdAt" },
    {
      title: "",
      render: (rowData) => (
        <IconButton
          color="primary"
          onClick={() => {
            for (let i = 0; i < testcaseDetailList.length; i++) {
              if (testcaseDetailList[i].testCaseId === rowData.testCaseId) {
                setSelectedTestcase(testcaseDetailList[i]);
              }
            }
            setOpenModal(true);
          }}
        >
          <InfoIcon />
        </IconButton>
      ),
    },
  ];

  function getSubmissionDetailTestCaseByTestCase() {
    request(
      "get",
      "/get-contest-problem-submission-detail-by-testcase-of-a-submission/" +
        submissionId,
      (res) => {
        let L = res.data.map((c) => ({
          ...c,
          createdAt: toFormattedDateTime(c.createdAt),
        }));
        setSubmissionTestCase(L);
      },
      { 401: () => {} }
    );
  }

  function getTestcaseDetail(testcaseId) {
    request(
      "get",
      "/get-test-case-detail/" + testcaseId,
      (res) => {
        setTestcaseDetailList((prev) => [...prev, res.data]);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getSubmissionDetailTestCaseByTestCase();
  }, []);

  useEffect(() => {
    var testcaseIdsList = submissionTestCase.map(
      (testcase) => testcase.testCaseId
    );
    testcaseIdsList.forEach((id) => {
      getTestcaseDetail(id);
    });
  }, [submissionTestCase]);

  const ModalPreview = (chosenTestcase) => {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          style={{
            position: "absolute",
            padding: "20px",
            top: "50%",
            left: "50%",
            maxHeight: "500px",
            transform: "translate(-50%, -50%)",
            width: 800,
            backgroundColor: "whitesmoke",
            border: "1px solid #000",
            borderRadius: "6px",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <Box>
            <Typography variant="h6">Input</Typography>
            <CopyBlock
              text={chosenTestcase?.chosenTestcase?.testCase}
              showLineNumbers={false}
              theme={dracula}
              wrapLines={true}
              codeBlock
            />
          </Box>
          <Box sx={{mt: 2}}>
            <Typography variant="h6">Output</Typography>
            <CopyBlock
              text={chosenTestcase?.chosenTestcase?.correctAns}
              showLineNumbers={false}
              theme={dracula}
              wrapLines={true}
              codeBlock
            />
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <div>
      <MaterialTable
        title={"Detail"}
        columns={columns}
        data={submissionTestCase}
      />
      <ModalPreview chosenTestcase={selectedTestcase} />
    </div>
  );
}
