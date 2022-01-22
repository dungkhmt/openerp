package com.hust.baseweb.applications.education.teacherclassassignment.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlgoTeacherAssignmentIM {

    private AlgoTeacherIM[] teachers;

    private AlgoClassIM[] classes;

    private TeacherClassAssignmentModel[] preAssignments; // mot so lop da duoc phan cong truoc

    private String solver;
}
