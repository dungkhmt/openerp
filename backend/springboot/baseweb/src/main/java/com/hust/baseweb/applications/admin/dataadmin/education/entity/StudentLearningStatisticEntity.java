package com.hust.baseweb.applications.admin.dataadmin.education.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "student_learning_statistic")
public class StudentLearningStatisticEntity {

    @Id
    private String loginId;

    private long totalQuizDoingTimes;

    private long totalCodeSubmissions;

    private LocalDateTime latestTimeDoingQuiz;

    private LocalDateTime latestTimeSubmittingCode;

    private long submissionsAcceptedOnTheFistTime;

    private long totalQuizDoingPeriods;

    private double errorSubmissionsRate;
}
