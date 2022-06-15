import { Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core/";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import SuggestedTeacherListForSelectedClassDialog from "../SuggestedTeacherListForSelectedClassDialog";
import { useStyles } from "./ClassInPlan";

function ClassTeacherAssignmentSolutionList(props) {
  const classes = useStyles();
  const { planId, planName } = props;

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [open, setOpen] = React.useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState({});
  const [suggestionData, setSuggestionData] = useState();

  // Table
  const columns = [
    { title: "Mã lớp", field: "classCode" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên học phần", field: "courseName" },
    { title: "Loại lớp", field: "classType" },
    { title: "Mã giảng viên", field: "teacherId" },
    { title: "Tên giảng viên", field: "teacherName" },
    { title: "Thời khoá biểu", field: "timetable", sorting: false },
    {
      title: "",
      field: "pinned",
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="pin"
          onClick={() => {
            onChangePin({
              classId: rowData["classCode"],
              pinned: rowData["pinned"],
              teacherId: rowData["teacherId"],
            });
          }}
        >
          {rowData["pinned"] ? <PushPinIcon /> : <PushPinOutlinedIcon />}
        </IconButton>
      ),
    },
    {
      title: "",
      sorting: false,
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onSuggestTeacher({
              classId: rowData["classCode"],
            });
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  // Funcs
  const onChangePin = (row) => {
    const { classId, pinned, teacherId } = row;
    console.log(pinned);
    let data = {
      planId: planId,
      classId: classId,
      teacherId: teacherId,
      pinned: !pinned, // Only this attribute change
    };

    request(
      "PUT",
      `edu/teaching-assignment/plan/${planId}/solution`,
      (res) => {
        const index = assignments.findIndex((s) => s.classCode === classId);

        const updatedClassList = assignments.map((s, i) => {
          if (i === index) {
            s.pinned = !pinned;
          }
          return s;
        });

        setAssignments(updatedClassList);
      },
      { 401: () => {} },
      data
    );
  };

  const getClassTeacherAssignmentSolutionList = () => {
    request("GET", `edu/teaching-assignment/plan/${planId}/solution`, (res) => {
      setAssignments(res.data);
    });
  };

  // Modal
  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSuggestionData(undefined);
  };

  const onSuggestTeacher = (selectedAssignment) => {
    setSelectedAssignment(selectedAssignment);
    handleModalOpen();

    request(
      "GET",
      `edu/teaching-assignment/plan/${planId}/class/${selectedAssignment.classId}/suggested-teacher-and-actions`,
      (res) => {
        setSuggestionData(res.data);
        console.log("SUGGEST TEACHERS ", res.data);
      },
      { 401: () => {} }
    );
  };

  const onReassign = (teacherId) => {
    console.log(teacherId);
    const { classId } = selectedAssignment;
    let data = {
      planId: planId,
      classId: classId,
      teacherId: teacherId,
      pinned: true,
    };

    request(
      "PUT",
      `edu/teaching-assignment/plan/${planId}/solution`,
      (res) => {
        const index = assignments.findIndex((s) => s.classCode === classId);

        const updatedClassList = assignments.map((s, i) => {
          if (i === index) {
            s.teacherId = teacherId;
            s.teacherName = teachers[teacherId];
            s.pinned = true;
          }
          return s;
        });

        setAssignments(updatedClassList);
      },
      { 401: () => {} },
      data
    );

    handleClose();
  };

  // function onRemoveTeacher(solutionItemId) {
  //   setIsProcessing(true);
  //   let datasend = { solutionItemId: solutionItemId };
  //   request(
  //     // token,
  //     // history,
  //     "post",
  //     "manual-remove-class-teacher-assignment-solution",
  //     (res) => {
  //       console.log(res);
  //       alert("Huy phân giảng viên " + " cho lớp " + "  OK");
  //       setIsProcessing(false);
  //       getClassTeacherAssignmentSolutionList();
  //     },
  //     { 401: () => {} },
  //     datasend
  //   );
  // }

  const removeAssignmentSolution = () => {
    if (selectedRows.length > 0) {
      let data = selectedRows.map((row) => row.solutionItemId);

      request(
        "DELETE",
        `edu/teaching-assignment/plan/${planId}/solution`,
        (res) => {
          const toRemove = new Set(
            selectedRows.map((row) => row.solutionItemId)
          );
          const difference = assignments.filter(
            (row) => !toRemove.has(row.solutionItemId)
          );

          setAssignments(difference);
        },
        {},
        data
      );
    }
  };

  function exportExcel() {
    request(
      "GET",
      `/edu/teaching-assignment/plan/${planId}/solution/export-excel`,
      (res) => {
        saveFile(planName + ".xlsx", res.data);
      },
      {},
      {},
      { responseType: "blob" }
    );
  }

  const saveFile = (fileName, data) => {
    let blob = new Blob([data]);

    //IE11 support
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      let link = window.document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // other browsers
      // Second approach but cannot specify saved name!
      // let file = new File([data], fileName, { type: "application/zip" });
      // let exportUrl = URL.createObjectURL(file);
      // window.location.assign(exportUrl);
      // URL.revokeObjectURL(exportUrl);
    }
  };

  useEffect(() => {
    getClassTeacherAssignmentSolutionList();

    // Get teacher info for update assignment
    request("GET", "edu/teaching-assignment/teacher", (res) => {
      const teachers = {};
      res.data.forEach((t) => {
        teachers[t.id] = t.teacherName;
      });

      setTeachers(teachers);
    });
  }, []);

  return (
    <>
      {/* <Box
        position="relative"
        top={64}
        borderWidth={1}
        borderRadius={10}
        borderColor="#0000001a"
        bgcolor={blue[200]}
        style={{ backgroundColor: blue[200] }}
      >
        <Typography component="span">
          Các phương án phân công được ghim sẽ không thay đổi khi chạy thuật
          toán phân công
        </Typography>
      </Box> */}
      <StandardTable
        title={"Danh sách lớp được phân công"}
        columns={columns}
        data={assignments}
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
                  onClick={exportExcel}
                >
                  Xuất excel
                </TertiaryButton>
              </>
            ) : (
              <>
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<DeleteRoundedIcon />}
                  onClick={removeAssignmentSolution}
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

      <SuggestedTeacherListForSelectedClassDialog
        open={open}
        handleClose={handleClose}
        onReassign={onReassign}
        classId={selectedAssignment.classId}
        suggestions={suggestionData}
      />
    </>
  );
}

export default ClassTeacherAssignmentSolutionList;
