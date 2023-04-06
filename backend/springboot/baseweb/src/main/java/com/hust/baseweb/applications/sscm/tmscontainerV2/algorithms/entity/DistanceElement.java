package com.hust.baseweb.applications.sscm.tmscontainerV2.algorithms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DistanceElement {
    private String fromLocationId;
    private String toLocationId;
    private int distance; // in meters
    private int travelTime;// in seconds
}
