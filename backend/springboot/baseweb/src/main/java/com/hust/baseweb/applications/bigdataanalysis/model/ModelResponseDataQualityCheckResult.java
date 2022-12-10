package com.hust.baseweb.applications.bigdataanalysis.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import java.util.*;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ModelResponseDataQualityCheckResult {
    private UUID id;
    private String ruleId;
    private String entity;
    private String instance;
    private String value;
    private String status;
    private String tableName;
    private String linkSource;
    private Date createdStamp;
}
