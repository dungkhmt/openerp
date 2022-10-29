import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { request } from "../../../../api";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import {Button} from "@mui/material";
import StandardTable from "../../../table/StandardTable";

export default function StudentListOfClass({ classId }) {
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
        <Button variant="outlined"
                onClick={() => removeStudentFromClass(student)}>
          Loại khỏi lớp
        </Button>
      )
    }
  ];

  function removeStudentFromClass(student) {
    //setOpenDelStuDialog(true);
    //setStuWillBeDeleted({ id: rowData.id, name: rowData.name });
  }

  useEffect(getStudentsOfClass, []);

  function getStudentsOfClass(type) {
    request("get", `/edu/class/${classId}/students`, (res) => {
        setStudentsOfClass(res.data);
      }
    );
  }

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
