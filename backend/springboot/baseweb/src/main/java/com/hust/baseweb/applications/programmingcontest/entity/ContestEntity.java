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

    public static final String CONTEST_SUBMISSION_ACTION_TYPE_STORE_ONLY = "STORE_ONLY";
    public static final String CONTEST_SUBMISSION_ACTION_TYPE_STORE_AND_EXECUTE = "STORE_AND_EXECUTE";

    public static final String CONTEST_PARTICIPANT_VIEW_MODE_SEE_CORRECT_ANSWER = "SEE_CORRECT_ANSWER";
    public static final String CONTEST_PARTICIPANT_VIEW_MODE_NOT_SEE_CORRECT_ANSWER = "NOT_SEE_CORRECT_ANSWER";

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
    public static List<String> getSubmissionActionTypes(){
        List<String> L = new ArrayList();
        L.add(ContestEntity.CONTEST_SUBMISSION_ACTION_TYPE_STORE_AND_EXECUTE);
        L.add(ContestEntity.CONTEST_SUBMISSION_ACTION_TYPE_STORE_ONLY);
        return L;
    }

    public static List<String> getParticipantViewResultModes(){
        List<String> L = new ArrayList();
        L.add(CONTEST_PARTICIPANT_VIEW_MODE_SEE_CORRECT_ANSWER);
        L.add(CONTEST_PARTICIPANT_VIEW_MODE_NOT_SEE_CORRECT_ANSWER);
        return L;
    }
    public static List<Integer> getListMaxNumberSubmissions(){
        List<Integer> L = new ArrayList();
        for(int i = 0; i <= 200; i++) L.add(i);
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

    @Column(name="submission_action_type")
    private String submissionActionType;

    @Column(name="max_number_submission")
    private int maxNumberSubmissions;

    @Column(name="participant_view_result_mode")
    private String participantViewResultMode;

}
