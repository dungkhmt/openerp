import { Delete } from "@material-ui/icons";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import React, { useEffect, useState } from "react";
import {errorNoti, successNoti} from "../../../../utils/notification";
import GenerateQuizTestGroupDialog from "./GenerateQuizTestGroupDialog";
import {request} from "../../../../api";
import {Button} from "@mui/material";
import {Card, CardContent} from "@material-ui/core";
import StandardTable from "../../../table/StandardTable";
import QuizTestGroupQuestionList from "../QuizTestGroupQuestionList";

export default function QuizGroupList(props) {
  let testId = props.testId;
  const [quizGroups, setQuizGroups] = useState([]);
  const [quizGroupIdsToDelete, setQuizGroupIdsToDelete] = useState([]);
  const [generateQuizGroupDlgOpen, setGenerateQuizGroupDlgOpen] = useState(false);

  useEffect(getQuizGroups, []);

  function getQuizGroups() {
    const successHandler = res => setQuizGroups(res.data);
    const errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", 3000)
    }
    request("GET", `/get-test-groups-info?testId=${testId}`, successHandler, errorHandlers);
  }

  function updateQuizGroupIdsToDelete(newSelectedGroups) {
    setQuizGroupIdsToDelete(newSelectedGroups.map(quizGroup => quizGroup.quizGroupId));
  }

  function deleteQuizGroups(deletedQuizGroupIds) {
    if (!deletedQuizGroupIds || deletedQuizGroupIds.length === 0) return;
    if (!window.confirm("Bạn có chắc muốn xóa những đề thi này không ?")) return;

    let formData = new FormData();
    formData.append("testId", testId);
    formData.append("quizTestGroupList", deletedQuizGroupIds.join(";"));

    const refreshQuizGroups = (res) => {
      if (res.data < 0) return;
      let remainingQuizGroups = quizGroups.filter(
        (el) => !deletedQuizGroupIds.includes(el.quizGroupId)
      );
      setQuizGroups(remainingQuizGroups);
    }
    const successHandler = (res) => {
      refreshQuizGroups(res);
      successNoti("Xóa đề thi thành công, xem kết quả trên giao diện!", 3000);
    }
    const errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi khi xóa đề thí!", 3000)
    }
    request("POST", "/delete-quiz-test-groups", successHandler, errorHandlers, formData);
  }

  const columns = [
    { field: "groupCode", title: "Mã đề" },
    { field: "note", title: "Ghi chú" },
    { field: "numStudent", title: "Số sinh viên", type: "numeric", cellStyle: { textAlign: 'center' } },
    { field: "numQuestion", title: "Số câu hỏi", type: "numeric", cellStyle: { textAlign: 'center' } },
    { field: "", title: "",
      render: (quizGroup) => (
        <DeleteQuizGroupButton deletedGroupIds={[quizGroup.quizGroupId]}
                               variant="outlined"/>
      )
    }
  ]

  const actions = [
    { icon: () => GenerateQuizGroupButton, isFreeAction: true },
    {
      icon: () => (
        <DeleteQuizGroupButton deletedGroupIds={quizGroupIdsToDelete}
                               variant="contained"/>
      )
    }
  ]

  const GenerateQuizGroupButton = (
    <Button color="primary"
            variant="contained"
            onClick={(_) => setGenerateQuizGroupDlgOpen(true)}>
      Thêm đề
    </Button>
  )

  const DeleteQuizGroupButton = ({deletedGroupIds, variant}) => (
    <Button color="error"
            variant={variant}
            onClick={(_) => deleteQuizGroups(deletedGroupIds)}>
      Xóa
    </Button>
  )

  return (
    <>
      <Card>
        <CardContent>
          <StandardTable
            title="Danh sách đề thi"
            columns={columns}
            data={quizGroups}
            hideCommandBar
            options={{
              selection: true,
              search: true,
              sorting: true
            }}
            actions={actions}
            onSelectionChange={updateQuizGroupIdsToDelete}/>
        </CardContent>
      </Card>

      <QuizTestGroupQuestionList testId={testId} />

      <GenerateQuizTestGroupDialog
        testId={testId}
        onGenerateSuccess={getQuizGroups}
        open={generateQuizGroupDlgOpen}
        onClose={() => setGenerateQuizGroupDlgOpen(false)} />
    </>
  );
}
