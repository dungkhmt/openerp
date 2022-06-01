package com.hust.baseweb.applications.education.thesisdefensejury.controller;

import com.hust.baseweb.applications.education.thesisdefensejury.entity.ThesisDefensePlan;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.TraningProgram;
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

import java.util.List;

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
}
