package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.SaleOrderHeader;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SaleOrderHeaderRepository extends JpaRepository<SaleOrderHeader, UUID> {

    List<SaleOrderHeader> findAllByStatusIn(List<OrderStatus> orderStatuses);

    List<SaleOrderHeader> findAllByUserLoginIdAndStatus(String userLoginId, OrderStatus orderStatus);

}
