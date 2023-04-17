package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryPerson;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryManagementService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wmsv2/delivery-manager")
@CrossOrigin
@Validated
@Slf4j
@AllArgsConstructor(onConstructor_ = @Autowired)
public class DeliveryManagementController {

    private DeliveryManagementService deliveryManagementService;

    @GetMapping("/delivery-person")
    public ResponseEntity<List<DeliveryPerson>> getAllDeliveryPersons() {
        return ResponseEntity.ok(deliveryManagementService.getAllDeliveryPersons());
    }

    @PutMapping("/delivery-person")
    public ResponseEntity<DeliveryPerson> create(@RequestBody DeliveryPerson person) {
        DeliveryPerson response = deliveryManagementService.create(person);
        return response == null ? new ResponseEntity<>(person, HttpStatus.INTERNAL_SERVER_ERROR) : ResponseEntity.ok(response);
    }

    @DeleteMapping("/delivery-person/{deliveryPersonId}")
    public ResponseEntity<String> delete(@PathVariable String deliveryPersonId) {
        return deliveryManagementService.delete(deliveryPersonId) ?
            ResponseEntity.ok("OK") :
            new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
