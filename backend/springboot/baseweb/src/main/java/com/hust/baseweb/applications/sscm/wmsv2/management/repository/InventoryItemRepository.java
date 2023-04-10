package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {

    Optional<InventoryItem> getInventoryItemByProductIdAndBayIdAndWarehouseIdAndLotId(UUID productId, UUID bayId, UUID warehouseId, String lotId);

    List<InventoryItem> findAllByWarehouseId(UUID warehouseId);

}
