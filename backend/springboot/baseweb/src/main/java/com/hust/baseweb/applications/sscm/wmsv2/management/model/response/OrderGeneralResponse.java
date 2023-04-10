package com.hust.baseweb.applications.sscm.wmsv2.management.model.response;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@ToString
public class OrderGeneralResponse {
    private UUID orderId;
    private Date createdOrderDate;
    private String orderType;
    private String status;
    private BigDecimal totalOrderCost;
}
