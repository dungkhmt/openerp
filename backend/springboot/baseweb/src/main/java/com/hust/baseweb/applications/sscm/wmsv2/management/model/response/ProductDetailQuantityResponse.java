package com.hust.baseweb.applications.sscm.wmsv2.management.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@ToString
public class ProductDetailQuantityResponse {
    private UUID warehouseId;
    private String warehouseName;
    private UUID bayId;
    private String code;
    private BigDecimal quantity;
    private BigDecimal importPrice;
    private BigDecimal exportPrice;
    private String lotId;
}
