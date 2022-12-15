package com.hust.baseweb.applications.bigdataanalysis.service;

import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheck;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckMaster;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckResult;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelCreateDataCheckRuleInput;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelCreateDataQualityCheckMaster;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckMaster;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckResult;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelUpdateDataQualityCheckInput;
import com.hust.baseweb.applications.bigdataanalysis.repo.DataQualityCheckMasterRepo;
import com.hust.baseweb.applications.bigdataanalysis.repo.DataQualityCheckRepo;
import com.hust.baseweb.applications.bigdataanalysis.repo.DataQualityCheckResultRepo;
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
    private DataQualityCheckResultRepo dataQualityCheckResultRepo;
    private DataQualityCheckMasterRepo dataQualityCheckMasterRepo;

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

        dqc = dataQualityCheckRepo.save(dqc);
        return dqc;
    }

    public List<ModelResponseDataQualityCheckResult> getDataQualityCheckResultList(){
        List<DataQualityCheckResult> lst = dataQualityCheckResultRepo.findAll();
        List<ModelResponseDataQualityCheckResult> res = new ArrayList();
        for(DataQualityCheckResult e: lst){
            ModelResponseDataQualityCheckResult r = new ModelResponseDataQualityCheckResult();
            r.setRuleId(e.getRuleId());
            r.setEntity(e.getEntity());
            r.setInstance(e.getInstance());
            r.setTableName(e.getTableName());
            r.setValue(e.getValue());
            r.setStatus(e.getStatus());
            r.setLinkSource(e.getLinkSource());
            r.setCreatedStamp(e.getCreatedStamp());
            res.add(r);
        }
        return res;
    }

    public List<ModelResponseDataQualityCheckRule> getDataQualityCheckRuleList(){
        List<DataQualityCheckRule> lst = dataQualityCheckRuleRepo.findAll();
        List<ModelResponseDataQualityCheckRule> res = new ArrayList();
        for(DataQualityCheckRule e: lst){
            String[] listParams = e.getParams().split(",");
            List<String> L = new ArrayList();

            if(listParams != null && listParams.length > 0)
                for(int i = 0; i < listParams.length; i++){
                    L.add(listParams[i].trim());
                }
            ModelResponseDataQualityCheckRule m  = new ModelResponseDataQualityCheckRule();
            m.setRuleId(e.getRuleId());
            m.setParams(e.getParams());
            m.setListParams(L);
            res.add(m);

        }
        return res;
    }

    public DataQualityCheckMaster createDataQualityCheckMaster(String userId, ModelCreateDataQualityCheckMaster input){
        DataQualityCheckMaster res = new DataQualityCheckMaster();
        res.setRuleId(input.getRuleId());
        res.setCreatedByUserLoginId(userId);
        res.setCreatedStamp(new Date());
        res.setMetaData(input.getMetaData());
        res.setTableName(input.getTableName());
        res = dataQualityCheckMasterRepo.save(res);

        return res;
    }

    public List<ModelResponseDataQualityCheckMaster> getListDataQualityCheckMaster(String userId){
        List<DataQualityCheckMaster> L = dataQualityCheckMasterRepo.findAllByCreatedByUserLoginId(userId);
        List<ModelResponseDataQualityCheckMaster> res = new ArrayList();
        for(DataQualityCheckMaster e : L){
            ModelResponseDataQualityCheckMaster m = new ModelResponseDataQualityCheckMaster();
            m.setId(e.getId());
            m.setRuleId(e.getRuleId());
            m.setCreatedByUserLoginId(e.getCreatedByUserLoginId());
            m.setMetaData(e.getMetaData());
            m.setTableName(e.getTableName());
            m.setCreatedStamp(e.getCreatedStamp());
            res.add(m);
        }
        return res;
    }

    public boolean removeDataQualityCheckMaster(UUID id){
        DataQualityCheckMaster r = dataQualityCheckMasterRepo.findById(id).orElse(null);
        if(r ==  null) return false;
        dataQualityCheckMasterRepo.delete(r);
        return true;
    }

}
