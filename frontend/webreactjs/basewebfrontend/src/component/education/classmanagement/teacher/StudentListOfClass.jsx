import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  //Link,
  Paper,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import MaterialTable from "material-table";
import { request } from "../../../../api";
import { FcConferenceCall } from "react-icons/fc";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";
import NegativeButton from "../../../../component/education/classmanagement/NegativeButton";
import {Button} from "@mui/material";
import StandardTable from "../../../table/StandardTable";

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
  negativeBtn: {
    minWidth: 112,
    marginLeft: 10,
    marginRight: 10,
  },
}));

export default function StudentListOfClass({ classId }) {
  const classes = useStyles();
  const [studentsOfClass, setStudentsOfClass] = useState([]);

  const stuCols = [
    { field: "id", title: "User Login",
      render: student => (
        <Link to={`/edu/student/learning/detail/${student.id}`}>
          {student.id}
        </Link>
      )
    },
    { field: "name", title: "Họ và tên" },
    { field: "email", title: "Email",
      render: student => (
        <a href={`mailto:${student.email}`}>
          {student.email}
        </a>
      )
    },
    { field: "", title: "",
      render: student => (
        <Button onClick={() => removeStudentFromClass(student)}>
          Loại khỏi lớp
        </Button>
      )
    }
  ];

  function removeStudentFromClass(student) {
    //setOpenDelStuDialog(true);
    //setStuWillBeDeleted({ id: rowData.id, name: rowData.name });
  };

  useEffect(getStudentsOfClass, []);

  function getStudentsOfClass(type) {
    request("get", `/edu/class/${classId}/students`, (res) => {
        setStudentsOfClass(res.data);
      }
    );
  };

  return (
    <StandardTable
      title="Danh sách sinh viên"
      columns={stuCols}
      data={studentsOfClass}
      hideCommandBar
      options={{
        selection: false,
        search: true,
        sorting: true
      }}
    />
  )
}
