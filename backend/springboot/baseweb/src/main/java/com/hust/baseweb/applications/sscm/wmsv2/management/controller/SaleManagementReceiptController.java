package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptRequestResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ReceiptService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<ReceiptRequestResponse>> getReceiptRequestForSaleManagement(Principal principal) {
        return ResponseEntity.ok(receiptService.getForSaleManagement(principal));
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<ReceiptRequestResponse> getReceiptRequestForSaleManagementById(@PathVariable String id) {
        return ResponseEntity.ok(receiptService.getForSaleManagementById(id));
    }

}
