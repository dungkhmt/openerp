package com.hust.baseweb.applications.education.thesisdefensejury.controller;

import com.hust.baseweb.applications.education.thesisdefensejury.entity.Thesis;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.ThesisDefensePlan;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.TraningProgram;
import com.hust.baseweb.applications.education.thesisdefensejury.models.Response;
import com.hust.baseweb.applications.education.thesisdefensejury.models.ThesisDefensePlanIM;
import com.hust.baseweb.applications.education.thesisdefensejury.models.ThesisIM;
import com.hust.baseweb.applications.education.thesisdefensejury.service.ThesisDefensePlanService;
import com.hust.baseweb.applications.education.thesisdefensejury.service.TranningProgramService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

@Log4j2
@Controller
@Validated
@AllArgsConstructor(onConstructor_ = @Autowired)
public class ThesisDefensePlanController {
    private final ThesisDefensePlanService thesisDefensePlanService;
    @GetMapping("/thesis_defense_plan")
    public ResponseEntity<?> getAll(Pageable pageable){
        try {
            List<ThesisDefensePlan> tdp;
            tdp = thesisDefensePlanService.getAllThesisDefensePlan();

            return new ResponseEntity<>(tdp, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/thesis_defense_plan/{defensePlanId}")
    public ResponseEntity<?> getDetailThesis(@PathVariable("defensePlanId") String defensePlanId){
        System.out.println(defensePlanId);
        if (defensePlanId == ""){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid defense plan id");
        }

        Response res = thesisDefensePlanService.findById(defensePlanId);
        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/thesis_defense_plan")
    public ResponseEntity<?> createThesisDefensePlan(
        @RequestBody ThesisDefensePlanIM request
    ){

        // TODO: check valid request
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid body request");
        }
        if(request.getName() == ""){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid body request");
        }

        Response res = thesisDefensePlanService.createThesisDefensePlan(request);



        return ResponseEntity.status(HttpStatus.OK).body(res);
    }
}
