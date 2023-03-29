package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.*;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.ReceiptRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ReceiptGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.*;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ReceiptService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class ReceiptServiceImpl implements ReceiptService {

    private ReceiptRepository receiptRepository;
    private ReceiptItemRepository receiptItemRepository;
    private InventoryItemRepository inventoryItemRepository;
    private ProductWarehouseRepository productWarehouseRepository;
    private WarehouseRepository warehouseRepository;

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
                                 .warehouseId(UUID.fromString(request.getWarehouseId()))
                                 .receiptDate(request.getReceivedDate())
                                 .receiptName(request.getReceiptName())
                                 .build();
        receiptRepository.save(receipt);

        List<ReceiptItem> receiptItemList = receiptList.stream()
                                                       .map(r -> ReceiptItem.builder()
                                                                            .receiptItemId(UUID.randomUUID())
                                                                            .receiptId(receipt.getReceiptId())
                                                                            .productId(UUID.fromString(r.getProductId()))
                                                                            .quantity(r.getQuantity())
                                                                            .bayId(UUID.fromString(r.getBayId()))
                                                                            .lotId(r.getLotId())
                                                                            .importPrice(r.getImportPrice())
                                                                            .exportPrice(r.getExportPrice())
                                                                            .expiredDate(r.getExpiredDate())
                                                                            .build())
                                                       .collect(Collectors.toList());
        receiptItemRepository.saveAll(receiptItemList);

        for (ReceiptRequest.ReceiptItemRequest item : receiptList) {
            UUID productId = UUID.fromString(item.getProductId());
            UUID bayId = UUID.fromString(item.getBayId());
            UUID warehouseId = UUID.fromString(request.getWarehouseId());
            updateInventoryItem(request, item, productId, bayId, warehouseId);
            updateProductWarehouse(item, productId, warehouseId);
        }
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
                .exportPrice(item.getExportPrice())
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
                                                   .exportPrice(item.getExportPrice())
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
