package com.hust.baseweb.applications.sscm.tmscontainer.entity;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "lots_date")
@EntityListeners(AuditingEntityListener.class)
public class LotsDate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name= "code")
    private String code;

    @Column(name= "variant_id")
    private Integer variantId;

    @Column(name= "quantity")
    private BigDecimal quantity;

    @Column(name= "manufacture_at")
    private Date manufactureAt; // ngày sản xuất

    @Column(name= "expiration_at")
    private Date expirationAt; //  ngày hết hạn

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

}
