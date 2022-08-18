package com.hust.baseweb.applications.sscm.tmscontainer.entity;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "export_order")
@EntityListeners(AuditingEntityListener.class)
public class ExportOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "exportOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExportLineItem> lineItems;

    @Column(name= "code")
    private String code;

    @Column(name= "total")
    private BigDecimal total;

    @Column(name= "facility_id")
    private Integer facilityId;

    @Column(name= "status")
    private String status;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

}
