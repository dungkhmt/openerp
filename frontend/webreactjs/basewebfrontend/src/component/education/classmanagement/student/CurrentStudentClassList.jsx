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
    { title: "Class Code", field: "classCode" },
    { title: "Course Code", field: "courseId" },
    { title: "Course Name", field: "name" },
    { title: "Course Type", field: "classType" },
    { title: "Semester", field: "semester" },
    {
      title: "Status",
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
      infoNoti(`Please wait for the teacher's approval to view details of class ${aClass.name}.`, 3000);
    }
  }

  return (
    <StandardTable
      title="Class List"
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