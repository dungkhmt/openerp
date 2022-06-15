import { Typography } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { authPostMultiPart, request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "./assignmentPlan/ClassInPlan";
import UploadExcelTeacherCourseModel from "./UploadExcelTeacherCourseModel";

const columns = [
  { title: "Mã Giáo viên", field: "id" },
  { title: "Tên", field: "teacherName" },
];

function TeacherList(props) {
  const planId = props.planId;
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [teacherList, setTeacherList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Funcs
  // TODO: fix this func
  function uploadExcel(selectedFile, choice) {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      planId: planId,
      choice: choice,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(dispatch, token, "/upload-excel-teacher-course", formData)
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);

        //var f = document.getElementById("selected-upload-file");
        //f.value = null;
        //setSelectedFile(null);
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
      });
  }

  const customUploadHandle = (selectedFile, choice) => {
    uploadExcel(selectedFile, choice);
    handleModalClose();
  };

  function getTeacherList() {
    request("GET", "edu/teaching-assignment/teacher", (res) => {
      setTeacherList(res.data);
    });
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const addTeacherToAssignmentPlan = () => {
    if (selectedRows.length > 0) {
      const data = selectedRows.map((row) => ({
        teacherId: row.id,
        maxHourLoad: 0,
      }));

      request(
        "POST",
        `edu/teaching-assignment/plan/${planId}/teacher`,
        (res) => {
          const toRemove = new Set(selectedRows.map((row) => row.id));
          const difference = teacherList.filter(
            (teacher) => !toRemove.has(teacher.id)
          );

          setTeacherList(difference);
        },
        {},
        data
      );
    }
  };

  useEffect(() => {
    getTeacherList();
  }, []);

  return (
    <>
      <StandardTable
        title={"Danh sách giáo viên"}
        columns={columns}
        data={teacherList}
        classNames={{ commandBar: classes.commandBar }}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
        commandBarComponents={
          <>
            {selectedRows.length === 0 ? (
              <>
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<PublishRoundedIcon />}
                  onClick={handleModalOpen}
                >
                  Tải lên Excel
                </TertiaryButton>
              </>
            ) : (
              <>
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<AddIcon />}
                  onClick={addTeacherToAssignmentPlan}
                >
                  Thêm vào kế hoạch
                </TertiaryButton>
                <Typography
                  component="span"
                  style={{ marginLeft: "auto", marginRight: 32 }}
                >{`Đã chọn ${selectedRows.length} mục`}</Typography>
              </>
            )}
          </>
        }
      />

      <UploadExcelTeacherCourseModel
        open={open}
        onClose={handleModalClose}
        onUpload={customUploadHandle}
      />
    </>
  );
}

export default TeacherList;
