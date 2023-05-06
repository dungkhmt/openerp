package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.AutoRouteResponse;

import java.security.Principal;

public interface AutoRouteService {

    void route(Principal principal, DeliveryTripDTO request);

    AutoRouteResponse getPath(String deliveryTripId);
}
