package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTripItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryTripItemRepository extends JpaRepository<DeliveryTripItem, String> {

}
