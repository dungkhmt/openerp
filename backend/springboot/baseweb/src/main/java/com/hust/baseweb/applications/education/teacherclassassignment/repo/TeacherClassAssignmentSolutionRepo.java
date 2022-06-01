package com.hust.baseweb.applications.education.teacherclassassignment.repo;

import com.hust.baseweb.applications.education.teacherclassassignment.entity.TeacherClassAssignmentSolution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeacherClassAssignmentSolutionRepo extends JpaRepository<TeacherClassAssignmentSolution, UUID> {

    List<TeacherClassAssignmentSolution> findAllByPlanId(UUID planId);

    List<TeacherClassAssignmentSolution> findAllByPlanIdAndTeacherId(UUID planId, String teacherId);

    List<TeacherClassAssignmentSolution> findAllByPlanIdAndClassId(UUID planId, String classId);

    void deleteAllByPlanId(UUID planId);
}
