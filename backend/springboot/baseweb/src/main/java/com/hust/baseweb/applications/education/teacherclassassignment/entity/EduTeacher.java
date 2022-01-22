package com.hust.baseweb.applications.education.teacherclassassignment.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "teacher")
public class EduTeacher {

    @Id
    @Column(name = "teacher_id")
    private String teacherId;

    @Column(name = "teacher_name")
    private String teacherName;

    @Column(name = "user_login_id")
    private String userLoginId;

    @Column(name="max_credit")
    private double maxCredit;
}
