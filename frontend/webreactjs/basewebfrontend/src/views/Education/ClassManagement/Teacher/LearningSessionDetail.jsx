import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router";
import {
  a11yProps, AntTab, AntTabs,
  StyledTab,
  StyledTabs,
  TabPanel,
} from "../../../../component/tab";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import QuizTestListOfClassSession from "./QuizTestListOfClassSession";
import ListWhiteBoard from "../../../../component/education/whiteboard/ListWhiteBoard";
import {request} from "../../../../api";
import {errorNoti} from "../../../../utils/notification";
import {useHistory} from "react-router-dom";

const tabsLabel = [
  "Quiz test",
  "Bảng viết"
]

export default function LearningSessionDetail(props) {
  const params = useParams();
  const sessionId = params.sessionId;
  const [sessionDetail, setSessionDetail] = useState();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(getSessionDetail, []);

  function getSessionDetail() {
    let successHandler = res => setSessionDetail(res.data);
    let errorHandlers = {
      onError: (error) => errorNoti("Đã xảy ra lỗi trong khi lấy thông tin buổi học!", true)
    }
    request("GET", `/edu/class/get-session-detail/${sessionId}`, successHandler, errorHandlers);
  }

  function handleTabChange(event, tabIndex) {
    setActiveTab(tabIndex);
  }

  return (
    <div>
      { sessionDetail &&
        <h1>{sessionDetail.sessionName}</h1>
      }

      <AntTabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="ant example"
        scrollButtons="auto"
        variant="scrollable"
      >
        {tabsLabel.map((label, idx) => (
          <AntTab key={label} label={label} {...a11yProps(idx)} />
        ))}
      </AntTabs>

      <TabPanel value={activeTab} index={0}>
        <QuizTestListOfClassSession sessionId={sessionId}
                                    role={props.role}/>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <ListWhiteBoard />
      </TabPanel>
    </div>
  );
}
