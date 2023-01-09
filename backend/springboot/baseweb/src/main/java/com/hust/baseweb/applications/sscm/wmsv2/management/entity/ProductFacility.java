package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
public class ProductFacility {
    @Id
    private UUID productFacilityId;
    private UUID productId;
    private UUID facilityId;
    private BigDecimal quantityOnHand;
}
