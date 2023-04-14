package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Receipt;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ReceiptRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptGeneralResponse;
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
@RequestMapping("/wmsv2/admin/receipt")
@CrossOrigin
@Validated
@Slf4j
@AllArgsConstructor(onConstructor_ = @Autowired)
public class ReceiptController {

    private ReceiptService receiptService;

    @PutMapping()
    public ResponseEntity<Receipt> createReceipt(Principal principal, @RequestBody ReceiptRequest request) {
        return ResponseEntity.ok(receiptService.createReceipt(principal, request));
    }

    @GetMapping
    public ResponseEntity<List<ReceiptGeneralResponse>> getAllReceiptGeneral() {
        return ResponseEntity.ok(receiptService.getAllReceiptGeneral());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceiptRequest> getByReceiptId(@PathVariable String id) {
        return ResponseEntity.ok(receiptService.getById(id));
    }

}
