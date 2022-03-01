package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrderItem {
    private String itemID;
    private int qty;
    private double weight;
}
