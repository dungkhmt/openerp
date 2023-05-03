package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryTripRepository extends JpaRepository<DeliveryTrip, String> {

//    List<DeliveryTrip> findAllByDeletedIsFalse();

    List<DeliveryTrip> findAllByShipmentIdAndIsDeletedIsFalse(String shipmentId);

    @Query(value = "select dt.delivery_trip_id  , dt.vehicle_id  , dt.delivery_person_id  , " +
        "dt.distance  , dt.total_weight  , dt.total_locations , dt.last_updated_stamp  , " +
        "dt.created_stamp  , dt.created_by  , dt.is_deleted  , dt.warehouse_id  , dt.shipment_id , dt.status  " +
        "from delivery_trip dt  " +
        "join shipment s on dt.shipment_id = s.shipment_id " +
        "where (extract (EPOCH from (now() - s.expected_delivery_stamp) ) < 61200 or extract (EPOCH from (s.expected_delivery_stamp - now()) ) > 25200) " +
        "and dt.delivery_person_id = ?1 " +
        "and dt.status in ?2 ", nativeQuery = true)
    List<DeliveryTrip> findTodayDeliveryTripsByPerson(String deliveryPersonId, List<String> deliveryStatus);
}
