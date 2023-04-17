package com.hust.baseweb.applications.sscm.wmsv2.management.model.response;

import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WarehouseDetailsResponse {
    private WarehouseWithBays info;
    private List<ProductWarehouseResponse.ProductWarehouseDetailResponse> items;
}
