import { Typography } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import { request } from "api";
import TertiaryButton from "component/button/TertiaryButton";
import StandardTable from "component/table/StandardTable";
import { useEffect, useState } from "react";
import { successNoti } from "utils/notification";
import { Input, useStyles } from "./assignmentPlan/ClassInPlan";

const columns = [
  { title: "Email", field: "id" },
  { title: "Tên giảng viên", field: "teacherName" },
];

function TeacherList(props) {
  const planId = props.planId;
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const [teacherList, setTeacherList] = useState([]);
  // const [open, setOpen] = React.useState(false);

  // Funcs
  function uploadExcel(e) {
    setTimeout(() => {
      successNoti("Đã tải lên.");
      e.target.value = "";
    }, Math.random() * 3);
    // const selectedFile = e.target.files[0];
    // console.log("upload file " + selectedFile.name);

    // const data = new FormData();
    // data.append("file", selectedFile);

    // request(
    //   "POST",
    //   `edu/teaching-assignment/plan/${planId}/teacher/upload-excel`,
    //   (res) => {
    //     e.target.value = "";
    //     successNoti("Đã tải lên.");
    //     getTeacherList()
    //   },
    //   {
    //     onError: (error) => {
    //       e.target.value = "";
    //       console.error(error);
    //       errorNoti(
    //         "Đã có lỗi xảy ra. Vui lòng kiểm tra định dạng file excel và thử lại."
    //       );
    //     },
    //   },
    //   data
    // );
  }

  const onUpload = (e) => {
    uploadExcel(e);
    // handleModalClose();
  };

  function getTeacherList() {
    request("GET", "edu/teaching-assignment/teacher", (res) => {
      setTeacherList(res.data);
    });
  }

  // const handleModalOpen = () => {
  //   setOpen(true);
  // };

  // const handleModalClose = () => {
  //   setOpen(false);
  // };

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
              <label htmlFor="upload-excel-teacher">
                <Input
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  id="upload-excel-teacher"
                  onChange={onUpload}
                />
                <TertiaryButton
                  className={classes.uploadExcelBtn}
                  color="default"
                  startIcon={<PublishRoundedIcon />}
                  component="span"
                >
                  Tải lên Excel
                </TertiaryButton>
              </label>
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

      {/* <UploadExcelTeacherCourseModel
        open={open}
        onClose={handleModalClose}
        onUpload={onUpload}
      /> */}
    </>
  );
}

export default TeacherList;
