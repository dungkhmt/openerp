package com.hust.baseweb.applications.education.teacherclassassignment.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlgoClassIM {

    private int id;

    private String classCode;

    private String classType;

    private String courseId;// ma mon hoc, vi du IT3011

    private String courseName;

    private String timetable; // example 1,41730,411145,7,8,9,11,12,13,B1-201;

    private double hourLoad; // gio quy doi cua lop (cd: 3 hours)
}
