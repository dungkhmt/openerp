package com.hust.baseweb.applications.sscm.tmscontainer.model;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanResponseItem {

    private Integer shelfId;
    private Shelf shelf;
    private List<VariantQuantity> variantQuantityList;

}
