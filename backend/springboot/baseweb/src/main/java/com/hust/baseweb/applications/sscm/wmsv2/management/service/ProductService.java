package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.ProductRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductGeneralResponse;

import java.util.List;

public interface ProductService {

    ProductV2 createProduct(ProductRequest request);

    List<ProductGeneralResponse> getAllProductGeneral();
}
