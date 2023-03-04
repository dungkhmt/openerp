import React from "react";

import StudentsWaitingForApprovalToClass
  from "../../../../component/education/classmanagement/teacher/StudentsWaitingForApprovalToClass";

export default function TeacherViewDetailClassStudentRegistered(props) {
  const classId = props.classId;

  return (
    <StudentsWaitingForApprovalToClass classId={classId}/>
  );
}
