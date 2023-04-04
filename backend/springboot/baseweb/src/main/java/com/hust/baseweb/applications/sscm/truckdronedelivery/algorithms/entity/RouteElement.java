package com.hust.baseweb.applications.sscm.truckdronedelivery.algorithms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RouteElement {
    private String locationID;
    private String action; //
}
