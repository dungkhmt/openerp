package com.hust.baseweb.applications.sscm.wmsv2.management.auto.impl;

import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import com.graphhopper.config.Profile;
import com.hust.baseweb.applications.sscm.wmsv2.management.auto.DistanceCalculator;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.WarehouseService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.math3.util.Precision;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Component
public class GraphHopperCalculator implements DistanceCalculator {

    private final GraphHopper graphHopper;

    public GraphHopperCalculator() {
        this.graphHopper = new GraphHopper();
        graphHopper.setProfiles(new Profile("car").setVehicle("car").setWeighting("fastest").setTurnCosts(false));
        graphHopper.setOSMFile("src/main/resources/osm/vietnam-latest.osm.pbf");
        graphHopper.setGraphHopperLocation("target/routing-graph-vietnam-latest-cache");
        graphHopper.importOrLoad();
    }

    @Override
    public Map<UUID, Double> getWarehouseCusAddMap(double cusAddLon, double cusAddLat, List<Warehouse> warehouses) {
        Map<UUID, Double> map = new HashMap<>();
        for (Warehouse warehouse : warehouses) {
            GHRequest request = new GHRequest(roundBigDecimal(warehouse.getLatitude()), roundBigDecimal(warehouse.getLongitude()),
                                              roundDouble(cusAddLat), roundDouble(cusAddLon)).setProfile("car")
                                                                                             .setLocale(Locale.US);
            GHResponse response = graphHopper.route(request);
            ResponsePath path = response.getBest(); // try catch here
            if (path == null) {
                log.warn(String.format("Not path found for warehouse %s to CustomerAddress(lon:%f, lat:%f)",
                                       warehouse.getWarehouseId(), cusAddLon, cusAddLat));
                continue;
            }
            double distance = path.getDistance();
            map.put(warehouse.getWarehouseId(), distance);
        }
        return map;
    }

    @Override
    public double calculate(double fromLon, double fromLat, double toLon, double toLat) {
        return 0;
    }

    private double roundBigDecimal(BigDecimal b) {
        return Precision.round(b.doubleValue(), 6);
    }

    private double roundDouble(double b) {
        return Precision.round(b, 6);
    }

}
