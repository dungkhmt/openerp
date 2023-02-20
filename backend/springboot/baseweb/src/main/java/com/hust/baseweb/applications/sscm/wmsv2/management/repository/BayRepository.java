package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Bay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BayRepository extends JpaRepository<Bay, UUID> {

    void deleteBaysByWarehouseId(UUID warehouseId);

    List<Bay> findAllByWarehouseId(UUID warehouseId);


}
