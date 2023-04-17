package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.ProductWarehouseResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.response.WarehouseDetailsResponse;
import com.hust.baseweb.applications.sscm.wmsv2.management.service.WarehouseService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/wmsv2/admin/warehouse")
@AllArgsConstructor(onConstructor_ = @Autowired)
@CrossOrigin
@Validated
public class WarehouseController {

    private WarehouseService warehouseService;

    @PutMapping()
    public ResponseEntity<Warehouse> createWarehouse(@Valid @RequestBody WarehouseWithBays request) {
        return ResponseEntity.ok(warehouseService.createWarehouse(request));
    }

    @GetMapping()
    public ResponseEntity<List<Warehouse>> getAllWarehouseGeneral() {
        return ResponseEntity.ok(warehouseService.getAllWarehouseGeneral());
    }

    @GetMapping(path = "/detail")
    public ResponseEntity<List<WarehouseWithBays>> getAllWarehouseDetail() {
        return ResponseEntity.ok(warehouseService.getAllWarehouseDetail());
    }

    @GetMapping(path = "/detail-with-products")
    public ResponseEntity<List<WarehouseDetailsResponse>> getAllWarehouseDetailWithProducts() {
        return ResponseEntity.ok(warehouseService.getAllWarehouseDetailWithProducts());
    }


    @DeleteMapping()
    public ResponseEntity<List<String>> delete(@RequestBody List<String> warehouseIds) {
        return warehouseService.delete(warehouseIds) ?
            ResponseEntity.ok(warehouseIds) :
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(warehouseIds);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseWithBays> getByWarehouseId(@PathVariable String id) {
        return ResponseEntity.ok(warehouseService.getById(id));
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductWarehouseResponse> getProductInWarehouse(@PathVariable String id) {
        return ResponseEntity.ok(warehouseService.getProductInWarehouse(id));
    }

}
