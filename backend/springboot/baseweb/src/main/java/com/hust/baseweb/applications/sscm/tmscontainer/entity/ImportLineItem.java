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
@Table(name = "import_line_item")
@EntityListeners(AuditingEntityListener.class)
public class ImportLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name= "variant_id")
    private Integer variantId;

    @Column(name= "name")
    private String name;

    @Column(name= "quantity")
    private BigDecimal quantity;

    @Column(name= "import_price")
    private BigDecimal importPrice;

    @Column(name= "whole_price")
    private BigDecimal wholePrice;

    @Column(name= "retail_price")
    private BigDecimal retailPrice;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "import_id", referencedColumnName = "id", nullable = false )
    private ImportOrder importOrder;

    @Column(name= "current_quantity")
    private BigDecimal currentQuantity;

    @Column(name= "status")
    private String status;

    @Column(name= "total")
    private BigDecimal total;

    @Column(name= "on_hand")
    private BigDecimal onHand;

    @Column(name= "available")
    private BigDecimal available;

    @Column(name= "image")
    private String image;

    @Column(name= "sku")
    private String sku;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;


}
