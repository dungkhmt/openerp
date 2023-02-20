package com.hust.baseweb.applications.sscm.wmsv2.management.controller;

import com.hust.baseweb.applications.sscm.wmsv2.management.entity.WMSV2Warehouse;
import com.hust.baseweb.applications.sscm.wmsv2.management.model.WarehouseWithBays;
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
    public ResponseEntity<WMSV2Warehouse> createWarehouse(@Valid @RequestBody WarehouseWithBays request) {
        return ResponseEntity.ok(warehouseService.createWarehouse(request));
    }

    @GetMapping()
    public ResponseEntity<List<WMSV2Warehouse>> getAll() {
        return ResponseEntity.ok(warehouseService.getAll());
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

}
