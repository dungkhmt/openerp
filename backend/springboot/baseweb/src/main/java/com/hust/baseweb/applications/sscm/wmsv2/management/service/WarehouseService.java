package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductWarehouseResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.WarehouseDetailsResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface WarehouseService {

    Warehouse createWarehouse(WarehouseWithBays request);

    List<Warehouse> getAllWarehouseGeneral();

    boolean delete(List<String> facilityIds);

    WarehouseWithBays getById(String id);

    List<WarehouseWithBays> getAllWarehouseDetail();

    ProductWarehouseResponse getProductInWarehouse(String warehouseId);

    Map<UUID, String> getWarehouseNameMap();

    List<WarehouseDetailsResponse> getAllWarehouseDetailWithProducts();
}
