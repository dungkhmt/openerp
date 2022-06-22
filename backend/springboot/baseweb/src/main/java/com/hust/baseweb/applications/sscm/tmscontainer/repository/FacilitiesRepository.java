package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.education.entity.EduDepartment;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facilities;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.FacilityResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilitiesRepository extends JpaRepository<Facilities, Integer> {
    Facilities save(Facilities facilities);
}
