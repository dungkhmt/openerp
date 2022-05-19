package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
@Builder
public class ModelContestSubmissionResponse {
    UUID contestSubmissionID;
    String contestId;
    String problemId;
    String problemName;
    Date submittedAt;
    Integer score;
    String testCasePass;
    Float memoryUsage;
    String status;
    long runtime;
}
