package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
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
@Table(name = "assigned_order_item")
@EntityListeners(AuditingEntityListener.class)
public class AssignedOrderItem {
    @Id
    private UUID assignedOrderItemId;
    private UUID orderId;
    private UUID productId;
    private BigDecimal quantity;
    private UUID bayId;
    private UUID warehouseId;
    private String lotId;
    @CreatedBy
    private String assignedBy;
    @LastModifiedDate
    private Date lastUpdatedStamp;
    @CreatedDate
    private Date createdStamp;
}
