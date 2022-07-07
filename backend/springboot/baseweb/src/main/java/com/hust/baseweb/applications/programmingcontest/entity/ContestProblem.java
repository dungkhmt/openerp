package com.hust.baseweb.applications.programmingcontest.entity;

import com.hust.baseweb.applications.programmingcontest.composite.CompositeContestProblemId;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "contest_contest_problem_new")
@IdClass(CompositeContestProblemId.class)
public class ContestProblem {
    @Id
    @Column(name="contest_id")
    private String contestId;

    @Id
    @Column(name="problem_id")
    private String problemId;
}
