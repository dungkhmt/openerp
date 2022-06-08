import React, { useState, useEffect } from "react";
import { request } from "../../../../api";
import { Link, Typography } from "@material-ui/core/";
import {
  a11yProps,
  StyledTab,
  StyledTabs,
  TabPanel,
} from "../../../../component/tab";
import MaterialTable from "material-table";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ListWhiteBoard from "../../../../component/education/whiteboard/ListWhiteBoard";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  divider: {
    width: "91.67%",
    marginTop: 16,
    marginBottom: 16,
  },
  rootDivider: {
    backgroundColor: "black",
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function StudentViewLearningSessionList(props) {
  const classId = props.classId;
  const classes = useStyles()
  const [sessions, setSessions] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, tabIndex) => {
    setActiveTab(tabIndex);
  };

  const columns = [
    {
      title: "Tên buổi học",
      field: "sessionId",
      render: (rowData) => (
        <Link
          component={RouterLink}
          to={`/edu/student/class/session/detail/${rowData["sessionId"]}`}
        >
          {rowData["sessionName"]}
        </Link>
      ),
    },
    { title: "Mô tả", field: "description" },
    { title: "Người tạo", field: "createdByUserLoginId" },
    { title: "Trạng thái", field: "statusId" },
  ];

  function getSessionsOfClass() {
    request(
      "get",
      "/edu/class/get-sessions-of-class/" + classId,
      (res) => {
        console.log(res);
        setSessions(res.data);
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getSessionsOfClass();
  }, []);

  return (
    <div>
      <div className={classes.tabs}>
        <StyledTabs
          value={activeTab}
          onChange={handleChange}
          aria-label="ant tabs"
          centered
        >
          <StyledTab label="Danh sách buổi học" {...a11yProps(0)} />
          <StyledTab label="Bảng viết" {...a11yProps(1)} />
        </StyledTabs>
        <Typography className={classes.padding} />
      </div>
      
      <TabPanel value={activeTab} index={0}>
        <MaterialTable
        title="Danh sách buổi học"
        columns={columns}
        data={sessions}
        //icons={tableIcons}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
            filterRow: {
              filterTooltip: "Lọc",
            },
          },
        }}
        options={{
          search: true,
          sorting: false,
          actionsColumnIndex: -1,
          pageSize: 8,
          tableLayout: "fixed",
        }}
        style={{
          fontSize: 14,
        }}
      />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ListWhiteBoard />
        </TabPanel>
    </div>
  );
}
