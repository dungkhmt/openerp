package com.hust.baseweb.applications.sscm.tmscontainer.model;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanRequest {
    public List<Shelf> listShelf;
    public List<ExportLineItem> lineItems;
    public List<ShelfVariant> variants;

    @Override
    public String toString() {
        return "{" +
               "listShelf:[" + listShelf +
               "[, lineItems:" + lineItems +
               ", variants:" + variants +
               '}';
    }
}
