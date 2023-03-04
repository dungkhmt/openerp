import React from "react";
import {
  Card,
  CardContent,
} from "@material-ui/core";
import StudentListOfClass from "../../../../component/education/classmanagement/teacher/StudentListOfClass";

export default function TeacherViewDetailClassStudentList(props) {
  const classId = props.classId;

  return (
    <Card>
      <CardContent>
        <StudentListOfClass classId={classId}/>
      </CardContent>
    </Card>
  );
}
