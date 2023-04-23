package com.hust.baseweb.applications.sscm.truckdronedelivery.algorithms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Drone {
    private String ID;
    private int capacity;
    private int durationCapacity; // max duration time

}
