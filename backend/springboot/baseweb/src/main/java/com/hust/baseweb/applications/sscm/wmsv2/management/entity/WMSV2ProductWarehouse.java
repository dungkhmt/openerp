package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@Table(name = "wmsv2_product_warehouse")
public class WMSV2ProductWarehouse {
    @Id
    private UUID productWarehouseId;
    private UUID productId;
    private UUID warehouseId;
    private BigDecimal quantityOnHand;
}
