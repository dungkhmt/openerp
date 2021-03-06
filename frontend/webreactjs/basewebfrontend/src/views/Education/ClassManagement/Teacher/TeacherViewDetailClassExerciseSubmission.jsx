import { request } from "../../../../api";
import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import {
  //FcApproval,
  //FcClock,
  FcConferenceCall,
  //FcExpired,
  //FcMindMap,
} from "react-icons/fc";
import Button from "@material-ui/core/Button";
import ReactExport from "react-data-export";
import MaterialTable from "material-table";
import { localization, tableIcons } from "../../../../utils/MaterialTableUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    margin: "auto",
    width: `calc(100vw - ${drawerWidth + theme.spacing(4) * 2 + 1}px)`,
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    marginTop: theme.spacing(2),
  },
}));
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export default function TeacherViewDetailClassExerciseSubmission(props) {
  const classes = useStyles();
  //const params = useParams();
  const classId = props.classId;
  //const history = useHistory();
  const [studentAssignmentList, setStudentAssignmentList] = useState([]);
  const [fetchedStudentAssignment, setFetchedStudentAssignment] =
    useState(false);

  const [classDetail, setClassDetail] = useState({});
  //const studentTableRef = useRef(null);
  const studentAssignTableRef = useRef(null);

  const TableBorderStyle = "medium";
  const TableHeaderStyle = {
    style: {
      font: { sz: "14", bold: true },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top: { style: TableBorderStyle },
        bottom: { style: TableBorderStyle },
        left: { style: TableBorderStyle },
        right: { style: TableBorderStyle },
      },
    },
  };

  const TableCellStyle = {
    style: {
      font: { sz: "14" },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top: { style: TableBorderStyle },
        bottom: { style: TableBorderStyle },
        left: { style: TableBorderStyle },
        right: { style: TableBorderStyle },
      },
    },
  };
  const stuAssignCols = [
    {
      field: "studentName",
      title: "H??? v?? t??n sinh vi??n",
    },
  ].concat(
    !fetchedStudentAssignment
      ? []
      : !studentAssignmentList.length
      ? []
      : studentAssignmentList[0].assignmentList.map((assignment, index) => {
          return {
            field: "assignmentList[" + index + "].assignmentStatus",
            title: assignment.assignmentName,
          };
        }),
    [
      {
        field: "totalSubmitedAssignment",
        //field: "totalSubmitedAssignment",
        title: "T???ng s??? b??i n???p",
      },
    ]
  );

  const DataSet = [
    {
      columns: [
        {
          title: "H??? v?? t??n sinh vi??n",
          ...TableHeaderStyle,
          width: { wch: "H??? v?? t??n sinh vi??n".length },
        },
      ].concat(
        !fetchedStudentAssignment
          ? []
          : !studentAssignmentList.length
          ? []
          : studentAssignmentList[0].assignmentList.map((assignment) => {
              return {
                title: assignment.assignmentName,
                ...TableHeaderStyle,
                width: { wch: assignment.assignmentName.length + 3 },
              };
            }),
        [
          {
            title: "T???ng s??? b??i n???p",
            ...TableHeaderStyle,
            width: { wch: "T???ng s??? b??i n???p".length },
          },
        ]
      ),
      data: !fetchedStudentAssignment
        ? []
        : studentAssignmentList.map((data) => {
            return [{ value: data.studentName, ...TableCellStyle }].concat(
              data.assignmentList.map((data2) => {
                return { value: data2.assignmentStatus, ...TableCellStyle };
              }),
              [{ value: data.totalSubmitedAssignment, ...TableCellStyle }]
            );
          }),
    },
  ];
  const getStudentAssignment = () => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/${classId}/all-student-assignments/teacher`,
      (res) => {
        setStudentAssignmentList(res.data);
        setFetchedStudentAssignment(true);
      }
    );
  };

  useEffect(() => {
    //getClassDetail();
    //getAssigns();
    getStudentAssignment();
    //getStudents("register");
    //getStudents();
  }, []);

  return (
    <div>
      <Card className={classes.card}>
        {/* <CardActionArea disableRipple onClick={onClickStuAssignCard}> */}
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              {/*#ffeb3b <PeopleAltRoundedIcon /> */}
              <FcConferenceCall size={40} />
            </Avatar>
          }
          title={<Typography variant="h5">Danh s??ch n???p b??i t???p</Typography>}
          action={
            studentAssignmentList.length !== 0 ? (
              <ExcelFile
                filename={"Danh s??ch n???p b??i t???p l???p " + classDetail.code}
                element={
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "0px" }}
                  >
                    Xu???t Excel
                  </Button>
                }
              >
                <ExcelSheet
                  dataSet={DataSet}
                  name={"Danh s??ch n???p b??i t???p l???p " + classDetail.code}
                />
              </ExcelFile>
            ) : null
          }
        />
        {/* </CardActionArea>
          <Collapse in={openStuAssignCard} timeout="auto"> */}
        <CardContent>
          {/* {studentAssignmentList.length !== 0 ? (
            <ExcelFile
              filename={"Danh s??ch n???p b??i t???p l???p " + classDetail.code}
              element={
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: "0px" }}
                >
                  Xu???t Excel
                </Button>
              }
            >
              <ExcelSheet
                dataSet={DataSet}
                name={"Danh s??ch n???p b??i t???p l???p " + classDetail.code}
              />
            </ExcelFile>
          ) : null} */}
          <MaterialTable
            title=""
            columns={stuAssignCols}
            icons={tableIcons}
            tableRef={studentAssignTableRef}
            localization={localization}
            data={studentAssignmentList}
            components={{
              Toolbar: () => null,
              Container: (props) => <span {...props} elevation={0} />,
            }}
            options={{
              // fixedColumns: {
              //   left: 1,
              //   right: 1,
              // },
              draggable: false,
              filtering: true,
              sorting: true,
              search: false,
              pageSize: 10,
              debounceInterval: 500,
              toolbarButtonAlignment: "left",
              // exportButton: true,
              // exportFileName: "Danh s??ch n???p b??i t???p l???p " + classDetail.code,
              // exportDelimiter: ",",
            }}
          />
        </CardContent>
        {/* </Collapse> */}
      </Card>
    </div>
  );
}
