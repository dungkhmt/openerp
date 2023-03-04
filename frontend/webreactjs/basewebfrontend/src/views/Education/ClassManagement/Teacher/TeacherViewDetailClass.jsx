import React, { useState } from "react";
import { useParams } from "react-router";
import {
  a11yProps,
  AntTab,
  AntTabs,
  TabPanel,
} from "../../../../component/tab";
import { useTheme } from "@material-ui/core/styles";
import TeacherViewDetailClassExercises from "./TeacherViewDetailClassExercises";
import TeacherViewDetailClassExerciseSubmission from "./TeacherViewDetailClassExerciseSubmission";
import TeacherViewDetailClassGeneralInfo from "./TeacherViewDetailClassGeneralInfo";
import TeacherViewLogUserQuizList from "../../../../component/education/course/TeacherViewLogUserQuizList";
import TeacherClassViewLearningSessionList from "./TeacherClassViewLearningSessionList";
import withScreenSecurity from "../../../../component/withScreenSecurity";
import StudentListOfClass from "../../../../component/education/classmanagement/teacher/StudentListOfClass";
import StudentsWaitingForApprovalToClass
  from "../../../../component/education/classmanagement/teacher/StudentsWaitingForApprovalToClass";
import AssignmentListOfClass from "../../../../component/education/classmanagement/teacher/AssignmentListOfClass";

const tabsLabel = [
  "Thông tin chung",
  "DS Sinh viên",
  "SV đăng ký",
  "Bài tập",
  "DS nộp bài tập",
  "Lịch sử học",
  "Buổi học",
];

function TeacherViewDetailClass() {
  const params = useParams();
  const classId = params.classId;
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  function handleChangeTab(e, newTab) {
    setSelectedTab(newTab);
  }

  return (
    <div>
      <AntTabs
        value={selectedTab}
        onChange={handleChangeTab}
        aria-label="ant example"
        scrollButtons="auto"
        variant="scrollable"
      >
        {tabsLabel.map((label, idx) => (
          <AntTab key={label} label={label} {...a11yProps(idx)} />
        ))}
      </AntTabs>

      <TabPanel value={selectedTab} index={0} dir={theme.direction}>
        <TeacherViewDetailClassGeneralInfo classId={classId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        <StudentListOfClass classId={classId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        <StudentsWaitingForApprovalToClass classId={classId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        <AssignmentListOfClass classId={classId}
                               userRole="teacher"
                               enableCreateAssignment />
      </TabPanel>

      <TabPanel value={selectedTab} index={4} dir={theme.direction}>
        <TeacherViewDetailClassExerciseSubmission classId={classId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={5} dir={theme.direction}>
        <TeacherViewLogUserQuizList classId={classId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={6} dir={theme.direction}>
        <TeacherClassViewLearningSessionList classId={classId} />
      </TabPanel>
    </div>
  );
}

const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default withScreenSecurity(TeacherViewDetailClass, screenName, true);
