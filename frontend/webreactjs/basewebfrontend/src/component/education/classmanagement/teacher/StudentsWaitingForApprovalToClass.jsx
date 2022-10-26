import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Link,
} from "@material-ui/core";
import { request } from "../../../../api";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import { FcApproval } from "react-icons/fc";
import { StyledBadge } from "../../../../component/education/classmanagement/StyledBadge";
import MaterialTable from "material-table";
import changePageSize, {
  localization,
} from "../../../../utils/MaterialTableUtils";

import NegativeButton from "../../../../component/education/classmanagement/NegativeButton";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";
import {errorNoti, successNoti} from "../../../../utils/notification";
import {Button} from "@mui/material";
import StandardTable from "../../../table/StandardTable";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    margin: "auto",
    width: `calc(100vw - ${drawerWidth + theme.spacing(4) * 2 + 1}px)`,
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  negativeBtn: {
    minWidth: 112,
    marginLeft: 10,
    marginRight: 10,
  },
  positiveBtn: {
    minWidth: 112,
  },
  dialogRemoveBtn: {
    fontWeight: "normal",
  },
  listItem: {
    height: 48,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  open: { transform: "rotate(-180deg)", transition: "0.3s" },
  close: { transition: "0.3s" },
  item: {
    paddingLeft: 32,
  },
  tabs: { padding: theme.spacing(2) },
  tabSelected: {
    background: "rgba(254,243,199,1)",
    color: "rgba(180,83,9,1) !important",
  },
  tabRoot: {
    margin: "0px 0.5rem",
    borderRadius: "0.375rem",
    textTransform: "none",
  },
}));

export default function StudentsWaitingForApprovalToClass(props) {
  const classes = useStyles();
  const classId = props.classId;
  const [registStudents, setRegistStudents] = useState([]);
  const [selectedRegists, setSelectedRegists] = useState([]);

  useEffect(getStudentsWaitingForApprovalToClass, []);

  function getStudentsWaitingForApprovalToClass() {
    request("GET", `/edu/class/${classId}/registered-students`, (res) => {
      setRegistStudents(res.data);
    })
  }

  function updateSelectedStudentsToUpdateStatus(newSelectedStudents) {
    setSelectedRegists(newSelectedStudents.map(selectedStudent => selectedStudent.id));
  }

  function updateRegistrationStatusForStudents(idsOfUpdatedStudents, newStatus) {
    let successNotiMsg = newStatus === "APPROVED" ? 
      "Phê duyệt thành công, xem kết quả ở bảng" :
      "Đã từ chối sinh viên tham gia vào lớp học";
    let successHandler = res => {
      successNoti(successNotiMsg, 3000);
      setRegistStudents(registStudents.filter(student => !idsOfUpdatedStudents.includes(student.id)))
    }
    
    let errorNotiMsg = newStatus === "APPROVED" ?
      "Đã xảy ra lỗi khi phê duyệt" :
      "Đã xảy ra lỗi khi từ chối";
    let errorHandlers = {
      onError: error => errorNoti(errorNotiMsg, 3000)
    }

    let data = { classId, studentIds: idsOfUpdatedStudents, status: newStatus};
    request("PUT", "/edu/class/registration-status", successHandler, errorHandlers, data);
  }
  
  const UpdateStatusButtons = ({ studentIds }) => (
    <div>
      <Button onClick={() => updateRegistrationStatusForStudents(studentIds, "APPROVED")}>
        Phê duyệt
      </Button>
      <Button onClick={() => updateRegistrationStatusForStudents(studentIds, "REFUSED")}>
        Từ chối
      </Button>
    </div>
  )

  const registCols = [
    { field: "name", title: "Họ và tên" },
    {
      field: "email", title: "Email",
      render: student => <a href={`mailto:${student.email}`}>{student.email}</a>
    },
    {
      field: "", title: "",
      render: student => <UpdateStatusButtons studentIds={[student.id]}/>
    }
  ];

  return (
    <div>
      { selectedRegists.length > 0 &&
        <UpdateStatusButtons studentIds={selectedRegists}/>
      }
      
      <StandardTable
        title="Phê duyệt sinh viên đăng ký"
        columns={registCols}
        data={registStudents}
        hideCommandBar
        options={{
          selection: true,
          search: true,
          sorting: true
        }}
        onSelectionChange={updateSelectedStudentsToUpdateStatus}
      />
    </div>
  );
}
