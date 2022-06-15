import { Typography } from "@material-ui/core/";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
// import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { authPostMultiPart, request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import UpdateTeacherCourseForAssignmentModel from "../UpdateTeacherCourseForAssignmentModel";
import UploadExcelTeacherCourseModel from "../UploadExcelTeacherCourseModel";
import { useStyles } from "./ClassInPlan";

function TeacherCourseInPlan(props) {
  const planId = props.planId;
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);

  const [open, setOpen] = React.useState(false);
  // const [openUpdateTeacherCourse, setOpenUpdateTeacherCourse] = useState(false);
  // const [selectedTeacherCourse, setSelectedTeacherCourse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

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
    //         onUpdatePriority(rowData);
    //       }}
    //     >
    //       <EditIcon />
    //     </IconButton>
    //   ),
    // },
  ];

  // function onUpdatePriority(rowData) {
  //   setSelectedTeacherCourse({ ...rowData });

  //   handleModalUpdateTeacherCourseOpen();
  // }

  // const handleModalUpdateTeacherCourseOpen = () => {
  //   setOpenUpdateTeacherCourse(true);
  // };

  // const handleModalUpdateTeacherCourseClose = () => {
  //   setOpenUpdateTeacherCourse(false);
  // };

  // const customUpdateHandle = (priority, score) => {
  //   delete selectedTeacherCourse["table"];
  //   const data = {
  //     ...selectedTeacherCourse,
  //     priority: priority,
  //     // score: score,
  //   };

  //   request(
  //     "PUT",
  //     `edu/teaching-assignment/plan/${planId}/teacher-course`,
  //     (res) => {
  //       const index = teacherCourses.findIndex(
  //         (tc) => tc.teacherCourseId === data.teacherCourseId
  //       );

  //       const updatedTeacherCourses = teacherCourses.map((tc, i) => {
  //         if (i !== index) return tc;
  //         return data;
  //       });

  //       setTeacherCourses(updatedTeacherCourses);
  //     },
  //     { 401: () => {} },
  //     data
  //   );

  //   handleModalUpdateTeacherCourseClose();
  // };

  // TODO: upgrade this func
  const uploadExcel = (selectedFile, choice) => {
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
  };

  const customUploadHandle = (selectedFile, choice) => {
    uploadExcel(selectedFile, choice);
    handleModalClose();
  };

  const getTeacherCourseForAssignmentList = () => {
    request(
      "GET",
      `edu/teaching-assignment/plan/${planId}/teacher-course`,
      (res) => {
        setTeacherCourses(res.data);
      }
    );
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const removeTeacherCourseFromAssignmentPlan = () => {
    if (selectedRows.length > 0) {
      const data = selectedRows.map((tc) => ({
        teacherCourseId: tc.teacherCourseId,
        planId: tc.planId,
        teacherId: tc.teacherId,
        courseId: tc.courseId,
        classType: tc.classType,
      }));

      request(
        "DELETE",
        `edu/teaching-assignment/plan/${planId}/teacher-course`,
        (res) => {
          const toRemove = new Set(
            selectedRows.map((tc) => tc.teacherCourseId)
          );
          const difference = teacherCourses.filter(
            (tc) => !toRemove.has(tc.teacherCourseId)
          );

          setTeacherCourses(difference);
        },
        {},
        data
      );
    }
  };

  useEffect(() => {
    getTeacherCourseForAssignmentList();
  }, []);

  return (
    <>
      <StandardTable
        title={"Danh sách giáo viên"}
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
                  startIcon={<DeleteRoundedIcon />}
                  onClick={removeTeacherCourseFromAssignmentPlan}
                >
                  Xoá
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

      {/* <UpdateTeacherCourseForAssignmentModel
        open={openUpdateTeacherCourse}
        onClose={handleModalUpdateTeacherCourseClose}
        onUpdateInfo={customUpdateHandle}
        selectedTeacherCourse={selectedTeacherCourse}
      /> */}
    </>
  );
}

export default TeacherCourseInPlan;
