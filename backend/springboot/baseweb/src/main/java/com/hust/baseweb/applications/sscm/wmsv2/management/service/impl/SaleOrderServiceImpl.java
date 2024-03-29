package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.CustomerAddress;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.SaleOrderHeader;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.SaleOrderItem;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.OrderType;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.PaymentType;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.CartItemRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.SaleOrderRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.CartItemResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.CustomerAddressRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.SaleOrderHeaderRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.SaleOrderItemRepository;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.CartService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.SaleOrderService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class SaleOrderServiceImpl implements SaleOrderService {

    private SaleOrderHeaderRepository saleOrderHeaderRepository;
    private SaleOrderItemRepository saleOrderItemRepository;
    private CustomerAddressRepository customerAddressRepository;

    private CartService cartService;
    private ProductService productService;

    @Override
    @Transactional
    public boolean createSaleOrder(Principal principal, SaleOrderRequest request) {
        String userLoginId = principal.getName();
        CustomerAddress customerAddress = null;
        if (request.getCustomerAddressId() == null) {
            customerAddress = CustomerAddress.builder()
                .customerAddressId(UUID.randomUUID())
                .addressName(request.getAddressName())
                .longitude(request.getLongitude())
                .latitude(request.getLatitude())
                .userLoginId(userLoginId)
                .build();
            customerAddressRepository.save(customerAddress);
        } else {
            Optional<CustomerAddress> customerAddressOpt = customerAddressRepository.findById(request.getCustomerAddressId());
            if (customerAddressOpt.isPresent()) {
                customerAddress = customerAddressOpt.get();
                customerAddressRepository.save(customerAddress);
            } else {
                log.warn(String.format("Customer address id %s is not found", request.getCustomerAddressId()));
                return false;
            }
        }

        OrderType orderType = OrderType.findByCode(request.getOrderTypeCode());
        if (orderType == null) {
            log.warn("Order type is null");
            return false;
        }

        PaymentType paymentType = PaymentType.findByCode(request.getPaymentTypeCode());
        if (paymentType == null) {
            log.warn("Payment type is null");
            return false;
        }

        CartItemResponse cartItemResponse = cartService.calculateCartFee(CartItemRequest
            .builder()
            .items(request.getItems())
            .longitude(request.getLongitude())
            .latitude(request.getLatitude())
            .build());
        SaleOrderHeader saleOrderHeader = SaleOrderHeader.builder()
            .orderId(UUID.randomUUID())
            .userLoginId(userLoginId)
            .orderDate(new Date())
            .deliveryFee(cartItemResponse.getDeliveryFee())
            .totalProductCost(cartItemResponse.getTotalProductCost())
            .totalOrderCost(cartItemResponse.getTotalOrderCost())
            .customerAddressId(customerAddress.getCustomerAddressId())
            .customerName(request.getCustomerName())
            .customerPhoneNumber(request.getCustomerPhoneNumber())
            .description(request.getDescription())
            .paymentType(paymentType)
            .orderType(orderType)
            .build();
        UUID orderId = saleOrderHeader.getOrderId();
        List<SaleOrderItem> saleOrderItemList = request.getItems().stream().map(item -> SaleOrderItem
            .builder()
            .saleOrderItemId(UUID.randomUUID())
            .orderId(orderId)
            .productId(UUID.fromString(item.getProductId()))
            .quantity(item.getQuantity())
            .priceUnit(productService.getCurrPriceByProductId(UUID.fromString(item.getProductId())))
            .build()).collect(Collectors.toList());

        saleOrderHeaderRepository.save(saleOrderHeader);
        saleOrderItemRepository.saveAll(saleOrderItemList);
        return true;
    }
}
