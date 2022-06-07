import { Card, Typography } from "@material-ui/core/";
import Box from "@material-ui/core/Box";
// import { makeStyles } from "@material-ui/core/styles";
import { request } from "api";
import map from "lodash/map";
import range from "lodash/range";
import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//   },
// }));

// const defaultProps = {
//   bgcolor: "background.paper",
//   style: { width: "5rem", height: "2rem" },
//   borderColor: "text.primary",
// };
const listSession = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const WU = 2; // change this for width of cell
const SU = 8;

function TimeTableHeaderDay({ day, ...rest }) {
  let w = listSession.length;

  return (
    <div>
      <div>
        <Box
          border={1}
          borderTop={2}
          width={w * WU + "rem"}
          height={"2rem"}
          display="flex"
          justifyContent={"center"}
          alignItems={"center"}
          // style={{ borderBottomColor: grey[500] }}
          {...rest}
        >
          Thứ {day}
        </Box>
      </div>
      <div>
        <Box display="flex" justifyContent="center">
          {listSession.map((session) => {
            return (
              <BoxClass
                sz={1}
                code={session}
                // style={{
                //   borderTopColor: grey[500],
                //   borderLeftColor: grey[500],
                //   borderRightColor: grey[500],
                // }}
              />
            );
          })}
        </Box>
      </div>
    </div>
  );
}

function TimeTableHeaderSpaceLeft() {
  return (
    <div>
      <BoxClass
        code={"Giảng viên"}
        sz={SU}
        height={"4rem"}
        borderTop={2}
        borderLeft={2}
      />
    </div>
  );
}

function TimeTableHeader() {
  return (
    <Box display="flex" border={"none"}>
      <TimeTableHeaderSpaceLeft />
      <TimeTableHeaderDay day={2} />
      <TimeTableHeaderDay day={3} />
      <TimeTableHeaderDay day={4} />
      <TimeTableHeaderDay day={5} />
      <TimeTableHeaderDay day={6} />
      <TimeTableHeaderDay day={7} />
    </Box>
  );
}

function BoxClass({ code, planId, sz, bgColor, ...rest }) {
  // function handleClick() {
  //   alert("Class " + code);
  //   //props.root.suggestTeacherListForClass(code);

  //   let data = {
  //     classId: code,
  //     planId: planId,
  //   };

  //   request(
  //     "POST",
  //     "get-suggested-teacher-and-actions-for-class",
  //     (res) => {
  //       alert("suggested teacher list: " + JSON.stringify(res.data));
  //     },
  //     { 401: () => {} },
  //     data
  //   );
  // }

  return (
    <Box
      border={1}
      width={sz * WU + "rem"}
      height={"2rem"}
      display="flex"
      justifyContent={"center"}
      alignItems="center"
      bgcolor={bgColor}
      color={"text.primary"}
      {...rest}
      // onClick={() => {
      //   handleClick();
      // }}
    >
      {code}
    </Box>
  );
}

function TimeTableSpace({ sz }) {
  return (
    <Box display="flex" justifyContent="center">
      {map(range(sz), (_) => {
        return <Box border={1} height={"2rem"} width={WU + "rem"} />;
      })}
    </Box>
  );
}

function TimeTableElement(props) {
  const drawClass = (startIndexFromPrevious, classCode, duration, bgColor) => (
    <Box display="flex" justifyContent="center">
      <TimeTableSpace sz={startIndexFromPrevious} />
      <BoxClass
        code={classCode}
        planId={props.planId}
        sz={duration}
        bgColor={bgColor}
        root={props.root}
      />
    </Box>
  );

  const drawConflictClasses = (classes, fromIndex, toIndex) => {
    const firstClass = classes[fromIndex];
    let classCode = firstClass.classCode + ", ";
    let duration = firstClass.duration;

    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const c = classes[i];
      classCode += c.classCode + (i === toIndex ? "" : ", ");
      duration += c.startIndexFromPrevious + c.duration;
    }

    return drawClass(
      firstClass.startIndexFromPrevious,
      classCode,
      duration,
      "error.main"
    );
  };

  const drawClasses = () => {
    const { list: classes } = props;
    const n = classes.length;
    const result = [];

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const boxClassJ = classes[j];

        if (boxClassJ.startIndexFromPrevious > -1) {
          if (j === i + 1) {
            result.push(
              drawClass(
                classes[i].startIndexFromPrevious,
                classes[i].classCode,
                classes[i].duration,
                "info.main"
              )
            );
          } else {
            // Paint class i to j-1
            result.push(drawConflictClasses(classes, i, j - 1));
          }
          i = j - 1;
          break;
        } else {
          if (j === n - 1) {
            // The last block
            result.push(drawConflictClasses(classes, i, j));
            i = j + 1; // To break for i loop because all element are drew
          }
        }
      }

      if (i === n - 1) {
        // Paint class j
        result.push(
          drawClass(
            classes[i].startIndexFromPrevious,
            classes[i].classCode,
            classes[i].duration,
            "info.main"
          )
        );
      }
    }

    result.push(<TimeTableSpace sz={props.remainEmptySlots} />);
    return result;
  };

  return (
    <Box display="flex" justifyContent="left">
      <BoxClass code={props.teacherId} sz={SU} borderLeft={2} />
      {drawClasses()}
    </Box>
  );
}

function TimeTable({ data, planId, root }) {
  // console.log("TimeTable data = " + JSON.stringify(data));
  //console.log("TimeTable planId (from root) = " + root.planId);
  return (
    <div>
      {data.map((e) => {
        return (
          <Box display="flex" justifyContent="left">
            <TimeTableElement
              list={e.classList}
              planId={planId}
              teacherId={e.teacherId}
              remainEmptySlots={e.remainEmptySlots}
              root={root}
            />
          </Box>
        );
      })}
    </div>
  );
}

function TeacherBasedTimeTableAssignmentInSolution(props) {
  const planId = props.planId;
  // const classes = useStyles();
  const [dataTimeTable, setDataTimeTable] = useState([]);
  // const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  // const [selectedClassId, setSelectedClassId] = useState(null);

  // const [openSuggestion, setOpenSuggestion] = React.useState(false);

  // const data = [
  //   {
  //     teacherId: "dung.phamquang@hust.edu.vn",
  //     classes: [
  //       { classCode: "110222", startIndexFromPrevious: 2, duration: 4 },
  //       { classCode: "324593", startIndexFromPrevious: 7, duration: 2 },
  //     ],
  //   },
  //   {
  //     teacherId: "trung.buiquoc@hust.edu.vn",
  //     classes: [
  //       { classCode: "420222", startIndexFromPrevious: 1, duration: 4 },
  //       { classCode: "324400", startIndexFromPrevious: 2, duration: 4 },
  //       { classCode: "324900", startIndexFromPrevious: 3, duration: 4 },
  //     ],
  //   },
  // ];

  const getDataTimeTableList = () => {
    request(
      "GET",
      //"/get-classes-assigned-to-a-teacher-solution/" + planId,
      `edu/teaching-assignment/plan/${planId}/solution/grid-view`,
      (res) => {
        // console.log("Gird TimeTable data = " + JSON.stringify(res.data));
        setDataTimeTable(res.data);
      }
    );
  };

  // const suggestTeacherListForClass = (classId) => {
  //   alert("suggest teacher list for class " + classId);
  // };
  // const customSelectTeacherHandle = (selectedTeacherId) => {};

  // const handleSuggestionModalClose = () => {
  //   setOpenSuggestion(false);
  // };

  // function handleBtnClick() {
  //   alert("Phân công lại");
  // }

  useEffect(() => {
    getDataTimeTableList();
  }, []);

  return (
    <Card
      style={{
        maxWidth: "100%",
        padding: 16,
        marginTop: 48,
      }}
    >
      <Box display="flex" pt={1} paddingBottom={2}>
        <Typography component="h6" style={{ fontSize: "1.25rem" }}>
          Biểu đồ lịch giảng dạy theo tuần
        </Typography>
        {/* <PrimaryButton
          // className={classes.btn}
          onClick={(e) => {
            handleBtnClick(e);
          }}
        >
          Phân công lại
        </PrimaryButton> */}
      </Box>
      <SimpleBar
        style={{
          maxWidth: "100%",
          paddingBottom: 16,
        }}
      >
        <TimeTableHeader />
        <TimeTable data={dataTimeTable} root={this} planId={planId} />
      </SimpleBar>
    </Card>
  );
}

export default TeacherBasedTimeTableAssignmentInSolution;
