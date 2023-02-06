package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.FacilityV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.NewFacilityRequest;

import java.util.List;

public interface FacilityService {

    FacilityV2 createFacility(NewFacilityRequest request);

    List<FacilityV2> getAll();

    boolean delete(List<String> facilityIds);

}
