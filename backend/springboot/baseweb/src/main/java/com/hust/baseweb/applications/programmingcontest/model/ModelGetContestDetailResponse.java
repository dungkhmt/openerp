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
    private String statusId;
    private String submissionActionType;
    private int maxNumberSubmission;
    private String participantViewResultMode;
    private String problemDescriptionViewType;
    private String useCacheContestProblem;
    private String evaluateBothPublicPrivateTestcase;
    private int maxSourceCodeLength;
    private List<String> listStatusIds;
    private List<String> listSubmissionActionTypes;
    private List<String> listParticipantViewModes;
    private List<Integer> listMaxNumberSubmissions;
    private List<String> listProblemDescriptionViewTypes;
    private List<String> listUseCacheContestProblems;
    private List<String> listEvaluateBothPublicPrivateTestcases;
}
