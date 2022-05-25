package com.hust.baseweb.applications.education.teacherclassassignment.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

/**
 * Meta data for assignment plan.
 */
@Getter
@Setter
@Entity
@Table(name = "class_teacher_assignment_plan")
public class ClassTeacherAssignmentPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "plan_id")
    private UUID planId;

    @Column(name = "plan_name")
    private String planName;

    @Column(name = "created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name = "created_stamp")
    private Date createdStamp;

}
