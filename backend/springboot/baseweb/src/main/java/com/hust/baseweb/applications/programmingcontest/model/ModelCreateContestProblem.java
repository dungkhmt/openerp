package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ModelCreateContestProblem {
    private String problemId;
    private String problemName;
    private String problemDescription;
    private int timeLimit;
    private int memoryLimit;
    private String levelId;
    private String categoryId;
    private String correctSolutionSourceCode;
    private String correctSolutionLanguage;
    private String solution;
    private Boolean isPublic;
}
