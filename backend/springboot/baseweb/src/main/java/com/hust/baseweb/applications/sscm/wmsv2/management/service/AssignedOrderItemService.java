package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.AssignedOrderItemDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.AssignedOrderItemRequest;

import java.util.List;

public interface AssignedOrderItemService {

    boolean create(AssignedOrderItemRequest request);

    List<AssignedOrderItemDTO> getAllCreatedItems();

}
