import React, { useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import withScreenSecurity from "../../../../component/withScreenSecurity";
import StudentLearningProgressDetailQuiz from "./StudentLearningProgressDetailQuiz";
import StudentLearningProgressDetailQuizInClass from "./StudentLearningProgressDetailQuizInClass";

import {
  a11yProps,
  AntTab,
  AntTabs,
  TabPanel,
} from "../../../../component/tab";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const tabsLabel = ["Thông tin chung", "Quiz", "Quiz In Class", "Video"];

function StudentLearningProgressDetail() {
  const params = useParams();
  const studentId = params.id;
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
        BLANK
      </TabPanel>
      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        <StudentLearningProgressDetailQuiz studentId={studentId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        <StudentLearningProgressDetailQuizInClass studentId={studentId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        BLANK
      </TabPanel>
    </div>
  );
}
const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default withScreenSecurity(
  StudentLearningProgressDetail,
  screenName,
  true
);
