package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Data;

import java.util.List;

@Data
public class ModelCreateContest {
    private String contestId;
    private String contestName;
    private int contestTime;
    private List<String> problemIds;
}
