package com.hust.baseweb.applications.bigdataanalysis.service;

import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheck;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelCreateDataCheckRuleInput;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelUpdateDataQualityCheckInput;
import com.hust.baseweb.applications.bigdataanalysis.repo.DataQualityCheckRepo;
import com.hust.baseweb.applications.bigdataanalysis.repo.DataQualityCheckRuleRepo;
import java.util.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.InputStream;
import java.security.Principal;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;
@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))

public class DataQualityCheckServiceImpl implements DataQualityCheckService{
    private DataQualityCheckRuleRepo dataQualityCheckRuleRepo;
    private DataQualityCheckRepo dataQualityCheckRepo;
    public List<DataQualityCheckRule> getDataQualityCheckRules(){
        List<DataQualityCheckRule> res = dataQualityCheckRuleRepo.findAll();
        return res;
    }
    public List<DataQualityCheck> getDataQualityCheckList(){
        List<DataQualityCheck> res = dataQualityCheckRepo.findAll();
        return res;
    }
    public DataQualityCheck createDataQualityCheck(String userId, ModelCreateDataCheckRuleInput input){
        DataQualityCheck dqc = new DataQualityCheck();
        dqc.setCreatedByUserLoginId(userId);
        dqc.setRuleId(input.getRuleId());
        dqc.setCreatedStamp(new Date());
        if(input.getParams().size() >= 1){
            dqc.setParam1(input.getParams().get(0));
        }
        if(input.getParams().size() >= 2){
            dqc.setParam2(input.getParams().get(1));
        }

        if(input.getParams().size() >= 3){
            dqc.setParam3(input.getParams().get(2));
        }
        if(input.getParams().size() >= 4){
            dqc.setParam4(input.getParams().get(3));
        }
        if(input.getParams().size() >= 5){
            dqc.setParam5(input.getParams().get(4));
        }
        if(input.getParams().size() >= 6){
            dqc.setParam6(input.getParams().get(5));
        }
        if(input.getParams().size() >= 7){
            dqc.setParam7(input.getParams().get(6));
        }
        if(input.getParams().size() >= 8){
            dqc.setParam8(input.getParams().get(7));
        }
        if(input.getParams().size() >= 9){
            dqc.setParam9(input.getParams().get(8));
        }
        if(input.getParams().size() >= 10){
            dqc.setParam10(input.getParams().get(9));
        }


        dqc = dataQualityCheckRepo.save(dqc);
        return dqc;
    }

    public DataQualityCheck updateDataQualityCheckResult(String userId, ModelUpdateDataQualityCheckInput input){
        DataQualityCheck dqc = dataQualityCheckRepo.findById(input.getDataQualityCheckId()).orElse(null);
        if(dqc == null) return null;
        dqc.setResult(input.getResult());
        dqc.setStatusId(input.getStatusId());
        dqc.setMessage(input.getMessage());
        dqc.setLastModifiedBy(inp;
        dqc = dataQualityCheckRepo.save(dqc);
        return dqc;
    }
}
