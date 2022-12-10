package com.hust.baseweb.applications.bigdataanalysis.service;

import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheck;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelCreateDataCheckRuleInput;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckResult;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelUpdateDataQualityCheckInput;

import java.util.*;
public interface DataQualityCheckService {
    public List<DataQualityCheckRule> getDataQualityCheckRules();

    public List<DataQualityCheck> getDataQualityCheckList();

    public DataQualityCheck createDataQualityCheck(String userId, ModelCreateDataCheckRuleInput input);
    public DataQualityCheck updateDataQualityCheckResult(String userId, ModelUpdateDataQualityCheckInput input);

    public List<ModelResponseDataQualityCheckResult> getDataQualityCheckResultList();

    public List<ModelResponseDataQualityCheckRule> getDataQualityCheckRuleList();
}
