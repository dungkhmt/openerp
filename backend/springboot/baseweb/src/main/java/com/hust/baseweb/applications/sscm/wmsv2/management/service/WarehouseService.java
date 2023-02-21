package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.WMSV2Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;

import java.util.List;

public interface WarehouseService {

    WMSV2Warehouse createWarehouse(WarehouseWithBays request);

    List<WMSV2Warehouse> getAll();

    boolean delete(List<String> facilityIds);

    WarehouseWithBays getById(String id);

}
