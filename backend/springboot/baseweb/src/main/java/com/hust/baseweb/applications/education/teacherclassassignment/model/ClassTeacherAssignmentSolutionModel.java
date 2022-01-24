package com.hust.baseweb.applications.education.teacherclassassignment.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassTeacherAssignmentSolutionModel {

    private UUID solutionItemId;

    private String classCode;

    private String courseId;

    private String courseName;

    private String teacherId;

    private String teacherName;

    private String timetable;

    private double hourLoad;

    // data structures for viewing under grid
    private int startSlot;
    private int endSlot;
    private int startIndexFromPrevious; // so tiet trong ke tu tiet cuoi cung cua lop truoc
    private int duration; // so tiet

    public ClassTeacherAssignmentSolutionModel clone(){
        ClassTeacherAssignmentSolutionModel o = new ClassTeacherAssignmentSolutionModel();
        o.setDuration(this.getDuration());
        o.setEndSlot(this.getEndSlot());
        o.setStartSlot(this.getStartSlot());
        o.setTimetable(this.getTimetable());
        o.setTeacherName(this.getTeacherName());
        o.setTeacherId(this.getTeacherId());
        o.setCourseName(this.getCourseName());
        o.setCourseId(this.getCourseId());
        o.setClassCode(this.getClassCode());
        o.setStartIndexFromPrevious(this.getStartIndexFromPrevious());
        o.setHourLoad(this.getHourLoad());
        o.setSolutionItemId(this.getSolutionItemId());
        return o;
    }
    public boolean checkMultipleFragments(){
        String[] s = timetable.split(";");
        if(s == null || s.length == 0) return false;
        int cnt = 0;
        for(int i = 0; i < s.length; i++){
            if(s[i].trim().length() > 3) cnt++;
        }
        return cnt > 1;
    }
    public ClassTeacherAssignmentSolutionModel[] checkMultipleFragmentsAndDuplicate(){
        String[] s = timetable.split(";");
        if(s == null || s.length == 0) return null;
        int cnt = 0;
        for(int i = 0; i < s.length; i++){
            if(s[i].trim().length() > 3) cnt++;
        }
        ClassTeacherAssignmentSolutionModel[] list = new ClassTeacherAssignmentSolutionModel[cnt];
        for(int i = 0; i < list.length; i++){
            list[i] = this.clone();
            list[i].setTimetable(s[i]);
        }
        return list;
    }
}
