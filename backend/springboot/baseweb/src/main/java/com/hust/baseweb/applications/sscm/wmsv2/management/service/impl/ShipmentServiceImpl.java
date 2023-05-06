package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryPerson;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTrip;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Shipment;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ShipmentDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.DeliveryPersonRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.DeliveryTripRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.ShipmentRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ShipmentService;
import com.hust.baseweb.applications.sscm.wmsv2.management.utils.DateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ShipmentServiceImpl implements ShipmentService {

    private ShipmentRepository shipmentRepository;
    private DeliveryTripRepository deliveryTripRepository;
    private DeliveryPersonRepository deliveryPersonRepository;

    @Override
    public String create(Principal principal, ShipmentDTO request) {
        try {
            Shipment shipment = Shipment.builder()
                                        .createdBy(principal.getName())
                                        .expectedDeliveryStamp(request.getExpectedDeliveryStamp()).build();
            shipmentRepository.save(shipment);
            return shipment.getShipmentId();
        } catch (Exception e) {
            log.warn(e.getMessage());
            return null;
        }
    }

    @Override
    public List<ShipmentDTO> getAllShipments(Principal principal) {
        List<Shipment> shipments =  shipmentRepository.findAllByIsDeletedIsFalse();
        return shipments.stream().map(shipment -> ShipmentDTO.builder()
            .shipmentId(shipment.getShipmentId())
            .lastUpdatedStamp(DateTimeFormat.convertDateToString(DateTimeFormat.DD_MM_YYYY_HH_MM_SS, shipment.getLastUpdatedStamp()))
            .createdStamp(DateTimeFormat.convertDateToString(DateTimeFormat.DD_MM_YYYY_HH_MM_SS, shipment.getCreatedStamp()))
            .createdBy(shipment.getCreatedBy())
            .expectedDeliveryStamp(shipment.getExpectedDeliveryStamp())
            .build()).collect(Collectors.toList());
    }

    @Override
    public ShipmentDTO getShipmentById(String shipmentId) {
        Optional<Shipment> shipmentOpt = shipmentRepository.findById(shipmentId);
        if (!shipmentOpt.isPresent()) {
            log.warn(String.format("Shipment with id %s is not exist", shipmentId));
            return null;
        }
        Shipment shipment = shipmentOpt.get();
        List<DeliveryTrip> trips = deliveryTripRepository.findAllByShipmentIdAndIsDeletedIsFalse(shipmentId);
        List<DeliveryTripDTO> tripDTOS = new ArrayList<>();
        for (DeliveryTrip trip : trips) {
            Optional<DeliveryPerson> person = Optional.empty();
            if (trip.getDeliveryPersonId() != null) {
                person = deliveryPersonRepository.findById(trip.getDeliveryPersonId());
            }
            DeliveryTripDTO dto = DeliveryTripDTO.builder()
                .deliveryTripId(trip.getDeliveryTripId())
                .vehicleId(trip.getVehicleId())
                .deliveryPersonId(trip.getDeliveryPersonId())
                .distance(trip.getDistance())
                .totalWeight(trip.getTotalWeight())
                .totalLocations(trip.getTotalLocations())
                .lastUpdatedStamp(DateTimeFormat.convertDateToString(DateTimeFormat.DD_MM_YYYY_HH_MM_SS, trip.getLastUpdatedStamp()))
                .createdBy(trip.getCreatedBy())
                .createdStamp(DateTimeFormat.convertDateToString(DateTimeFormat.DD_MM_YYYY_HH_MM_SS, trip.getCreatedStamp()))
                .build();
            if (person.isPresent()) {
                dto.setDeliveryPersonName(person.get().getFullName());
            } else {
                dto.setDeliveryPersonName(null);
            }
            tripDTOS.add(dto);
        }
        return ShipmentDTO.builder().shipmentId(shipment.getShipmentId())
            .expectedDeliveryStamp(shipment.getExpectedDeliveryStamp())
            .createdStamp(DateTimeFormat.convertDateToString(DateTimeFormat.DD_MM_YYYY_HH_MM_SS, shipment.getCreatedStamp()))
            .createdBy(shipment.getCreatedBy())
            .lastUpdatedStamp(DateTimeFormat.convertDateToString(DateTimeFormat.DD_MM_YYYY_HH_MM_SS, shipment.getLastUpdatedStamp()))
            .trips(tripDTOS)
            .build();
    }

    @Override
    @Transactional
    public boolean deleteByIds(String[] shipmentIds) {
        try {
            for (String shipmentId : shipmentIds) {
                Optional<Shipment> shipmentOpt = shipmentRepository.findById(shipmentId);
                if (shipmentOpt.isPresent()) {
                    Shipment shipment = shipmentOpt.get();
                    shipment.setDeleted(true);
                    shipmentRepository.save(shipment);
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
