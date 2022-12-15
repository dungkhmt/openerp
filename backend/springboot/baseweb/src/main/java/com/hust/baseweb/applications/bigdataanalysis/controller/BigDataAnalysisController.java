package com.hust.baseweb.applications.bigdataanalysis.controller;

import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheck;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.entity.DataQualityCheckMaster;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelCreateDataCheckRuleInput;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelCreateDataQualityCheckMaster;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckMaster;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckResult;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelResponseDataQualityCheckRule;
import com.hust.baseweb.applications.bigdataanalysis.model.ModelUpdateDataQualityCheckInput;
import com.hust.baseweb.applications.bigdataanalysis.service.DataQualityCheckService;
import org.springframework.http.ResponseEntity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.InputStream;
import java.security.Principal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
@RestController
@CrossOrigin
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j

public class BigDataAnalysisController {
    private DataQualityCheckService dataQualityCheckService;

    @GetMapping("/get-data-quality-check-rules")
    public ResponseEntity<?> getDataQualityCheckRules(Principal principal){
        //List<DataQualityCheckRule> res = dataQualityCheckService.getDataQualityCheckRules();
        List<ModelResponseDataQualityCheckRule> res = dataQualityCheckService.getDataQualityCheckRuleList();

        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-data-quality-check-list")
    public ResponseEntity<?> getDataQualityCheckList(Principal principal){
        List<DataQualityCheck> res = dataQualityCheckService.getDataQualityCheckList();
        return ResponseEntity.ok().body(res);
    }
    @PostMapping("/update-data-quality-check-result")
    public ResponseEntity<?> updateDataQualityCheckResult(Principal principal, @RequestBody
        ModelUpdateDataQualityCheckInput input){
        DataQualityCheck dqc = dataQualityCheckService.updateDataQualityCheckResult(principal.getName(), input);
        return ResponseEntity.ok().body(dqc);
    }
    @PostMapping("/create-data-quality-check")
    public ResponseEntity<?> createDataQualityCheck(Principal principal, @RequestBody ModelCreateDataCheckRuleInput input){
        DataQualityCheck dqc = dataQualityCheckService.createDataQualityCheck(principal.getName(), input);
        return ResponseEntity.ok().body(dqc);
    }

    @GetMapping("/get-data-quality-check-result-list")
    public ResponseEntity<?> getDataQualityCheckResultList(){
        List<ModelResponseDataQualityCheckResult> res = dataQualityCheckService.getDataQualityCheckResultList();
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/create-data-quality-check-master")
    public ResponseEntity<?> createDataQualityCheckMaster(Principal principal, @RequestBody ModelCreateDataQualityCheckMaster input){
        DataQualityCheckMaster res =  dataQualityCheckService.createDataQualityCheckMaster(principal.getName(), input);
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/get-list-data-quality-check-master")
    public ResponseEntity<?> getListDataQualityCheckMaster(Principal principal){
        List<ModelResponseDataQualityCheckMaster> res = dataQualityCheckService.getListDataQualityCheckMaster(principal.getName());


        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/remove-data-quality-check-master/{id}")
    public ResponseEntity<?> removeDataQualityCheckMaster(@PathVariable UUID id){
        boolean ok = dataQualityCheckService.removeDataQualityCheckMaster(id);
        return ResponseEntity.ok().body(ok);
    }

}
