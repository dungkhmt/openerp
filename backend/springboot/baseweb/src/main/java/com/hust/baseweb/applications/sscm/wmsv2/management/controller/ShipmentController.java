package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.AssignedOrderItemDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ShipmentDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.AutoRouteResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.AssignedOrderItemService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.AutoRouteService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryTripService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ShipmentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    private AutoRouteService autoRouteService;

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

    @GetMapping("/delivery-trip/est-dist/{tripId}")
    public ResponseEntity<DeliveryTripDTO> estimateDistanceForTrip(@PathVariable String tripId) {
        return ResponseEntity.ok(deliveryTripService.estimateDistance(tripId));
    }

    @GetMapping("/delivery-trip/{tripId}")
    public ResponseEntity<DeliveryTripDTO> getDeliveryTripById(@PathVariable String tripId) {
        return ResponseEntity.ok(deliveryTripService.getById(tripId));
    }

    @DeleteMapping("/delivery-trip/{tripId}")
    public ResponseEntity<DeliveryTripDTO> deleteDeliveryTripById(@PathVariable String tripId) {
        DeliveryTripDTO response = deliveryTripService.deleteById(tripId);
        return response != null ? ResponseEntity.ok(response) : new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/assigned-order-items")
    public ResponseEntity<List<AssignedOrderItemDTO>> getAssignedOrderItems() {
        return ResponseEntity.ok(assignedOrderItemService.getAllCreatedItems());
    }

    @GetMapping("/assigned-order-items/{assignOrderItemId}")
    public ResponseEntity<AssignedOrderItemDTO> getAssignedOrderItems(@PathVariable UUID assignOrderItemId) {
        return ResponseEntity.ok(assignedOrderItemService.getById(assignOrderItemId));
    }

    @PutMapping("/assigned-order-items")
    public ResponseEntity<AssignedOrderItemDTO> updateItemQuantity(@RequestBody DeliveryTripDTO.DeliveryTripItemDTO request) {
        // dùng cho onRowDelete ở màn hình thông tin chuyến giao hàng
        return ResponseEntity.ok(assignedOrderItemService.update(request));
    }

    @PutMapping("/auto-route")
    public ResponseEntity<String> autoRoute(Principal principal, @RequestBody DeliveryTripDTO request) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                autoRouteService.route(principal, request);
            }
        }).start();
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/auto-route/{deliveryTripId}")
    public ResponseEntity<AutoRouteResponse> getRoutePath(@PathVariable String deliveryTripId) {
        return ResponseEntity.ok(autoRouteService.getPath(deliveryTripId));
    }
}
