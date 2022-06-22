package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelves;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShelvesRepository extends JpaRepository<Shelves, Integer> {
//    List<Shelves> saveAll(List<Shelves> shelves);

    @Query(value = "SELECT * FROM shelves WHERE facility_id = ?1",nativeQuery = true)
    List<Shelves>  findUserByFacilityID(Integer id);
}
