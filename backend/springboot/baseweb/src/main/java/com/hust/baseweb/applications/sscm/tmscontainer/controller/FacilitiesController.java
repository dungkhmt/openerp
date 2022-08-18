package com.hust.baseweb.applications.sscm.tmscontainer.controller;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facility;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.service.FacilitiesService;
import com.hust.baseweb.applications.sscm.tmscontainer.service.ShelvesService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@AllArgsConstructor(onConstructor_ = @Autowired)

@RequestMapping("/admin/wms/warehouse")
@CrossOrigin()
@RestController
public class FacilitiesController {

    @Autowired
    private FacilitiesService facilitiesService;

    @Autowired
    private ShelvesService shelvesService;

    @PostMapping("")
    public FacilityResponse createFacilities(@RequestBody @Valid FacilityRequest facilityRequest) {

        return facilitiesService.createFacility(facilityRequest);
    }

    @GetMapping("/{id}")
    public FacilityResponse getFacilitiesById(@PathVariable Integer id){
        return facilitiesService.getById(id);
    }

    @GetMapping("")
    public List<Facility> getAllFacilities(){
        return facilitiesService.getAllFacilities();
    }

    @PutMapping("/{id}")
    public FacilityResponse update(@PathVariable Integer id, @RequestBody @Valid FacilityRequest facilityRequest) throws Exception {
        return facilitiesService.updateById(id, facilityRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Integer id) {
        try {
            facilitiesService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


//    @PostMapping("/add-product")
//    public FacilityResponse addProduct(@RequestBody @Valid Integer shelfId, Integer variantId ) {
//
//    }

}
