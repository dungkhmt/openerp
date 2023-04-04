package com.hust.baseweb.applications.sscm.truckdronedelivery.algorithms.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TruckDroneDeliveryInput {
    private List<Request> request;
    private Truck truck;
    private Drone drone;
    private Depot depot;
    private List<DistanceElement> distances;

}
