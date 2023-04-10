package com.hust.baseweb.applications.sscm.wmsv2.management.model.response;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailResponse {
    private ProductV2 productInfo;
    private List<ProductDetailQuantityResponse> quantityList;
}
