package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryTripRepository extends JpaRepository<DeliveryTrip, String> {

//    List<DeliveryTrip> findAllByDeletedIsFalse();

    List<DeliveryTrip> findAllByShipmentIdAndIsDeletedIsFalse(String shipmentId);
}
