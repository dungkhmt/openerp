package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.SaleOrderRequest;

import java.security.Principal;
import java.util.Set;
import java.util.UUID;

public interface SaleOrderService {
    boolean createSaleOrder(Principal principal, SaleOrderRequest request);

    void updateStatusByDeliveryTripItem(Set<UUID> orderIds);
}
