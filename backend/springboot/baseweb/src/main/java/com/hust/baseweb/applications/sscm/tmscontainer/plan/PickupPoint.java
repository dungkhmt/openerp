package com.hust.baseweb.applications.sscm.tmscontainer.plan;

import java.util.Map;

public class PickupPoint {

    public int pointId;
    public Map<Integer,Long> quantityProduct;
    public PickupPoint(int pointId,Map<Integer,Long> quantityProduct){
        this.pointId  = pointId;
        this.quantityProduct = quantityProduct;
    }
}
