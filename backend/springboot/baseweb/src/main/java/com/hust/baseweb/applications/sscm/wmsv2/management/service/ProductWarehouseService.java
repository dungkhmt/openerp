package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import java.math.BigDecimal;
import java.util.UUID;

public interface ProductWarehouseService {

    BigDecimal getProductQuantityByWarehouseIdAndProductId(UUID warehouseId, UUID productId);

}
