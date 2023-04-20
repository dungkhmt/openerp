package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTrip;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.DeliveryTripDTO;

import java.security.Principal;
import java.util.List;

public interface DeliveryTripService {

    DeliveryTripDTO create(Principal principal, DeliveryTripDTO request);

    List<DeliveryTripDTO> getAll();

    DeliveryTripDTO getById(String tripId);

}
