package com.hust.baseweb.applications.education.thesisdefensejury.controller;

import ch.qos.logback.classic.Logger;
import com.hust.baseweb.applications.education.recourselink.entity.EducationResourceDomain;
import com.hust.baseweb.applications.education.teacherclassassignment.entity.EduTeacher;
import com.hust.baseweb.applications.education.teacherclassassignment.repo.EduTeacherRepo;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.DefenseJury;
import com.hust.baseweb.applications.education.thesisdefensejury.entity.Thesis;
import com.hust.baseweb.applications.education.thesisdefensejury.models.*;
import com.hust.baseweb.applications.education.thesisdefensejury.repo.ThesisRepo;
import com.hust.baseweb.applications.education.thesisdefensejury.service.ThesisService;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Log4j2
@Controller
@Validated
@AllArgsConstructor(onConstructor_ = @Autowired)
public class ThesisController {
    private final ThesisService thesisService;
    private final EduTeacherRepo eduTeacherRepo;
    @GetMapping("/thesis")
    public ResponseEntity<?> getThesis(Pageable pageable){
        Page<ThesisOM> res = thesisService.findAll(pageable);
        if (res == null){
            return ResponseEntity.ok().body("Not found thesis");
        }
        return ResponseEntity.ok().body(res);
    }
    @GetMapping("/thesis/{thesisId}")
    public ResponseEntity<?> getDetailThesis(@PathVariable("thesisId") UUID thesisId){
        System.out.println(thesisId);
        if (thesisId == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid thesis id");
        }
        return ResponseEntity.ok().body(thesisService.findById(thesisId));
    }
    @GetMapping("/teachers")
    public ResponseEntity<?> getTeachers(Pageable pageable){
        List<EduTeacher> res = eduTeacherRepo.findAll();
        if (res == null){
            return ResponseEntity.ok().body("Not found any teacher");
        }
        return ResponseEntity.ok().body(res);
    }
    @PostMapping("/thesis/search")
    public ResponseEntity<?> searchByName(@RequestBody SearchThesisIM input){
        // check input
//        if (input == null){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid body request");
//        }
//        if (input.getThesis_name()=="") {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid thesis name");
//        }
        List<ThesisOM> res = thesisService.searchByThesisName(input.getThesis_name());

        return ResponseEntity.ok().body(res);
    }

    @PostMapping("/thesis")
    public ResponseEntity<?> createThesis(
        @RequestBody ThesisIM request
    ){

        // TODO: check valid request
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid body request");
        }

        Thesis thesis = thesisService.createThesis(request);
        if (thesis == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Internal server");
        }


        return ResponseEntity.status(HttpStatus.OK).body(thesis);
    }
    @PostMapping("/thesis/delete")
    public ResponseEntity<?> deleteThesis(
        @RequestBody DeleteThesisIM request
    ){
        Response res = new Response();
        // TODO: check valid request
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid body request");
        }
        if (request.getId()==null||request.getUserLogin()==""){
            res.setOk(false);
            res.setErr("Thesis id or userLogin Id invalid");
            return  ResponseEntity.status(HttpStatus.OK).body(res);
        }

        Response ok = thesisService.deleteThesis(request.getId(),request.getUserLogin());

        return ResponseEntity.status(HttpStatus.OK).body(ok);
    }

    @PutMapping("/thesis/edit")
    public ResponseEntity<?> editThesis(
        @RequestBody ThesisIM request
    ){

        // TODO: check valid request
        if (request == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid body request");
        }

        Response response = thesisService.editThesis(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
