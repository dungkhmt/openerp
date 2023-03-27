package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductBay;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailQuantityResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductBayRepository extends JpaRepository<ProductBay, UUID> {

    @Query("select new com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailQuantityResponse " +
           "(w.warehouseId, w.name, b.bayId, b.code, pb.quantity) " +
           "from ProductBay pb " +
           "join Bay b on b.bayId = pb.bayId " +
           "join Warehouse w on w.warehouseId = b.warehouseId " +
           "where pb.productId = :productId")
    List<ProductDetailQuantityResponse> getProductDetailQuantityResponseByProductId(UUID productId);
}
