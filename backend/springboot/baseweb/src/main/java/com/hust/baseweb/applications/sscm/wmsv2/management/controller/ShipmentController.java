package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.AssignedOrderItemDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ShipmentDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.AssignedOrderItemService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryTripService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ShipmentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/wmsv2/delivery-manager")
@AllArgsConstructor(onConstructor_ = @Autowired)
@CrossOrigin
@Validated
public class ShipmentController {

    private ShipmentService shipmentService;
    private DeliveryTripService deliveryTripService;
    private AssignedOrderItemService assignedOrderItemService;

    @GetMapping("/shipment")
    public ResponseEntity<List<ShipmentDTO>> getAllShipments(Principal principal) {
        return ResponseEntity.ok(shipmentService.getAllShipments(principal));
    }

    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<ShipmentDTO> getAllShipments(@PathVariable String shipmentId) {
        return ResponseEntity.ok(shipmentService.getShipmentById(shipmentId));
    }

    @PutMapping("/shipment")
    public ResponseEntity<String> createShipment(Principal principal, @RequestBody ShipmentDTO request) {
        return ResponseEntity.ok(shipmentService.create(principal, request));
    }

    @PutMapping("/delivery-trip")
    public ResponseEntity<DeliveryTripDTO> createDeliveryTrip(Principal principal, @RequestBody DeliveryTripDTO request) {
        return ResponseEntity.ok(deliveryTripService.create(principal, request));
    }

    @GetMapping("/delivery-trip")
    public ResponseEntity<List<DeliveryTripDTO>> getAllDeliveryTrips() {
        return ResponseEntity.ok(deliveryTripService.getAll());
    }

    @GetMapping("/delivery-trip/{tripId}")
    public ResponseEntity<DeliveryTripDTO> getDeliveryTripById(@PathVariable String tripId) {
        return ResponseEntity.ok(deliveryTripService.getById(tripId));
    }

    @GetMapping("/assigned-order-items")
    public ResponseEntity<List<AssignedOrderItemDTO>> getAssignedOrderItems() {
        return ResponseEntity.ok(assignedOrderItemService.getAllCreatedItems());
    }
}
