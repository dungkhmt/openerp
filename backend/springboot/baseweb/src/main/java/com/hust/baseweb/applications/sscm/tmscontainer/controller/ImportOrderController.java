package com.hust.baseweb.applications.sscm.tmscontainer.controller;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportOrder;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ImportOrderResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.service.ImportOrderService;
import com.hust.baseweb.applications.sscm.tmscontainer.service.ShelfLineItemService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@AllArgsConstructor(onConstructor_ = @Autowired)

@RequestMapping("/admin/wms/import")
@CrossOrigin()
@RestController
public class ImportOrderController {
    @Autowired
    private ImportOrderService importOrderService;

    @Autowired
    private ShelfLineItemService shelfLineItemService;

    @PostMapping("")
    public ImportOrderResponse create(@RequestBody @Valid ImportOrder importOrder) {
        return importOrderService.creatImportOrder(importOrder);
    }

    @GetMapping("/{id}")
    public ImportOrderResponse getById(@PathVariable Integer id) throws Exception {
        return importOrderService.getById(id);
    }

    @GetMapping("")
    public List<ImportOrderResponse> getAll(){
        return importOrderService.getAllImportOrder();
    }

    @PostMapping("/put-to-shelf")
    public ShelfLineItemResponse putIntoShelf(@RequestBody @Valid ShelfLineItem shelfLineItem) throws Exception {
        return shelfLineItemService.putIntoShelf(shelfLineItem);
    }
}
