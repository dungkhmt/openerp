package com.hust.baseweb.applications.education.teacherclassassignment.entity;

import com.hust.baseweb.applications.education.teacherclassassignment.entity.compositeid.TeacherCourseId;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

/**
 * Course that teacher can teach.
 */
@Getter
@Setter
@Entity
@Table(name = "teacher_course")
@IdClass(TeacherCourseId.class)
public class TeacherCourse {

    @Id
    @Column(name = "teacher_id")
    private String teacherId;

    @Id
    @Column(name = "course_id")
    private String courseId;

    @Id
    @Column(name = "classType")
    private String classType;

    // For referencing only
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID refId;

    @Column(name = "priority")
    private int priority;

}
