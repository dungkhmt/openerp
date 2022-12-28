import {useEffect, useMemo, useState} from "react";
import { request } from "../../../../api";
import {defaultDatetimeFormat} from "../../../../utils/dateutils";
import { exportResultListPdf } from "../TeacherQuizResultExportPDF.js";
import ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice from "../ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice";
import {errorNoti} from "../../../../utils/notification";
import ExcelExporter from "../../../common/ExcelExporter";
import {Button} from "@mui/material";
import StandardTable from "../../../table/StandardTable";
import React from "react";

const EXCEL_CELL_STYLE =  {
  alignment: {
    vertical: "center",
    horizontal: "center"
  },
  border: {
    top: { style: "medium" },
    bottom: { style: "medium" },
    left: { style: "medium" },
    right: { style: "medium" }
  }
}

const EXCEL_DATA_CELL_STYLE = {
  font: { sz: "14" },
  ...EXCEL_CELL_STYLE
}

const EXCEL_HEADER_CELL_STYLE = {
  font: { sz: "14", bold: true },
  ...EXCEL_CELL_STYLE
}

export default function ResultListOfQuizTest(props) {
  let testId = props.testId;
  let isGeneral = props.isGeneral;
  const [rawResultList, setRawResultList] = useState([]);

  useEffect(getRawResultList, []);

  const displayedResults = useMemo(() => {
    let factory = isGeneral ? getDisplayedGeneralResults : getDisplayedDetailResults;
    return factory(rawResultList);
  }, [rawResultList]);

  function getRawResultList() {
    let successHandler = res => setRawResultList(res.data);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", true)
    }
    request("POST", "/get-quiz-test-participation-execution-result", successHandler, errorHandlers, { testId });
  }

  function getDisplayedGeneralResults(rawResults) {
    let mapGeneralResultByLoginId = {};
    rawResults.forEach((rawResult) => {
      let loginId = rawResult.participationUserLoginId;
      if (!mapGeneralResultByLoginId[loginId]) {
        let generalResult = {
          userLoginId: loginId,
          fullName: rawResult.participationFullName,
          groupId: rawResult.quizGroupId,
          grade: rawResult.grade
        };
        mapGeneralResultByLoginId[loginId] = generalResult;
      } else {
        mapGeneralResultByLoginId[loginId]["grade"] += rawResult.grade;
      }
    });
    return Object.values(mapGeneralResultByLoginId)
  }

  function getDisplayedDetailResults(rawResults) {
    return rawResults.map(doingResult => ({
        userLoginId: doingResult.participationUserLoginId,
        fullName: doingResult.participationFullName,
        groupId: doingResult.quizGroupId,
        questionId: doingResult.questionId,
        grade: doingResult.grade,
        createdStamp: defaultDatetimeFormat(doingResult.createdStamp)
    }));
  }

  function getPdfExportedResults(rawResults) {
    let mapExportedResultByLoginId = {};

    rawResults.forEach((rawResult) => {
      let loginId = rawResult.participationUserLoginId;
      if (!mapExportedResultByLoginId[loginId]) {
        let exportedResult = {
          fullName: rawResult.participationFullName,
          groupId: rawResult.quizGroupId,
          listQuestion: [],
          totalGrade: rawResult.grade,
        };
        mapExportedResultByLoginId[loginId] = exportedResult;
      } else {
        mapExportedResultByLoginId[loginId]["totalGrade"] += rawResult.grade;
      }

      let question = {
        content: rawResult.questionContent,
        grade: rawResult.grade,
        listAnswer: rawResult.quizChoiceAnswerList,
        listchooseAns: rawResult.chooseAnsIds,
      };
      mapExportedResultByLoginId[loginId]["listQuestion"].push(question);
    });

    return Object.values(mapExportedResultByLoginId).sort(sortByFullNameAscIgnoresCaseComparator);
  }


  const excelColumns = [
    { title: "UserLoginID", width: { wch: "50" }, style: EXCEL_HEADER_CELL_STYLE },
    { title: "Họ và tên", width: { wch: "50" }, style: EXCEL_HEADER_CELL_STYLE },
    { title: "Nhóm", width: { wch: "35" }, style: EXCEL_HEADER_CELL_STYLE },
    { title: "Điểm", width: { wch: "25" }, style: EXCEL_HEADER_CELL_STYLE }
  ]

  const DataSet = [
    {
      columns: excelColumns,
      data: displayedResults.map(mapGeneralResultToExcelDataRow),
    },
  ];

  const shareColumns = [
    { field: "userLoginId", title: "UserLoginID", width: "40%" },
    { field: "fullName", title: "Họ tên", width: "40%" },
    { field: "groupId", title: "Group" }
  ]

  const detailResultColumns = [
    ...shareColumns,
    { field: "questionId", title: "Question ID" },
    { field: "grade", title: "Điểm" },
    { field: "createdStamp", title: "Thời gian submit" }
  ]

  const generalResultColumns = [
    ...shareColumns,
    { field: "grade", title: "Điểm"},
  ]

  let excelFileName = `Danh sách kết quả ${testId}`;
  const excelExportedResults = [{
      columns: excelColumns,
      data: displayedResults.map(mapGeneralResultToExcelDataRow),
  }]

  const ExcelExportButton = (
    <ExcelExporter filename={excelFileName}
                   sheets={[{
                     name: excelFileName,
                     dataSet: excelExportedResults
                   }]} />
  )

  const PdfExportButton = (
    <Button color="primary" variant="contained"
            onClick={ () => exportResultListPdf(displayedResults, getPdfExportedResults(rawResultList), testId) }>
      Xuất PDF
    </Button>
  )

  const actions = (displayedResults.length > 0 && isGeneral) ? [
    { icon: () => ExcelExportButton, isFreeAction: true },
    { icon: () => PdfExportButton, isFreeAction: true }
  ] : [];

  let tableTitle = isGeneral ? "Kết quả tổng quát" : "Kết quả chi tiết";

  return (
    <>
      <StandardTable
        title={tableTitle}
        columns={isGeneral ? generalResultColumns : detailResultColumns}
        data={displayedResults}
        hideCommandBar
        options={{
          selection: false,
          search: true,
          sorting: true,
        }}
        actions={actions}
      />
      <ViewHistoryLogQuizGroupQuestionParticipationExecutionChoice
        testId={testId}
      />
    </>
  );
}

function mapGeneralResultToExcelDataRow(singleResult) {
  const excelFields = ["userLoginId", "fullName", "groupId", "grade"];
  return excelFields.map(field => ({
    value: singleResult[field],
    style: EXCEL_DATA_CELL_STYLE
  }))
}

function sortByFullNameAscIgnoresCaseComparator(first, second) {
  if (!first.fullName) return 1;
  if (!second.fullName) return -1;

  let firstLowerCaseName = first.fullName.toLowerCase();
  let secondLowerCaseName = second.fullName.toLowerCase();

  if (firstLowerCaseName < secondLowerCaseName) {
    return -1;
  } else if (firstLowerCaseName > secondLowerCaseName) {
    return 1;
  } else {
    return 0;
  }
}
