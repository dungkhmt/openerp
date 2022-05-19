package com.hust.baseweb.applications.programmingcontest.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ModelGetProblemDetailResponse {
    private String problemId;
    private String problemName;
    private String levelId;
    private int levelOrder;
    private String problemDescription;
    private boolean unauthorized;
}
