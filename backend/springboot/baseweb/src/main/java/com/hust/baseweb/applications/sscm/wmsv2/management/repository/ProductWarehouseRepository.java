package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductWarehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductWarehouseRepository extends JpaRepository<ProductWarehouse, UUID> {

    Optional<ProductWarehouse> findProductWarehouseByWarehouseId(UUID warehouseId);

    Optional<ProductWarehouse> findProductWarehouseByWarehouseIdAndProductId(UUID warehouseId, UUID productId);

}
