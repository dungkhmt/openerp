package com.hust.baseweb.applications.programmingcontest.entity;

import lombok.*;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
//@Table(name = "test_case")
@Table(name = "test_case_new")
public class TestCaseEntity {
    @Id
    @Column(name = "test_case_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID testCaseId;

    @Column(name = "test_case_point")
    private int testCasePoint;

    @Column(name = "test_case")
    private String testCase;

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "contest_problem_id")
    private String problemId;

    @Column(name="is_public")
    private String isPublic;

    @Column(name="description")
    private String description;

    public String getTestCaseShort(int sz){
        String res = "";
        if(sz > testCase.length()) sz = testCase.length();
        for(int i = 0; i < sz; i++) res += testCase.charAt(i);
        return res;
    }
    public String getCorrectAnswerShort(int sz){
        String res = "";
        if(sz > correctAnswer.length()) sz = correctAnswer.length();
        for(int i = 0; i < sz; i++) res += correctAnswer.charAt(i);
        return res;
    }
//    @JoinColumn(name = "contest_problem_id", referencedColumnName = "problem_id")
//    @ManyToOne(fetch = FetchType.LAZY)
//    private ProblemEntity problem;

//    @JoinTable(name = "contest_problem_test_case",
//            joinColumns = @JoinColumn(name = "test_case_id", referencedColumnName = "test_case_id"),
//            inverseJoinColumns = @JoinColumn(name = "problem_id", referencedColumnName = "problem_id")
//    )
//    @OneToOne(fetch = FetchType.LAZY)
//    private ContestProblem contestProblem;
}
