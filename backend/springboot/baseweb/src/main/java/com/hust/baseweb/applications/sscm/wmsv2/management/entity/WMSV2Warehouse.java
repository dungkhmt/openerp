package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "wmsv2_warehouse")
public class WMSV2Warehouse {
    @Id
    @GenericGenerator(name = "uuid1", strategy = "org.hibernate.id.UUIDGenerator")
    @GeneratedValue(generator = "uuid1")
    private UUID warehouseId;
    private String name;
    private String code;
    private Integer width;
    private Integer length;
    private String address;
    private BigDecimal longitude;
    private BigDecimal latitude;
}
