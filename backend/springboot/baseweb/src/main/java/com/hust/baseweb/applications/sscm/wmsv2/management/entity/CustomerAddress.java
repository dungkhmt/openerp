package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
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
@Table(name = "customer_address")
public class CustomerAddress {
    @Id
    private UUID customerAddressId;
    private String userLoginId;
    private String addressName;
    private BigDecimal longitude;
    private BigDecimal latitude;
}
