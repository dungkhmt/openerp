package com.hust.baseweb.applications.sscm.tmscontainer.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "export_line_item")
@EntityListeners(AuditingEntityListener.class)
public class ExportLineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name= "variant_id")
    private Integer variantId;

    @Column(name= "quantity")
    private BigDecimal quantity;

    @Column(name= "total_quantity")
    private BigDecimal totalQuantity;

    @Column(name= "price")
    private BigDecimal retailPrice;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "export_id", referencedColumnName = "id", nullable = false )
    private  ExportOrder exportOrder;

    @Column(name= "total")
    private BigDecimal total;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;
}
