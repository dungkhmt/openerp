package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderDetailResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderGeneralResponse;

import java.security.Principal;
import java.util.List;

public interface OrderService {

    List<OrderGeneralResponse> getAllOrdersByStatus(String[] orderStatus);

    OrderDetailResponse getOrderDetailById(String orderId);

    boolean approve(Principal principal, String orderId);

    boolean cancel(Principal principal, String orderId);

}
