import React from "react";
import { useParams } from "react-router";
import withScreenSecurity from "../../withScreenSecurity";
import TeacherViewCourseDetail from "./teacher/TeacherViewCourseDetail";

function TeacherCourseDetail() {
  const params = useParams();
  const courseId = params.id;

  console.log(courseId);

  return (
    <TeacherViewCourseDetail courseId={courseId}/>
  );
}

const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default withScreenSecurity(TeacherCourseDetail, screenName, true);
