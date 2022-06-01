package com.hust.baseweb.applications.education.teacherclassassignment.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Du lieu da duoc xu ly va chuyen doi thanh dau vao thuat toan.
 */
@Getter
@Setter
@AllArgsConstructor
public class AlgoTeacherAssignmentIM {

    private AlgoTeacherIM[] teachers;

    private AlgoClassIM[] classes;

    private TeacherClassAssignmentModel[] preAssignments; // mot so lop da duoc phan cong truoc

    private String solver;
}
