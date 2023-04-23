package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ReceiptItemRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReceiptItemRequestRepository extends JpaRepository<ReceiptItemRequest, UUID> {

    List<ReceiptItemRequest> findAllByReceiptId(UUID receiptId);

}
