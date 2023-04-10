package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderGeneralResponse;

import java.util.List;

public interface OrderService {

    List<OrderGeneralResponse> getAllOrders();

}
