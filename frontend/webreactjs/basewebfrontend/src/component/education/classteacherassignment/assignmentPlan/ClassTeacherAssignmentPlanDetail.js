import { Box, CircularProgress, Typography } from "@material-ui/core/";
import { teal } from "@material-ui/core/colors";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Skeleton } from "@material-ui/lab";
import { request } from "api";
import PrimaryButton from "component/button/PrimaryButton";
import { a11yProps, AntTab, AntTabs, TabPanel } from "component/tab";
import React, { lazy, useEffect, useState } from "react";
import { useParams } from "react-router";
import ClassForAssignmentList from "./ClassForAssignmentList";
import PairConflictTimetableClass from "./PairConflictTimetableClass";

const ClassesAssignToATeacherList = lazy(() =>
  import("./ClassesAssignToATeacherList")
);

const ClassTeacherAssignmentSolutionList = lazy(() =>
  import("./ClassTeacherAssignmentSolutionList")
);
const ConflictClassesAssignedToTeacherInSolution = lazy(() =>
  import("./ConflictClassesAssignedToTeacherInSolution")
);
const NotAssignedClassInSolutionList = lazy(() =>
  import("./NotAssignedClassInSolutionList")
);

const TeacherBasedTimeTableAssignmentInSolution = lazy(() =>
  import("./TeacherBasedTimeTableAssignmentInSolution")
);
const TeacherCourseForAssignmentList = lazy(() =>
  import("./TeacherCourseForAssignmentList")
);
const TeacherCourseList = lazy(() => import("./TeacherCourseList"));
const TeacherForAssignmentPlanList = lazy(() =>
  import("./TeacherForAssignmentPlanList")
);
const TeacherList = lazy(() => import("./TeacherList"));

const useStyles = makeStyles((theme) => ({
  courseName: { fontWeight: theme.typography.fontWeightMedium },
  time: {
    paddingLeft: 6,
    color: teal[800],
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: "1rem",
  },
  selectMode: {
    minWidth: 300,
    marginRight: 16,
  },
  popoverPaper: {
    minWidth: 300,
    borderRadius: 8,
    boxShadow:
      "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
  },
  modeList: {
    paddingLeft: 8,
    paddingRight: 8,
    "& .MuiListItem-root": {
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 6,
    },
    "& .Mui-selected, .Mui-selected:hover": {
      color: "#ffffff",
      backgroundColor: "#1976d2", // updated backgroundColor
    },
  },
  tabs: {
    position: "sticky",
    top: 64,
    zIndex: 11,
    backgroundColor: "#fafafa",
  },
}));

const tabsLabel = [
  "DS lớp",
  "Giáo viên",
  "Giáo viên trong KH",
  "Giáo viên-môn",
  "Giáo viên-môn trong KH",
  "Kết quả phân công",
  "Lớp chưa được phân công",
];

const assignmentModes = [
  {
    value: "SCORES",
    label: "Tối ưu thói quen",
  },
  {
    value: "PRIORITY",
    label: "Tối ưu độ ưu tiên",
  },
  {
    value: "WORKDAYS",
    label: "Tối ưu ngày dạy",
  },
  {
    value: "LOAD_BALANCING_DURATION_CONSIDERATION",
    label: "Cân bằng tải tính đến thời lượng",
  },
];

export default function ClassTeacherAssignmentPlanDetail() {
  let planId = useParams().planId;
  const classes = useStyles();
  const theme = useTheme();

  //
  const [plan, setPlan] = useState();
  const [mode, setMode] = React.useState("SCORES");

  //
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  //
  const handleChangeMode = (event) => {
    setMode(event.target.value);
  };

  const handleChangeTab = (event, mode) => {
    setSelectedTab(mode);
  };

  const assignTeacher2Class = (solver) => {
    setIsProcessing(true);

    let data = { planId: planId, solver: solver };
    // console.log(data);

    request(
      "post",
      "auto-assign-teacher-2-class",
      (res) => {
        setIsProcessing(false);
      },
      { 401: () => {} },
      data
    );
  };

  useEffect(() => {
    function getClassTeacherAssignmentPlanDetail() {
      request(
        "get",
        "get-class-teacher-assignment-plan/detail/" + planId,
        (res) => {
          setPlan(res.data);
        },
        { 401: () => {} }
      );
    }

    getClassTeacherAssignmentPlanDetail();
  }, []);

  return plan ? (
    <>
      <Typography variant="h5">{`${plan.planName}`}</Typography>

      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <TextField
          id="outlined-select-assignment-mode"
          select
          className={classes.selectMode}
          label="Mục tiêu phân công"
          value={mode}
          onChange={handleChangeMode}
          variant="outlined"
          size="small"
          SelectProps={{
            MenuProps: {
              classes: { list: classes.modeList },
              PopoverClasses: {
                paper: classes.popoverPaper,
              },
            },
          }}
        >
          {assignmentModes.map((mode) => (
            <MenuItem key={mode.value} value={mode.value}>
              {mode.label}
            </MenuItem>
          ))}
        </TextField>
        <PrimaryButton onClick={() => assignTeacher2Class(mode)}>
          Phân công
        </PrimaryButton>
      </Box>

      {isProcessing ? <CircularProgress /> : ""}
      <AntTabs
        className={classes.tabs}
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
        <ClassForAssignmentList planId={planId} />
        <PairConflictTimetableClass planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        <TeacherList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        <TeacherForAssignmentPlanList planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        <TeacherCourseList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={4} dir={theme.direction}>
        <TeacherCourseForAssignmentList planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={5} dir={theme.direction}>
        <TeacherBasedTimeTableAssignmentInSolution planId={planId} />
        <ClassTeacherAssignmentSolutionList
          planId={planId}
          planName={plan.planName}
        />

        <ConflictClassesAssignedToTeacherInSolution planId={planId} />
        <ClassesAssignToATeacherList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={6} dir={theme.direction}>
        <NotAssignedClassInSolutionList planId={planId} />
      </TabPanel>
    </>
  ) : (
    // Loading screen
    <>
      <Typography variant="h5" className={classes.courseName}>
        <Skeleton width={400} variant="rect" animation="wave" />
      </Typography>
      <Typography variant="subtitle1" className={classes.testName}>
        <Skeleton width={200} variant="rect" animation="wave" />
      </Typography>

      <Box display="flex" alignItems="center" pt={2}>
        <Skeleton width={24} height={24} variant="circle" animation="wave" />
        <Typography component="span" className={classes.time}>
          <Skeleton width={80} variant="rect" animation="wave" />
        </Typography>
      </Box>
    </>
  );
}
