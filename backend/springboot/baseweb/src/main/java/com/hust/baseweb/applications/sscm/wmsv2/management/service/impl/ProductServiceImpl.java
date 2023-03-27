package com.hust.baseweb.applications.sscm.wmsv2.management.service.impl;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Bay;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductBay;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductWarehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.ProductRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailQuantityResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductDetailResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.repository.*;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductWarehouseService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@NoArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private ProductWarehouseService productWarehouseService;

    private ProductV2Repository productRepository;
    private ProductBayRepository productBayRepository;
    private ProductWarehouseRepository productWarehouseRepository;
    private BayRepository bayRepository;

    @Override
    @Transactional
    public ProductV2 createProduct(ProductRequest request) {
        log.info("Start create product " + request);
        ProductV2 product;
        boolean isCreateRequest = request.getProductId() == null;
        if (!isCreateRequest) {
            String productId = request.getProductId();
            log.info("Start update product with id " + productId);
            Optional<ProductV2> productOpt = productRepository.findById(UUID.fromString(productId));
            if (productOpt.isPresent()) {
                product = productOpt.get();
            } else {
                log.warn("Not found product with id " + productId);
                return null;
            }
        } else {
            product = ProductV2.builder()
                               .productId(UUID.randomUUID())
                               .build();
        }
        product.setName(request.getName());
        product.setCode(request.getCode());
        product.setDescription(request.getDescription());
        product.setHeight(request.getHeight());
        product.setWeight(request.getWeight());
        product.setArea(request.getArea());
        product.setImportPrice(request.getImportPrice());
        product.setRetailPrice(request.getRetailPrice());
        product.setWholeSalePrice(request.getWholeSalePrice());
        product.setTaxPercentage(request.getTaxPercentage());
        product.setUom(request.getUom());
        product.setCategoryId(request.getCategoryId() == null
                        ? null
                        : UUID.fromString(request.getCategoryId()));
        if (request.getImage() != null) {
            try {
                MultipartFile image = request.getImage();
                product.setImageData(image.getBytes());
                product.setImageContentType(image.getContentType());
                product.setImageSize(image.getSize());
            } catch (IOException ioe) {
                log.error("Error when get image");
                return null;
            }
        }
        productRepository.save(product);
        log.info("Saved new product");

        // update init product quantity of created product is not allowed
        if (!isCreateRequest) {
            return product;
        }

        List<ProductRequest.InitProductQuantity> quantityList = request.getInitProductQuantityList();
        Map<String, BigDecimal> normQuantityMap = new HashMap<>();
        if (quantityList != null && !quantityList.isEmpty()) {
            log.info("Init product quantity list is empty");

            // normalize list by bay id
            for (ProductRequest.InitProductQuantity quantity : quantityList) {
                String bayId = quantity.getBayId();
                if (!normQuantityMap.containsKey(quantity.getBayId())) {
                    normQuantityMap.put(bayId, quantity.getQuantity());
                } else {
                    BigDecimal newValue = normQuantityMap.get(bayId).add(quantity.getQuantity());
                    normQuantityMap.put(bayId, newValue);
                }
            }

            for (Map.Entry<String, BigDecimal> entry : normQuantityMap.entrySet()) {
                ProductBay productBay = ProductBay.builder()
                                                  .bayId(UUID.fromString(entry.getKey()))
                                                  .quantity(entry.getValue())
                                                  .productId(product.getProductId())
                                                  .productBayId(UUID.randomUUID())
                                                  .build();
                productBayRepository.save(productBay);
            }
            log.info("Saved product bay entity");

            // update product warehouse quantity
            List<Bay> bays = bayRepository.findAll();
            Map<String, String> bayWarehouseMap = new HashMap<>(); // key = bayId, value = warehouseId -> For fast lookup
            for (Bay bay : bays) {
                bayWarehouseMap.put(bay.getBayId().toString(), bay.getWarehouseId().toString());
            }
            for (Map.Entry<String, BigDecimal> entry : normQuantityMap.entrySet()) {
                if (bayWarehouseMap.containsKey(entry.getKey())) {
                    UUID warehouseId = UUID.fromString(bayWarehouseMap.get(entry.getKey()));
                    BigDecimal addQuantity = entry.getValue();
                    BigDecimal currQuantity = productWarehouseService.
                        getProductQuantityByWarehouseIdAndProductId(warehouseId, product.getProductId());
                    BigDecimal newQuantity = currQuantity.add(addQuantity);

                    Optional<ProductWarehouse> productWarehouseOpt = productWarehouseRepository.
                        findProductWarehouseByWarehouseIdAndProductId(warehouseId, product.getProductId());
                    ProductWarehouse productWarehouse;
                    if (productWarehouseOpt.isPresent()) {
                        productWarehouse = productWarehouseOpt.get();
                        productWarehouse.setQuantityOnHand(newQuantity);
                    } else {
                        productWarehouse = ProductWarehouse.builder()
                                                           .productId(product.getProductId())
                                                           .warehouseId(warehouseId)
                                                           .productWarehouseId(UUID.randomUUID())
                                                           .quantityOnHand(newQuantity)
                                                           .build();
                    }
                    productWarehouseRepository.save(productWarehouse);
                }
            }
            log.info("Saved product warehouse entity");
        }
        return product;
    }

    @Override
    public List<ProductGeneralResponse> getAllProductGeneral() {
        List<ProductV2> products = productRepository.findAll();
        Map<String, BigDecimal> productOnHandQuantityMap = new HashMap<>();
        for (ProductV2 product : products) {
            String productId = product.getProductId().toString();
            productOnHandQuantityMap.put(productId,
                 productWarehouseRepository.getTotalOnHandQuantityByProductId(UUID.fromString(productId)));
        }
        List<ProductGeneralResponse> response = products.stream()
                                    .map(product -> ProductGeneralResponse.builder()
                                        .productId(product.getProductId().toString())
                                        .name(product.getName())
                                        .code(product.getCode())
                                        .retailPrice(product.getRetailPrice())
                                        .onHandQuantity(productOnHandQuantityMap.get(product.getProductId().toString()))
                                        .build())
                                    .collect(Collectors.toList());
        return response;
    }

    @Override
    @Transactional
    public boolean deleteProducts(List<String> productIds) {
        if (productIds.isEmpty()) {
            log.info("Product ids list for deleting is empty");
            return true;
        }

        try {
            for (String productId : productIds) {
                log.info("Start delete product with id " + productId);
                productRepository.deleteById(UUID.fromString(productId));
            }
            return true;
        } catch (Exception e) {
            log.info("Error when deleting product ids list");
            return false;
        }
    }

    @Override
    public ProductDetailResponse getById(String id) {
        UUID productId = UUID.fromString(id);
        Optional<ProductV2> productInfo = productRepository.findById(productId);
        if (!productInfo.isPresent()) {
            log.warn(String.format("Product with id %s is not found", id));
            return null;
        }

        List<ProductDetailQuantityResponse> quantityList =
            productBayRepository.getProductDetailQuantityResponseByProductId(productId);
        return ProductDetailResponse.builder()
                                    .productInfo(productInfo.get())
                                    .quantityList(quantityList)
                                    .build();
    }
}
