package com.hust.baseweb.applications.sscm.wmsv2.management.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Table(name = "receipt")
@EntityListeners(AuditingEntityListener.class)
public class Receipt {

    @Id
    private UUID receiptId;
    private Date receiptDate;
    private String receiptName;
    private UUID warehouseId;
    private String description;
    @LastModifiedDate
    private Date lastUpdatedStamp;
    @CreatedDate
    private Date createdStamp;

}
