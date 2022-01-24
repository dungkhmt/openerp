package com.hust.baseweb.applications.education.teacherclassassignment.service;

import com.hust.baseweb.applications.education.teacherclassassignment.model.TeacherClassAssignmentOM;

public interface ISolver {

    void solve();

    TeacherClassAssignmentOM getSolution();
}
