package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.*;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.enumentity.ReceiptStatus;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ReceiptRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptRequestResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.*;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ReceiptService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ReceiptServiceImpl implements ReceiptService {

    private ReceiptRepository receiptRepository;
    private ReceiptItemRepository receiptItemRepository;
    private ReceiptItemRequestRepository receiptItemRequestRepository;
    private InventoryItemRepository inventoryItemRepository;
    private ProductWarehouseRepository productWarehouseRepository;
    private WarehouseRepository warehouseRepository;
    private ProductV2Repository productRepository;

    @Override
    @Transactional
    public Receipt createReceipt(ReceiptRequest request) {
        log.info(String.format("Start create receipt with request %s", request));
        List<ReceiptRequest.ReceiptItemRequest> receiptList = request.getReceiptItemList();
        if (receiptList.isEmpty()) {
            log.warn("Receipt item list is empty... Nothing to import");
            return null;
        }

        Receipt receipt = Receipt.builder()
                                 .receiptId(UUID.randomUUID())
                                 .warehouseId(request.getWarehouseId() == null ? null : UUID.fromString(request.getWarehouseId()))
                                 .receiptDate(request.getReceivedDate())
                                 .receiptName(request.getReceiptName())
                                 .status(ReceiptStatus.CREATED)
                                 .createdReason(request.getCreatedReason())
                                 .expectedReceiptDate(request.getExpectedReceiveDate())
                                 // created by set
                                 .build();
        receiptRepository.save(receipt);

        List<ReceiptItemRequest> receiptItemList = receiptList.stream()
            .map(r -> ReceiptItemRequest.builder()
                .receiptItemRequestId(UUID.randomUUID())
                .receiptId(receipt.getReceiptId())
                .productId(UUID.fromString(r.getProductId()))
                .quantity(r.getQuantity())
                .warehouseId(request.getWarehouseId() == null ? null : UUID.fromString(request.getWarehouseId()))
                .build())
            .collect(Collectors.toList());
        receiptItemRequestRepository.saveAll(receiptItemList);

        return receipt;
    }

    @Override
    public List<ReceiptGeneralResponse> getAllReceiptGeneral() {
        List<Receipt> receipts = receiptRepository.findAll();
        String pattern = "dd-MM-yyyy HH:mm:ss";
        SimpleDateFormat format = new SimpleDateFormat(pattern);
        Map<String, String> warehouseIdNameMap = new HashMap<>();
        for (Receipt receipt : receipts) {
            UUID warehouseId = receipt.getWarehouseId();
            Optional<Warehouse> warehouseOpt = warehouseRepository.findById(warehouseId);
            if (warehouseOpt.isPresent()) {
                warehouseIdNameMap.put(receipt.getWarehouseId().toString(), warehouseOpt.get().getName());
            } else {
                log.warn(String.format("Not found warehouse with id %s", warehouseId));
            }
        }
        List<ReceiptGeneralResponse> response = receipts.stream()
                                                        .map(r -> ReceiptGeneralResponse.builder()
                                                            .receiptName(r.getReceiptName())
                                                            .createdDate(format.format(r.getCreatedStamp()))
                                                            .warehouseName(warehouseIdNameMap.get(r.getWarehouseId().toString()))
                                                            .receiptId(r.getReceiptId().toString())
                                                            .receivedDate(format.format(r.getReceiptDate()))
                                                            .build())
                                                        .collect(Collectors.toList());
        return response;
    }

    @Override
    public ReceiptRequest getById(String id) {
        Optional<Receipt> receiptOpt = receiptRepository.findById(UUID.fromString(id));
        if (!receiptOpt.isPresent()) {
            log.warn(String.format("Receipt id %s is not found....", id));
            return null;
        }

        Receipt receipt = receiptOpt.get();
        List<ReceiptItem> receiptItems = receiptItemRepository.findAllByReceiptId(receipt.getReceiptId());
        List<ReceiptRequest.ReceiptItemRequest> receiptItemRequestList = receiptItems.stream()
            .map(item -> ReceiptRequest.ReceiptItemRequest
                .builder()
                .productId(item.getProductId().toString())
                .lotId(item.getLotId())
                .bayId(item.getBayId().toString())
                .quantity(item.getQuantity())
                .importPrice(item.getImportPrice())
                .expiredDate(item.getExpiredDate())
                .build())
            .collect(Collectors.toList());
        return ReceiptRequest
            .builder()
            .receiptName(receipt.getReceiptName())
            .receivedDate(receipt.getReceiptDate())
            .warehouseId(receipt.getWarehouseId().toString())
            .description(receipt.getDescription())
            .receiptItemList(receiptItemRequestList)
            .build();
    }

    @Override
    public List<ReceiptRequestResponse> getForSaleManagement(Principal principal, String statusCode) {
        ReceiptStatus status = ReceiptStatus.findByCode(statusCode);
        List<Receipt> receipts;
        if (status != null) {
            receipts = receiptRepository.findAllByCreatedByAndStatus(principal.getName(), status);
        } else {
            receipts = receiptRepository.findAllByCreatedBy(principal.getName());
        }
        return receipts.stream().map(receipt -> ReceiptRequestResponse.builder()
            .receiptRequestId(receipt.getReceiptId())
            .approvedBy(receipt.getApprovedBy())
            .createdDate(receipt.getCreatedStamp())
            .createdBy(receipt.getCreatedBy())
            .status(receipt.getStatus().getName())
            .build())
            .collect(Collectors.toList());
    }

    @Override
    public ReceiptRequestResponse getForSaleManagementById(String id) {
        Optional<Receipt> receiptOpt = receiptRepository.findById(UUID.fromString(id));
        if (!receiptOpt.isPresent()) {
            log.warn(String.format("Receipt id %s not present", id));
            return null;
        }
        Receipt receipt = receiptOpt.get();
        List<ReceiptItemRequest> items = receiptItemRequestRepository.findAllByReceiptId(receipt.getReceiptId());
        List<ReceiptRequestResponse.ReceiptRequestItemResponse> itemResponse = new ArrayList<>();
        for (ReceiptItemRequest item : items) {
            ReceiptRequestResponse.ReceiptRequestItemResponse temp = ReceiptRequestResponse.ReceiptRequestItemResponse
                .builder()
                .receiptRequestItemId(item.getReceiptItemRequestId())
                .quantity(item.getQuantity())
                .productId(item.getProductId())
                .productName(productRepository
                                 .findById(item.getProductId())
                                 .get()
                                 .getName())
                .warehouseId(item.getWarehouseId())
                .build();
            if (item.getWarehouseId() != null) {
                temp.setWarehouseName(warehouseRepository
                                          .findById(item.getWarehouseId())
                                          .get()
                                          .getName());
            }
            itemResponse.add(temp);
        }
        return ReceiptRequestResponse.builder()
                .receiptRequestId(receipt.getReceiptId())
                .createdDate(receipt.getCreatedStamp())
                .approvedBy(receipt.getApprovedBy())
                .status(receipt.getStatus().getName())
                .createdBy(receipt.getCreatedBy())
                .createdReason(receipt.getCreatedReason())
                .expectedReceiveDate(receipt.getExpectedReceiptDate())
                .items(itemResponse).build();
    }

    @Override
    public boolean approve(Principal principal, String id) {
        Optional<Receipt> receiptOpt = receiptRepository.findById(UUID.fromString(id));
        if (!receiptOpt.isPresent()) {
            log.warn(String.format("Receipt %s is not present", id));
            return false;
        }
        Receipt receipt = receiptOpt.get();
        if (receipt.getStatus() != ReceiptStatus.CREATED) {
            log.warn("Receipt status is not CREATED");
            return false;
        }
        receipt.setApprovedBy(principal.getName());
        receipt.setStatus(ReceiptStatus.APPROVED);
        receiptRepository.save(receipt);
        return true;
    }

    @Override
    public boolean cancel(Principal principal, String id) {
        Optional<Receipt> receiptOpt = receiptRepository.findById(UUID.fromString(id));
        if (!receiptOpt.isPresent()) {
            log.warn(String.format("Receipt %s is not present", id));
            return false;
        }
        Receipt receipt = receiptOpt.get();
        receipt.setCancelledBy(principal.getName());
        receipt.setStatus(ReceiptStatus.CANCELLED);
        receiptRepository.save(receipt);
        return true;
    }

    private void updateInventoryItem(
        ReceiptRequest request,
        ReceiptRequest.ReceiptItemRequest item,
        UUID productId,
        UUID bayId,
        UUID warehouseId
    ) {
        InventoryItem inventoryItem = InventoryItem.builder()
                                                   .inventoryItemId(UUID.randomUUID())
                                                   .productId(productId)
                                                   .lotId(item.getLotId())
                                                   .warehouseId(warehouseId)
                                                   .bayId(bayId)
                                                   .quantityOnHandTotal(item.getQuantity())
                                                   .importPrice(item.getImportPrice())
                                                   .currencyUomId("VND")
                                                   .datetimeReceived(request.getReceivedDate())
                                                   .expireDate(item.getExpiredDate())
                                                   .description(request.getDescription())
                                                   .build();
        inventoryItemRepository.save(inventoryItem);
        log.info(String.format("Saved / updated an inventory item with id %s", inventoryItem.getInventoryItemId()));
    }

    private void updateProductWarehouse(ReceiptRequest.ReceiptItemRequest item, UUID productId, UUID warehouseId) {
        Optional<ProductWarehouse> productWarehouseOpt = productWarehouseRepository
            .findProductWarehouseByWarehouseIdAndProductId(warehouseId, productId);
        ProductWarehouse productWarehouse;
        if (productWarehouseOpt.isPresent()) {
            productWarehouse = productWarehouseOpt.get();
            BigDecimal newQuantity = productWarehouse.getQuantityOnHand().add(item.getQuantity());
            productWarehouse.setQuantityOnHand(newQuantity);
        } else {
            productWarehouse = ProductWarehouse.builder()
                                               .productWarehouseId(UUID.randomUUID())
                                               .warehouseId(warehouseId)
                                               .productId(productId)
                                               .quantityOnHand(item.getQuantity())
                                               .build();
        }
        productWarehouseRepository.save(productWarehouse);
        log.info(String.format("Saved / updated product warehouse with id %s", productWarehouse.getProductWarehouseId()));
    }
}
