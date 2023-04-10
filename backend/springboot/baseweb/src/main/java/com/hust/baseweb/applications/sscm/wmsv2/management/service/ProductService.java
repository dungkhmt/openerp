package com.hust.baseweb.applications.sscm.wmsv2.management.service;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.ProductPriceRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.ProductRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductPriceResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductV2 createProduct(ProductRequest request);

    List<ProductGeneralResponse> getAllProductGeneral();

    boolean deleteProducts(List<String> productIds);

    ProductDetailResponse getById(String id);

    boolean createProductPrice(ProductPriceRequest request);

    List<ProductPriceResponse> getAllProductPrices();

    boolean deleteProductPriceById(String id);

    BigDecimal getCurrPriceByProductId(UUID id);
}
