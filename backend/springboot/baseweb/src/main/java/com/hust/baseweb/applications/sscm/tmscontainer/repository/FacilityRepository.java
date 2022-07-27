package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Integer> {
    Facility save(Facility facility);

//    void store(Facilities facilities, Integer id) throws Exception;
}
