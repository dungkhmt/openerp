//package com.hust.baseweb.applications.education.thesisdefensejury.entity;
//
//
//import com.hust.baseweb.applications.education.entity.mongodb.Teacher;
//import com.hust.baseweb.applications.education.teacherclassassignment.entity.EduTeacher;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//
//import javax.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Data
//@Table(name = "teacher_thesis_defense_plan") // Entity map voi bang teacher_thesis_defense_plan
//@NoArgsConstructor
//public class TeacherThesisDefensePlan {
//    @Id
//    @ManyToOne
//    @JoinColumn(name = "teacher_id")
//    private EduTeacher teacher;
//
//    @Id
//    @ManyToOne
//    @JoinColumn(name = "thesis_defense_plan_id")
//    private ThesisDefensePlan thesisDefensePlan;
//
//    @Column(name = "last_updated_stamp")
//    private LocalDateTime updatedDateTime;
//
//    @CreationTimestamp
//    @Column(name = "created_stamp")
//    private LocalDateTime createdTime;
//
//    public EduTeacher getTeacher() {
//        return teacher;
//    }
//
//    public void setTeacher(EduTeacher teacher) {
//        this.teacher = teacher;
//    }
//
//    public ThesisDefensePlan getThesisDefensePlan() {
//        return thesisDefensePlan;
//    }
//
//    public void setThesisDefensePlan(ThesisDefensePlan thesisDefensePlan) {
//        this.thesisDefensePlan = thesisDefensePlan;
//    }
//
//    public LocalDateTime getUpdatedDateTime() {
//        return updatedDateTime;
//    }
//
//    public void setUpdatedDateTime(LocalDateTime updatedDateTime) {
//        this.updatedDateTime = updatedDateTime;
//    }
//}
