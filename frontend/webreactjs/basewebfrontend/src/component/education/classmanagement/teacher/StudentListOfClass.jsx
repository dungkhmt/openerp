import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { request, authPostMultiPart } from "../../../../api";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
//import {Button} from "@mui/material";
import { Button, CircularProgress } from "@mui/material";
import StandardTable from "../../../table/StandardTable";

export default function StudentListOfClass({ classId }) {
  const [studentsOfClass, setStudentsOfClass] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);
  const [filename, setFilename] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [uploadMessage, setUploadMessage] = React.useState("");

  const stuCols = [
    {
      field: "id",
      title: "User Login",
      render: (student) => (
        <Link to={`/edu/student/learning/detail/${student.id}`}>
          {student.id}
        </Link>
      ),
    },
    { field: "name", title: "Họ và tên" },
    {
      field: "email",
      title: "Email",
      render: (student) => (
        <a href={`mailto:${student.email}`}>{student.email}</a>
      ),
    },
    {
      field: "",
      title: "",
      render: (student) => (
        <Button
          variant="outlined"
          onClick={() => removeStudentFromClass(student)}
        >
          Loại khỏi lớp
        </Button>
      ),
    },
  ];

  function removeStudentFromClass(student) {
    //setOpenDelStuDialog(true);
    //setStuWillBeDeleted({ id: rowData.id, name: rowData.name });
  }

  useEffect(getStudentsOfClass, []);

  function getStudentsOfClass(type) {
    request("get", `/edu/class/${classId}/students`, (res) => {
      setStudentsOfClass(res.data);
    });
  }
  function onFileChange(event) {
    setFilename(event.target.files[0]);
  }
  const handleUploadExcelUserList = (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setUploadMessage("");
    //alert("handleUploadExcelStudentList " + testId);
    let body = {
      classId: classId,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", filename);

    authPostMultiPart(
      dispatch,
      token,
      "/edu/class/add-students-to-class-excel-upload",
      formData
    )
      .then((res) => {
        setIsProcessing(false);
        console.log("handleFormSubmit, res = ", res);
        setUploadMessage(res.message);
        //if (res.status == "TIME_OUT") {
        //  alert("Time Out!!!");
        //} else {
        //}
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
        //alert("Time Out!!!");
      });
  };

  return (
    <div>
      <input type="file" id="selected-upload-file" onChange={onFileChange} />
      <Button onClick={handleUploadExcelUserList}>Upload</Button>
      {isProcessing ? <CircularProgress /> : ""}

      <StandardTable
        title="Danh sách sinh viên"
        columns={stuCols}
        data={studentsOfClass}
        hideCommandBar
        options={{
          selection: false,
          search: true,
          sorting: true,
        }}
      />
    </div>
  );
}
