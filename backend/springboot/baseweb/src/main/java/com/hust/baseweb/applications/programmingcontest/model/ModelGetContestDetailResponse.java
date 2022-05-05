package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Builder
public class ModelGetContestDetailResponse {
    private String contestId;
    private String contestName;
    private long contestTime;
    private Date startAt;
    private List<ModelGetProblemDetailResponse> list;
    private boolean unauthorized;
    private Boolean isPublic;

}
