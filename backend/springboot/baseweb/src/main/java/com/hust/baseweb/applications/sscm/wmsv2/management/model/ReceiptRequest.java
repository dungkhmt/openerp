package com.hust.baseweb.applications.sscm.wmsv2.management.model;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ReceiptRequest {
    @NotBlank
    private String warehouseId;
    @NotNull
    private Date receivedDate;
    private String receiptName;
    private String description;
    private List<ReceiptItemRequest> receiptItemList;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ReceiptItemRequest {
        private String productId;
        private String lotId;
        private String bayId;
        private BigDecimal quantity;
        private BigDecimal importPrice;
        private Date expiredDate;
    }

}
