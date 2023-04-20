package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.AssignedOrderItem;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTrip;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTripItem;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.AssignedOrderItemStatus;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.AssignedOrderItemRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.DeliveryTripItemRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.DeliveryTripRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryManagementService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.DeliveryTripService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.WarehouseService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class DeliveryTripServiceImpl implements DeliveryTripService {

    private DeliveryTripRepository deliveryTripRepository;
    private DeliveryTripItemRepository deliveryTripItemRepository;
    private AssignedOrderItemRepository assignedOrderItemRepository;

    private WarehouseService warehouseService;
    private DeliveryManagementService deliveryManagementService;

    @Override
    @Transactional
    public DeliveryTripDTO create(Principal principal, DeliveryTripDTO request) {
        DeliveryTrip trip;
        if (request.getDeliveryTripId() == null) {
            trip = DeliveryTrip.builder()
                    .createdBy(principal.getName())
                    .shipmentId(request.getShipmentId()).build();
            DeliveryTrip t = deliveryTripRepository.save(trip);
            request.setDeliveryTripId(t.getDeliveryTripId());
            return request;
        }

        String deliveryTripId = request.getDeliveryTripId();
        Optional<DeliveryTrip> tripOpt = deliveryTripRepository.findById(request.getDeliveryTripId());
        if (!tripOpt.isPresent()) {
            String message = String.format("Delivery Trip id %s is not exist", request.getDeliveryTripId());
            log.warn(message);
            throw new RuntimeException(message);
        }

        trip = tripOpt.get();
        trip.setVehicleId(request.getVehicleId());
        trip.setDeliveryPersonId(request.getDeliveryPersonId());
        trip.setTotalLocations(request.getTotalLocations());
        trip.setWarehouseId(request.getWarehouseId());

        List<DeliveryTripItem> items = new ArrayList<>();
        List<AssignedOrderItem> updateAssignedOrderItems = new ArrayList<>();
        for (DeliveryTripDTO.DeliveryTripItemDTO item : request.getItems()) {
            DeliveryTripItem adder = DeliveryTripItem.builder()
                                                     .deliveryTripId(deliveryTripId)
                                                     .sequence(item.getSequence())
                                                     .assignedOrderItemId(item.getAssignOrderItemId())
                                                     .quantity(item.getQuantity())
                                                     .orderId(item.getOrderID())
                                                     .build();
            items.add(adder);
            // update quantity of assigned order items
            Optional<AssignedOrderItem> updateItemAdderOpt = assignedOrderItemRepository.findById(item.getAssignOrderItemId());
            if (!updateItemAdderOpt.isPresent()) {
                throw new RuntimeException(String.format("Assigned order item with id %s is not exist", item.getAssignOrderItemId()));
            }
            AssignedOrderItem updateItemAdder = updateItemAdderOpt.get();
            BigDecimal newQuantity = updateItemAdder.getQuantity().subtract(item.getQuantity());
            if (newQuantity.compareTo(BigDecimal.ZERO) == 0) {
                // nếu đã gán tất cả item cho chuyến giao hàng này
                // thì sẽ cập nhật status của assigned order item này thành DONE trong database
                updateItemAdder.setStatus(AssignedOrderItemStatus.DONE);
            }
            updateItemAdder.setQuantity(newQuantity);
            updateAssignedOrderItems.add(updateItemAdder);
        }
        // TODO: Calculate distance here

        deliveryTripRepository.save(trip);
        deliveryTripItemRepository.saveAll(items);
        assignedOrderItemRepository.saveAll(updateAssignedOrderItems);
        return new DeliveryTripDTO(trip);
    }

    @Override
    public List<DeliveryTripDTO> getAll() {
        List<DeliveryTrip> trips = deliveryTripRepository.findAll();
        return trips.stream().map(trip -> new DeliveryTripDTO(trip)).collect(Collectors.toList());
    }

    @Override
    public DeliveryTripDTO getById(String tripId) {
        Optional<DeliveryTrip> tripOpt = deliveryTripRepository.findById(tripId);
        if (!tripOpt.isPresent()) {
            log.warn(String.format("Trip id %s is not exist", tripId));
            return null;
        }

        Map<UUID, String> warehouseNameMap = warehouseService.getWarehouseNameMap();
        DeliveryTrip trip = tripOpt.get();
        DeliveryTripDTO response = new DeliveryTripDTO(trip);
        if (trip.getWarehouseId() != null) {
            response.setWarehouseName(warehouseNameMap.get(trip.getWarehouseId()));
        }

        Map<UUID, String> personNameMap = deliveryManagementService.getDeliveryPersonNameMap();
        if (trip.getDeliveryPersonId() != null) {
            response.setDeliveryPersonName(personNameMap.get(trip.getDeliveryPersonId()));
        }
        return response;
    }
}
