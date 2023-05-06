package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.ShipmentDTO;

import java.security.Principal;
import java.util.List;

public interface ShipmentService {

    String create(Principal principal, ShipmentDTO request);

    List<ShipmentDTO> getAllShipments(Principal principal);

    ShipmentDTO getShipmentById(String shipmentId);

    boolean deleteByIds(String[] shipmentIds);

}
