package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrderPickupPlanningIM {
    private List<Order> orders;
    private List<Shelf> shelfs;
    private List<DistanceElement> distances;
    private String doorIn;
    private String doorOut;
    private ConfigParam param;
}
