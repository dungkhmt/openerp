package com.hust.baseweb.applications.sscm.wms.orderpickupplanning.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class DistanceElement {
    private String fromlocationID;
    private String toLocaltionID;
    private double distance;
}
