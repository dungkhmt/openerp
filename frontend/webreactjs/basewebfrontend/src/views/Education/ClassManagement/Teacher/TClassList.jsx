import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  //IconButton,
} from "@material-ui/core";
//import EditIcon from "@material-ui/icons/Edit";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import { FaListUl } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../../api";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";
import withScreenSecurity from "../../../../component/withScreenSecurity";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

function TClassList() {
  const classes = useStyles();
  const history = useHistory();
  //const token = useSelector((state) => state.auth.token);

  // Table.

  const columns = [
    {
      field: "classCode",
      title: "Mã lớp",
    },
    {
      field: "courseId",
      title: "Mã môn",
    },
    {
      field: "courseName",
      title: "Tên môn",
    },
    {
      field: "createdByUserLoginId",
      title: "Người tạo",
    },

    {
      field: "semester",
      title: "Học kỳ",
    },

    {
      field: "statusId",
      title: "Trạng thái",
    },
  ];

  const cols = [
    {
      field: "classCode",
      title: "Mã lớp",
    },
    {
      field: "courseId",
      title: "Mã học phần",
    },
    {
      field: "name",
      title: "Tên học phần",
    },
    {
      field: "classType",
      title: "Loại lớp",
    },
    {
      field: "department",
      title: "Khoa/Viện",
    },
    {
      field: "semester",
      title: "Học kỳ",
    },
    {
      field: "statusId",
      title: "Trạng thái",
    },
  ];

  const [data, setData] = useState([]);
  const [classesOfUser, setClassesOfUser] = useState([]);
  const tableRef = useRef(null);

  // Functions.

  //function onUpdateClass(classId) {
  //  alert("Edit Class ", classId);
  //}
  const getClasses = () => {
    request(
      // token, history,
      "get",
      "/edu/class/list/teacher",
      (res) => {
        changePageSize(res.data.length, tableRef);
        setData(res.data);
      }
    );
  };

  function getClassesOfUser() {
    request(
      // token, history,
      "get",
      "/edu/class/get-classes-of-user/null",
      (res) => {
        //let lst = [];
        //res.data.map((e) => {
        //  lst.push(e);s
        //});
        console.log("getClassesOfUser, res.data = ", res.data);
        //console.log("getClassesOfUser, lst = ", lst);
        setClassesOfUser(res.data);
      }
    );
  }

  useEffect(() => {
    getClasses();
    getClassesOfUser();
  }, []);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ff7043" }}>
              <FaListUl size={24} />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách lớp</Typography>}
        />
        <CardContent>
          <MaterialTable
            title=""
            columns={cols}
            icons={tableIcons}
            tableRef={tableRef}
            localization={localization}
            data={data}
            components={{
              Toolbar: () => null,
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              filtering: true,
              search: false,
              pageSize: 10,
              debounceInterval: 500,
            }}
            onRowClick={(event, rowData) => {
              // console.log(rowData);
              history.push({
                //pathname: `/edu/teacher/class/${rowData.id}`,
                pathname: `/edu/teacher/class/detail/${rowData.id}`,
                state: {},
              });
            }}
          />
        </CardContent>

        <CardContent>
          <MaterialTable
            title=""
            columns={columns}
            icons={tableIcons}
            //tableRef={tableRef}
            //localization={localization}
            data={classesOfUser}
            onRowClick={(event, rowData) => {
              // console.log(rowData);
              history.push({
                //pathname: `/edu/teacher/class/${rowData.id}`,
                pathname: `/edu/teacher/class/detail/${rowData.classId}`,
                state: {},
              });
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default withScreenSecurity(TClassList, screenName, true);
