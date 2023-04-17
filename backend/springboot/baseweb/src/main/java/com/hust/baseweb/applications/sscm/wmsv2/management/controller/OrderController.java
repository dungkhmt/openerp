package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.AssignedOrderItemRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderDetailResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.AssignedOrderItemService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.OrderService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/wmsv2/admin/order")
@CrossOrigin
@Validated
@Slf4j
@AllArgsConstructor(onConstructor_ = @Autowired)
public class OrderController {

    private OrderService orderService;

    private AssignedOrderItemService assignedOrderItemService;

    @GetMapping()
    public ResponseEntity<List<OrderGeneralResponse>> getAllOrders(
        @RequestParam(name = "orderStatus", required = false) String[] orderStatus) {
        return ResponseEntity.ok(orderService.getAllOrdersByStatus(orderStatus));
    }

    @GetMapping(path = "/{orderId}")
    public ResponseEntity<OrderDetailResponse> getOrderDetailById(@PathVariable String orderId) {
        return ResponseEntity.ok(orderService.getOrderDetailById(orderId));
    }

    @PutMapping(path = "/approve/{orderId}")
    public ResponseEntity<String> approveOrder(Principal principal, @PathVariable String orderId) {
        return orderService.approve(principal, orderId) ? ResponseEntity.ok("OK") :
            new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping(path = "/cancel/{orderId}")
    public ResponseEntity<String> cancelOrder(Principal principal, @PathVariable String orderId) {
        return orderService.cancel(principal, orderId) ? ResponseEntity.ok("OK") :
            new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping(path = "/assign-order-item")
    public ResponseEntity<String> createAssignedOrderItems(@Valid @RequestBody AssignedOrderItemRequest request) {
        return assignedOrderItemService.create(request) ? ResponseEntity.ok("OK") :
            new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
