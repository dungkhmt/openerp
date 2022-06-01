package com.hust.baseweb.applications.education.thesisdefensejury.controller;


import com.hust.baseweb.applications.education.thesisdefensejury.entity.DefenseJury;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.TraningProgram;
import com.hust.baseweb.applications.education.thesisdefensejury.service.TranningProgramService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log4j2
@Controller
@Validated
@AllArgsConstructor(onConstructor_ = @Autowired)
public class TraningProgramController {
    private final TranningProgramService tranningProgramService;
    @GetMapping("/program_tranings")
    public ResponseEntity<?> getAllTranningProgram(Pageable pageable){
        try {
            List<TraningProgram> tp;
            tp = tranningProgramService.getAllTranningProgram();

            return new ResponseEntity<>(tp, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
