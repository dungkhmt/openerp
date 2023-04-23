package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.SaleOrderHeader;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.SaleOrderHeaderRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.OrderService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class OrderServiceImpl implements OrderService {

    private SaleOrderHeaderRepository saleOrderHeaderRepository;

    @Override
    public List<OrderGeneralResponse> getAllOrders() {
        List<SaleOrderHeader> orders = saleOrderHeaderRepository.findAll();
        List<OrderGeneralResponse> response = orders
            .stream()
            .map(order -> OrderGeneralResponse
                .builder()
                .orderId(order.getOrderId())
                .createdOrderDate(order.getOrderDate())
                .orderType(order.getOrderType().getName())
                .status(order.getStatus())
                .totalOrderCost(order.getTotalOrderCost())
                .build())
            .collect(Collectors.toList());
        return response;
    }
}
