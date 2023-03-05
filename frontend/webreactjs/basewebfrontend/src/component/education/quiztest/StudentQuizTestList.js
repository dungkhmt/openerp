/* eslint-disable */
import { Card, CardContent } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { request } from "../../../api";
import {errorNoti, successNoti} from "../../../utils/notification";
import StandardTable from "../../table/StandardTable";
import {Box, Chip} from "@material-ui/core";
import {FcApproval, FcCancel} from "react-icons/fc";
import {GiSandsOfTime} from "react-icons/gi";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@mui/material/Button";

function StudentQuizList() {
  const history = useHistory();
  const [openedQuizTests, setOpenedQuizTests] = useState([]);

  async function onRegisterClick(quizid) {
    await registerQuizTest(quizid);
    await getOpenedQuizTests();
  }
  const onClickQuizId = (quizid, viewTypeId) => {
    console.log("click " + quizid);
    history.push(`/edu/class/student/quiztest/detail/${quizid}`, {
      testId: quizid,
      viewTypeId: viewTypeId,
    });
  };

  const columns = [
    { title: "Mã bài thi", field: "testId",
      render: (rowData) =>
        rowData["statusId"] == "STATUS_APPROVED" ? (
          <a
            style={{ cursor: "pointer" }}
            onClick={() => {
              onClickQuizId(rowData["testId"], rowData["viewTypeId"]);
            }}
          >
            {" "}
            {rowData["testId"]}{" "}
          </a>
        ) : (
          <p>{rowData["testId"]}</p>
        ),
    },
    { title: "Tên bài thi", field: "testName" },
    { title: "Thời điểm", field: "scheduleDatetime" },
    { title: "Trạng thái", field: "statusId",
      render: ({testId, statusId}) => (
        statusId == null ?
          <RegisterQuizTestButton testId={testId}/> :
          <RegisterStatusBox status={statusId}/>
      ),
    }
  ]

  useEffect(getOpenedQuizTests, []);

  function getOpenedQuizTests() {
    let successHandler = res => setOpenedQuizTests(res.data);
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi trong khi tải dữ liệu!", true)
    }
    request("GET", "/get-all-quiz-test-user", successHandler, errorHandlers);
  }

  function registerQuizTest(testQuizId) {
    let successHandler = res => {
      successNoti("Đăng ký thành công, vui lòng đợi giáo viên phê duyệt!", true);
      getOpenedQuizTests();
    }
    let errorHandlers = {
      onError: () => errorNoti("Đã xảy ra lỗi khi đăng ký tham gia quiz test", true)
    }
    request("POST", "create-quiz-test-participation-register", successHandler, errorHandlers, {testQuizId});
  }

  const RegisterQuizTestButton = ({testId}) => (
    <Button color="primary"
            variant="contained"
            onClick={() => registerQuizTest(testId)}>
      Tham gia
    </Button>
  );

  return (
    <Card>
      <CardContent>
        <StandardTable title="Danh sách quiz test"
                       columns={columns}
                       data={openedQuizTests}
                       hideCommandBar
                       options={{
                         selection: false,
                         search: true,
                         sorting: true
                       }}/>
      </CardContent>
    </Card>
  );
}

export default StudentQuizList;

const useRegisterStatusBoxStyles = makeStyles((theme) => ({
  approved: {
    color: "green",
    borderColor: "green",
    fontSize: "1rem",
    width: 160,
  },
  pendingApproval: {
    fontSize: "1rem",
  },
}))

/** Private component, do not expose it */
function RegisterStatusBox({ status }) {
  const classes = useRegisterStatusBoxStyles();

  return (
    <Box>
      { status === "STATUS_APPROVED" &&
        <Chip
          icon={<FcApproval size={24} />}
          label="Đã phê duyệt"
          variant="outlined"
          className={classes.approved}
        />
      }

      { status === "STATUS_REGISTERED" &&
        <Chip
          icon={<GiSandsOfTime size={24} />}
          label="Chờ phê duyệt"
          color="primary"
          variant="outlined"
          className={classes.pendingApproval}
        />
      }

      { (status !== "STATUS_APPROVED" && status !== "STATUS_REGISTERED") &&
        <Chip
          icon={<FcCancel size={24} />}
          label="Bị từ chối"
          color="error"
          variant="outlined"
          className={classes.pendingApproval}
        />
      }
    </Box>
  );
}
