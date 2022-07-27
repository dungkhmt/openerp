package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ShelfRepository extends JpaRepository<Shelf, Integer> {
//    List<Shelves> saveAll(List<Shelves> shelves);

    @Query(value = "SELECT * FROM shelves WHERE facility_id = ?1",nativeQuery = true)
    List<Shelf>  findShelvesByFacilityID(Integer id);

    @Query(value = "SELECT shelf_id FROM shelves WHERE facility_id = ?1",nativeQuery = true)
    List<Integer> findAllByFacilityId(Integer id);
}
