package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {

    private int id;

    private String code;

    private String name;

    private String type;

    private String description;

    private String image;

    private Boolean isActive;

    private String opt1;

    private String opt2;

    private String opt3;

    private List<Variant> variants;

    private Date updateAt;

    private Date createAt;

    private BigDecimal onHand;

    private BigDecimal available;

    public void setQuantity(){
//        BigDecimal onHand = BigDecimal.ZERO;
        this.onHand =  BigDecimal.ZERO;
        this.available =  BigDecimal.ZERO;
        for( Variant variant : this.variants){
            if(variant.getOnHand() != null){
//            this.onHand.add(variant.getOnHand());
            this.onHand = this.onHand.add(variant.getOnHand());
            }
            if(variant.getAvailable() != null){
                this.available =  this.available.add(variant.getAvailable());
            }
        }
    }

}
