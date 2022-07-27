package com.hust.baseweb.applications.sscm.tmscontainer.service;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ImportOrder;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.ShelfLineItem;
import com.hust.baseweb.applications.sscm.tmscontainer.entity.Variant;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ImportOrderResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.LineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.model.ShelfLineItemResponse;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.FacilityRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ImportOrderRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.ShelfLineItemRepository;
import com.hust.baseweb.applications.sscm.tmscontainer.repository.VariantRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImportOrderService {

    ModelMapper mapper = new ModelMapper();

    @Autowired
    private ImportOrderRepository importOrderRepository;

    @Autowired
    private FacilitiesService facilitiesService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ShelfLineItemRepository shelfLineItemRepository;

    @Autowired
    private VariantRepository variantRepository;


    public ImportOrderResponse creatImportOrder(ImportOrder importOrder) {
        if (importOrder.getLineItems() != null) {
            for (var item : importOrder.getLineItems()) {
                item.setImportOrder(importOrder);
                if (item.getQuantity() != null) {
                    item.setCurrentQuantity(item.getQuantity());
                    productService.addVariantOnHand(item.getVariantId(), item.getQuantity());
                }
            }
        }
        setImportOrderCode(importOrder);

        var importOrderRes = importOrderRepository.save(importOrder);
        var res = mapper.map(importOrderRes, ImportOrderResponse.class);
        res.setFacility(facilitiesService.getById(res.getFacilityId()));
        res.updateStatusImport();
        return res;
    }

    public ImportOrderResponse getById(Integer id) throws Exception {
        var importOrder = importOrderRepository.findById(id).orElse(null);
        if (importOrder == null) {
            throw new Exception("khong tim thay don nhap hang");
        }
        var lineItemsRes = importOrder.getLineItems().stream().map(lineItem -> {
            return mapper.map(lineItem, LineItemResponse.class);
        }).map(lineItemResponse -> {
            var product = variantRepository.getOne(lineItemResponse.getVariantId()).getProduct();
            lineItemResponse.setProductId(product.getId());
            return lineItemResponse;
        }).collect(Collectors.toList());

        var res = mapper.map(importOrder, ImportOrderResponse.class);

        res.setFacility(facilitiesService.getById(res.getFacilityId()));
        res.setLineItems(lineItemsRes);
        res.updateStatusImport();
        return res;
    }

    public List<ImportOrderResponse> getAllImportOrder() {
        var res = importOrderRepository
            .findAll()
            .stream()
            .map(importOrder -> mapper.map(importOrder, ImportOrderResponse.class))
            .collect(
                Collectors.toList());
        return res
            .stream()
            .map(importOrderResponse -> {
                importOrderResponse.setFacility(facilitiesService.getById(importOrderResponse.getFacilityId()));
                importOrderResponse.updateStatusImport();
                return importOrderResponse;
            }).collect(Collectors.toList());
//        return res;
    }


    public void setImportOrderCode(ImportOrder importOrder) {
        var currentCode = importOrderRepository.count();
        importOrder.setCode("IMP00" + currentCode);
    }

}
