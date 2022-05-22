package com.hust.baseweb.applications.education.teacherclassassignment.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;
import java.util.UUID;

/**
 * Class information in an assignment plan.
 */
@Getter
@Setter
@Entity
@Table(name = "class_teacher_assignment_class_info")
public class ClassTeacherAssignmentClassInfo {

    @Id
    @Column(name = "class_id")
    private String classId;

    @Column(name = "plan_id")
    private UUID planId;

    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "semester_id")
    private String semesterId;

    @Column(name = "course_id")
    private String courseId;

    @Column(name = "class_name")
    private String className;

    @Column(name = "credit_info")
    private String creditInfo;

    @Column(name = "class_note")
    private String classNote;

    @Column(name = "program")
    private String program;

    @Column(name = "semester_type")
    private String semesterType;

    @Column(name = "enrollment")
    private int enrollment;

    @Column(name = "max_enrollment")
    private int maxEnrollment;

    @Column(name = "class_type")
    private String classType;

    @Column(name = "time_table")
    private String timeTable;

    @Column(name = "lesson")
    private String lesson;

    @Column(name = "department_id")
    private String departmentId;

    @Column(name = "teacher_id")
    private String teacherId;

    @Column(name = "created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name = "created_stamp")
    private Date createdStamp;

    @Column(name = "hour_load")
    private double hourLoad;
}
