package com.hust.baseweb.applications.sscm.tmscontainer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
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
@Table(name = "variants")
@EntityListeners(AuditingEntityListener.class)
public class Variant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false )
    private Product product;

    @Column(name= "name")
    private String name;

    @Column(name= "sku")
    private String sku;

    @Column(name= "is_active")
    private Boolean isActive;

    @Column(name= "image")
    private String image;

    @Column(name= "weight_unit")
    private String weightUnit;

    @Column(name= "weight_value")
    private Integer weightValue;

    @Column(name= "import_price")
    private BigDecimal importPrice;// giá nhập

    @Column(name= "whole_price")
    private BigDecimal wholePrice; // giá bán buôn

    @Column(name= "retail_price")
    private BigDecimal retailPrice; // giá bán lẻ

    @Column(name= "on_hand")
    private BigDecimal onHand; // tồn kho: tổng số lượng sản phẩm có trong kho

    @Column(name= "available")
    private BigDecimal available; // có thể bán: số lượng sp có thể bán

    @Column(name= "opt1")
    private String opt1;

    @Column(name= "opt2")
    private String opt2;

    @Column(name= "opt3")
    private String opt3;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void update(Variant variant){
        this.name = variant.getName();
        this.sku = variant.getSku();
        this.isActive = variant.getIsActive();
        this.image = variant.getImage();
        this.weightUnit = variant.getWeightUnit();
        this.weightValue = variant.getWeightValue();
        this.importPrice = variant.getImportPrice();
        this.wholePrice = variant.getWholePrice();
        this.retailPrice = variant.getRetailPrice();
        this.onHand = variant.getOnHand();
        this.available = variant.getAvailable();
        this.opt1 = variant.getOpt1();
        this.opt2 = variant.getOpt2();
        this.opt3 = variant.getOpt3();
    }
    public Boolean checkStatus(Variant variant){
        if(variant.getIsActive() == null){
            return false;
        }else return variant.getIsActive();
    }
//    public Variant mapLineItem(LineItem lineItem){
//        this.id = lineItem.getVariantId();
//        this.name = lineItem.getName();
//        this.sku = lineItem.getSku();
//        this.isActive = lineItem.getIsActive();
//        this.image = lineItem.getImage();
//        this.weightUnit = lineItem.getWeightUnit();
//        this.weightValue = lineItem.getWeightValue();
//        this.importPrice = lineItem.getImportPrice();
//        this.wholePrice = lineItem.getWholePrice();
//        this.retailPrice = lineItem.getRetailPrice();
//        this.onHand = lineItem.getOnHand();
//        this.available = lineItem.getAvailable();
//        this.opt1 = lineItem.getOpt1();
//        this.opt2 = lineItem.getOpt2();
//        this.opt3 = lineItem.getOpt3();
//    }
}
