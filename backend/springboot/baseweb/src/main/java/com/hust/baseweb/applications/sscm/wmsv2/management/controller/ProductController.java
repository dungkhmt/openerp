package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductCategory;
import com.hust.baseweb.applications.sscm.wmsv2.management.entity.ProductV2;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.request.ProductRequest;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductGeneralResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductCategoryService;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/wmsv2/admin/product")
@CrossOrigin
@Validated
@Slf4j
@AllArgsConstructor(onConstructor_ = @Autowired)
public class ProductController {

    private ProductService productService;
    private ProductCategoryService productCategoryService;

    @PutMapping()
    public ResponseEntity<ProductV2> createProduct(@RequestParam(required = false, name = "image") MultipartFile image,
                                                    @RequestParam("model") String model) {
        try {
            log.info("Model: " + model);
            log.info("Image: " + image);
            ObjectMapper mapper = new ObjectMapper();
            ProductRequest request = mapper.readValue(model, ProductRequest.class);
            request.setImage(image);
            log.info("Create product with request " + request);
            return ResponseEntity.ok(productService.createProduct(request));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProductGeneralResponse>> getProductGeneral() {
        return ResponseEntity.ok(productService.getAllProductGeneral());
    }

    @GetMapping(path = "/category")
    public ResponseEntity<List<ProductCategory>> getAll() {
        return ResponseEntity.ok(productCategoryService.getAll());
    }
}
