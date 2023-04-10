package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Receipt;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.ReceiptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, UUID> {

    List<Receipt> findAllByCreatedBy(String createdBy);

    List<Receipt> findAllByCreatedByAndStatus(String createdBy, ReceiptStatus status);

}
