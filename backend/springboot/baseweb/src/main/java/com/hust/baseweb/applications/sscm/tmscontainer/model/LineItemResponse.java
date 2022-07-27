package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LineItemResponse {
    private int id;

    private Integer variantId;

    private Integer productId;

    private String name;

    private BigDecimal quantity;

    private BigDecimal importPrice;

    private BigDecimal wholePrice;

    private BigDecimal retailPrice;

    private ImportOrder importOrder;

    private BigDecimal currentQuantity;

    private String status;

    private BigDecimal total;

    private BigDecimal onHand;

    private BigDecimal available;

    private String image;

    private String sku;

    private Date updateAt;

    private Date createAt;

}
