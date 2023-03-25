package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_bay")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductBay {

    @Id
    private UUID productBayId;
    private UUID productId;
    private UUID bayId;
    private BigDecimal quantity;

}
