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

public class ModelResponseDataQualityCheckMaster {
    private UUID id;

    private String ruleId;

    private String createdByUserLoginId;

    private String metaData;

    private String tableName;

    private Date createdStamp;

}
