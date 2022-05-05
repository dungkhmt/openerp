package com.hust.baseweb.applications.programmingcontest.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
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
    public static final String CONTEST_STATUS_CREATED = "CREATED";
    public static final String CONTEST_STATUS_OPEN = "OPEN";
    public static final String CONTEST_STATUS_RUNNING = "RUNNING";
    public static final String CONTEST_STATUS_COMPLETED = "COMPLETED";
    public static final String CONTEST_STATUS_CLOSED = "CLOSED";
    public static final String CONTEST_STATUS_DISABLED = "DISABLED";

    public static List<String> getStatusIds(){
        List<String> L = new ArrayList();
        L.add(ContestEntity.CONTEST_STATUS_CREATED);
        L.add(ContestEntity.CONTEST_STATUS_OPEN);
        L.add(ContestEntity.CONTEST_STATUS_CLOSED);
        L.add(ContestEntity.CONTEST_STATUS_DISABLED);
        L.add(ContestEntity.CONTEST_STATUS_RUNNING);
        L.add(ContestEntity.CONTEST_STATUS_COMPLETED);
        return L;
    }

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

    @Column(name="status_id")
    private String statusId;


}
