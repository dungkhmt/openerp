package com.hust.baseweb.applications.education.teacherclassassignment.model.teachersuggestion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SuggestedTeacherAndActionForClass {
    private String teacherId;
    private String teacherName;
    private List<ClassToListTeacher> moveClass = new ArrayList();



}
