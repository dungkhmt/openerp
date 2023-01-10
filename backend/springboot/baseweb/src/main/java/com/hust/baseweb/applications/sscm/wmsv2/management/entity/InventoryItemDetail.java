package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class InventoryItemDetail {
    @Id
    private UUID inventoryItemDetailId;
    private UUID inventoryItemId;
    private BigDecimal quantityOnHandDiff;
    private Date effectiveDate;
}
