package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model.solution;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderPickupRouteElementItemPickup {
    private String orderItemID;
    private int qty; // quantity of items to be picked up
}
