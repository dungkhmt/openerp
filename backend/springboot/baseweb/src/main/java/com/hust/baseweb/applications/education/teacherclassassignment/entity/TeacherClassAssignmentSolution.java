package com.hust.baseweb.applications.education.teacherclassassignment.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

/**
 * Assigns a class to a teacher in an assignment plan.
 */
@Getter
@Setter
@Entity
@Table(name = "class_teacher_assignment_solution")
public class TeacherClassAssignmentSolution {

    @Id
    @Column(name = "solution_item_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID solutionItemId;

    @Column(name = "class_id")
    private String classId;

    @Column(name = "plan_id")
    private UUID planId;

    @Column(name = "teacher_id")
    private String teacherId;

    @Column(name = "created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name = "created_stamp")
    private Date createdStamp;
}
