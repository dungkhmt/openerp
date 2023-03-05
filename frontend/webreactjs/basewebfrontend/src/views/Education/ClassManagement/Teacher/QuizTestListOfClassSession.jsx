import React, { useState, useEffect } from "react";
import { request } from "../../../../api";
import { Button, Tooltip } from "@material-ui/core/";

import LearningSessionFormAddQuizTest from "./LearningSessionFormAddQuizTest";
import {useHistory} from "react-router";
import {errorNoti} from "../../../../utils/notification";
import StandardTable from "../../../../component/table/StandardTable";
import {Card, CardContent} from "@material-ui/core";

export default function QuizTestListOfClassSession(props) {
  const history = useHistory();
  const sessionId = props.sessionId;
  const [quizTests, setQuizTests] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(getQuizTestsOfSession, []);

  function getQuizTestsOfSession() {
    let successHandler = res => setQuizTests(res.data);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu", true)
    }
    request("GET", `/edu/class/get-quiz-test-list-of-session/${sessionId}`, successHandler, errorHandlers);
  }

  function navigateToQuizTestDetailPage(event, quickQuiztest) {
    let url = props.role === "TEACHER" ?
      `/edu/class/quiztest/detail/${quickQuiztest.testId}` :
      `/edu/class/student/quiztest/detail/${quickQuiztest.testId}`;
    history.push(url);
  }

  const CreateSessionQuizTestButton = (
    <Button color="primary"
            variant="outlined"
            onClick={() => setOpen(true)}>
      Thêm mới
    </Button>
  );

  const columns = [
    { field: "testId", title: "Mã kỳ thi" },
    { field: "testName", title: "Tên kỳ thi" },
    { field: "statusId", title: "Trạng thái" },
  ];

  const actions = props.role === "TEACHER" ?
    [{ icon: () => CreateSessionQuizTestButton, isFreeAction: true }] : null;

  return (
    <div>
      <Card>
        <CardContent>
          <StandardTable title="Danh sách quiz test"
                         columns={columns}
                         data={quizTests}
                         hideCommandBar
                         options={{
                           selection: false,
                           search: true,
                           sorting: true
                         }}
                         actions={actions}
                         onRowClick={navigateToQuizTestDetailPage} />
        </CardContent>
      </Card>
      <LearningSessionFormAddQuizTest
        open={open}
        setOpen={setOpen}
        sessionId={sessionId}
      />
    </div>
  );
}
