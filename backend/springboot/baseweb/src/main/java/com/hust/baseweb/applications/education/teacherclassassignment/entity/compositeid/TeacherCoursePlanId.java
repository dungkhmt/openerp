package com.hust.baseweb.applications.education.teacherclassassignment.entity.compositeid;

import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class TeacherCoursePlanId implements Serializable {

    private String teacherId;
    private String courseId;
    private UUID planId;

}
