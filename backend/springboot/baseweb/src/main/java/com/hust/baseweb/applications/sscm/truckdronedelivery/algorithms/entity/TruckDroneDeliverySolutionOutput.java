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
public class TruckDroneDeliverySolutionOutput {
    private TruckRoute truckRoute;
    private List<DroneRoute> droneRoutes;

}
