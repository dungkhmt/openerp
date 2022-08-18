package com.hust.baseweb.applications.sscm.tmscontainer.controller;


import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportOrder;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportShelfVariant;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfVariant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ExportLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ExportOrderResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ExportShelfVariantRequest;
import com.hust.baseweb.applications.sscm.tmscontainer.service.ExportOrderService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@AllArgsConstructor(onConstructor_ = @Autowired)

@RequestMapping("/admin/wms/export")
@CrossOrigin()
@RestController
public class ExportOrderController {

    @Autowired
    private ExportOrderService exportOrderService;

    @PostMapping("")
    public ExportOrderResponse create(@RequestBody @Valid ExportOrder exportOrder) {
        return exportOrderService.createExportOrder(exportOrder);
    }

    @GetMapping("/{id}")
    public ExportOrderResponse getById(@PathVariable Integer id) throws Exception {
        return exportOrderService.getById(id);
    }

    @GetMapping("")
    public List<ExportOrderResponse> getAll(){
        return exportOrderService.getAllExportOrder();
    }

    @GetMapping("/variant/{id}")
    public List<ShelfVariant> getShelfByVariantId(@PathVariable Integer id){
        return exportOrderService.getShelfByVariantId(id);
    }
    @PostMapping("/create-export")
    public ExportLineItemResponse createExportShelfVariant(@RequestBody @Valid ExportShelfVariantRequest exportShelfVariantRequest) {
        return exportOrderService.createExportShelfVariant(exportShelfVariantRequest);
    }

    @PostMapping("/create-export/confirm")
    public ExportShelfVariant confirmExported(@RequestBody @Valid ExportShelfVariant exportShelfVariant) throws Exception {
        return exportOrderService.confirmExported(exportShelfVariant);
    }

//
//    @GetMapping("/facility/{id}")
//    public ImportOrderResponse getByFacilityId(@PathVariable Integer id) throws Exception {
//        return exportOrderService.getByFacilityId(id);
//    }

}
