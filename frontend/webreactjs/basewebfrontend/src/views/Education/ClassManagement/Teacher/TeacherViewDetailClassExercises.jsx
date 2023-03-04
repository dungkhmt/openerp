import React from "react";
import AssignmentListOfClass from "../../../../component/education/classmanagement/teacher/AssignmentListOfClass";

export default function TeacherViewDetailClassExercises(props) {
  const classId = props.classId;

  return (
    <AssignmentListOfClass classId={classId}
                           userRole="teacher"
                           enableCreateAssignment />
  );
}
