package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailQuantityResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductV2Repository extends JpaRepository<ProductV2, UUID> {

    @Query("select new com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailQuantityResponse " +
           "(w.warehouseId, w.name, b.bayId, b.code, ii.quantityOnHandTotal, ii.importPrice, ii.exportPrice, ii.lotId) " +
           "from InventoryItem ii " +
           "join Bay b on b.bayId = ii.bayId " +
           "join Warehouse w on w.warehouseId = b.warehouseId " +
           "where ii.productId = :productId")
    List<ProductDetailQuantityResponse> getProductDetailQuantityResponseByProductId(UUID productId);

}
