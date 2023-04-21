package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.AssignedOrderItemDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.AssignedOrderItemRequest;

import java.util.List;
import java.util.UUID;

public interface AssignedOrderItemService {

    boolean create(AssignedOrderItemRequest request);

    List<AssignedOrderItemDTO> getAllCreatedItems();

    AssignedOrderItemDTO getById(UUID id);

    AssignedOrderItemDTO update(DeliveryTripDTO.DeliveryTripItemDTO request);

}
