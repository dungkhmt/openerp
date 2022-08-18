package com.hust.baseweb.applications.sscm.tmscontainer.model;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VariantQuantity {

    private Integer variantId;
    private Variant variant;
    private long quantity;

}
