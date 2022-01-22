package com.hust.baseweb.applications.education.teacherclassassignment.entity;

import com.hust.baseweb.applications.education.teacherclassassignment.entity.compositeid.TeacherCoursePlanId;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "teacher_course_for_assignment_plan")
@IdClass(TeacherCoursePlanId.class)
public class TeacherCourseForAssignmentPlan {

    @Id
    @Column(name = "teacher_id")
    private String teacherId;

    @Id
    @Column(name = "course_id")
    private String courseId;

    @Id
    @Column(name = "plan_id")
    private UUID planId;

    @Column(name = "priority")
    private int priority;

}
