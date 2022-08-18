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
@Table(name = "import_order")
@EntityListeners(AuditingEntityListener.class)
public class ImportOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "importOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImportLineItem> lineItems;

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

//    public Product(ProductRequest productRequest){
//        this.code = productRequest.getCode();
//        this.name = productRequest.getName();
//        this.isActive = productRequest.getIsActive();
//        this.type = productRequest.getType();
//        this.description = productRequest.getDescription();
//        this.image = productRequest.getImage();
//        this.opt1 = productRequest.getOpt1();
//        this.opt2 = productRequest.getOpt2();
//        this.opt3 = productRequest.getOpt3();
//        this.variants = productRequest.getVariants();
//    }
}
