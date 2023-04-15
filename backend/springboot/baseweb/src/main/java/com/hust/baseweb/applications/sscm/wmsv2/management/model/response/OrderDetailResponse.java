package com.hust.baseweb.applications.sscm.wmsv2.management.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class OrderDetailResponse {
    private String userLoginId;
    private String customerName;
    private BigDecimal totalSuccessOrderCount;
    private BigDecimal totalSuccessOrderCost;
    private BigDecimal totalCancelledOrderCount;
    private BigDecimal totalCancelledOrderCost;
    private Date createdDate;
    private String paymentMethod;
    private String receiptAddress;
    private BigDecimal totalOrderCost;
    private List<OrderItemResponse> items;
    private String status;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private UUID productId;
        private String productName;
        private long quantity;
        private BigDecimal priceUnit;
    }
}
