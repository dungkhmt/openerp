package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.SaleOrderRequest;

import java.security.Principal;

public interface SaleOrderService {
    boolean createSaleOrder(Principal principal, SaleOrderRequest request);
}
