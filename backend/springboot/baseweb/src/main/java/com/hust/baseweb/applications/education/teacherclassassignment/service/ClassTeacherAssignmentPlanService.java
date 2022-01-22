package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.entity.*;
import com.hust.baseweb.applications.education.teacherclassassignment.model.*;
import com.hust.baseweb.applications.education.teacherclassassignment.model.teachersuggestion.SuggestedTeacherAndActionForClass;
import com.hust.baseweb.entity.UserLogin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ClassTeacherAssignmentPlanService {

    ClassTeacherAssignmentPlan create(UserLogin u, ClassTeacherAssignmentPlanCreateModel input);

    List<ClassTeacherAssignmentPlan> findAll();

    ClassTeacherAssignmentPlanDetailModel getClassTeacherAssignmentPlanDetail(UUID planId);

    List<ClassInfoForAssignment2TeacherModel> findAllClassTeacherAssignmentClassByPlanId(UUID planId);

    boolean extractExcelAndStoreDB(UUID planId, MultipartFile file);

    String addTeacher(EduTeacher teacher);

    List<EduTeacher> findAllTeachers();

    Page<EduTeacher> findAllTeachersByPage(String keyword, Pageable pageable);

    List<TeacherForAssignmentPlan> findAllTeacherByPlanId(UUID planId);

    boolean addTeacherToAssignmentPlan(UUID planId, String teacherList);

    boolean removeTeacherFromAssignmentPlan(UUID planId, String teacherList);

    boolean removeClassFromAssignmentPlan(UUID planId, String classList);

    List<TeacherCourse> findAllTeacherCourse();

    List<TeacherCourseForAssignmentPlan> findTeacherCourseOfPlan(UUID planId);

    boolean extractExcelAndStoreDBTeacherCourse(UUID planId, String choice, MultipartFile file);

    boolean autoAssignTeacher2Class(RunAutoAssignTeacher2ClassInputModel input);

    List<ClassTeacherAssignmentSolutionModel> getNotAssignedClassSolution(UUID planId);

    List<SuggestedTeacherForClass> getSuggestedTeacherForClass(String classId, UUID planId);

    List<SuggestedTeacherAndActionForClass> getSuggestedTeacherAndActionForClass(String classId, UUID planId);

    List<ClassesAssignedToATeacherModel> getClassesAssignedToATeacherSolutionDuplicateWhenMultipleFragmentTimeTable(UUID planId);
    public TeacherClassAssignmentSolution reAssignTeacherToClass(UserLogin u, AssignTeacherToClassInputModel input);

    TeacherClassAssignmentSolution assignTeacherToClass(UserLogin u, AssignTeacherToClassInputModel input);

    boolean removeClassTeacherAssignmentSolution(
        UserLogin u,
        RemoveClassTeacherAssignmentSolutionInputModel input
    );

    boolean removeClassTeacherAssignmentSolutionList(UUID planId, String solutionItemList);

    List<ClassesAssignedToATeacherModel> getClassesAssignedToATeacherSolution(UUID planId);

    List<ClassTeacherAssignmentSolutionModel> getClassTeacherAssignmentSolution(UUID planId);

    boolean addTeacherCourseToAssignmentPlan(UUID planId, String teacherCourseList);

    boolean removeTeacherCourseFromAssignmentPlan(UUID planId, String teacherCourseList);

    List<PairOfConflictTimetableClassModel> getPairOfConflictTimetableClass(UUID planId);

    ClassTeacherAssignmentClassInfo updateClassForAssignment(
        UserLogin u,
        UpdateClassForAssignmentInputModel input
    );


    TeacherForAssignmentPlan updateTeacherForAssignment(UserLogin u, UpdateTeacherForAssignmentInputModel input);

    TeacherCourseForAssignmentPlan updateTeacherCourseForAssignmentPlan(
        UserLogin u,
        UpdateTeacherCoursePriorityForAssignmentPlanInputModel input
    );
}
