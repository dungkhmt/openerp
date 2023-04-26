package com.hust.baseweb.applications.sscm.wmsv2.management.auto;

import com.graphhopper.ResponsePath;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Warehouse;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface DistanceCalculator {

    Map<UUID, Double> getWarehouseCusAddMap(double cusAddLon, double cusAddLat, List<Warehouse> warehouses); // get warehouse - customer address distance map

    ResponsePath calculate(BigDecimal fromLat, BigDecimal fromLon, BigDecimal toLat, BigDecimal toLon);
}
