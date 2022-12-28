import { Box, Typography } from "@material-ui/core/";
import { teal } from "@material-ui/core/colors";
import { Skeleton } from "@material-ui/lab";
import { authGet, request } from "api";
import PrimaryButton from "component/button/PrimaryButton";
import TertiaryButton from "component/button/TertiaryButton";
import { useEffect, useState } from "react";
import { FcCalendar, FcClock } from "react-icons/fc";
import { useParams } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { addZeroBefore } from "utils/dateutils";
import withScreenSecurity from "../../../withScreenSecurity";
import {Card, CardContent} from "@material-ui/core";

const styles = {
  btn: {
    ml: 1,
  },
  courseName: { fontWeight: (theme) => theme.typography.fontWeightMedium },
  testName: { fontSize: "1.25rem", pt: 1 },
  time: {
    pl: 0.75,
    color: teal[800],
    fontWeight: (theme) => theme.typography.fontWeightMedium,
    fontSize: "1rem",
  },
};

const WEEK_DAYS = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy",];

function QuizTestDetail() {
  let params = useParams();
  let testId = params.id;
  const [testInfo, setTestInfo] = useState();
  const [courseInfo, setCourseInfo] = useState();

  function handleAssignStudents2QuizGroup() {
    let data = { quizTestId: testId };

    request("POST", "auto-assign-participants-2-quiz-test-group",
      (res) => {
        console.log("assign students to groups ", res);
        alert("assign students to groups " + res.data);
      },
      { 401: () => {} },
      data
    );
  }

  function handleAssignQuestions2QuizGroup() {
    let data = { quizTestId: testId, numberQuestions: 10 };

    request("POST", "auto-assign-question-2-quiz-group",
      (res) => {
        console.log("assign questions to groups ", res);
        alert("assign questions to groups " + res.data);
      },
      { 401: () => {} },
      data
    );
  }

  async function getQuizTestDetail() {
    let testInfo = await request("GET", `/get-quiz-test?testId=${params.id}`);
    let courseInfo = await request("GET", `/edu/class/${testInfo.classId}`);

    const date = new Date(testInfo.scheduleDatetime), currentTime = new Date();
    const year = currentTime.getFullYear() === date.getFullYear() ? "" : ` ${date.getFullYear()},`;
    const scheduleDateTime = `${WEEK_DAYS[date.getDay()]},${date.getDate()} Tháng ${date.getMonth() + 1}, ${year} ` +
                             `lúc ${addZeroBefore(date.getHours(), 2)}:${addZeroBefore(date.getMinutes(), 2)}`;

    setTestInfo({ ...testInfo, scheduleDateTime });
    setCourseInfo(courseInfo);
  }

  useEffect(getQuizTestDetail, []);

  return courseInfo ? (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5"
                      sx={styles.courseName}>
            {`${courseInfo.name} (${courseInfo.courseId})`}
          </Typography>
          <Typography variant="subtitle1"
                      sx={styles.testName}>
            {`Kỳ thi: ${testInfo.testName}`}
          </Typography>
          <Typography variant="subtitle1"
                      sx={styles.testName}>
            {`Mã kỳ thi: ${testInfo.testId}`}
          </Typography>
          <Typography variant="subtitle1"
                      sx={styles.testName}>
            {`Trạng thái: ${testInfo.statusId}`}
          </Typography>

          <Box display="flex" alignItems="center" pt={2}>
            <FcClock size={24} />
            <Typography component="span"
                        sx={styles.time}>
              {`${testInfo.duration} phút`}
            </Typography>

            <FcCalendar size={24} style={{ marginLeft: 40 }} />
            <Typography component="span"
                        sx={styles.time}>
              {`${testInfo.scheduleDateTime}`}
            </Typography>

            <TertiaryButton sx={{
                ml: 2,
                fontWeight: (theme) => theme.typography.fontWeightRegular,
              }}
              component={RouterLink}
              to={`/edu/class/quiztest/edit/${testId}`}
            >
              Chỉnh sửa
            </TertiaryButton>
          </Box>
        </CardContent>
      </Card>

      <br />
      <br />

      <Box display="flex" justifyContent="flex-end">
        <PrimaryButton
          sx={styles.btn}
          onClick={(e) => {
            handleAssignStudents2QuizGroup(e);
          }}
        >
          Phân đề cho SV
        </PrimaryButton>

        <PrimaryButton
          sx={styles.btn}
          onClick={(e) => {
            handleAssignQuestions2QuizGroup(e);
          }}
        >
          Phân câu hỏi cho đề
        </PrimaryButton>
      </Box>

      <br />
    </>
  ) : (
    // Loading screen
    <>
      <Typography variant="h5" sx={styles.courseName}>
        <Skeleton width={400} variant="rect" animation="wave" />
      </Typography>
      <Typography variant="subtitle1" sx={styles.testName}>
        <Skeleton width={200} variant="rect" animation="wave" />
      </Typography>

      {/*  */}
      <Box display="flex" alignItems="center" pt={2}>
        {/*  */}
        <Skeleton width={24} height={24} variant="circle" animation="wave" />
        <Typography component="span" sx={styles.time}>
          <Skeleton width={80} variant="rect" animation="wave" />
        </Typography>
      </Box>
    </>
  );
}

const screenName = "SCREEN_VIEW_QUIZ_TEST_TEACHER";
export default withScreenSecurity(QuizTestDetail, screenName, true);
