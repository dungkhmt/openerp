package com.hust.baseweb.applications.education.teacherclassassignment.repo;

import com.hust.baseweb.applications.education.teacherclassassignment.entity.ClassTeacherAssignmentClassInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClassTeacherAssignmentClassInfoRepo extends JpaRepository<ClassTeacherAssignmentClassInfo, String> {

    List<ClassTeacherAssignmentClassInfo> findAllByPlanId(UUID planId);

    List<ClassTeacherAssignmentClassInfo> findByClassId(String classId);

}
