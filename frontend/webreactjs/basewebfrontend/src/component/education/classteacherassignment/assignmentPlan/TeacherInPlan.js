import { IconButton, Typography } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/Edit";
import { request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import UpdateTeacherForAssignmentDialog from "../UpdateTeacherForAssignmentDialog";
import { useStyles } from "./ClassInPlan";

function TeacherInPlan(props) {
  const classes = useStyles();
  const planId = props.planId;

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  //
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [open, setOpen] = React.useState(false);

  // Table
  const columns = [
    { title: "Email", field: "teacherId" },
    // { title: "Tên", field: "teacherName" },
    { title: "Tải tối đa", field: "maxHourLoad" },
    // { title: "Tối ưu số ngày", field: "minimizeNumberWorkingDays" },
    {
      title: "",
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onUpdateTeacher(rowData["teacherId"]);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  // Funcs
  function onUpdateTeacher(teacherId) {
    setSelectedTeacherId(teacherId);
    handleModalOpen();
  }

  const onUpdateInfo = (hourLoad, minimizeNumberWorkingDays) => {
    let data = {
      planId: planId,
      teacherId: selectedTeacherId,
      hourLoad: hourLoad,
      minimizeNumberWorkingDays: minimizeNumberWorkingDays,
    };

    request(
      "PUT",
      `/edu/teaching-assignment/plan/${planId}/teacher/${selectedTeacherId}`,
      (res) => {
        const index = teacherList.findIndex(
          (teacher) => teacher.teacherId === selectedTeacherId
        );

        const updatedTeacherList = teacherList.map((teacher, i) => {
          if (i === index) teacher.maxHourLoad = hourLoad;
          return teacher;
        });

        setTeacherList(updatedTeacherList);
      },
      { 401: () => {} },
      data
    );

    handleModalClose();
  };

  function getTeacherForAssignmentList() {
    request("GET", `edu/teaching-assignment/plan/${planId}/teacher`, (res) => {
      setTeacherList(res.data);
    });
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const removeTeacherFromAssignmentPlan = () => {
    if (selectedRows.length > 0) {
      let data = selectedRows.map((row) => row.teacherId);

      request(
        "DELETE",
        `/edu/teaching-assignment/plan/${planId}/teacher`,
        (res) => {
          const toRemove = new Set(selectedRows.map((row) => row.teacherId));
          const difference = teacherList.filter(
            (teacher) => !toRemove.has(teacher.teacherId)
          );

          setTeacherList(difference);
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
        title={"Danh sách giáo viên trong kế hoạch"}
        columns={columns}
        data={teacherList}
        classNames={{ commandBar: classes.commandBar }}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
        commandBarComponents={
          <>
            <TertiaryButton
              className={classes.uploadExcelBtn}
              color="default"
              startIcon={<DeleteRoundedIcon />}
              onClick={removeTeacherFromAssignmentPlan}
              disabled={selectedRows.length === 0}
            >
              Xoá
            </TertiaryButton>
            {selectedRows.length > 0 && (
              <Typography
                component="span"
                style={{ marginLeft: "auto", marginRight: 32 }}
              >{`Đã chọn ${selectedRows.length} mục`}</Typography>
            )}
          </>
        }
      />

      <UpdateTeacherForAssignmentDialog
        open={open}
        onClose={handleModalClose}
        onUpdateInfo={onUpdateInfo}
        selectedTeacherId={selectedTeacherId}
      />
    </>
  );
}

export default TeacherInPlan;
