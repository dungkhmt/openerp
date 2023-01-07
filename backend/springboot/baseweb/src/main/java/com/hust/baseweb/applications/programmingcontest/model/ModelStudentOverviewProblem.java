package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModelStudentOverviewProblem {

    private String problemId;
    private String problemName;
    private String levelId;
    private boolean submitted = false;
    private boolean accepted = false;
    private Integer maxSubmittedPoint;
}
