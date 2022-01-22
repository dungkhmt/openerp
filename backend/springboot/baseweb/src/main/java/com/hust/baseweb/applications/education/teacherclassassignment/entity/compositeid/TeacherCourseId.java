package com.hust.baseweb.applications.education.teacherclassassignment.entity.compositeid;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class TeacherCourseId implements Serializable {

    private String teacherId;
    private String courseId;
}
