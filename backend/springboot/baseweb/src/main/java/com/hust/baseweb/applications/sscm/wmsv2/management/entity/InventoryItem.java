package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "wmsv2_inventory_item")
public class InventoryItem {
    @Id
    private UUID inventoryItemId;
    private UUID productId;
    private String lotId;
    private UUID warehouseId;
    private UUID bayId;

    private BigDecimal quantityOnHandTotal;
    private String uomId;

    private String description;

    private BigDecimal importPrice;
    private BigDecimal exportPrice;
    private String currencyOumId;

    private Date datetimeReceived;
    private Date lastUpdatedStamp;
    private Date createdStamp;
    private Date expireDate;
}
