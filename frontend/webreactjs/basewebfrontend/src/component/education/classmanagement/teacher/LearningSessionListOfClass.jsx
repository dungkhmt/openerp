import React, { useState, useEffect } from "react";
import { request } from "../../../../api";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import {Card, CardContent} from "@mui/material";
import StandardTable from "../../../table/StandardTable";
import CreateLearningSessionDlg from "./CreateLearningSessionDlg";
import PropTypes from "prop-types";
import { Link, Typography } from "@material-ui/core/";

export default function LearningSessionListOfClass(props) {
  const history = useHistory();
  const classId = props.classId;
  const [learningSessionsOfClass, setLearningSessionsOfClass] = useState([]);
  const [createLearningSessionDlgOpen, setCreateLearningSessionDlgOpen] =
    useState(false);

  useEffect(getLearningSessionsOfClass, []);

  function getLearningSessionsOfClass() {
    request("GET", `/edu/class/get-sessions-of-class/${classId}`, (res) => {
      setLearningSessionsOfClass(res.data);
    });
  }

  function navigateToLearningSessionDetailPage(_, { sessionId }) {
    let url = props.role === "TEACHER" ?
      `/edu/teacher/class/session/detail/${sessionId}` :
      `/edu/student/class/session/detail/${sessionId}` ;
    history.push(url);
  }

  function updateLearningSessionsWhenCreateSuccess(res) {
    console.log("Newly created learning sessions");
    setLearningSessionsOfClass([...learningSessionsOfClass, res.data]);
  }

  const columns = [
    { title: "Tên buổi học", field: "sessionName" },
    { title: "Mô tả", field: "description" },
    { title: "Người tạo", field: "createdByUserLoginId" },
    { title: "Trạng thái", field: "statusId" },
  ];
  const actions = props.role === "TEACHER"
    ? [{ icon: () => CreateLearningSessionButton, isFreeAction: true }]
    : [];

  const CreateLearningSessionButton = (
    <Button
      variant="outlined"
      onClick={() => setCreateLearningSessionDlgOpen(true)}
    >
      Thêm mới
    </Button>
  );

  return (
    <div>
      <Card>
        <CardContent>
          <StandardTable
            title="Danh sách buổi học"
            columns={columns}
            data={learningSessionsOfClass}
            hideCommandBar
            options={{
              selection: false,
              search: true,
              sorting: true,
            }}
            onRowClick={navigateToLearningSessionDetailPage}
            actions={actions}
          />
        </CardContent>
      </Card>

      {props.role === "TEACHER" && (
        <CreateLearningSessionDlg
          classId={classId}
          open={createLearningSessionDlgOpen}
          setOpen={setCreateLearningSessionDlgOpen}
          onCreateSuccess={updateLearningSessionsWhenCreateSuccess}
        />
      )}
    </div>
  );
}

LearningSessionListOfClass.propTypes = {
  classId: PropTypes.string.isRequired,
  role: PropTypes.oneOf(["TEACHER", "STUDENT"])
};
