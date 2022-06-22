import { Box, CircularProgress, Typography } from "@material-ui/core/";
import { teal } from "@material-ui/core/colors";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Skeleton } from "@material-ui/lab";
import { request } from "api";
import PrimaryButton from "component/button/PrimaryButton";
import { a11yProps, AntTab, AntTabs, TabPanel } from "component/tab";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import TeacherCourseList from "../TeacherCourseList";
import TeacherList from "../TeacherList";
import AssignmentStatistic from "./AssignmentStatistic";
import ClassInPlan from "./ClassInPlan";
import ClassTeacherAssignmentSolutionList from "./ClassTeacherAssignmentSolutionList";
import ConflictClassesAssignedToTeacherInSolution from "./ConflictClassesAssignedToTeacherInSolution";
import NotAssignedClassInSolutionList from "./NotAssignedClassInSolutionList";
import PairConflictTimetableClass from "./PairConflictTimetableClass";
import TeacherBasedTimeTableAssignmentInSolution from "./TeacherBasedTimeTableAssignmentInSolution";
import TeacherCourseInPlan from "./TeacherCourseInPlan";
import TeacherInPlan from "./TeacherInPlan";

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
  "Giảng viên",
  "Giảng viên trong KH",
  "Giảng viên-Môn",
  "Giảng viên-Môn trong KH",
  "Kết quả phân công",
  "Lớp chưa được phân công",
];

const objectives = [
  // {
  //   value: "SCORES",
  //   label: "Tối ưu thói quen",
  // },
  // {
  //   value: "PRIORITY",
  //   label: "Tối ưu độ ưu tiên",
  // },
  // {
  //   value: "WORKDAYS",
  //   label: "Tối ưu ngày dạy",
  // },
  {
    value: "LOAD_BALANCING_DURATION_CONSIDERATION",
    label: "Cân bằng tải tính đến thời lượng",
  },
];

const models = [
  {
    value: "MIP",
    label: "MIP",
  },
  {
    value: "CP",
    label: "CP",
  },
];

const solvers = [
  {
    value: "ORTOOLS",
    label: "Or-tools",
  },
  {
    value: "CPLEX",
    label: "Cplex",
  },
];

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function PlanDetail() {
  let planId = useParams().planId;
  let query = useQuery();
  const classes = useStyles();
  const theme = useTheme();

  //
  const [plan, setPlan] = useState();
  const [objective, setObjective] = React.useState(
    "LOAD_BALANCING_DURATION_CONSIDERATION"
  );
  const [solver, setSolver] = React.useState("ORTOOLS");
  const [model, setModel] = React.useState("MIP");

  //
  const configParams = [solver, model, objective];
  const setter = [setSolver, setModel, setObjective];

  //
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    query.get("tab") ? parseInt(query.get("tab")) : 0
  );

  //
  const handleChange = (event, index) => {
    setter[index](event.target.value);
  };

  const handleChangeTab = (event, mode) => {
    setSelectedTab(mode);
  };

  const assignTeacher2Class = () => {
    setIsProcessing(true);

    let data = {
      planId: planId,
      config: { solver: solver, model: model, objective: objective },
    };
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
        {[solvers, models, objectives].map((config, index) => (
          <TextField
            id="outlined-select-assignment-mode"
            select
            className={classes.selectMode}
            label="Mục tiêu phân công"
            value={configParams[index]}
            onChange={(e) => handleChange(e, index)}
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
            {config.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ))}
        <PrimaryButton onClick={() => assignTeacher2Class()}>
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
        {tabsLabel.map((label, index) => (
          <AntTab
            key={label}
            label={label}
            component={Link}
            to={`/edu/teaching-assignment/plan/${planId}/?tab=${index}`}
            {...a11yProps(index)}
          />
        ))}
      </AntTabs>

      <TabPanel value={selectedTab} index={0} dir={theme.direction}>
        <ClassInPlan planId={planId} />
        <PairConflictTimetableClass planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={1} dir={theme.direction}>
        <TeacherList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={2} dir={theme.direction}>
        <TeacherInPlan planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={3} dir={theme.direction}>
        <TeacherCourseList planId={planId} />
      </TabPanel>
      <TabPanel value={selectedTab} index={4} dir={theme.direction}>
        <TeacherCourseInPlan planId={planId} />
      </TabPanel>

      <TabPanel value={selectedTab} index={5} dir={theme.direction}>
        <ClassTeacherAssignmentSolutionList
          planId={planId}
          planName={plan.planName}
        />
        <TeacherBasedTimeTableAssignmentInSolution planId={planId} />
        <ConflictClassesAssignedToTeacherInSolution planId={planId} />
        <AssignmentStatistic planId={planId} />
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
