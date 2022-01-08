package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Data;

import java.util.List;

@Data
public class ModelUpdateContest {
    private String contestName;
    private int contestSolvingTime;
    private List<String> problemIds;
}
