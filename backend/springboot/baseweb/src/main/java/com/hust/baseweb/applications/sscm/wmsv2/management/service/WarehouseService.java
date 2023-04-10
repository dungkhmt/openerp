package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductWarehouseResponse;

import java.util.List;

public interface WarehouseService {

    Warehouse createWarehouse(WarehouseWithBays request);

    List<Warehouse> getAllWarehouseGeneral();

    boolean delete(List<String> facilityIds);

    WarehouseWithBays getById(String id);

    List<WarehouseWithBays> getAllWarehouseDetail();

    ProductWarehouseResponse getProductInWarehouse(String warehouseId);
}
