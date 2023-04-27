package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.DeliveryTripItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryTripItemRepository extends JpaRepository<DeliveryTripItem, String> {

    List<DeliveryTripItem> findAllByDeliveryTripIdAndIsDeletedIsFalse(String deliveryTripId);

    List<DeliveryTripItem> findAllByDeliveryTripIdAndIsDeleted(String deliveryTripId, boolean isDeleted);

    Optional<DeliveryTripItem> findByDeliveryTripItemIdAndIsDeletedIsFalse(String id);

    @Modifying(clearAutomatically = true)
    @Query("update DeliveryTripItem item set item.sequence = ?1 where item.deliveryTripItemId = ?2")
    @Transactional
    void updateSequenceByDeliveryItemId(int sequence, String itemId);
}
