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

public class ModelResponseDataQualityCheckRule {
    private String ruleId;
    private String params;
    private List<String> listParams;
}
