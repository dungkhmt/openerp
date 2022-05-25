package com.hust.baseweb.applications.education.teacherclassassignment.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Can dung de mo hinh khoa hoc ma giang vien co the day khi chay thuat toan.
 */
@Getter
@Setter
@AllArgsConstructor
public class Course4Teacher {

    private String courseId;

    private String courseName;

    private int priority;

    private String type;
}
