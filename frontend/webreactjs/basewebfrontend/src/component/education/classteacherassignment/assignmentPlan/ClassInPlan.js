import { IconButton, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { styled } from "@mui/material/styles";
import { request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import { errorNoti, successNoti } from "utils/notification";
import UpdateClassForAssignmentDialog from "../UpdateClassForAssignmentDialog";

export const useStyles = makeStyles((theme) => ({
  uploadExcelBtn: {
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  commandBar: {
    position: "sticky",
    top: 112,
    zIndex: 11,
    marginTop: -theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const cellStyles = { headerStyle: { padding: 8 }, cellStyle: { padding: 8 } };
const alignRightCellStyles = {
  headerStyle: { padding: 8, textAlign: "right" },
  cellStyle: { padding: 8, textAlign: "right" },
};

export const Input = styled("input")({
  display: "none",
});

function ClassInPlan({ planId }) {
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [classList, setClassList] = useState([]);

  //
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [open, setOpen] = React.useState(false);
  // const [openModelExcel, setOpenModelExcel] = React.useState(false);

  // Table
  const columns = [
    { title: "Mã lớp", field: "classId", ...cellStyles },
    { title: "Mã học phần", field: "courseId", ...cellStyles },
    { title: "Tên học phần", field: "className", ...cellStyles },
    { title: "Loại lớp", field: "classType", ...cellStyles },
    { title: "Thời khoá biểu", field: "lesson", sorting: false, ...cellStyles },
    { title: "Chương trình", field: "program", ...cellStyles },
    {
      sorting: false,
      title: "Giờ quy đổi",
      field: "hourLoad",
      ...alignRightCellStyles,
    },
    {
      sorting: false,
      title: "Số GV",
      field: "numberPossibleTeachers",
      ...alignRightCellStyles,
    },
    {
      sorting: false,
      title: "Số GV trong KH",
      field: "numberPossibleTeachersInPlan",
      ...alignRightCellStyles,
    },
    {
      title: "",
      sorting: false,
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onUpdateHourLoad(rowData["classId"]);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
      ...cellStyles,
    },
  ];

  // Funcs
  function onUpdateHourLoad(classId) {
    setSelectedClassId(classId);
    handleModalOpen();
  }

  const getClasses = () => {
    request("GET", `edu/teaching-assignment/plan/${planId}/class`, (res) => {
      setClassList(res.data);
    });
  };

  function uploadExcel(e) {
    const selectedFile = e.target.files[0];
    console.log("upload file " + selectedFile.name);

    const data = new FormData();
    data.append("file", selectedFile);

    request(
      "POST",
      `edu/teaching-assignment/plan/${planId}/class/upload-excel`,
      (res) => {
        e.target.value = "";

        if (res.data === true) {
          successNoti("Đã tải lên.");
          getClasses();
        } else {
          errorNoti(
            "Đã có lỗi xảy ra. Vui lòng kiểm tra định dạng file excel và thử lại."
          );
        }
      },
      {
        onError: (error) => {
          e.target.value = "";
          console.error(error);
          errorNoti("Đã có lỗi xảy ra.");
        },
      },
      data
    );
  }

  const onUpload = (e) => {
    uploadExcel(e);
    // handleModalCloseModelExcel();
  };

  // OK
  const onUpdateInfo = (hourLoad) => {
    let data = {
      hourLoad: hourLoad,
    };

    request(
      "PUT",
      `/edu/teaching-assignment/plan/${planId}/class/${selectedClassId}`,
      (res) => {
        const index = classList.findIndex((c) => c.classId === selectedClassId);

        const updatedClassList = classList.map((c, i) => {
          if (i === index) c.hourLoad = hourLoad;
          return c;
        });

        setClassList(updatedClassList);
      },
      { 401: () => {} },
      data
    );

    handleModalClose();
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  // const handleModalOpenModelExcel = () => {
  //   setOpenModelExcel(true);
  // };

  // const handleModalCloseModelExcel = () => {
  //   setOpenModelExcel(false);
  // };

  // OK
  const removeClassesFromAssignmentPlan = () => {
    if (selectedRows.length > 0) {
      let data = selectedRows.map((row) => row.classId);

      request(
        "DELETE",
        `edu/teaching-assignment/plan/${planId}/class`,
        (res) => {
          const toRemove = new Set(selectedRows.map((row) => row.classId));
          const difference = classList.filter(
            (row) => !toRemove.has(row.classId)
          );

          setClassList(difference);
        },
        {},
        data
      );
    }
  };

  // OK
  useEffect(() => {
    getClasses();
  }, []);

  return (
    <>
      <StandardTable
        title={"Danh sách lớp trong kế hoạch"}
        columns={columns}
        data={classList}
        classNames={{ commandBar: classes.commandBar }}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
        commandBarComponents={
          <>
            {selectedRows.length === 0 ? (
              <label htmlFor="upload-excel-class-in-plan">
                <Input
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  id="upload-excel-class-in-plan"
                  onChange={onUpload}
                />
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<PublishRoundedIcon />}
                  component="span"
                  // onClick={handleModalOpenModelExcel}
                >
                  Tải lên Excel
                </TertiaryButton>
              </label>
            ) : (
              <>
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<DeleteRoundedIcon />}
                  onClick={removeClassesFromAssignmentPlan}
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

      {/* <UploadExcelClassForTeacherAssignmentModel
        open={openModelExcel}
        onClose={handleModalCloseModelExcel}
        onUpload={onUpload}
      /> */}

      <UpdateClassForAssignmentDialog
        open={open}
        onClose={handleModalClose}
        onUpdateInfo={onUpdateInfo}
        selectedClassId={selectedClassId}
      />
    </>
  );
}

export default ClassInPlan;
