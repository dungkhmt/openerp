package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ModelCreateContest {
    private String contestId;
    private String contestName;
    private long contestTime;
    private boolean isPublic;
    private List<String> problemIds;
    private Date startedAt;
    private long countDownTime;
}
