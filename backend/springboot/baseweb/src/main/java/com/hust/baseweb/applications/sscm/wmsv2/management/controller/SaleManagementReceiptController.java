package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptRequestResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ReceiptService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/wmsv2/sale-management/receipt")
@CrossOrigin
@Validated
@Slf4j
@AllArgsConstructor(onConstructor_ = @Autowired)
public class SaleManagementReceiptController {

    private ReceiptService receiptService;

    @GetMapping()
    public ResponseEntity<List<ReceiptRequestResponse>> getReceiptRequestForSaleManagement(Principal principal, @RequestParam(required = false) String status) {
        return ResponseEntity.ok(receiptService.getForSaleManagement(principal, status));
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ReceiptRequestResponse> getReceiptRequestForSaleManagementById(@PathVariable String id) {
        return ResponseEntity.ok(receiptService.getForSaleManagementById(id));
    }

    @PutMapping(path = "/approve/{id}")
    public ResponseEntity<String> approveReceiptRequest(Principal principal, @PathVariable String id) {
        return receiptService.approve(principal, id) ?
            ResponseEntity.ok("OK") :
            new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping(path = "/cancel/{id}")
    public ResponseEntity<String> cancelReceiptRequest(Principal principal, @PathVariable String id) {
        return receiptService.cancel(principal, id) ?
            ResponseEntity.ok("OK") :
            new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
