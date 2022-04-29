package com.hust.baseweb.applications.sscm.tmscontainer.controller;

import com.hust.baseweb.applications.sscm.tmscontainer.service.TMSContainerService;
import localsearch.domainspecific.vehiclerouting.apps.truckcontainer.model.TruckMoocContainerOutputJson;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.security.Principal;
import java.util.Scanner;

@Log4j2
@org.springframework.stereotype.Controller
@Validated
@AllArgsConstructor(onConstructor = @__(@Autowired))

public class TMSContainerController {
    @PostMapping("/tmscontainer/solve")
    public ResponseEntity<?> tmsContainerSolve(
        Principal principale,
        @RequestParam("inputJson") String inputJson,
        @RequestParam("file") MultipartFile file){

        try {
            InputStream inputStream = file.getInputStream();
            String input = "";
            Scanner in = new Scanner(inputStream);
            while(in.hasNext()){
                input = input + in.nextLine();
            }
            System.out.println("tmsContainerSolve, input = " + input);
            in.close();
            TMSContainerService tmsContainerService = new TMSContainerService();
            TruckMoocContainerOutputJson solution = tmsContainerService.solve(input);
            return ResponseEntity.ok().body(solution);
        }catch(Exception e){
            e.printStackTrace();
        }
        return ResponseEntity.ok().body(null);
    }
}
