import React from "react";
import { Button, Tooltip, Link } from "@material-ui/core/";
import LearningSessionListOfClass
  from "../../../../component/education/classmanagement/teacher/LearningSessionListOfClass";

export default function TeacherClassViewLearningSessionList(props) {
  const classId = props.classId;

  return (
    <LearningSessionListOfClass classId={classId}
                                role="TEACHER"/>
  );
}
