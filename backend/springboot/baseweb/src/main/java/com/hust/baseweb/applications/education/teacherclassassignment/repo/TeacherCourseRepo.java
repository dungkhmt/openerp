package com.hust.baseweb.applications.education.teacherclassassignment.repo;

import com.hust.baseweb.applications.education.teacherclassassignment.entity.TeacherCourse;
import com.hust.baseweb.applications.education.teacherclassassignment.entity.compositeid.TeacherCourseId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherCourseRepo extends JpaRepository<TeacherCourse, TeacherCourseId> {

}
