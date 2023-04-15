package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.CustomerAddress;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.SaleOrderHeader;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.SaleOrderItem;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.OrderStatus;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderDetailResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.OrderGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.CustomerAddressRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.SaleOrderHeaderRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.SaleOrderItemRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.OrderService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class OrderServiceImpl implements OrderService {

    private SaleOrderHeaderRepository saleOrderHeaderRepository;
    private CustomerAddressRepository customerAddressRepository;
    private SaleOrderItemRepository saleOrderItemRepository;

    private ProductService productService;

    @Override
    public List<OrderGeneralResponse> getAllOrdersByStatus(String[] orderStatusStr) {
        List<SaleOrderHeader> orders;
        if (orderStatusStr == null) {
            orders = saleOrderHeaderRepository.findAll();
        } else {
            List<OrderStatus> orderStatuses = Arrays.stream(orderStatusStr).map(OrderStatus::findByCode)
                                                    .collect(Collectors.toList());
            orders = saleOrderHeaderRepository.findAllByStatusIn(orderStatuses);
        }
        return orders
            .stream()
            .map(order -> OrderGeneralResponse
                .builder()
                .orderId(order.getOrderId())
                .createdOrderDate(order.getOrderDate())
                .orderType(order.getOrderType().getName())
                .status(order.getStatus().getName())
                .totalOrderCost(order.getTotalOrderCost())
                .build())
            .collect(Collectors.toList());
    }

    @Override
    public OrderDetailResponse getOrderDetailById(String orderIdStr) {
        UUID orderId = UUID.fromString(orderIdStr);
        Optional<SaleOrderHeader> saleOrderHeaderOpt = saleOrderHeaderRepository.findById(orderId);
        if (!saleOrderHeaderOpt.isPresent()) {
            log.warn(String.format("Order id %s is not exist", orderIdStr));
            return null;
        }

        SaleOrderHeader saleOrderHeader = saleOrderHeaderOpt.get();
        List<SaleOrderHeader> successCustomerOrders = saleOrderHeaderRepository
            .findAllByUserLoginIdAndStatus(saleOrderHeader.getUserLoginId(), OrderStatus.COMPLETED);
        List<SaleOrderHeader> cancelledCustomerOrders = saleOrderHeaderRepository
            .findAllByUserLoginIdAndStatus(saleOrderHeader.getUserLoginId(), OrderStatus.CUSTOMER_CANCELLED);
        BigDecimal totalSuccessOrderCost = successCustomerOrders.stream().map(SaleOrderHeader::getTotalOrderCost)
                                                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCancelledOrderCost = cancelledCustomerOrders.stream().map(SaleOrderHeader::getTotalOrderCost)
                                                                    .reduce(BigDecimal.ZERO, BigDecimal::add);

        Optional<CustomerAddress> customerAddressOpt = customerAddressRepository.findById(saleOrderHeader.getCustomerAddressId());
        if (!customerAddressOpt.isPresent()) {
            throw new RuntimeException(
                String.format("Customer address with id %s of order id %s not found",
                              saleOrderHeader.getCustomerAddressId(),
                              saleOrderHeader.getOrderId()));
        }

        Map<UUID, String> productNameMap = productService.getProductNameMap();
        List<SaleOrderItem> saleOrderItems = saleOrderItemRepository.findAllByOrderId(saleOrderHeader.getOrderId());
        List<OrderDetailResponse.OrderItemResponse> items = saleOrderItems.stream()
            .map(item -> OrderDetailResponse.OrderItemResponse.builder()
                .productId(item.getProductId())
                .productName(productNameMap.get(item.getProductId()))
                .quantity(item.getQuantity())
                .priceUnit(item.getPriceUnit()).build())
            .collect(Collectors.toList());

        return OrderDetailResponse.builder()
            .userLoginId(saleOrderHeader.getUserLoginId())
            .customerName(saleOrderHeader.getCustomerName())
            .totalSuccessOrderCost(totalSuccessOrderCost)
            .totalSuccessOrderCount(BigDecimal.valueOf(successCustomerOrders.size()))
            .totalCancelledOrderCost(totalCancelledOrderCost)
            .totalCancelledOrderCount(BigDecimal.valueOf(cancelledCustomerOrders.size()))
            .createdDate(saleOrderHeader.getCreatedStamp())
            .paymentMethod(saleOrderHeader.getPaymentType().getName())
            .receiptAddress(customerAddressOpt.get().getAddressName())
            .totalOrderCost(saleOrderHeader.getTotalOrderCost())
            .status(saleOrderHeader.getStatus().getName())
            .items(items)
            .build();
    }

    @Override
    public boolean approve(Principal principal,  String orderIdStr) {
        UUID orderId = UUID.fromString(orderIdStr);
        Optional<SaleOrderHeader> saleOrderHeaderOpt = saleOrderHeaderRepository.findById(orderId);
        if (!saleOrderHeaderOpt.isPresent()) {
            log.warn(String.format("Order id %s is not exist", orderIdStr));
            return false;
        }

        SaleOrderHeader saleOrderHeader = saleOrderHeaderOpt.get();
        if (saleOrderHeader.getStatus() != OrderStatus.CREATED) {
            log.warn(String.format("Sale order header is %s -> can not approve", saleOrderHeader.getStatus().getCode()));
            return false;
        }

        saleOrderHeader.setStatus(OrderStatus.APPROVED);
        saleOrderHeader.setApprovedBy(principal.getName());
        saleOrderHeaderRepository.save(saleOrderHeader);
        return true;
    }

    @Override
    public boolean cancel(Principal principal, String orderIdStr) {
        UUID orderId = UUID.fromString(orderIdStr);
        Optional<SaleOrderHeader> saleOrderHeaderOpt = saleOrderHeaderRepository.findById(orderId);
        if (!saleOrderHeaderOpt.isPresent()) {
            log.warn(String.format("Order id %s is not exist", orderIdStr));
            return false;
        }

        SaleOrderHeader saleOrderHeader = saleOrderHeaderOpt.get();
        saleOrderHeader.setStatus(OrderStatus.CANCELLED);
        saleOrderHeader.setCancelledBy(principal.getName());
        saleOrderHeaderRepository.save(saleOrderHeader);
        return true;
    }
}
