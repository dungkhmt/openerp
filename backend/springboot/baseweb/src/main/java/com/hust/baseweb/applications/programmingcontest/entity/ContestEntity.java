package com.hust.baseweb.applications.programmingcontest.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
//@Table(name = "contest")
@Table(name = "contest_new")
public class ContestEntity {
    @Id
    @Column(name = "contest_id")
    private String contestId;

    @Column(name = "contest_name")
    private String contestName;

//    @OneToOne
//    @JoinColumn(name = "user_create_id", referencedColumnName = "user_login_id")
//    private UserLogin userCreatedContest;

    @Column(name = "user_create_id")
    private String userId;

    @Column(name = "contest_solving_time")
    private long contestSolvingTime;

    @JoinTable(
            name = "contest_contest_problem_new",
            joinColumns = @JoinColumn(name = "contest_id", referencedColumnName = "contest_id"),
            inverseJoinColumns = @JoinColumn(name = "problem_id", referencedColumnName = "problem_id")
    )
    @OneToMany(fetch = FetchType.LAZY)
    private List<ProblemEntity> problems;

    @Column(name = "try_again")
    private boolean tryAgain;

    @Column(name = "public")
    private Boolean isPublic;

    @Column(name = "created_stamp")
    private Date createdAt;

    @Column(name = "started_at")
    private Date startedAt;

    @Column(name = "count_down")
    private long countDown;

    @Column(name = "started_count_down_time")
    private Date startedCountDownTime;

    @Column(name = "end_time")
    private Date endTime;

}
