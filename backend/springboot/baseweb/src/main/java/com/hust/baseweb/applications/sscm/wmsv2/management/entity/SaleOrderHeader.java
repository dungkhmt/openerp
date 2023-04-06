package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.OrderType;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.PaymentType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "sale_order_header")
@EntityListeners(AuditingEntityListener.class)
public class SaleOrderHeader {
    @Id
    private UUID orderId;
    private String userLoginId;
    private Date orderDate;
    private BigDecimal deliveryFee;
    private BigDecimal totalProductCost;
    private BigDecimal totalOrderCost;
    private UUID customerAddressId;
    private String customerName;
    private String customerPhoneNumber;
    private String description;

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;
    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @CreatedDate
    private Date lastUpdatedStamp;
    @LastModifiedDate
    private Date createdStamp;
}
