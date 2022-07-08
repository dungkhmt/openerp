import { IconButton } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { request } from "api";
import FileSaver from "file-saver";
import MaterialTable from "material-table";
import { useEffect, useState } from "react";
import { VscFilePdf } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { exportQuizQuestionAssigned2StudentPdf } from "./TeacherQuizQuestionAssign2StudentExportPDF.js";
import ExamQuestionsOfParticipantPDFDocument from "./template/ExamQuestionsOfParticipantPDFDocument";

const generatePdfDocument = async (documentData, fileName) => {
  const blob = await pdf(
    <ExamQuestionsOfParticipantPDFDocument data={documentData} />
  ).toBlob();
  FileSaver.saveAs(blob, fileName);
};

function QuizTestGroupParticipants(props) {
  let testId = props.testId;

  const [data, setData] = useState([]);
  const [studentQuestions, setStudentQuestions] = useState([]);
  const [resultExportPDFData, setResultExportPDFData] = useState([]);

  const columns = [
    { title: "Group Id", field: "quizTestGroupId" },
    { title: "Group Code", field: "quizTestGroupCode" },
    { title: "UserLoginId", field: "participantUserLoginId" },
    { title: "FullName", field: "fullName" },
    {
      title: "View Question",
      field: "quizTestGroupId",
      render: (rowData) => (
        <Link
          to={`/edu/class/quiztest/teacher-view-questions-of-participant/${rowData["participantUserLoginId"]}/${rowData["quizTestGroupId"]}/${testId}`}
        >
          VIEW
        </Link>
      ),
    },
    {
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="export PDF"
          onClick={() => {
            exportExamQuestions(rowData["participantUserLoginId"]);
          }}
        >
          <VscFilePdf />
        </IconButton>
      ),
    },
  ];

  //
  const exportExamQuestions = (studentId) => {
    request(
      "GET",
      `/get-quiz-questions-assigned-to-participant/${testId}/${studentId}`,
      (res1) => {
        const {
          testName,
          scheduleDatetime,
          courseName,
          duration,
          quizGroupId,
          groupCode,
          viewTypeId,
          listQuestion,
        } = res1.data;

        request("GET", `/get-user-detail/${studentId}`, (res2) => {
          generatePdfDocument(
            {
              userId: studentId,
              userDetail: res2.data,
              ...res1.data,
            },
            `${testId} - ${courseName} - ${studentId}.pdf`
          );
        });
      }
    );
  };

  function getStudentListResultGeneral() {
    let input = { testId: testId };

    request(
      "POST",
      "/get-quiz-test-participation-execution-result",
      (res) => {
        let dataPdf = [];
        let objectPdf = {};

        res.data.map((elm) => {
          let question = {
            content: elm.questionContent,
            grade: elm.grade,
            listAnswer: elm.quizChoiceAnswerList,
            listchooseAns: elm.chooseAnsIds,
          };

          if (objectPdf[elm.participationUserLoginId] == null) {
            let userObj = {
              fullName: elm.participationFullName,
              groupId: elm.quizGroupId,
              listQuestion: [],
              totalGrade: elm.grade,
            };
            objectPdf[elm.participationUserLoginId] = userObj;
          } else {
            objectPdf[elm.participationUserLoginId]["totalGrade"] += elm.grade;
          }

          objectPdf[elm.participationUserLoginId]["listQuestion"].push(
            question
          );
        });

        // console.log(objectPdf);
        Object.keys(objectPdf).map((ele) => {
          dataPdf.push(objectPdf[ele]);
        });

        // console.log(dataPdf);

        dataPdf.sort(function (firstEl, secondEl) {
          if (firstEl.fullName === null || secondEl.fullName === null)
            return -1;
          if (
            firstEl.fullName.toLowerCase() < secondEl.fullName.toLowerCase()
          ) {
            return -1;
          }
          if (
            firstEl.fullName.toLowerCase() > secondEl.fullName.toLowerCase()
          ) {
            return 1;
          }

          return 0;
        });

        //after sort
        console.log("dataPdf = ", dataPdf);

        setResultExportPDFData(dataPdf);
      },
      {},
      input
    );
  }

  function getParticipantQuestions() {
    request(
      "get",
      "get-all-quiz-test-participation-group-question/" + testId,
      (res) => {
        console.log("participant questions = ", res.data);
        //alert('assign students to groups OK');
        setStudentQuestions(res.data);
      },
      { 401: () => {} }
    );
  }

  function getQuizTestGroupParticipants() {
    request(
      "get",
      "get-all-quiz-test-group-participants/" + testId,
      (res) => {
        //alert('assign students to groups OK');
        setData(res.data);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getQuizTestGroupParticipants();
    getStudentListResultGeneral();
    getParticipantQuestions();
  }, []);

  return (
    <MaterialTable
      title={"Phân thí sinh vào các đề"}
      columns={columns}
      data={data}
      actions={[
        {
          icon: () => (
            <img
              alt="Xuất PDF"
              src="/static/images/icons/pdf_icon.png"
              style={{ width: "35px", height: "35px" }}
            />
          ),
          tooltip: "Xuất PDF",
          isFreeAction: true,
          onClick: () => {
            exportQuizQuestionAssigned2StudentPdf(
              //students,
              data,
              resultExportPDFData,
              studentQuestions,
              testId
            );
          },
        },
      ]}
    />
  );
}

export default QuizTestGroupParticipants;
