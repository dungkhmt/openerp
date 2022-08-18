package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportLineItem;
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
public class ShelfVariantResponse {
    private int id;

    private Integer shelfId;

    private List<ImportLineItem> importLineItems;

    private Variant variant;

    private Integer productId;

    private Integer variantId;

    private Integer lineItemId;

    private BigDecimal quantity;

    private Date updateAt;

    private Date createAt;

}
