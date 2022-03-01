package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderPickupRouteElement {
    private String shelfID;
   private List<OrderPickupRouteElementItemPickup> itemPickups;
   private String description;
   public void setDescription(){
       description = "";
       for(OrderPickupRouteElementItemPickup e: itemPickups){
           description = description + "[" + e.getOrderItemID() + "," + e.getQty() + "] ";
       }
   }
}
