package com.hust.baseweb.applications.sscm.wmsv2.management.auto;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Warehouse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface DistanceCalculator {

    Map<UUID, Double> getWarehouseCusAddMap(double cusAddLon, double cusAddLat, List<Warehouse> warehouses); // get warehouse - customer address distance map

    double calculate(double fromLon, double fromLat, double toLon, double toLat);
}
