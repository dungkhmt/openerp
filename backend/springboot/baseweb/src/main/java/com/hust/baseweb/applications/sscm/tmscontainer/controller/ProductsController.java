package com.hust.baseweb.applications.sscm.tmscontainer.controller;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ImportLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ProductResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfVariantResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@AllArgsConstructor(onConstructor_ = @Autowired)

@RequestMapping("/admin/wms/warehouse/products")
@CrossOrigin()
@RestController
public class ProductsController {

    @Autowired
    ProductService productService;

    @PostMapping("")
    public ProductResponse createProduct(@RequestBody @Valid ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Integer id) throws Exception {
        return productService.getProductById(id);
    }

    @GetMapping("")
    public List<ProductResponse> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping("/variant")
    public List<Variant> getAllVariants(){
        return productService.getAllVariants();
    }

    @GetMapping("/variant-active")
    public List<Variant> getAllVariantsActive(){
        return productService.getAllVariantsActive();
    }

    @PutMapping("/{id}")
    public ProductResponse updateProduct(@PathVariable Integer id, @RequestBody @Valid ProductRequest productRequest) throws Exception {
        return productService.updateById(id, productRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Integer id) {
        try {
            productService.deleteProductById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/facility/{id}")
    public List<ProductResponse> getAllProductByFacility(@PathVariable Integer id){
        return productService.getAllProductsByFacility(id);
    }
    @GetMapping("/facility/{id}/variant")
    public List<Variant> getAllVariantsByFacilityId(@PathVariable Integer id){
        return productService.getAllVariantsByFacilityId(id);
    }

//    @GetMapping("/shelf/{id}")
//    public List<ImportLineItemResponse> getAllProductInShelf(@PathVariable Integer id){
//        return productService.getAllProductInShelf(id);
//    }
    @GetMapping("/shelf/{id}")
    public List<ShelfVariantResponse> getAllVariantInShelf(@PathVariable Integer id){
        return productService.getAllVariantInShelf(id);
    }
    @GetMapping("/shelf/facility/{id}")
//    @GetMapping("/shelf/variant/{id}")

    public List<ShelfVariant> getAllShelfVariantInFacility(@PathVariable Integer id){
        return productService.getAllShelfVariantInFacility(id);
    }

    @GetMapping("/variant/{id}")
    public List<ImportLineItemResponse> getAllVariantImport(@PathVariable Integer id){
        return productService.getAllVariantImport(id);
    }

//    @GetMapping("/import/{id}")
//    public List<ProductResponse> getAllProductImport(@PathVariable Integer id){
//        return productService.getAllProductImport(id);
//    }
}
