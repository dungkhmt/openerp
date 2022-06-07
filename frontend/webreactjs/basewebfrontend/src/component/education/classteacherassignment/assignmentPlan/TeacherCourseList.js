import { Typography } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
// import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { authPostMultiPart, request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import UpdateTeacherCourseModel from "../UpdateTeacherCourseModel";
import UploadExcelTeacherCourseModel from "../UploadExcelTeacherCourseModel";
import { useStyles } from "./ClassForAssignmentList";

function TeacherCourseList(props) {
  const classes = useStyles();
  const planId = props.planId;

  // Command add button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // const [selectedTeacherCourse, setSelectedTeacherCourse] = useState(null);
  // const [openUpdateTeacherCourse, setOpenUpdateTeacherCourse] = useState(false);

  // Table
  const columns = [
    { title: "Giáo viên", field: "teacherId" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Loại lớp", field: "classType" },
    // { title: "Độ ưu tiên", field: "priority" },
    // { title: "Score", field: "score" },
    // {
    //   title: "",
    //   render: (rowData) => (
    //     <IconButton
    //       color="primary"
    //       aria-label="edit"
    //       onClick={() => {
    //         onUpdatePriority(rowData["teacherId"], rowData["courseId"]);
    //       }}
    //     >
    //       <EditIcon />
    //     </IconButton>
    //   ),
    // },
  ];

  // Funcs
  const customUploadHandle = (selectedFile, choice) => {
    uploadExcel(selectedFile, choice);
    handleModalClose();
  };

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

  // TODO: fix this func
  // function onUpdatePriority(teacherId, courseId) {
  //   //alert("update priority " + teacherId + "-" + courseId);

  //   setSelectedTeacherCourse({
  //     planId: planId,
  //     teacherId: teacherId,
  //     courseId: courseId,
  //   });

  //   handleModalUpdateTeacherCourseOpen();
  // }

  // const handleModalUpdateTeacherCourseOpen = () => {
  //   setOpenUpdateTeacherCourse(true);
  // };

  // const handleModalUpdateTeacherCourseClose = () => {
  //   setOpenUpdateTeacherCourse(false);
  // };

  // TODO: fix this func, error in API not exist
  // const customUpdateHandle = (priority, score) => {
  //   //alert("update  class " + selectedClassId + " with ourload = " + hourLoad);

  //   let data = {
  //     planId: selectedTeacherCourse.planId,
  //     teacherId: selectedTeacherCourse.teacherId,
  //     courseId: selectedTeacherCourse.courseId,
  //     priority: priority,
  //     score: score,
  //   };

  //   request(
  //     "post",
  //     "update-teacher-course",
  //     (res) => {
  //       console.log(res);
  //       alert("Cập nhật " + "  OK");
  //     },
  //     { 401: () => {} },
  //     data
  //   );

  //   handleModalUpdateTeacherCourseClose();
  // };

  const getTeacherForAssignmentList = () => {
    request("GET", "edu/teaching-assignment/teacher-course", (res) => {
      setTeacherCourses(res.data);
    });
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const addTeacherCourseToAssignmentPlan = () => {
    if (selectedRows.length > 0) {
      const data = selectedRows.map((tc) => ({
        teacherCourseId: tc.refId,
        priority: tc.priority,
        score: tc.score, // currently not used in API
      }));

      request(
        "POST",
        `edu/teaching-assignment/plan/${planId}/teacher-course`,
        (res) => {
          const toRemove = new Set(selectedRows.map((tc) => tc.refId));
          const difference = teacherCourses.filter(
            (tc) => !toRemove.has(tc.refId)
          );

          setTeacherCourses(difference);
        },
        {},
        data
      );
    }
  };

  useEffect(() => {
    getTeacherForAssignmentList();
  }, []);

  return (
    <>
      <StandardTable
        title={"Danh sách giáo viên - môn"}
        columns={columns}
        data={teacherCourses}
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
                  onClick={addTeacherCourseToAssignmentPlan}
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

      {/* <UpdateTeacherCourseModel
        open={openUpdateTeacherCourse}
        onClose={handleModalUpdateTeacherCourseClose}
        onUpdateInfo={customUpdateHandle}
        selectedTeacherCourse={selectedTeacherCourse}
      /> */}
    </>
  );
}

export default TeacherCourseList;
