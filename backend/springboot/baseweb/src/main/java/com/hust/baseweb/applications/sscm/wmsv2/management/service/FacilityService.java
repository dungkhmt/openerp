package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.FacilityV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.NewFacilityRequest;

public interface FacilityService {

    FacilityV2 createFacility(NewFacilityRequest request);

}
