import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import TeacherCourseChapterList from "./TeacherCourseChapterList";
import TeacherCourseQuizList from "./TeacherCourseQuizList";
import TeacherCourseTopicList from "./TeacherCourseTopicList";
import TeacherViewCourseQuizList from "./TeacherViewCourseQuizList";
import withScreenSecurity from "../../withScreenSecurity";

function TeacherCourseDetail() {
  const params = useParams();
  const courseId = params.id;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [course, setCourse] = useState(null);

  console.log(courseId);

  return (
    <>
      <TeacherCourseChapterList courseId={courseId} />
      <TeacherCourseQuizList courseId={courseId} />
      <TeacherCourseTopicList courseId={courseId} />
      <TeacherViewCourseQuizList courseId={courseId} />
    </>
  );
}

const screenName = "SCREEN_EDUCATION_TEACHING_MANAGEMENT_TEACHER";
export default withScreenSecurity(TeacherCourseDetail, screenName, true);
