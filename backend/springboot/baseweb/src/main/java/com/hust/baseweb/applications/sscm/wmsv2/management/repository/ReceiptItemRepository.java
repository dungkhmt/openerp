package com.hust.baseweb.applications.sscm.wmsv2.management.repository;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ReceiptItem;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProcessedItemModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, UUID> {

    List<ReceiptItem> findAllByReceiptId(UUID id);

    @Query("select new com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProcessedItemModel " +
           "(ri.receiptItemId, prod.productId, prod.name, ri.quantity, b.bayId, b.code, w.warehouseId, w.name, ri.lotId, " +
           "ri.importPrice, ri.expiredDate, ri.receiptItemRequestId) " +
           "from ReceiptItem ri " +
           "join ProductV2 prod on prod.productId = ri.productId " +
           "join Bay b on ri.bayId = b.bayId " +
           "join Warehouse w on w.warehouseId = b.warehouseId " +
           "where ri.receiptId = :receiptId")
    List<ProcessedItemModel> getProcessedItemsByReceiptId(UUID receiptId);

    Optional<ReceiptItem> findReceiptItemByReceiptItemRequestId(UUID requestId);
}
