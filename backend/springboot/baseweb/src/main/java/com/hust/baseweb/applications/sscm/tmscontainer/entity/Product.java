package com.hust.baseweb.applications.sscm.tmscontainer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductRequest;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name= "code")
    private String code;

    @Column(name= "type")
    private String type;

    @Column(name= "name")
    private String name;

    @Column(name= "description")
    private String description;

    @Column(name= "image")
    private String image;

    @Column(name= "is_active")
    private Boolean isActive;

    @Column(name= "opt1")
    private String opt1;

    @Column(name= "opt2")
    private String opt2;

    @Column(name= "opt3")
    private String opt3;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Variant> variants;

    @LastModifiedDate
    private Date updateAt;

    @CreatedDate
    private Date createAt;

    public Product(ProductRequest productRequest){
        this.code = productRequest.getCode();
        this.name = productRequest.getName();
        this.isActive = productRequest.getIsActive();
        this.type = productRequest.getType();
        this.description = productRequest.getDescription();
        this.image = productRequest.getImage();
        this.opt1 = productRequest.getOpt1();
        this.opt2 = productRequest.getOpt2();
        this.opt3 = productRequest.getOpt3();
        this.variants = productRequest.getVariants();
    }
}
