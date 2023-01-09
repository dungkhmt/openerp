package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.FacilityV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.NewFacilityRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.FacilityService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/wmsv2/admin/facility")
@AllArgsConstructor(onConstructor_ = @Autowired)
@CrossOrigin
@Validated
public class FacilityController {

    private FacilityService facilityService;

    @PostMapping()
    public ResponseEntity<FacilityV2> createFacility(@Valid @RequestBody NewFacilityRequest request) {
        return ResponseEntity.ok(facilityService.createFacility(request));
    }
}
