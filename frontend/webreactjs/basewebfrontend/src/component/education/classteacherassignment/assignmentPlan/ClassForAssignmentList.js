import { IconButton, Typography } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { authPostMultiPart, request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UpdateClassForAssignmentModel from "../UpdateClassForAssignmentModel";
import UploadExcelClassForTeacherAssignmentModel from "../UploadExcelClassForTeacherAssignmentModel";

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

function ClassForAssignmentList({ planId }) {
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [classList, setClassList] = useState([]);

  //
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openModelExcel, setOpenModelExcel] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

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

  // TODO: fix this func
  function uploadExcel(selectedFile) {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      planId: planId,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(
      dispatch,
      token,
      "/upload-excel-class-4-teacher-assignment",
      formData
    )
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

  const customUploadHandle = (selectedFile) => {
    uploadExcel(selectedFile);
    handleModalCloseModelExcel();
  };

  // OK
  const customUpdateHandle = (hourLoad) => {
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

  const handleModalOpenModelExcel = () => {
    setOpenModelExcel(true);
  };

  const handleModalCloseModelExcel = () => {
    setOpenModelExcel(false);
  };

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
    request("GET", `edu/teaching-assignment/plan/${planId}/class`, (res) => {
      setClassList(res.data);
    });
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
              <>
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<PublishRoundedIcon />}
                  onClick={handleModalOpenModelExcel}
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

      <UploadExcelClassForTeacherAssignmentModel
        open={openModelExcel}
        onClose={handleModalCloseModelExcel}
        onUpload={customUploadHandle}
      />

      <UpdateClassForAssignmentModel
        open={open}
        onClose={handleModalClose}
        onUpdateInfo={customUpdateHandle}
        selectedClassId={selectedClassId}
      />
    </>
  );
}

export default ClassForAssignmentList;
