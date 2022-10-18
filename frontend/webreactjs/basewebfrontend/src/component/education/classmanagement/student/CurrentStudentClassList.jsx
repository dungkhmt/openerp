import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Chip} from "@material-ui/core";
import {FcApproval} from "react-icons/fc";
import {GiSandsOfTime} from "react-icons/gi";
import {request} from "../../../../api";
import {useHistory} from "react-router-dom";
import {infoNoti} from "../../../../utils/notification";
import StandardTable from "../../../table/StandardTable";

function CurrentStudentClassList(props) {
  const columns = [
    { title: "Mã lớp", field: "classCode" },
    { title: "Mã học phần", field: "courseId" },
    { title: "Tên học phần", field: "name" },
    { title: "Loại lớp", field: "classType" },
    { title: "Học kỳ", field: "semester" },
    {
      title: "Trạng thái",
      field: "status",
      render: aClass => <RegisterStatusBox status={aClass.status}/>
    }
  ];

  const history = useHistory();
  const [classesOfCurrentStudent, setClassesOfCurrentStudent] = useState([]);

  useEffect(getClassesOfCurrentStudent, []);

  function getClassesOfCurrentStudent() {
    request("get", "/edu/class/list/student", (response) => {
      setClassesOfCurrentStudent(response.data);
    })
  }

  function viewClassDetailsIfApproved(aClass) {
    if (aClass.status === "APPROVED") {
      history.push(`/edu/student/class/${aClass.id}`);
    } else {
      infoNoti(`Vui lòng chờ giảng viên phê duyệt để xem thông tin của lớp ${aClass.name}.`, 3000);
    }
  }

  return (
    <StandardTable
      title="Danh sách lớp"
      columns={columns}
      data={classesOfCurrentStudent}
      onRowClick={ (event, aClass) => viewClassDetailsIfApproved(aClass) }
      hideCommandBar
      options={{
        selection: false,
        search: true,
        sorting: true,
      }}
    />
  );
}


const useRegisterStatusBoxStyles = makeStyles((theme) => ({
  approved: {
    color: "green",
    borderColor: "green",
    fontSize: "1rem",
    width: 160,
  },
  pendingApproval: {
    fontSize: "1rem",
  },
}))

/** Private component, do not expose it */
function RegisterStatusBox({ status }) {
  const classes = useRegisterStatusBoxStyles();
  return (
    <Box display="flex" justifyContent="center">
      { status === "APPROVED" &&
        <Chip
          icon={<FcApproval size={24} />}
          label="Đã phê duyệt"
          variant="outlined"
          className={classes.approved}
        />
      }

      { status === "WAITING_FOR_APPROVAL" &&
        <Chip
        icon={<GiSandsOfTime size={24} />}
        label="Chờ phê duyệt"
        color="primary"
        variant="outlined"
        className={classes.pendingApproval}
        />
      }
    </Box>
  );
}

export default CurrentStudentClassList;